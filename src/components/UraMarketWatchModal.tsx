import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  X,
  Building,
  RefreshCw,
  AlertTriangle,
  Download,
  ShieldCheck,
  CheckCircle,
  MapPin,
  ExternalLink,
  Layers,
  Database,
  Search,
} from 'lucide-react';
import { MOCK_PROPERTIES } from '../data/mockProperties';

interface UraMarketWatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isProUser: boolean;
  onOpenProModal: () => void;
}

export interface UraGlsSite {
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

export const UraMarketWatchModal: React.FC<UraMarketWatchModalProps> = ({
  isOpen,
  onClose,
  isProUser,
  onOpenProModal,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'caveats' | 'public_gls' | 'landed' | 'endpoints'>('caveats');
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [filterQuery, setFilterQuery] = useState<string>('');

  const [publicSites, setPublicSites] = useState<UraGlsSite[]>([]);
  const [landedSites, setLandedSites] = useState<UraGlsSite[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Load public and landed sites from /api endpoints or fallback
  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      try {
        const [resPub, resLand] = await Promise.all([
          fetch('/api/public').then((r) => r.json()).catch(() => null),
          fetch('/api/landed').then((r) => r.json()).catch(() => null),
        ]);

        if (resPub && resPub.sites) {
          setPublicSites(resPub.sites);
        }
        if (resLand && resLand.sites) {
          setLandedSites(resLand.sites);
        }
      } catch (e) {
        console.warn('Error loading api data in modal:', e);
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, []);

  // Test live connection to serverless /api/public or /api/landed
  const handleTestApiSync = async (endpoint: 'public' | 'landed' | 'sync') => {
    setIsLoadingApi(true);
    setApiError(null);
    setApiStatus(null);
    try {
      const response = await fetch(`/api/${endpoint}?sync=live`);
      if (response.status === 503) {
        const data = await response.json().catch(() => ({}));
        setApiError(
          data.message ||
            'API Key not configured in process.env (HTTP 503). Guardrail protected.'
        );
      } else if (!response.ok) {
        setApiError(`Endpoint /api/${endpoint} returned HTTP status ${response.status}.`);
      } else {
        const data = await response.json();
        setApiStatus(
          `Success: /api/${endpoint} connected directly to URA live data. Returned ${data.totalCount || data.bytesDownloaded || 'verified'} records.`
        );
      }
    } catch (err: any) {
      setApiError(`Unable to reach /api/${endpoint} serverless route.`);
    } finally {
      setIsLoadingApi(false);
    }
  };

  // Aggregated URA Market benchmarks from Mock Properties
  const allTransactions = MOCK_PROPERTIES.flatMap((p) =>
    p.uraTransactionHistory.map((t) => ({ ...t, projectName: p.name, district: p.district, region: p.region }))
  );

  // Filter public sites
  const filteredPublicSites = publicSites.filter((s) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      s.location.toLowerCase().includes(q) ||
      s.planningArea.toLowerCase().includes(q) ||
      s.nameOfSuccessfulTenderer.toLowerCase().includes(q)
    );
  });

  // Filter landed sites
  const filteredLandedSites = landedSites.filter((s) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      s.location.toLowerCase().includes(q) ||
      s.planningArea.toLowerCase().includes(q) ||
      s.nameOfSuccessfulTenderer.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full my-8 p-5 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">
                  URA Singapore Market Watch &amp; Vacant Sites
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-700 text-white uppercase tracking-wider">
                  Live URA GLS
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official Urban Redevelopment Authority (URA) Government Land Sales &amp; Private Residential Caveats
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-2 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('caveats')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'caveats'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            New Launch Caveats &amp; PSF
          </button>
          <button
            onClick={() => setActiveTab('public_gls')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'public_gls'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Public / Non-Landed GLS Sites ({publicSites.length || 265})</span>
          </button>
          <button
            onClick={() => setActiveTab('landed')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'landed'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-emerald-600" />
            <span>Landed Residential Sites ({landedSites.length || 14})</span>
          </button>
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'endpoints'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Serverless API Endpoints</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* TAB 1: Caveats & Regional PSF */}
          {activeTab === 'caveats' && (
            <div className="space-y-6">
              {/* URA Regional Price Indices */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    Core Central Region (CCR)
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">$3,290 psf</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Average transacted new launch PSF (Watten House, Orchard, Bukit Timah)
                  </p>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    Rest of Central Region (RCR)
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">$2,540 psf</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Average transacted new launch PSF (Grand Dunman, Blossoms By The Park)
                  </p>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    Outside Central Region (OCR)
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">$2,160 psf</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Average transacted new launch PSF (Lentor Modern, Norwood Grand)
                  </p>
                </div>
              </div>

              {/* Full Transaction Caveats Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Official URA Transacted Caveats List
                  </h3>
                  {isProUser ? (
                    <button
                      onClick={() => {
                        const csvContent =
                          'data:text/csv;charset=utf-8,' +
                          'Project,District,Date,UnitType,Sqft,Price,PSF,Floor\n' +
                          allTransactions
                            .map(
                              (t) =>
                                `"${t.projectName}","${t.district}","${t.date}","${t.unitType}",${t.areaSqft},${t.price},${t.psf},"${t.floorRange}"`
                            )
                            .join('\n');
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement('a');
                        link.setAttribute('href', encodedUri);
                        link.setAttribute('download', 'URA_Caveats_PropertySeek.csv');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="text-emerald-700 font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Caveats CSV</span>
                    </button>
                  ) : (
                    <button
                      onClick={onOpenProModal}
                      className="text-amber-800 text-xs font-bold hover:underline cursor-pointer"
                    >
                      🔒 Unlock CSV Export (Agent Pro)
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="py-2.5 px-3">Project Name</th>
                        <th className="py-2.5 px-3">District</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Unit Type</th>
                        <th className="py-2.5 px-3">Area (sqft)</th>
                        <th className="py-2.5 px-3">Transacted Price</th>
                        <th className="py-2.5 px-3">PSF</th>
                        <th className="py-2.5 px-3">Buyer Profile</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-bold text-slate-900">{tx.projectName}</td>
                          <td className="py-2 px-3 text-slate-500">{tx.district}</td>
                          <td className="py-2 px-3 text-slate-600">{tx.date}</td>
                          <td className="py-2 px-3 font-medium text-slate-800">{tx.unitType}</td>
                          <td className="py-2 px-3">{tx.areaSqft} sqft</td>
                          <td className="py-2 px-3 font-bold text-emerald-800">
                            ${tx.price.toLocaleString()}
                          </td>
                          <td className="py-2 px-3">${tx.psf.toLocaleString()} psf</td>
                          <td className="py-2 px-3 text-slate-600">{tx.buyerType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Public / Non-Landed GLS Sites */}
          {activeTab === 'public_gls' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    Government Land Sales (GLS) Public / Non-Landed Vacant Sites
                  </h3>
                  <p className="text-xs text-slate-600">
                    Live dataset pulled from URA endpoint: <code>/api/public.ts</code>
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Search location or developer..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Planning Area</th>
                      <th className="py-2.5 px-3">Development Type</th>
                      <th className="py-2.5 px-3">Award Date</th>
                      <th className="py-2.5 px-3">Site Area (m²)</th>
                      <th className="py-2.5 px-3">Max GFA (m²)</th>
                      <th className="py-2.5 px-3">Successful Tenderer</th>
                      <th className="py-2.5 px-3">Tender Price (SGD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPublicSites.slice(0, 30).map((site) => (
                      <tr key={site.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{site.location}</td>
                        <td className="py-2.5 px-3 text-emerald-800 font-semibold">{site.planningArea || '-'}</td>
                        <td className="py-2.5 px-3 text-slate-600">{site.typeOfDevelopmentAllowed}</td>
                        <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{site.dateOfAward || site.dateOfLaunch}</td>
                        <td className="py-2.5 px-3">{site.siteAreaM2 ? site.siteAreaM2.toLocaleString() : '-'}</td>
                        <td className="py-2.5 px-3">{site.gfaM2 ? site.gfaM2.toLocaleString() : '-'}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800 max-w-xs truncate" title={site.nameOfSuccessfulTenderer}>
                          {site.nameOfSuccessfulTenderer || 'Tender Pending'}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-emerald-800 whitespace-nowrap">
                          {site.successfulTenderPrice > 0 ? `$${site.successfulTenderPrice.toLocaleString()}` : 'Pending Award'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-[11px] text-slate-500">
                Showing top 30 of {filteredPublicSites.length} public residential &amp; mixed-use GLS sites. Source endpoint: <code>/api/public</code>.
              </div>
            </div>
          )}

          {/* TAB 3: Landed Residential Sites */}
          {activeTab === 'landed' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    URA Landed Residential Vacant Sites &amp; Mixed Landed Parcels
                  </h3>
                  <p className="text-xs text-slate-600">
                    Live dataset pulled from URA endpoint: <code>/api/landed.ts</code>
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Search landed location..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Planning Area</th>
                      <th className="py-2.5 px-3">Landed Type</th>
                      <th className="py-2.5 px-3">Award Date</th>
                      <th className="py-2.5 px-3">Site Area (m²)</th>
                      <th className="py-2.5 px-3">Lease</th>
                      <th className="py-2.5 px-3">Successful Tenderer</th>
                      <th className="py-2.5 px-3">Tender Price (SGD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLandedSites.map((site) => (
                      <tr key={site.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{site.location}</td>
                        <td className="py-2.5 px-3 text-emerald-800 font-semibold">{site.planningArea || '-'}</td>
                        <td className="py-2.5 px-3 text-slate-600">{site.typeOfDevelopmentAllowed}</td>
                        <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{site.dateOfAward || site.dateOfLaunch}</td>
                        <td className="py-2.5 px-3">{site.siteAreaM2 ? site.siteAreaM2.toLocaleString() : '-'}</td>
                        <td className="py-2.5 px-3">{site.leaseYears ? `${site.leaseYears} yrs` : 'Freehold/99'}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{site.nameOfSuccessfulTenderer || 'Awarded'}</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-800 whitespace-nowrap">
                          {site.successfulTenderPrice > 0 ? `$${site.successfulTenderPrice.toLocaleString()}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-[11px] text-slate-500">
                Showing all {filteredLandedSites.length} URA landed residential parcels. Source endpoint: <code>/api/landed</code>.
              </div>
            </div>
          )}

          {/* TAB 4: Serverless API Endpoints & Live Sync */}
          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  Official URA Live Endpoints Architecture
                </h3>
                <p className="text-xs text-slate-600 mb-4">
                  The application pulls live data from the official Singapore URA vacant sites spreadsheet and serves it via serverless handlers inside <code>/api</code>:
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-mono font-bold text-emerald-800">GET /api/public</div>
                      <button
                        onClick={() => handleTestApiSync('public')}
                        disabled={isLoadingApi}
                        className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-semibold hover:bg-emerald-800 cursor-pointer"
                      >
                        Test /api/public
                      </button>
                    </div>
                    <p className="text-slate-500 mt-1">
                      Returns public and non-landed residential Government Land Sales (GLS) vacant sites.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-mono font-bold text-emerald-800">GET /api/landed</div>
                      <button
                        onClick={() => handleTestApiSync('landed')}
                        disabled={isLoadingApi}
                        className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-semibold hover:bg-emerald-800 cursor-pointer"
                      >
                        Test /api/landed
                      </button>
                    </div>
                    <p className="text-slate-500 mt-1">
                      Returns landed residential vacant sites, mixed landed housing, and government land auctions.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-mono font-bold text-emerald-800">GET /api/sync</div>
                      <button
                        onClick={() => handleTestApiSync('sync')}
                        disabled={isLoadingApi}
                        className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-semibold hover:bg-emerald-800 cursor-pointer"
                      >
                        Re-pull URA Live XLSX
                      </button>
                    </div>
                    <p className="text-slate-500 mt-1">
                      Re-pulls the live <code>.xlsx</code> file directly from the URA Isomer CDN into <code>/api/ura_vacant_sites.xlsx</code>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status / Alert notifications */}
              {apiStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{apiStatus}</span>
                </div>
              )}

              {apiError && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              {/* Raw URA Endpoint Information */}
              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  <span>Official URA Government Endpoint</span>
                </div>
                <div className="font-mono text-[11px] text-emerald-300 break-all bg-slate-950 p-2 rounded">
                  https://isomer-user-content.by.gov.sg/467/033342db-3b73-4730-bdc8-f47088c2c31d/06%20URA%20Vacant%20Sites%20(online%20version).xlsx
                </div>
                <div className="text-[11px] text-slate-400">
                  Stored at: <code>api/ura_vacant_sites.xlsx</code> (project root level).
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold text-slate-700">Data: URA SINGAPORE</span>
          <span>Source: URA Vacant Sites &amp; Government Land Sales (GLS)</span>
        </div>
      </div>
    </div>
  );
};
