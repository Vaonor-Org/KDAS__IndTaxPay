// Vercel Serverless Function — api/send-application-email.js
// Deploys automatically with the Vercel project (free tier supported).
// Set GMAIL_USER and GMAIL_APP_PASSWORD in Vercel → Project → Settings → Environment Variables.

const nodemailer = require('nodemailer');

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

function buildMailContent(data) {
  const subject = 'Application Received – IndTaxPay | Ticket: ' + data.ticketNumber;

  const text = [
    'Dear ' + data.name + ',',
    '',
    'Thank you for choosing IndTaxPay!',
    '',
    'We have received your documents and will process them shortly.',
    'Our expert team will review your application and start the filing process as soon as possible.',
    '',
    'Your Ticket ID: ' + data.ticketNumber,
    'Service Requested: ' + (data.serviceType || ''),
    '',
    'Track your application status anytime at:',
    data.trackUrl,
    '',
    'Website: https://indtaxpay.com',
    '',
    'Thank you for trusting IndTaxPay. We will reach out if any additional information is required.',
    '',
    'Warm regards,',
    'Team IndTaxPay',
    'https://indtaxpay.com'
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received – IndTaxPay</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

          <!-- HEADER -->
          <tr>
            <td style="background:#16a34a;padding:28px 36px;">
              <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.75);">Official Confirmation</p>
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;">Application Received ✅</h1>
              <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">IndTaxPay – Tax &amp; Compliance Experts</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:32px 36px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#1e293b;">Dear <strong>${data.name}</strong>,</p>

              <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#334155;">
                Thank you for choosing <strong>IndTaxPay</strong>! 🎉
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.75;color:#334155;">
                We have successfully received your documents and will begin processing your application right away.
                Our team of experts will review everything and start the filing process as soon as possible.
                We will reach out if any additional information is needed.
              </p>

              <!-- TICKET BOX -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1.5px solid #86efac;border-radius:12px;padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#16a34a;">Your Ticket ID</p>
                    <p style="margin:0;font-size:26px;font-weight:900;color:#15803d;letter-spacing:0.04em;">${data.ticketNumber}</p>
                    <p style="margin:8px 0 0;font-size:12px;color:#4b5563;">Keep this ID safe — you'll need it to track your application.</p>
                  </td>
                </tr>
              </table>

              <!-- SERVICE ROW -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background:#fefce8;border:1.5px solid #fde047;border-radius:10px;padding:14px 18px;">
                    <p style="margin:0 0 2px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a16207;">Service Requested</p>
                    <p style="margin:0;font-size:15px;font-weight:700;color:#1e293b;">${data.serviceType || 'Tax &amp; Compliance Service'}</p>
                  </td>
                </tr>
              </table>

              <!-- TRACK BUTTON -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td align="center">
                    <a href="${data.trackUrl}" style="display:inline-block;padding:14px 36px;background:#f97316;border-radius:10px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.03em;">
                      📦 Track Your Application
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:8px;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;">Or visit: <a href="${data.trackUrl}" style="color:#16a34a;text-decoration:none;">${data.trackUrl}</a></p>
                  </td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;">

              <p style="margin:0 0 6px;font-size:15px;line-height:1.6;color:#475569;">Warm regards,</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#15803d;">Team IndTaxPay</p>
              <p style="margin:4px 0 0;font-size:13px;color:#64748b;">
                <a href="https://indtaxpay.com" style="color:#16a34a;text-decoration:none;">https://indtaxpay.com</a>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 36px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                This is an automated confirmation from IndTaxPay &bull;
                <a href="https://indtaxpay.com" style="color:#16a34a;text-decoration:none;">indtaxpay.com</a>
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:#cbd5e1;">Please do not reply to this email directly.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, serviceType, ticketNumber, trackUrl } = req.body || {};

  if (!name || !email || !ticketNumber || !trackUrl) {
    return res.status(400).json({ error: 'Missing required fields: name, email, ticketNumber, trackUrl' });
  }

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error('[MAIL] Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables');
    return res.status(500).json({ error: 'Mail server not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in Vercel environment variables.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD
      }
    });

    const mail = buildMailContent({ name, email, serviceType, ticketNumber, trackUrl });

    await transporter.sendMail({
      from: '"IndTaxPay" <' + GMAIL_USER + '>',
      to: email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html
    });

    console.log('[MAIL] Sent to', email, 'for ticket', ticketNumber);
    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('[MAIL] Send failed:', err.message);
    return res.status(500).json({ error: err.message || 'Mail send failed' });
  }
};
