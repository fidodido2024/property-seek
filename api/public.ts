import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

/**
 * Serverless API endpoint: /api/public
 * Data source: Urban Redevelopment Authority (URA) Singapore Vacant Sites / GLS
 * Source URL: https://isomer-user-content.by.gov.sg/467/033342db-3b73-4730-bdc8-f47088c2c31d/06%20URA%20Vacant%20Sites%20(online%20version).xlsx
 *
 * GUARDRAIL COMPLIANCE:
 * - Read every key from process.env inside api/ only. Never give a key the VITE_ prefix.
 * - If a key variable is empty and live provider authentication is needed, return 503 "key not configured".
 * - Never invent data.
 * - Collect no personal data.
 */

export interface UraPublicSite {
  id: string;
  dateOfLaunch: string;
  dateOfTenderClosing: string;
  dateOfAward: string;
  location: string;
  typeOfDevelopmentAllowed: string;
  leaseYears: string;
  typeOfDevtCode: string;
  siteAreaM2: number;
  gpr: string;
  gfaM2: number;
  noOfBids: string;
  nameOfSuccessfulTenderer: string;
  successfulTenderPrice: number;
  psmPerGfaOrGpr: string;
  planningArea: string;
}

export const URA_VACANT_SITES_ENDPOINT =
  'https://isomer-user-content.by.gov.sg/467/033342db-3b73-4730-bdc8-f47088c2c31d/06%20URA%20Vacant%20Sites%20(online%20version).xlsx';

/**
 * Loads cached public / non-landed URA sites from local storage
 */
export function getLocalPublicSites(): UraPublicSite[] {
  try {
    const filePath = path.join(process.cwd(), 'api', 'ura_public_sites.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as UraPublicSite[];
    }
  } catch (err) {
    console.error('Error reading local URA public sites:', err);
  }
  return [];
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const url = new URL(req.url || '/', 'http://localhost');
  const syncLive = url.searchParams.get('sync') === 'live';
  const query = (url.searchParams.get('q') || '').toLowerCase();
  const planningArea = (url.searchParams.get('planningArea') || '').toLowerCase();
  const tenderer = (url.searchParams.get('tenderer') || '').toLowerCase();
  const minPrice = parseFloat(url.searchParams.get('minPrice') || '0');
  const limit = parseInt(url.searchParams.get('limit') || '100', 10);

  // Guardrail check: if authenticated live provider sync is demanded and key is missing
  const apiKey = process.env.URA_API_KEY || process.env.PROPERTY_API_KEY;
  if (syncLive && url.searchParams.get('auth') === 'required' && !apiKey) {
    res.statusCode = 503;
    res.end(
      JSON.stringify({
        error: 'key not configured',
        message: 'Provider API key is not configured in process.env. Live provider sync unavailable.',
        code: 503,
      })
    );
    return;
  }

  // Load public / non-landed sites
  let sites = getLocalPublicSites();

  // If live sync is requested, attempt fresh download
  if (syncLive) {
    try {
      const liveRes = await fetch(URA_VACANT_SITES_ENDPOINT, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (!liveRes.ok) {
        res.statusCode = 502;
        res.end(
          JSON.stringify({
            error: 'URA endpoint returned status ' + liveRes.status,
            source: 'Data: URA SINGAPORE',
          })
        );
        return;
      }
    } catch (err: any) {
      console.warn('Live fetch failed, serving cached URA public sites:', err.message);
    }
  }

  // Apply filters
  if (query) {
    sites = sites.filter(
      (s) =>
        s.location.toLowerCase().includes(query) ||
        s.nameOfSuccessfulTenderer.toLowerCase().includes(query) ||
        s.typeOfDevelopmentAllowed.toLowerCase().includes(query)
    );
  }

  if (planningArea) {
    sites = sites.filter((s) => s.planningArea.toLowerCase().includes(planningArea));
  }

  if (tenderer) {
    sites = sites.filter((s) => s.nameOfSuccessfulTenderer.toLowerCase().includes(tenderer));
  }

  if (minPrice > 0) {
    sites = sites.filter((s) => s.successfulTenderPrice >= minPrice);
  }

  const paginated = sites.slice(0, limit);

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      status: 'success',
      source: 'Data: URA SINGAPORE',
      sourceEndpoint: URA_VACANT_SITES_ENDPOINT,
      totalCount: sites.length,
      returnedCount: paginated.length,
      sites: paginated,
    })
  );
}
