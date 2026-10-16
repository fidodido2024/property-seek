import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

export const URA_EXCEL_URL =
  'https://isomer-user-content.by.gov.sg/467/033342db-3b73-4730-bdc8-f47088c2c31d/06%20URA%20Vacant%20Sites%20(online%20version).xlsx';

/**
 * Serverless API endpoint: /api/sync
 * Pulls live data from URA official vacant sites spreadsheet and stores in /api folder
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const response = await fetch(URA_EXCEL_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      res.statusCode = response.status;
      res.end(
        JSON.stringify({
          error: `Failed to fetch from URA endpoint: HTTP ${response.status}`,
          source: 'Data: URA SINGAPORE',
        })
      );
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const targetPath = path.join(process.cwd(), 'api', 'ura_vacant_sites.xlsx');
    fs.writeFileSync(targetPath, buffer);

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        status: 'success',
        message: 'Successfully pulled live data from URA and stored in /api folder.',
        source: 'Data: URA SINGAPORE',
        endpoint: URA_EXCEL_URL,
        bytesDownloaded: buffer.length,
        timestamp: new Date().toISOString(),
      })
    );
  } catch (error: any) {
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        error: 'Error pulling live data from URA: ' + error.message,
        source: 'Data: URA SINGAPORE',
      })
    );
  }
}
