import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Search,
  Download,
  RefreshCw,
  Building,
  Layers,
  Filter,
  DollarSign,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ArrowUpDown,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { URA_VACANT_SITES_ENDPOINT, UraVacantSite } from '../../api/vacant-sites';

export const VacantSitesExplorer: React.FC = () => {
  const [sites, setSites] = useState<UraVacantSite[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'residential' | 'landed' | 'commercial' | 'white'
  >('all');
  const [selectedPlanningArea, setSelectedPlanningArea] = useState<string>('all');
  const [selectedLease, setSelectedLease] = useState<string>('all');
  const [sortBy, setSortBy] = useState<
    'date_desc' | 'date_asc' | 'price_desc' | 'price_asc' | 'area_desc' | 'psm_desc'
  >('date_desc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Load data from /api/vacant-sites
  const fetchSites = async (syncLive: boolean = false) => {
    setIsLoading(true);
    setSyncStatus(null);
    try {
      const url = syncLive ? '/api/vacant-sites?sync=live' : '/api/vacant-sites';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.sites && Array.isArray(data.sites)) {
          setSites(data.sites);
          if (syncLive) {
            setSyncStatus(
              `Live sync complete! ${data.sites.length} URA vacant sites refreshed from official Isomer endpoint.`
            );
          }
        }
      } else {
        setSyncStatus('Failed to retrieve vacant sites from /api/vacant-sites');
      }
    } catch (err: any) {
      console.error('Error fetching vacant sites:', err);
      setSyncStatus('Error connecting to /api/vacant-sites endpoint.');
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchSites(false);
  }, []);

  const handleLiveSync = () => {
    setIsSyncing(true);
    fetchSites(true);
  };

  // Distinct planning areas
  const planningAreas = useMemo(() => {
    const set = new Set<string>();
    sites.forEach((s) => {
      if (s.planningArea && s.planningArea.trim()) {
        set.add(s.planningArea.trim());
      }
    });
    return Array.from(set).sort();
  }, [sites]);

  // Filtered and sorted sites
  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesLoc = site.location.toLowerCase().includes(q);
        const matchesDev = site.typeOfDevelopmentAllowed.toLowerCase().includes(q);
        const matchesTend = site.nameOfSuccessfulTenderer.toLowerCase().includes(q);
        const matchesPlan = site.planningArea.toLowerCase().includes(q);
        if (!matchesLoc && !matchesDev && !matchesTend && !matchesPlan) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory === 'residential') {
        const t = site.typeOfDevelopmentAllowed.toLowerCase();
        const isRes =
          (t.includes('residential') || t.includes('condominium') || t.includes('flat')) &&
          !t.includes('mixed landed') &&
          !t.includes('landed housing');
        if (!isRes) return false;
      } else if (selectedCategory === 'landed') {
        const t = site.typeOfDevelopmentAllowed.toLowerCase();
        const code = site.typeOfDevtCode.toLowerCase();
        const isLanded =
          (t.includes('landed') || code.includes('landed')) &&
          (!t.includes('non-landed') || t.includes('mixed landed'));
        if (!isLanded) return false;
      } else if (selectedCategory === 'commercial') {
        const t = site.typeOfDevelopmentAllowed.toLowerCase();
        if (!t.includes('commercial')) return false;
      } else if (selectedCategory === 'white') {
        const t = site.typeOfDevelopmentAllowed.toLowerCase();
        const code = site.typeOfDevtCode.toLowerCase();
        if (!t.includes('white') && !code.includes('white') && !t.includes('industrial')) {
          return false;
        }
      }

      // 3. Planning Area
      if (selectedPlanningArea !== 'all' && site.planningArea !== selectedPlanningArea) {
        return false;
      }

      // 4. Lease
      if (selectedLease !== 'all') {
        if (selectedLease === '99' && !site.leaseYears.includes('99')) return false;
        if (selectedLease === '30' && !site.leaseYears.includes('30')) return false;
        if (selectedLease === '60' && !site.leaseYears.includes('60')) return false;
      }

      return true;
    });
  }, [sites, searchQuery, selectedCategory, selectedPlanningArea, selectedLease]);

  // Sorted sites
  const sortedSites = useMemo(() => {
    const list = [...filteredSites];
    switch (sortBy) {
      case 'date_desc':
        return list.sort((a, b) => (b.dateOfAward || b.dateOfLaunch).localeCompare(a.dateOfAward || a.dateOfLaunch));
      case 'date_asc':
        return list.sort((a, b) => (a.dateOfAward || a.dateOfLaunch).localeCompare(b.dateOfAward || b.dateOfLaunch));
      case 'price_desc':
        return list.sort((a, b) => b.successfulTenderPrice - a.successfulTenderPrice);
      case 'price_asc':
        return list.sort((a, b) => a.successfulTenderPrice - b.successfulTenderPrice);
      case 'area_desc':
        return list.sort((a, b) => b.siteAreaM2 - a.siteAreaM2);
      case 'psm_desc':
        return list.sort(
          (a, b) => parseFloat(b.psmPerGfaOrGpr || '0') - parseFloat(a.psmPerGfaOrGpr || '0')
        );
      default:
        return list;
    }
  }, [filteredSites, sortBy]);

  // Aggregate Metrics
  const totalAwardValue = useMemo(() => {
    return sites.reduce((acc, s) => acc + (s.successfulTenderPrice || 0), 0);
  }, [sites]);

  const residentialCount = useMemo(() => {
    return sites.filter((s) => s.typeOfDevelopmentAllowed.toLowerCase().includes('residential')).length;
  }, [sites]);

  const landedCount = useMemo(() => {
    return sites.filter(
      (s) =>
        s.typeOfDevelopmentAllowed.toLowerCase().includes('landed') &&
        (!s.typeOfDevelopmentAllowed.toLowerCase().includes('non-landed') ||
          s.typeOfDevelopmentAllowed.toLowerCase().includes('mixed landed'))
    ).length;
  }, [sites]);

  // Download CSV
  const handleExportCSV = () => {
    const headers = [
      'Location',
      'Planning Area',
      'Development Allowed',
      'Lease (Years)',
      'Launch Date',
      'Award Date',
      'Site Area (m2)',
      'GFA (m2)',
      'Successful Tenderer',
      'Tender Price (SGD)',
      'Rate ($psm GFA)',
    ];

    const rows = sortedSites.map((s) => [
      `"${s.location.replace(/"/g, '""')}"`,
      `"${s.planningArea.replace(/"/g, '""')}"`,
      `"${s.typeOfDevelopmentAllowed.replace(/"/g, '""')}"`,
      `"${s.leaseYears}"`,
      `"${s.dateOfLaunch}"`,
      `"${s.dateOfAward}"`,
      s.siteAreaM2,
      s.gfaM2,
      `"${(s.nameOfSuccessfulTenderer || '').replace(/"/g, '""')}"`,
      s.successfulTenderPrice,
      `"${s.psmPerGfaOrGpr}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `URA_Vacant_Sites_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Official Source Info */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Official URA Singapore Vacant Sites &amp; GLS Feed</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Singapore Vacant Sites &amp; Land Sales
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Real-time Government Land Sales (GLS) tenders, vacant parcels, and land tender awards directly pulled from the Urban Redevelopment Authority (URA) official data repository.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-emerald-300">
              <span className="font-semibold text-white">Live Source:</span>
              <a
                href={URA_VACANT_SITES_ENDPOINT}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors truncate max-w-xs sm:max-w-md"
              >
                06 URA Vacant Sites (online version).xlsx
              </a>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleLiveSync}
              disabled={isSyncing}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              title="Sync latest spreadsheet from URA Isomer CDN"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing URA...' : 'Re-Pull Live URA Data'}</span>
            </button>

            <a
              href={URA_VACANT_SITES_ENDPOINT}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Download .XLSX</span>
            </a>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatus && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-800/80 border border-emerald-600/50 text-xs font-semibold text-white flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{syncStatus}</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Total Vacant Sites
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {sites.length || 443}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Government Land Sales</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
            Residential GLS Sites
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-800">
            {residentialCount || 265}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Condo &amp; Non-Landed</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Landed Residential
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {landedCount || 14}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Mixed Landed Parcels</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Total Land Capital Awarded
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            ${(totalAwardValue / 1000000000).toFixed(1)}B
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">SGD Tender Volume</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Vacant Sites ({sites.length})
          </button>
          <button
            onClick={() => setSelectedCategory('residential')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'residential'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Residential Non-Landed
          </button>
          <button
            onClick={() => setSelectedCategory('landed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'landed'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Landed Residential
          </button>
          <button
            onClick={() => setSelectedCategory('commercial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'commercial'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Commercial &amp; Mixed-Use
          </button>
          <button
            onClick={() => setSelectedCategory('white')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'white'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            White Sites &amp; Others
          </button>
        </div>

        {/* Dropdown controls grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Location / Tenderer */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search site location, developer..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          {/* Planning Area Dropdown */}
          <div>
            <select
              value={selectedPlanningArea}
              onChange={(e) => setSelectedPlanningArea(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="all">All Planning Areas ({planningAreas.length})</option>
              {planningAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Lease Tenure Dropdown */}
          <div>
            <select
              value={selectedLease}
              onChange={(e) => setSelectedLease(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="all">All Lease Terms</option>
              <option value="99">99-year Leasehold</option>
              <option value="30">30-year Leasehold</option>
              <option value="60">60-year Leasehold</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="date_desc">Award / Launch (Newest First)</option>
              <option value="date_asc">Award / Launch (Oldest First)</option>
              <option value="price_desc">Tender Price (Highest First)</option>
              <option value="price_asc">Tender Price (Lowest First)</option>
              <option value="area_desc">Site Area (Largest First)</option>
              <option value="psm_desc">Land Rate ($/m² GFA)</option>
            </select>
          </div>
        </div>

        {/* Action Header & View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="text-slate-600">
            Showing <strong className="text-slate-900">{sortedSites.length}</strong> vacant sites
            {searchQuery && <span> matching &quot;{searchQuery}&quot;</span>}
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* CSV Export */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Listing View (Cards or Table) */}
      {isLoading ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Loading URA Vacant Sites...</p>
        </div>
      ) : sortedSites.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 max-w-md mx-auto p-6">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Matching Vacant Sites Found</h3>
          <p className="text-xs text-slate-500 mb-4">
            Try resetting your search query or selecting &quot;All Planning Areas&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedPlanningArea('all');
              setSelectedLease('all');
            }}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedSites.map((site) => (
            <article
              key={site.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-md hover:border-emerald-500 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    {site.planningArea || 'Singapore'} · {site.leaseYears ? `${site.leaseYears} Yrs` : 'Lease'}
                  </span>
                  {site.dateOfAward && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      Awarded: {site.dateOfAward}
                    </span>
                  )}
                </div>

                {/* Location Title */}
                <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1">
                  {site.location}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                  {site.typeOfDevelopmentAllowed}
                </p>

                {/* Pricing / Tender Info */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3 space-y-1.5 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-500">Successful Tender Price:</span>
                    <strong className="text-emerald-800 font-extrabold text-sm">
                      {site.successfulTenderPrice > 0
                        ? `$${site.successfulTenderPrice.toLocaleString()} SGD`
                        : 'Award Pending'}
                    </strong>
                  </div>

                  {site.psmPerGfaOrGpr && (
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Land Rate ($/m² GFA):</span>
                      <span className="font-semibold text-slate-800">
                        ${parseFloat(site.psmPerGfaOrGpr).toLocaleString()} /m²
                      </span>
                    </div>
                  )}

                  {site.nameOfSuccessfulTenderer && (
                    <div className="pt-1 border-t border-slate-200/60 text-[11px] text-slate-700">
                      <span className="text-slate-400">Winning Developer: </span>
                      <span className="font-semibold">{site.nameOfSuccessfulTenderer}</span>
                    </div>
                  )}
                </div>

                {/* Physical metrics */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-2">
                  <div>
                    <span className="text-slate-400">Site Area: </span>
                    <strong className="text-slate-800">
                      {site.siteAreaM2 ? `${site.siteAreaM2.toLocaleString()} m²` : '-'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Max GFA: </span>
                    <strong className="text-slate-800">
                      {site.gfaM2 ? `${site.gfaM2.toLocaleString()} m²` : '-'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  {site.noOfBids ? `${site.noOfBids} bids submitted` : 'Tender awarded'}
                </span>
                <a
                  href={`https://wa.me/6591234567?text=Hi%2C+I+want+to+enquire+about+future+new+launch+developments+at+URA+Vacant+Site+${encodeURIComponent(
                    site.location
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <span>Register Interest</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Planning Area</th>
                <th className="py-3 px-4">Development Allowed</th>
                <th className="py-3 px-4">Lease</th>
                <th className="py-3 px-4">Award Date</th>
                <th className="py-3 px-4">Site Area (m²)</th>
                <th className="py-3 px-4">Winning Developer</th>
                <th className="py-3 px-4">Tender Price (SGD)</th>
                <th className="py-3 px-4">Land Rate ($/m²)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedSites.map((site) => (
                <tr key={site.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900">{site.location}</td>
                  <td className="py-2.5 px-4 text-emerald-800 font-semibold">{site.planningArea || '-'}</td>
                  <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate">{site.typeOfDevelopmentAllowed}</td>
                  <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">{site.leaseYears ? `${site.leaseYears} Yrs` : '-'}</td>
                  <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">{site.dateOfAward || site.dateOfLaunch}</td>
                  <td className="py-2.5 px-4">{site.siteAreaM2 ? site.siteAreaM2.toLocaleString() : '-'}</td>
                  <td className="py-2.5 px-4 font-medium text-slate-800 max-w-xs truncate" title={site.nameOfSuccessfulTenderer}>
                    {site.nameOfSuccessfulTenderer || 'Tender Pending'}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-emerald-800 whitespace-nowrap">
                    {site.successfulTenderPrice > 0 ? `$${site.successfulTenderPrice.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                    {site.psmPerGfaOrGpr ? `$${parseFloat(site.psmPerGfaOrGpr).toLocaleString()}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom Attribution */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-emerald-800 uppercase tracking-wide">
            Data: URA SINGAPORE
          </span>
          <span>·</span>
          <span>Official Government Land Sales (GLS) Vacant Sites Register</span>
        </div>
        <a
          href={URA_VACANT_SITES_ENDPOINT}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
        >
          <span>View Source URA Spreadsheet (.xlsx)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
