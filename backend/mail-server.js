require('dotenv').config({ path: __dirname + '/.env' });

const http = require('http');
const nodemailer = require('nodemailer');

const PORT = process.env.MAIL_PORT || 8787;
const MAIL_USER = process.env.GMAIL_USER;
const MAIL_PASS = process.env.GMAIL_APP_PASSWORD;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!MAIL_USER || !MAIL_PASS) {
  console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD in backend/.env');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
});

function getAllowedOrigin(requestOrigin) {
  if (ALLOWED_ORIGINS.includes('*')) return '*';
  if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) return requestOrigin;
  return ALLOWED_ORIGINS[0] || '*';
}

function sendJson(req, res, statusCode, payload) {
  const requestOrigin = req.headers.origin;
  const allowedOrigin = getAllowedOrigin(requestOrigin);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin'
  });
  res.end(JSON.stringify(payload));
}

function buildMailContent(data) {
  const subject = 'Thank you for choosing K.Das & Associates - ' + data.ticketNumber;
  const text = [
    'Dear ' + data.name + ',',
    '',
    'Thank you for choosing K.Das & Associates.',
    'We have received your application and documents successfully.',
    '',
    'Your application ID is: ' + data.ticketNumber,
    '',
    'Track your application here:',
    data.trackUrl,
    '',
    'Please keep this ID safe for future reference.',
    '',
    'Regards,',
    'K.Das & Associates'
  ].join('\n');

  const html = [
    '<div style="font-family:Arial,sans-serif;background:#f5f8fc;padding:32px 16px;color:#0f172a;">',
    '<div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid rgba(19,63,112,0.08);overflow:hidden;">',
    '<div style="padding:28px 32px;background:linear-gradient(135deg,#133F70,#069CCE);color:#ffffff;">',
    '<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.8;">K.Das & Associates</p>',
    '<h1 style="margin:0;font-size:28px;">Application Received</h1>',
    '</div>',
    '<div style="padding:32px;">',
    '<p style="margin:0 0 14px;font-size:16px;line-height:1.7;">Dear ' + data.name + ',</p>',
    '<p style="margin:0 0 14px;font-size:16px;line-height:1.7;">Thank you for choosing <strong>K.Das & Associates</strong>. We have received your application and documents successfully.</p>',
    '<div style="margin:24px 0;padding:18px;border-radius:14px;background:linear-gradient(135deg,rgba(128,184,69,0.12),rgba(6,156,206,0.10));">',
    '<p style="margin:0 0 6px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#475569;">Application ID</p>',
    '<p style="margin:0;font-size:24px;font-weight:800;color:#133F70;">' + data.ticketNumber + '</p>',
    '</div>',
    '<p style="margin:0 0 16px;font-size:15px;line-height:1.7;">Service: <strong>' + data.serviceType + '</strong></p>',
    '<p style="margin:0 0 24px;font-size:15px;line-height:1.7;">Track your application anytime using the link below.</p>',
    '<p style="margin:0 0 24px;"><a href="' + data.trackUrl + '" style="display:inline-block;padding:14px 22px;border-radius:12px;background:#80B845;color:#ffffff;text-decoration:none;font-weight:700;">Track Application</a></p>',
    '<p style="margin:0;font-size:15px;line-height:1.7;color:#475569;">Regards,<br><strong>K.Das & Associates</strong></p>',
    '</div>',
    '</div>',
    '</div>'
  ].join('');

  return { subject, text, html };
}

const server = http.createServer(async (req, res) => {
  const requestOrigin = req.headers.origin || 'unknown-origin';

  if (req.method === 'OPTIONS') {
    const allowedOrigin = getAllowedOrigin(requestOrigin);
    res.writeHead(204, {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Vary': 'Origin'
    });
    console.log('[MAIL] Preflight accepted for origin:', requestOrigin);
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/send-application-email') {
    console.warn('[MAIL] Invalid route:', req.method, req.url, 'from', requestOrigin);
    sendJson(req, res, 404, { error: 'Not found' });
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const data = JSON.parse(body || '{}');

      if (!data.name || !data.email || !data.ticketNumber || !data.trackUrl) {
        console.error('[MAIL] Missing required fields for request from', requestOrigin, data);
        sendJson(req, res, 400, { error: 'Missing required email fields' });
        return;
      }

      const mail = buildMailContent(data);
      console.log('[MAIL] Sending acknowledgement to', data.email, 'for', data.ticketNumber);

      await transporter.sendMail({
        from: '"K.Das & Associates" <' + MAIL_USER + '>',
        to: data.email,
        subject: mail.subject,
        text: mail.text,
        html: mail.html
      });

      console.log('[MAIL] Mail sent successfully to', data.email, 'for', data.ticketNumber);
      sendJson(req, res, 200, { ok: true });
    } catch (error) {
      console.error('[MAIL] Mail send failed:', error && error.message ? error.message : error);
      sendJson(req, res, 500, { error: error.message || 'Mail send failed' });
    }
  });
});

server.listen(PORT, () => {
  console.log('K.Das & Associates mail server running on http://127.0.0.1:' + PORT);
  console.log('[MAIL] Allowed origins:', ALLOWED_ORIGINS.join(', '));
  console.log('[MAIL] Ready to send application acknowledgement emails');
});
