const { isAfter, addMonths, parseISO } = require('date-fns');

function parseDate(value) {
  if (!value) return null;
  try {
    // Accept ISO or YYYY-MM-DD
    return parseISO(value.toString());
  } catch {
    return null;
  }
}

function verifyPassport({ expiryDate, documentNumber }) {
  const now = new Date();
  const expiry = parseDate(expiryDate);
  const sixMonthsFromNow = addMonths(now, 6);

  let status = 'Verified';
  const details = [];

  // Expiry date check
  if (!expiry) {
    status = 'Failed';
    details.push('Expiry date is missing or invalid.');
  } else if (!isAfter(expiry, sixMonthsFromNow)) {
    status = 'Expired';
    details.push('Passport expiry date is less than 6 months from today.');
  } else {
    details.push('Expiry date is at least 6 months in the future.');
  }

  // Passport number: 9 alphanumeric characters
  const passportRegex = /^[A-Za-z0-9]{9}$/;
  if (!documentNumber || !passportRegex.test(documentNumber)) {
    status = status === 'Verified' ? 'Failed' : status;
    details.push('Passport number must be 9 alphanumeric characters.');
  } else {
    details.push('Passport number format is valid.');
  }

  return { status, details: details.join(' ') };
}

function verifyIDCard({ expiryDate, documentNumber }) {
  const now = new Date();
  const expiry = parseDate(expiryDate);

  let status = 'Verified';
  const details = [];

  if (!expiry) {
    status = 'Failed';
    details.push('ID expiry date is missing or invalid.');
  } else if (!isAfter(expiry, now)) {
    status = 'Expired';
    details.push('ID is expired.');
  } else {
    details.push('ID expiry date is valid (not expired).');
  }

  // ID number: 8 digits
  const idRegex = /^\d{8}$/;
  if (!documentNumber || !idRegex.test(documentNumber)) {
    status = status === 'Verified' ? 'Failed' : status;
    details.push('ID number must be 8 digits.');
  } else {
    details.push('ID number format is valid.');
  }

  return { status, details: details.join(' ') };
}

function verifyPAN({ documentNumber }) {
  // Simple PAN format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/i;
  let status = 'Verified';
  const details = [];

  if (!documentNumber || !panRegex.test(documentNumber)) {
    status = 'Failed';
    details.push('PAN number should match format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F).');
  } else {
    details.push('PAN number format is valid.');
  }

  return { status, details: details.join(' ') };
}

function verifyAadhaar({ documentNumber }) {
  // Simple Aadhaar format: 12 digits
  const aadhaarRegex = /^\d{12}$/;
  let status = 'Verified';
  const details = [];

  if (!documentNumber || !aadhaarRegex.test(documentNumber)) {
    status = 'Failed';
    details.push('Aadhaar number must be 12 digits.');
  } else {
    details.push('Aadhaar number format is valid.');
  }

  return { status, details: details.join(' ') };
}

function verifyGeneric() {
  return {
    status: 'Not Applicable',
    details: 'No specific verification rules applied for this document type.'
  };
}

function verifyDocument(documentType, payload) {
  switch (documentType) {
    case 'Passport':
      return verifyPassport(payload);
    case 'ID Card':
      return verifyIDCard(payload);
    case 'PAN Card':
      return verifyPAN(payload);
    case 'Aadhaar Card':
      return verifyAadhaar(payload);
    default:
      return verifyGeneric();
  }
}

module.exports = {
  verifyDocument,
};


