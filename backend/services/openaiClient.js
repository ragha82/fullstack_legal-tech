const OpenAI = require('openai');

let client = null;
const ALLOWED_TYPES = ['Passport', 'Driving License', 'ID Card', 'PAN Card', 'Aadhaar Card', 'Other'];

function getOpenAIClient() {
  if (!client && process.env.OPENAI_API_KEY) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return client;
}

/**
 * Detect document type using filename (heuristic + optional OpenAI text).
 */
async function detectDocumentType({ originalFileName, hintType }) {
  if (hintType && ALLOWED_TYPES.includes(hintType)) {
    return hintType;
  }

  const lower = (originalFileName || '').toLowerCase();
  if (lower.includes('passport')) return 'Passport';
  if (lower.includes('license') || lower.includes('licence') || lower.includes('dl')) return 'Driving License';
  if (lower.includes('aadhar') || lower.includes('aadhaar')) return 'Aadhaar Card';
  if (lower.includes('pan')) return 'PAN Card';
  if (lower.includes('id') || lower.includes('identity') || lower.includes('card')) return 'ID Card';

  const openai = getOpenAIClient();
  if (!openai) return 'Other';

  try {
    const prompt = `You are a strict classifier for identity / government documents.
Given this file name: "${originalFileName}", return exactly one of:
${ALLOWED_TYPES.join(', ')}.
Reply with ONLY one of those strings.`;

    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
    });

    const text = response.output?.[0]?.content?.[0]?.text?.trim();
    if (ALLOWED_TYPES.includes(text)) {
      return text;
    }
  } catch (error) {
    console.error('Error detecting document type via OpenAI:', error.message);
  }

  return 'Other';
}

/**
 * Detect document type from an image/PDF buffer using OpenAI vision.
 * Does NOT store the image. Sends as base64 data URL.
 *
 * @param {{ buffer: Buffer, mimeType: string, originalName?: string }} params
 * @returns {Promise<string>} one of ALLOWED_TYPES
 */
async function detectDocumentTypeFromImage({ buffer, mimeType, originalName }) {
  const openai = getOpenAIClient();
  if (!openai) {
    // Without key, fall back to filename heuristics
    return detectDocumentType({ originalFileName: originalName, hintType: null });
  }

  try {
    const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
    const prompt = `You are a strict classifier for identity/government documents.
Look at the provided image/PDF content and return exactly one of:
${ALLOWED_TYPES.join(', ')}.
If unsure, return "Other". Reply with ONLY one of those strings.`;

    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        { role: 'user', content: [{ type: 'text', text: prompt }, { type: 'input_image', image_url: dataUrl }] },
      ],
    });

    const text = response.output?.[0]?.content?.[0]?.text?.trim();
    if (ALLOWED_TYPES.includes(text)) {
      return text;
    }
  } catch (error) {
    console.error('Error detecting document type from image via OpenAI:', error.message);
  }

  return 'Other';
}

module.exports = {
  detectDocumentType,
  detectDocumentTypeFromImage,
  ALLOWED_TYPES,
};


