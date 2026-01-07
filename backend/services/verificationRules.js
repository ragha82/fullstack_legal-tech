const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;
const passportNumberRegex = /^[A-Za-z0-9]{9}$/;
const idNumberRegex = /^[0-9]{8}$/;
const drivingNumberRegex = /^[A-Za-z0-9]{4,20}$/; // simple generic rule

function isFutureDate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d.toString() !== 'Invalid Date' && d.getTime() > Date.now();
}

function verifyPassport({ expiryDate, passportNumber }) {
  const details = [];
  let status = 'Verified';

  if (expiryDate) {
    const expiry = new Date(expiryDate);
    const ok = expiry.getTime() - Date.now() >= SIX_MONTHS_MS;
    details.push(
      ok
        ? `Expiry date ok (>= 6 months): ${expiry.toISOString().slice(0, 10)}`
        : `Expiry date too soon: ${expiry.toISOString().slice(0, 10)}`
    );
    if (!ok) status = 'Expired';
  } else {
    details.push('Expiry date not provided');
    status = 'Pending';
  }

  if (passportNumber) {
    const ok = passportNumberRegex.test(passportNumber);
    details.push(ok ? 'Passport number format valid' : 'Passport number format invalid');
    if (!ok) status = 'Invalid';
  } else {
    details.push('Passport number not provided');
    status = 'Pending';
  }

  return { status, details };
}

function verifyId({ expiryDate, idNumber }) {
  const details = [];
  let status = 'Verified';

  if (expiryDate) {
    const ok = isFutureDate(expiryDate);
    details.push(
      ok ? `ID not expired: ${expiryDate}` : `ID expired or invalid date: ${expiryDate}`
    );
    if (!ok) status = 'Expired';
  } else {
    details.push('ID expiry date not provided');
    status = 'Pending';
  }

  if (idNumber) {
    const ok = idNumberRegex.test(idNumber);
    details.push(ok ? 'ID number format valid' : 'ID number format invalid');
    if (!ok) status = 'Invalid';
  } else {
    details.push('ID number not provided');
    status = 'Pending';
  }

  return { status, details };
}

function verifyDrivingLicense({ expiryDate, documentNumber }) {
  const details = [];
  let status = 'Verified';

  if (expiryDate) {
    const ok = isFutureDate(expiryDate);
    details.push(
      ok ? `License not expired: ${expiryDate}` : `License expired or invalid date: ${expiryDate}`
    );
    if (!ok) status = 'Expired';
  } else {
    details.push('License expiry date not provided');
    status = 'Pending';
  }

  if (documentNumber) {
    const ok = drivingNumberRegex.test(documentNumber);
    details.push(ok ? 'License number format valid' : 'License number format invalid');
    if (!ok) status = 'Invalid';
  } else {
    details.push('License number not provided');
    status = 'Pending';
  }

  return { status, details };
}

function verifyGeneric() {
  return { status: 'Pending', details: ['No specific rules for this document type'] };
}

function verifyByType(type, payload) {
  switch (type) {
    case 'Passport':
      return verifyPassport({ expiryDate: payload.expiryDate, passportNumber: payload.documentNumber });
    case 'ID Card':
      return verifyId({ expiryDate: payload.expiryDate, idNumber: payload.documentNumber });
    case 'Driving License':
      return verifyDrivingLicense({ expiryDate: payload.expiryDate, documentNumber: payload.documentNumber });
    default:
      return verifyGeneric();
  }
}

module.exports = {
  verifyByType,
  verifyPassport,
  verifyId,
  verifyDrivingLicense,
  verifyGeneric,
};

