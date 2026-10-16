import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

/**
 * Serverless API endpoint: /api/vacant-sites
 * Data source: Urban Redevelopment Authority (URA) Singapore Vacant Sites / GLS
 * Source URL: https://isomer-user-content.by.gov.sg/467/033342db-3b73-4730-bdc8-f47088c2c31d/06%20URA%20Vacant%20Sites%20(online%20version).xlsx
 *
 * Covers:
 * - All official URA Government Land Sales (GLS) Vacant Sites
 * - Residential (Non-Landed), Landed Housing, Commercial & Residential, White Sites, Industrial
 */

export interface UraVacantSite {
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

export function getLocalVacantSites(): UraVacantSite[] {
  try {
    const filePath = path.join(process.cwd(), 'api', 'ura_vacant_sites.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as UraVacantSite[];
    }
  } catch (err) {
    console.error('Error reading local URA vacant sites:', err);
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
  const category = (url.searchParams.get('category') || '').toLowerCase();
  const planningArea = (url.searchParams.get('planningArea') || '').toLowerCase();
  const tenderer = (url.searchParams.get('tenderer') || '').toLowerCase();
  const minPrice = parseFloat(url.searchParams.get('minPrice') || '0');
  const limit = parseInt(url.searchParams.get('limit') || '450', 10);

  // If live sync is demanded
  if (syncLive) {
    try {
      const liveRes = await fetch(URA_VACANT_SITES_ENDPOINT, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (liveRes.ok) {
        const arrayBuffer = await liveRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const xlsxPath = path.join(process.cwd(), 'api', 'ura_vacant_sites.xlsx');
        fs.writeFileSync(xlsxPath, buffer);
      }
    } catch (err: any) {
      console.warn('Live URA vacant sites sync warning:', err.message);
    }
  }

  let sites = getLocalVacantSites();

  // Apply filters
  if (query) {
    sites = sites.filter(
      (s) =>
        s.location.toLowerCase().includes(query) ||
        s.nameOfSuccessfulTenderer.toLowerCase().includes(query) ||
        s.typeOfDevelopmentAllowed.toLowerCase().includes(query) ||
        s.planningArea.toLowerCase().includes(query)
    );
  }

  if (category) {
    if (category === 'landed') {
      sites = sites.filter(
        (s) =>
          s.typeOfDevelopmentAllowed.toLowerCase().includes('landed') ||
          s.typeOfDevtCode.toLowerCase().includes('landed')
      );
    } else if (category === 'residential') {
      sites = sites.filter(
        (s) =>
          s.typeOfDevelopmentAllowed.toLowerCase().includes('residential') ||
          s.typeOfDevelopmentAllowed.toLowerCase().includes('condominium') ||
          s.typeOfDevelopmentAllowed.toLowerCase().includes('flat')
      );
    } else if (category === 'commercial') {
      sites = sites.filter(
        (s) =>
          s.typeOfDevelopmentAllowed.toLowerCase().includes('commercial') ||
          s.typeOfDevtCode.toLowerCase().includes('commercial')
      );
    } else if (category === 'white') {
      sites = sites.filter(
        (s) =>
          s.typeOfDevelopmentAllowed.toLowerCase().includes('white') ||
          s.typeOfDevtCode.toLowerCase().includes('white')
      );
    }
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
      timestamp: new Date().toISOString(),
    })
  );
}
