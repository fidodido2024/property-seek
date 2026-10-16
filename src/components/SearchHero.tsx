import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Train,
  GraduationCap,
  Navigation,
  DollarSign,
  BedDouble,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Building,
} from 'lucide-react';
import { FilterState } from '../types/property';
import {
  SINGAPORE_DISTRICTS,
  POPULAR_PRIMARY_SCHOOLS,
  MRT_STATIONS,
  EXPRESSWAYS,
} from '../data/mockProperties';

interface SearchHeroProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
  onResetFilters: () => void;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  filters,
  setFilters,
  totalMatches,
  onResetFilters,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleRegionTab = (region: string) => {
    setFilters((prev) => ({
      ...prev,
      region,
    }));
  };

  const handleBedroomToggle = (bed: number) => {
    setFilters((prev) => {
      const exists = prev.bedrooms.includes(bed);
      return {
        ...prev,
        bedrooms: exists
          ? prev.bedrooms.filter((b) => b !== bed)
          : [...prev.bedrooms, bed],
      };
    });
  };

  return (
    <div className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-emerald-700/40">
      {/* Background Architectural Accent Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Title & Value Proposition */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Singapore New Launch Database & Price Alerts</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            Find Your Dream Singapore <br className="hidden sm:inline" />
            <span className="text-emerald-300">New Launch Property</span>
          </h1>
          <p className="text-xs sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl mx-auto">
            Shortlist developments by planning sector, sheltered MRT proximity, elite primary school priority zones, and compare unit floor plans with real-time URA pricing.
          </p>
        </div>

        {/* Main PropertyGuru Styled White Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-800 border border-emerald-100">
          {/* Region Tabs (All / CCR / RCR / OCR) */}
          <div className="flex items-center gap-1 sm:gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100">
            <button
              onClick={() => handleRegionTab('all')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                filters.region === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
              }`}
            >
              All Singapore
            </button>
            <button
              onClick={() => handleRegionTab('CCR')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                filters.region === 'CCR'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
              }`}
            >
              Core Central (CCR)
            </button>
            <button
              onClick={() => handleRegionTab('RCR')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                filters.region === 'RCR'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
              }`}
            >
              Rest of Central (RCR)
            </button>
            <button
              onClick={() => handleRegionTab('OCR')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                filters.region === 'OCR'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
              }`}
            >
              Outside Central (OCR)
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-emerald-700" />
            </div>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              placeholder="Search by project name, developer, address, or MRT (e.g. Grand Dunman, Dakota, GuocoLand)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
            />
          </div>

          {/* Dropdown Selection Boxes Grid (Mobile & Desktop Responsive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Sector / District Dropdown */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Sector & District</span>
              </label>
              <select
                value={filters.district}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, district: e.target.value }))
                }
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent cursor-pointer font-medium"
              >
                <option value="">All Singapore Districts (D01-D28)</option>
                {SINGAPORE_DISTRICTS.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Proximity to MRT Stations Dropdown */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Train className="w-3.5 h-3.5 text-emerald-700" />
                <span>MRT Proximity</span>
              </label>
              <select
                value={
                  filters.maxMrtWalkMinutes > 0
                    ? `walk_${filters.maxMrtWalkMinutes}`
                    : filters.mrtStation
                    ? `stn_${filters.mrtStation}`
                    : ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.startsWith('walk_')) {
                    const mins = parseInt(val.replace('walk_', ''), 10);
                    setFilters((prev) => ({
                      ...prev,
                      maxMrtWalkMinutes: mins,
                      mrtStation: '',
                    }));
                  } else if (val.startsWith('stn_')) {
                    const stn = val.replace('stn_', '');
                    setFilters((prev) => ({
                      ...prev,
                      mrtStation: stn,
                      maxMrtWalkMinutes: 0,
                    }));
                  } else {
                    setFilters((prev) => ({
                      ...prev,
                      maxMrtWalkMinutes: 0,
                      mrtStation: '',
                    }));
                  }
                }}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent cursor-pointer font-medium"
              >
                <option value="">Any Distance to MRT</option>
                <optgroup label="Walking Distance (Sheltered)">
                  <option value="walk_2">Under 2 Mins Walk (Direct/Covered)</option>
                  <option value="walk_5">Under 5 Mins Walk (&lt; 400m)</option>
                  <option value="walk_10">Under 10 Mins Walk (&lt; 800m)</option>
                </optgroup>
                <optgroup label="Specific New Launch MRT Stations">
                  {MRT_STATIONS.map((m) => (
                    <option key={m.name} value={`stn_${m.name}`}>
                      {m.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* 3. Proximity to Primary Schools Dropdown */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                <span>Primary Schools</span>
              </label>
              <select
                value={filters.primarySchool}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    primarySchool: e.target.value,
                    schoolProximity: e.target.value ? '1km' : 'any',
                  }))
                }
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent cursor-pointer font-medium"
              >
                <option value="">All Primary Schools (Any distance)</option>
                <optgroup label="Top 1km Priority Admission Schools">
                  {POPULAR_PRIMARY_SCHOOLS.map((school) => (
                    <option key={school} value={school}>
                      Within 1km of {school}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* 4. Proximity to Expressways Dropdown */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                <span>Expressways</span>
              </label>
              <select
                value={filters.expressway}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, expressway: e.target.value }))
                }
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent cursor-pointer font-medium"
              >
                <option value="">All Expressways</option>
                {EXPRESSWAYS.map((exp) => (
                  <option key={exp} value={exp}>
                    Direct Access to {exp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Collapsible Advanced Filters (Bedrooms, Price Quantum, PSF, Tenure) */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
              {/* Bedroom Count selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Bedroom Types</span>
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[1, 2, 3, 4, 5].map((bed) => {
                    const isSelected = filters.bedrooms.includes(bed);
                    return (
                      <button
                        key={bed}
                        type="button"
                        onClick={() => handleBedroomToggle(bed)}
                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-700 border-emerald-700 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {bed === 5 ? '5+ BR' : `${bed} BR`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Quantum Dropdown */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Max Budget Quantum</span>
                </label>
                <select
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-600 cursor-pointer font-medium"
                >
                  <option value="10000000">Any Price Budget</option>
                  <option value="1500000">Under $1.5M SGD</option>
                  <option value="2000000">Under $2.0M SGD</option>
                  <option value="2500000">Under $2.5M SGD</option>
                  <option value="3500000">Under $3.5M SGD</option>
                  <option value="5000000">Under $5.0M SGD</option>
                </select>
              </div>

              {/* Average PSF Cap */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Max PSF ($/sqft)</span>
                </label>
                <select
                  value={filters.maxPsf}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPsf: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-600 cursor-pointer font-medium"
                >
                  <option value="4000">Any PSF</option>
                  <option value="2200">Under $2,200 psf</option>
                  <option value="2500">Under $2,500 psf</option>
                  <option value="2800">Under $2,800 psf</option>
                  <option value="3200">Under $3,200 psf</option>
                </select>
              </div>

              {/* Tenure Type */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Tenure</span>
                </label>
                <select
                  value={filters.tenure}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, tenure: e.target.value }))
                  }
                  className="w-full bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-600 cursor-pointer font-medium"
                >
                  <option value="all">All Tenures</option>
                  <option value="Freehold">Freehold Only</option>
                  <option value="99-year Leasehold">99-year Leasehold</option>
                </select>
              </div>
            </div>
          )}

          {/* Filter Footer Controls */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>
                  {showAdvancedFilters
                    ? 'Hide Advanced Filters'
                    : 'More Filters (Bedrooms, PSF, Tenure)'}
                </span>
              </button>

              {(filters.searchQuery ||
                filters.region !== 'all' ||
                filters.district ||
                filters.mrtStation ||
                filters.maxMrtWalkMinutes > 0 ||
                filters.primarySchool ||
                filters.expressway ||
                filters.bedrooms.length > 0 ||
                filters.maxPrice < 10000000 ||
                filters.maxPsf < 4000 ||
                filters.tenure !== 'all') && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors ml-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Total Results Counter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600">
                Found <strong className="text-emerald-800 font-bold">{totalMatches}</strong> active new launches
              </span>
            </div>
          </div>
        </div>

        {/* Quick Click Badges / Popular Shortcuts */}
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs text-emerald-100">
          <span className="text-emerald-300 font-medium">Trending searches:</span>
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                maxMrtWalkMinutes: 2,
                district: '',
                primarySchool: '',
              }))
            }
            className="px-2.5 py-1 rounded-full bg-emerald-800/70 hover:bg-emerald-700/80 border border-emerald-600/40 transition-colors cursor-pointer"
          >
            🚆 Sheltered Walk to MRT (&lt; 2 min)
          </button>
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                primarySchool: 'Tao Nan School',
                schoolProximity: '1km',
              }))
            }
            className="px-2.5 py-1 rounded-full bg-emerald-800/70 hover:bg-emerald-700/80 border border-emerald-600/40 transition-colors cursor-pointer"
          >
            🏫 Within 1km to Tao Nan School
          </button>
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                tenure: 'Freehold',
              }))
            }
            className="px-2.5 py-1 rounded-full bg-emerald-800/70 hover:bg-emerald-700/80 border border-emerald-600/40 transition-colors cursor-pointer"
          >
            🏆 Rare Freehold Launches
          </button>
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                district: 'D15',
              }))
            }
            className="px-2.5 py-1 rounded-full bg-emerald-800/70 hover:bg-emerald-700/80 border border-emerald-600/40 transition-colors cursor-pointer"
          >
            🌊 D15 East Coast / Marine Parade
          </button>
        </div>
      </div>
    </div>
  );
};
