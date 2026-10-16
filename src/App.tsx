import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SearchHero } from './components/SearchHero';
import { PropertyCard } from './components/PropertyCard';
import { FloorPlanCompare } from './components/FloorPlanCompare';
import { PriceAlertModal } from './components/PriceAlertModal';
import { LiveAlertTicker } from './components/LiveAlertTicker';
import { ShortlistDrawer } from './components/ShortlistDrawer';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ProSubscriptionModal } from './components/ProSubscriptionModal';
import { UraMarketWatchModal } from './components/UraMarketWatchModal';
import { VacantSitesExplorer } from './components/VacantSitesExplorer';
import { TalkToUs } from './components/TalkToUs';
import { Footer } from './components/Footer';
import { MOCK_PROPERTIES } from './data/mockProperties';
import { Property, FloorPlan, FilterState, PriceAlert } from './types/property';
import {
  ArrowUpDown,
  Filter,
  Sparkles,
  Building,
  RotateCcw,
  Scale,
  Bell,
  Heart,
  Crown,
} from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  region: 'all',
  district: '',
  mrtStation: '',
  maxMrtWalkMinutes: 0,
  primarySchool: '',
  schoolProximity: '1km',
  expressway: '',
  minPrice: 0,
  maxPrice: 10000000,
  minPsf: 0,
  maxPsf: 4000,
  bedrooms: [],
  tenure: 'all',
  sortBy: 'featured',
};

export default function App() {
  const [properties] = useState<Property[]>(MOCK_PROPERTIES);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Shortlisted property IDs
  const [shortlistIds, setShortlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('propertyseek_shortlist');
      return saved ? JSON.parse(saved) : ['grand-dunman', 'lentor-modern'];
    } catch {
      return ['grand-dunman', 'lentor-modern'];
    }
  });

  // Selected floor plans for comparison
  const [selectedComparisonPlans, setSelectedComparisonPlans] = useState<
    { property: Property; floorPlan: FloorPlan }[]
  >(() => [
    { property: MOCK_PROPERTIES[0], floorPlan: MOCK_PROPERTIES[0].floorPlans[1] },
    { property: MOCK_PROPERTIES[1], floorPlan: MOCK_PROPERTIES[1].floorPlans[1] },
  ]);

  // Real-time price alerts
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('propertyseek_alerts');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'init-alert-1',
              propertyId: 'grand-dunman',
              propertyName: 'Grand Dunman',
              bedroomFilter: '2 Bedroom',
              triggerType: 'star_buy',
              thresholdValue: 50000,
              recipientContact: '+65 9123 4567',
              channel: 'WhatsApp',
              active: true,
              createdAt: 'Oct 14, 2026',
              history: [
                {
                  date: 'Today, 09:30 AM',
                  message:
                    'Star Buy #12-08 released! $52,000 developer discount applied to stack 08.',
                },
              ],
            },
          ];
    } catch {
      return [];
    }
  });

  // Recent ticker alert message
  const [tickerMessage, setTickerMessage] = useState<string>(
    '🔥 Grand Dunman: Star Buy #12-08 just released with $52,000 developer discount!'
  );

  // Pro User toggle (Economics context: Free for buyers, Pro for Agents & Developers)
  const [isProUser, setIsProUser] = useState<boolean>(() => {
    return localStorage.getItem('propertyseek_pro') === 'true';
  });

  // Modal and drawer open states
  const [isShortlistDrawerOpen, setIsShortlistDrawerOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertTargetProperty, setAlertTargetProperty] = useState<Property | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isUraModalOpen, setIsUraModalOpen] = useState(false);

  // Active view tab (home, shortlist, compare, alerts, vacant-sites, talk-to-us)
  const [activeView, setActiveView] = useState<'home' | 'shortlist' | 'compare' | 'alerts' | 'vacant-sites' | 'talk-to-us'>('home');

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('propertyseek_shortlist', JSON.stringify(shortlistIds));
    } catch {
      // ignore
    }
  }, [shortlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('propertyseek_alerts', JSON.stringify(alerts));
    } catch {
      // ignore
    }
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('propertyseek_pro', isProUser ? 'true' : 'false');
  }, [isProUser]);

  // Handle shortlist toggle
  const handleToggleShortlist = (property: Property) => {
    const exists = shortlistIds.includes(property.id);
    if (!exists) {
      // Check free buyer limit
      if (!isProUser && shortlistIds.length >= 3) {
        setIsProModalOpen(true);
        return;
      }
      setShortlistIds([...shortlistIds, property.id]);
    } else {
      setShortlistIds(shortlistIds.filter((id) => id !== property.id));
    }
  };

  // Add plan to comparison
  const handleAddComparisonPlan = (property: Property, floorPlan: FloorPlan) => {
    if (selectedComparisonPlans.length >= 3) {
      alert('You can compare up to 3 floor plans at the same time.');
      return;
    }
    // Check if duplicate
    const exists = selectedComparisonPlans.some(
      (p) => p.property.id === property.id && p.floorPlan.id === floorPlan.id
    );
    if (!exists) {
      setSelectedComparisonPlans([...selectedComparisonPlans, { property, floorPlan }]);
    }
    setActiveView('compare');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleSelectFloorPlanCompare = (property: Property, floorPlan?: FloorPlan) => {
    const planToCompare = floorPlan || property.floorPlans[0];
    handleAddComparisonPlan(property, planToCompare);
  };

  const handleRemoveComparisonPlan = (index: number) => {
    setSelectedComparisonPlans(selectedComparisonPlans.filter((_, i) => i !== index));
  };

  // Price alert handlers
  const handleOpenPriceAlert = (property: Property) => {
    setAlertTargetProperty(property);
    setIsAlertModalOpen(true);
  };

  const handleSaveAlert = (newAlert: PriceAlert) => {
    setAlerts([newAlert, ...alerts]);
    setTickerMessage(`🔔 Active Alert: Monitoring ${newAlert.propertyName} for price cuts.`);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const handleSimulatePriceDrop = (alertId: string) => {
    const target = alerts.find((a) => a.id === alertId);
    if (!target) return;

    const discountAmount = 60000;
    const now = new Date().toLocaleTimeString('en-SG', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newHistoryEntry = {
      date: `Today, ${now}`,
      message: `⚡ FLASH TRIGGER: Developer announced $${discountAmount.toLocaleString()} discount on 2 units in ${target.propertyName}!`,
    };

    setAlerts(
      alerts.map((a) =>
        a.id === alertId ? { ...a, history: [newHistoryEntry, ...a.history] } : a
      )
    );

    setTickerMessage(
      `⚡ REAL-TIME ALERT: ${target.propertyName} developer flash price cut by $${discountAmount.toLocaleString()} SGD!`
    );
  };

  // View Details
  const handleViewDetails = (property: Property) => {
    setDetailProperty(property);
    setIsDetailModalOpen(true);
  };

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // 1. Text Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDev = item.developer.toLowerCase().includes(q);
        const matchesAddress = item.address.toLowerCase().includes(q);
        const matchesSector = item.sector.toLowerCase().includes(q);
        const matchesMrt = item.mrtStation.toLowerCase().includes(q);
        if (!matchesName && !matchesDev && !matchesAddress && !matchesSector && !matchesMrt) {
          return false;
        }
      }

      // 2. Region Filter (CCR, RCR, OCR)
      if (filters.region !== 'all' && item.region !== filters.region) {
        return false;
      }

      // 3. District Filter
      if (filters.district && item.district !== filters.district) {
        return false;
      }

      // 4. Proximity to MRT Walk Minutes
      if (filters.maxMrtWalkMinutes > 0 && item.mrtDistanceMinutes > filters.maxMrtWalkMinutes) {
        return false;
      }

      // 5. Specific MRT Station
      if (filters.mrtStation && !item.mrtStation.includes(filters.mrtStation)) {
        return false;
      }

      // 6. Primary School Proximity (< 1km or < 2km)
      if (filters.primarySchool) {
        if (filters.schoolProximity === '1km') {
          if (!item.primarySchoolsWithin1km.includes(filters.primarySchool)) {
            return false;
          }
        } else {
          const in1km = item.primarySchoolsWithin1km.includes(filters.primarySchool);
          const in2km = item.primarySchoolsWithin2km.includes(filters.primarySchool);
          if (!in1km && !in2km) {
            return false;
          }
        }
      }

      // 7. Expressway Access
      if (filters.expressway && !item.expressways.includes(filters.expressway)) {
        return false;
      }

      // 8. Price Cap
      if (item.priceFrom > filters.maxPrice) {
        return false;
      }

      // 9. PSF Cap
      if (item.psfAverage > filters.maxPsf) {
        return false;
      }

      // 10. Bedrooms Filter
      if (filters.bedrooms.length > 0) {
        const hasMatchingBed = item.floorPlans.some((fp) =>
          filters.bedrooms.includes(fp.bedroomCount)
        );
        if (!hasMatchingBed) return false;
      }

      // 11. Tenure Filter
      if (filters.tenure !== 'all' && item.tenure !== filters.tenure) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);

  // Sort Filtered Results
  const sortedProperties = useMemo(() => {
    const list = [...filteredProperties];
    switch (filters.sortBy) {
      case 'price_asc':
        return list.sort((a, b) => a.priceFrom - b.priceFrom);
      case 'price_desc':
        return list.sort((a, b) => b.priceFrom - a.priceFrom);
      case 'psf_asc':
        return list.sort((a, b) => a.psfAverage - b.psfAverage);
      case 'mrt_proximity':
        return list.sort((a, b) => a.mrtDistanceMinutes - b.mrtDistanceMinutes);
      case 'top_date':
        return list.sort((a, b) => a.estTop.localeCompare(b.estTop));
      default:
        return list; // featured order
    }
  }, [filteredProperties, filters.sortBy]);

  // Shortlisted Property objects
  const shortlistedProperties = useMemo(() => {
    return properties.filter((p) => shortlistIds.includes(p.id));
  }, [properties, shortlistIds]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col selection:bg-emerald-200">
      {/* Top Navbar */}
      <Navbar
        shortlistCount={shortlistIds.length}
        activeAlertsCount={alerts.length}
        comparisonCount={selectedComparisonPlans.length}
        onOpenShortlist={() => setIsShortlistDrawerOpen(true)}
        onOpenAlerts={() => setIsAlertModalOpen(true)}
        onOpenComparison={() => {
          setActiveView('compare');
          window.scrollTo({ top: 380, behavior: 'smooth' });
        }}
        onOpenUraData={() => setIsUraModalOpen(true)}
        onOpenProModal={() => setIsProModalOpen(true)}
        isProUser={isProUser}
        onToggleProUser={() => setIsProUser(!isProUser)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Real-Time Live Alert Ticker */}
      <LiveAlertTicker
        recentAlertText={tickerMessage}
        onOpenAlerts={() => setIsAlertModalOpen(true)}
      />

      {/* Main Search Hero with Dropdowns (Shown on home & compare views) */}
      {activeView !== 'vacant-sites' && activeView !== 'talk-to-us' && (
        <SearchHero
          filters={filters}
          setFilters={setFilters}
          totalMatches={sortedProperties.length}
          onResetFilters={() => setFilters(INITIAL_FILTERS)}
          onOpenVacantSites={() => {
            setActiveView('vacant-sites');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Dedicated Talk to Us (Disqus Forum) View */}
        {activeView === 'talk-to-us' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveView('home')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                ← Back to Singapore New Launches
              </button>
            </div>
            <TalkToUs />
          </div>
        ) : activeView === 'vacant-sites' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveView('home')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                ← Back to Singapore New Launches
              </button>
            </div>
            <VacantSitesExplorer />
          </div>
        ) : (
          <>
            {/* Floor Plan Comparison Studio (Shown when compare view is active or user expanded it) */}
            {activeView === 'compare' && (
              <FloorPlanCompare
                selectedPlans={selectedComparisonPlans}
                onRemovePlan={handleRemoveComparisonPlan}
                onAddPlan={(prop, plan) => handleAddComparisonPlan(prop, plan)}
                onClose={() => setActiveView('home')}
                onToggleShortlist={handleToggleShortlist}
                shortlistIds={shortlistIds}
              />
            )}

            {/* Listings Section Header & Sorting Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/90">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Singapore New Launches</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {sortedProperties.length} Found
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified URA caveats, developer pricing, and sheltered MRT proximity
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Quick compare toggle button */}
            {selectedComparisonPlans.length > 0 && activeView !== 'compare' && (
              <button
                onClick={() => setActiveView('compare')}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <Scale className="w-4 h-4 text-emerald-700" />
                <span>View Comparison ({selectedComparisonPlans.length})</span>
              </button>
            )}

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="sort-listings" className="font-semibold text-slate-700 whitespace-nowrap">Sort by:</label>
              <select
                id="sort-listings"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as FilterState['sortBy'],
                  }))
                }
                className="bg-white border border-slate-300 text-slate-800 font-semibold text-xs rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="featured">Featured / Top Velocity</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="psf_asc">PSF: Lowest $/sqft</option>
                <option value="mrt_proximity">MRT Distance (Fastest Walk)</option>
                <option value="top_date">Completion (Nearest TOP)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Property Cards List or Empty State */}
        {sortedProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs my-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center mb-4">
              <Building className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              No New Launches Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              No new launches currently match all of your criteria. Try loosening the MRT walking distance, primary school radius, or budget cap.
            </p>
            <button
              onClick={() => setFilters(INITIAL_FILTERS)}
              className="px-5 py-2.5 bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-emerald-800 transition-colors shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {sortedProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                isShortlisted={shortlistIds.includes(prop.id)}
                onToggleShortlist={handleToggleShortlist}
                onSelectFloorPlanCompare={handleSelectFloorPlanCompare}
                onOpenPriceAlert={handleOpenPriceAlert}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Pro Banner for Agents & Developers */}
        {!isProUser && (
          <div className="mt-12 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase">
                <Crown className="w-3.5 h-3.5" />
                <span>Developer & Agent Intelligence</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Are you a Property Developer or Real Estate Agent?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Access unreleased developer stacks, land bid breakeven modeling, real-time WhatsApp price drop alerts, and download raw URA caveats CSV data.
              </p>
            </div>

            <button
              onClick={() => setIsProModalOpen(true)}
              className="px-6 py-3 bg-white text-emerald-950 font-extrabold text-xs sm:text-sm rounded-xl hover:bg-emerald-50 transition-colors shadow-md shrink-0 cursor-pointer flex items-center gap-2"
            >
              <span>Explore Pro Plan ($68/mo)</span>
            </button>
          </div>
        )}
          </>
        )}
      </main>

      {/* Shortlist Drawer Modal */}
      <ShortlistDrawer
        isOpen={isShortlistDrawerOpen}
        onClose={() => setIsShortlistDrawerOpen(false)}
        shortlistedProperties={shortlistedProperties}
        onRemoveShortlist={(id) => setShortlistIds(shortlistIds.filter((item) => item !== id))}
        onSelectFloorPlanCompare={handleSelectFloorPlanCompare}
        onViewDetails={handleViewDetails}
      />

      {/* Price Alert Configuration Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => {
          setIsAlertModalOpen(false);
          setAlertTargetProperty(null);
        }}
        targetProperty={alertTargetProperty}
        alerts={alerts}
        onSaveAlert={handleSaveAlert}
        onDeleteAlert={handleDeleteAlert}
        onSimulatePriceDrop={handleSimulatePriceDrop}
      />

      {/* Property Details Modal */}
      <PropertyDetailModal
        property={detailProperty}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailProperty(null);
        }}
        isShortlisted={detailProperty ? shortlistIds.includes(detailProperty.id) : false}
        onToggleShortlist={handleToggleShortlist}
        onSelectFloorPlanCompare={handleSelectFloorPlanCompare}
        onOpenPriceAlert={handleOpenPriceAlert}
      />

      {/* Pro Plan Modal */}
      <ProSubscriptionModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        isProUser={isProUser}
        onTogglePro={() => setIsProUser(!isProUser)}
      />

      {/* URA Market Caveats Modal */}
      <UraMarketWatchModal
        isOpen={isUraModalOpen}
        onClose={() => setIsUraModalOpen(false)}
        isProUser={isProUser}
        onOpenProModal={() => setIsProModalOpen(true)}
      />

      {/* Footer Crediting Data: URA SINGAPORE */}
      <Footer
        onOpenUraData={() => setIsUraModalOpen(true)}
        onOpenProModal={() => setIsProModalOpen(true)}
      />
    </div>
  );
}
