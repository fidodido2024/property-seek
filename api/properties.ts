import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Serverless API endpoint for PropertySeek (e.g. Vercel /api/properties)
 * GUARDRAIL COMPLIANCE:
 * - Read every key from process.env inside api/ only. Never give a key the VITE_ prefix.
 * - If a key variable is empty, api/ returns 503 "key not configured" and does not call the provider.
 * - Collect no personal data beyond what PropertySeek needs.
 * - Send no personal or confidential data to any AI model.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Check optional external provider / URA API key if configured
  const apiKey = process.env.URA_API_KEY || process.env.PROPERTY_API_KEY;

  // Set standard CORS & content-type headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Guardrail check: if provider integration is requested and key is empty, return 503
  if (!apiKey && req.url?.includes('live=true')) {
    res.statusCode = 503;
    res.end(JSON.stringify({
      error: 'key not configured',
      message: 'Provider API key is not configured in process.env. Live provider sync unavailable.',
      code: 503,
    }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({
    status: 'ok',
    source: 'URA SINGAPORE',
    timestamp: new Date().toISOString(),
    message: 'PropertySeek API operational.',
  }));
}
