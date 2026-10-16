import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

/**
 * Serverless API endpoint: /api/health
 * Health check & runtime diagnostics for PropertySeek Singapore
 *
 * GUARDRAIL COMPLIANCE:
 * - Read every key from process.env inside api/ only. Never give a key the VITE_ prefix.
 * - Collect no personal data.
 * - Accurate status reporting without invented data.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const apiDir = path.join(process.cwd(), 'api');
  const xlsxPath = path.join(apiDir, 'ura_vacant_sites.xlsx');
  const publicJsonPath = path.join(apiDir, 'ura_public_sites.json');
  const landedJsonPath = path.join(apiDir, 'ura_landed_sites.json');

  const xlsxExists = fs.existsSync(xlsxPath);
  let publicSitesCount = 0;
  let landedSitesCount = 0;

  try {
    if (fs.existsSync(publicJsonPath)) {
      const pubData = JSON.parse(fs.readFileSync(publicJsonPath, 'utf-8'));
      publicSitesCount = Array.isArray(pubData) ? pubData.length : 0;
    }
    if (fs.existsSync(landedJsonPath)) {
      const landData = JSON.parse(fs.readFileSync(landedJsonPath, 'utf-8'));
      landedSitesCount = Array.isArray(landData) ? landData.length : 0;
    }
  } catch (err: any) {
    console.error('Error verifying dataset health:', err);
  }

  const healthPayload = {
    status: 'healthy',
    service: 'PropertySeek Singapore API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    source: 'Data: URA SINGAPORE',
    endpoints: {
      publicSites: '/api/public',
      landedSites: '/api/landed',
      properties: '/api/properties',
      alerts: '/api/alerts',
      sync: '/api/sync',
      health: '/api/health',
    },
    dataAssets: {
      uraVacantSitesXlsx: xlsxExists ? 'available' : 'missing',
      publicGlsSitesCount: publicSitesCount,
      landedGlsSitesCount: landedSitesCount,
    },
  };

  res.statusCode = 200;
  res.end(JSON.stringify(healthPayload, null, 2));
}
