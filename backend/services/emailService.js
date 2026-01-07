const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer transport using environment variables.
 *
 * REQUIRED ENV VARS (add these to backend/.env):
 * - SMTP_HOST
 * - SMTP_PORT
 * - SMTP_USER
 * - SMTP_PASS
 * - FROM_EMAIL
 */
function createTransport() {
  if (!process.env.SMTP_HOST) {
    console.warn('SMTP_HOST not set. Email notifications will be skipped.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const transport = createTransport();

async function sendVerificationEmail({ toEmail, userName, documentType, verification, expiryDate, documentNumber }) {
  if (!transport) {
    console.warn('Email transport not configured. Skipping email send.');
    return;
  }

  const from = process.env.FROM_EMAIL || process.env.SMTP_USER;

  const subject = `Document Verification Result - ${documentType}`;

  const lines = [
    `Hello ${userName || 'User'},`,
    '',
    `Your document has been processed by the Legal Tech Smart Upload system.`,
    '',
    `Document Type: ${documentType}`,
    `Verification Status: ${verification.status}`,
  ];

  if (expiryDate) {
    lines.push(`Expiry Date: ${expiryDate}`);
  }

  if (documentNumber) {
    lines.push(`Document Number: ${documentNumber}`);
  }

  lines.push('', 'Details:', verification.details || 'No additional details.', '', 'Thank you.', 'Legal Tech Dashboard');

  const text = lines.join('\n');

  await transport.sendMail({
    from,
    to: toEmail,
    subject,
    text,
  });
}

module.exports = {
  sendVerificationEmail,
};


