/* ──────────────────────────────────────────
   firestore-helpers.js
   All Firestore CRUD operations.
   Files stored as base64 in Firestore subcollection.
   Requires firebase-init.js to be loaded first.
   ────────────────────────────────────────── */

var STATUSES = ['New', 'Documents Pending', 'In Progress', 'Filed', 'Completed', 'Rejected'];
var PRIORITIES = ['Urgent', 'High', 'Normal', 'Low'];
var PRIORITY_COLORS = { Urgent: '#ef4444', High: '#f59e0b', Normal: '#3b82f6', Low: '#9ca3af' };
var MAX_FIRESTORE_FILE_SIZE_BYTES = 500 * 1024;
var MAX_FIRESTORE_BASE64_LENGTH = 900000;

function sanitizeAlphaNumeric(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

function buildNameToken(name) {
  var cleaned = sanitizeAlphaNumeric(name);
  if (!cleaned) return 'USR';
  return cleaned.slice(0, 3).padEnd(3, 'X');
}

function buildDateToken(dateObj) {
  var day = String(dateObj.getDate()).padStart(2, '0');
  var month = String(dateObj.getMonth() + 1).padStart(2, '0');
  return day + month;
}

function simpleHash(input) {
  var hash = 0;
  for (var i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildHashToken(data, sequence) {
  var source = [
    sanitizeAlphaNumeric(data.name || ''),
    sanitizeAlphaNumeric(data.email || ''),
    sanitizeAlphaNumeric(data.phone || ''),
    sanitizeAlphaNumeric(data.serviceType || ''),
    String(sequence || '')
  ].join('|');

  var hashed = simpleHash(source).toString(36).toUpperCase();
  var randomTail = Math.random().toString(36).slice(2, 6).toUpperCase();
  return (hashed + randomTail).slice(0, 8).padEnd(8, 'X');
}

/* ── Ticket Number Generator ── */
async function generateTicketNumber(data) {
  var counterRef = db.collection('counters').doc('tickets');
  var now = new Date();

  var newNumber = await db.runTransaction(async function (transaction) {
    var counterDoc = await transaction.get(counterRef);
    var lastNumber = 0;
    if (counterDoc.exists) {
      lastNumber = counterDoc.data().lastNumber || 0;
    }
    var nextNumber = lastNumber + 1;
    transaction.set(counterRef, { lastNumber: nextNumber }, { merge: true });
    return nextNumber;
  });

  var sequenceToken = newNumber.toString(36).toUpperCase().padStart(4, '0');
  var nameToken = buildNameToken(data && data.name);
  var dateToken = buildDateToken(now);
  var hashToken = buildHashToken(data || {}, newNumber);

  return 'IEF-' + nameToken + '-' + dateToken + '-' + sequenceToken + '-' + hashToken;
}

/* ── Create Ticket ── */
async function createTicket(data) {
  var ticketNumber = await generateTicketNumber(data);

  var docRef = await db.collection('tickets').add({
    ticketNumber: ticketNumber,
    name: data.name,
    phone: data.phone,
    email: data.email,
    serviceType: data.serviceType,
    dataFields: data.dataFields || {},
    status: 'New',
    priority: 'Normal',
    isDeleted: false,
    internalNotes: [],
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
    assignedTo: null,
    notes: ''
  });

  return { ticketId: docRef.id, ticketNumber: ticketNumber };
}

/* ── Convert File to base64 ── */
function fileToBase64(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function () { resolve(reader.result); };
    reader.onerror = function () { reject(reader.error); };
    reader.readAsDataURL(file);
  });
}

/* ── Upload Documents as base64 into Firestore subcollection ── */
async function uploadDocuments(ticketId, files) {
  for (var i = 0; i < files.length; i++) {
    var item = files[i];
    var file = item.file;
    var type = item.type || 'Other';
    validateFirestoreFileSize(file);
    var safeName = file.name.replace(/[\\/:*?"<>|]/g, '_');
    var base64Data = await fileToBase64(file);
    validateFirestoreBase64Size(file, base64Data);

    await db.collection('tickets').doc(ticketId).collection('documents').add({
      type: type,
      fileName: safeName,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      base64: base64Data,
      uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

/* ── Track Ticket (public) ── */
async function trackTicket(ticketNumber, phone) {
  var snapshot = await db.collection('tickets')
    .where('ticketNumber', '==', ticketNumber.toUpperCase().trim())
    .where('phone', '==', phone.trim())
    .get();

  if (snapshot.empty) return null;

  var docSnap = snapshot.docs[0];
  return Object.assign({ id: docSnap.id }, docSnap.data());
}

/* ── Admin: Subscribe to all tickets (realtime, excludes soft-deleted) ── */
function subscribeToTickets(callback, onError) {
  return db.collection('tickets')
    .orderBy('createdAt', 'desc')
    .onSnapshot(function (snapshot) {
      var tickets = snapshot.docs.map(function (d) {
        return Object.assign({ id: d.id }, d.data());
      });
      // Client-side filter: hide soft-deleted tickets
      // Works for old tickets (no isDeleted field) and new ones (isDeleted: false)
      tickets = tickets.filter(function (t) { return t.isDeleted !== true; });
      callback(tickets);
    }, function (err) {
      console.error('Firestore subscription error:', err);
      if (onError) onError(err);
    });
}

/* ── Admin: Get single ticket ── */
async function getTicket(ticketId) {
  var docSnap = await db.collection('tickets').doc(ticketId).get();
  if (!docSnap.exists) return null;
  return Object.assign({ id: docSnap.id }, docSnap.data());
}

/* ── Admin: Update ticket status (with audit log) ── */
async function updateTicketStatus(ticketId, newStatus, adminEmail) {
  var ticket = await getTicket(ticketId);
  var oldStatus = ticket ? ticket.status : '';

  await db.collection('tickets').doc(ticketId).update({
    status: newStatus,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  });

  // Audit log — best effort, does not block status update
  if (adminEmail && oldStatus !== newStatus) {
    try {
      await addAuditLog(ticketId, {
        type: 'status_change',
        previousValue: oldStatus,
        newValue: newStatus,
        changedBy: adminEmail
      });
    } catch (e) { console.warn('Audit log skipped:', e.message); }
  }
}

/* ── Admin: Update ticket priority (with audit log) ── */
async function updateTicketPriority(ticketId, newPriority, adminEmail) {
  var ticket = await getTicket(ticketId);
  var oldPriority = ticket ? (ticket.priority || 'Normal') : 'Normal';

  await db.collection('tickets').doc(ticketId).update({
    priority: newPriority,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  });

  // Audit log — best effort
  if (adminEmail && oldPriority !== newPriority) {
    try {
      await addAuditLog(ticketId, {
        type: 'priority_change',
        previousValue: oldPriority,
        newValue: newPriority,
        changedBy: adminEmail
      });
    } catch (e) { console.warn('Audit log skipped:', e.message); }
  }
}

/* ── Admin: Update ticket fields ── */
async function updateTicketFields(ticketId, fields) {
  fields.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
  await db.collection('tickets').doc(ticketId).update(fields);
}

/* ── Admin: Get documents for ticket ── */
async function getTicketDocuments(ticketId) {
  var snapshot = await db.collection('tickets').doc(ticketId).collection('documents').get();
  return snapshot.docs.map(function (d) {
    return Object.assign({ id: d.id }, d.data());
  });
}

/* ── Admin: Soft delete ticket (with audit log) ── */
async function softDeleteTicket(ticketId, adminEmail) {
  await db.collection('tickets').doc(ticketId).update({
    isDeleted: true,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  });

  // Audit log — best effort
  if (adminEmail) {
    try {
      await addAuditLog(ticketId, {
        type: 'archive',
        previousValue: 'Active',
        newValue: 'Archived',
        changedBy: adminEmail
      });
    } catch (e) { console.warn('Audit log skipped:', e.message); }
  }
}

/* ── Admin: Unarchive ticket ── */
async function unarchiveTicket(ticketId, adminEmail) {
  await db.collection('tickets').doc(ticketId).update({
    isDeleted: false,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  });

  if (adminEmail) {
    try {
      await addAuditLog(ticketId, {
        type: 'restore',
        previousValue: 'Archived',
        newValue: 'Active',
        changedBy: adminEmail
      });
    } catch (e) { console.warn('Audit log skipped:', e.message); }
  }
}

/* ── Admin: Get archived tickets ── */
async function getArchivedTickets() {
  var snapshot = await db.collection('tickets')
    .where('isDeleted', '==', true)
    .orderBy('lastUpdated', 'desc')
    .get();
  return snapshot.docs.map(function (d) {
    return Object.assign({ id: d.id }, d.data());
  });
}

/* ── LEGACY: Hard delete (kept for backward compatibility) ── */
async function deleteTicketAndFiles(ticketId) {
  var ticketRef = db.collection('tickets').doc(ticketId);
  var docSnap = await ticketRef.collection('documents').get();
  var batch = db.batch();
  docSnap.forEach(function (d) { batch.delete(d.ref); });
  batch.delete(ticketRef);
  await batch.commit();
}

/* ══════════════════════════════════════════
   AUDIT LOG (Activity History)
   ══════════════════════════════════════════ */

/* ── Add audit log entry ── */
async function addAuditLog(ticketId, logData) {
  try {
    await db.collection('tickets').doc(ticketId).collection('activityLog').add({
      type: logData.type,
      previousValue: logData.previousValue || '',
      newValue: logData.newValue || '',
      changedBy: logData.changedBy || 'system',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {
    console.warn('addAuditLog: ' + e.message + ' — Deploy Firestore rules to enable audit logging.');
  }
}

/* ── Get audit logs (newest first) ── */
async function getAuditLogs(ticketId) {
  try {
    var snapshot = await db.collection('tickets').doc(ticketId)
      .collection('activityLog')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();
    return snapshot.docs.map(function (d) {
      return Object.assign({ id: d.id }, d.data());
    });
  } catch (err) {
    console.warn('getAuditLogs error for ticket ' + ticketId + ':', err.message);
    return [];
  }
}

/* ══════════════════════════════════════════
   INTERNAL NOTES
   ══════════════════════════════════════════ */

/* ── Add internal note ── */
async function addInternalNote(ticketId, noteText, adminEmail) {
  var note = {
    noteText: noteText,
    addedBy: adminEmail,
    timestamp: new Date().toISOString()
  };

  await db.collection('tickets').doc(ticketId).update({
    internalNotes: firebase.firestore.FieldValue.arrayUnion(note),
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  });

  await addAuditLog(ticketId, {
    type: 'note_added',
    previousValue: '',
    newValue: noteText.substring(0, 80),
    changedBy: adminEmail
  });
}

/* ══════════════════════════════════════════
   FILE DOWNLOAD TRACKING
   ══════════════════════════════════════════ */

async function trackFileDownload(ticketId, fileName, adminEmail) {
  await addAuditLog(ticketId, {
    type: 'file_download',
    previousValue: '',
    newValue: fileName,
    changedBy: adminEmail
  });
}

/* ── Download a base64 document as a file ── */
function downloadBase64File(base64Data, fileName) {
  var link = document.createElement('a');
  link.href = base64Data;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ── Build zip from Firestore docs (client-side) ── */
async function buildTicketZip(ticket, docs) {
  if (!window.JSZip) throw new Error('JSZip not loaded');

  var zip = new JSZip();

  var lines = [];
  lines.push('Ticket ID: ' + ticket.ticketNumber);
  lines.push('Service: ' + ticket.serviceType);
  lines.push('Name: ' + ticket.name);
  lines.push('Phone: ' + ticket.phone);
  lines.push('Email: ' + ticket.email);
  lines.push('Status: ' + ticket.status);
  lines.push('Priority: ' + (ticket.priority || 'Normal'));
  lines.push('Created: ' + formatFirestoreDate(ticket.createdAt));
  lines.push('Last Updated: ' + formatFirestoreDate(ticket.lastUpdated));
  if (ticket.assignedTo) lines.push('Assigned To: ' + ticket.assignedTo);
  if (ticket.notes) lines.push('Notes: ' + ticket.notes);
  lines.push('');

  if (ticket.dataFields) {
    Object.keys(ticket.dataFields).forEach(function (key) {
      if (ticket.dataFields[key]) lines.push(key + ': ' + ticket.dataFields[key]);
    });
  }

  zip.file('data.txt', lines.join('\n'));

  docs.forEach(function (d) {
    if (d.base64) {
      var base64Content = d.base64.split(',')[1] || d.base64;
      zip.file('files/' + d.fileName, base64Content, { base64: true });
    }
  });

  return zip.generateAsync({ type: 'blob' });
}

/* ══════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════ */

function formatFirestoreDate(ts) {
  if (!ts || !ts.seconds) return '—';
  return new Date(ts.seconds * 1000).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function statusPercent(status) {
  if (status === 'Rejected') return 100;
  var idx = STATUSES.indexOf(status);
  if (idx < 0) return 0;
  return Math.round((idx / (STATUSES.length - 2)) * 100);
}

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function validateFirestoreFileSize(file) {
  if (!file || !file.size) return;
  if (file.size > MAX_FIRESTORE_FILE_SIZE_BYTES) {
    throw new Error(
      'The file "' + file.name + '" is too large for the current upload system. ' +
      'Please keep each file under ' + formatFileSize(MAX_FIRESTORE_FILE_SIZE_BYTES) + '.'
    );
  }
}

function validateFirestoreBase64Size(file, base64Data) {
  if (!base64Data) return;
  if (base64Data.length > MAX_FIRESTORE_BASE64_LENGTH) {
    throw new Error(
      'The file "' + file.name + '" becomes too large after secure encoding for Firestore. ' +
      'Please upload a smaller image or PDF under ' + formatFileSize(MAX_FIRESTORE_FILE_SIZE_BYTES) + '.'
    );
  }
}

function prioritySortValue(p) {
  var map = { 'Urgent': 0, 'High': 1, 'Normal': 2, 'Low': 3 };
  return map[p] !== undefined ? map[p] : 2;
}

function formatAuditType(type) {
  var map = {
    'status_change': 'Status Changed',
    'priority_change': 'Priority Changed',
    'file_download': 'File Downloaded',
    'archive': 'Ticket Archived',
    'restore': 'Ticket Restored',
    'delete': 'Ticket Deleted',
    'note_added': 'Note Added'
  };
  return map[type] || type;
}

function auditTypeIcon(type) {
  var map = {
    'status_change': '🔄',
    'priority_change': '🏷️',
    'file_download': '📥',
    'delete': '🗑️',
    'note_added': '📝'
  };
  return map[type] || '📋';
}

/* ══════════════════════════════════════════
   CALLBACKS
   ══════════════════════════════════════════ */

/* ── Add new callback ── */
async function addCallback(data) {
  return await db.collection('callbacks').add({
    name: data.name,
    phone: data.phone,
    email: data.email,
    service: data.service,
    message: data.message || '',
    status: 'New', // New, Called
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

/* ── Subscribe to callbacks ── */
function subscribeToCallbacks(callback, onError) {
  return db.collection('callbacks')
    .orderBy('createdAt', 'desc')
    .onSnapshot(function (snapshot) {
      var callbacksList = snapshot.docs.map(function (d) {
        return Object.assign({ id: d.id }, d.data());
      });
      callback(callbacksList);
    }, function (err) {
      console.error('Firestore callback subscription error:', err);
      if (onError) onError(err);
    });
}

/* ── Update callback status ── */
async function updateCallbackStatus(callbackId, newStatus) {
  await db.collection('callbacks').doc(callbackId).update({
    status: newStatus,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  });
}

/* ── Delete callback ── */
async function deleteCallback(callbackId) {
  await db.collection('callbacks').doc(callbackId).delete();
}
