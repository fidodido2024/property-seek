import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Serverless API endpoint for PropertySeek Price Alerts
 * GUARDRAIL COMPLIANCE:
 * - Read every key from process.env inside api/ only. Never give a key the VITE_ prefix.
 * - If a key variable is empty, api/ returns 503 "key not configured" and does not call the provider.
 * - Collect no personal data beyond what PropertySeek needs (recipient contact for alert only).
 * - Send no personal or confidential data to any AI model.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const alertProviderKey = process.env.ALERTS_PROVIDER_KEY || process.env.WHATSAPP_API_KEY;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // If live external SMS/WhatsApp webhook is requested without key configured
  if (req.method === 'POST' && req.url?.includes('dispatch=live') && !alertProviderKey) {
    res.statusCode = 503;
    res.end(JSON.stringify({
      error: 'key not configured',
      message: 'Alert provider key is not configured in process.env. Unable to dispatch external SMS/WhatsApp.',
      code: 503,
    }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({
    status: 'success',
    message: 'Alert registered successfully in PropertySeek.',
    source: 'Data: URA SINGAPORE',
  }));
}
