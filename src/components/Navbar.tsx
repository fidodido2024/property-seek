import React, { useState } from 'react';
import {
  Building2,
  Bookmark,
  Bell,
  Scale,
  TrendingUp,
  Crown,
  Menu,
  X,
  MapPin,
  ChevronRight,
  ShieldCheck,
  LandPlot,
} from 'lucide-react';

interface NavbarProps {
  shortlistCount: number;
  activeAlertsCount: number;
  comparisonCount: number;
  vacantSitesCount?: number;
  onOpenShortlist: () => void;
  onOpenAlerts: () => void;
  onOpenComparison: () => void;
  onOpenUraData: () => void;
  onOpenProModal: () => void;
  isProUser: boolean;
  onToggleProUser: () => void;
  activeView: 'home' | 'shortlist' | 'compare' | 'alerts' | 'vacant-sites';
  setActiveView: (view: 'home' | 'shortlist' | 'compare' | 'alerts' | 'vacant-sites') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  shortlistCount,
  activeAlertsCount,
  comparisonCount,
  onOpenShortlist,
  onOpenAlerts,
  onOpenComparison,
  onOpenUraData,
  onOpenProModal,
  isProUser,
  onToggleProUser,
  activeView,
  setActiveView,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-emerald-900/10 shadow-xs">
      {/* Top micro-bar: Singapore URA market indicator */}
      <div className="bg-emerald-900 text-emerald-100 text-[11px] sm:text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white tracking-wide">Data: URA SINGAPORE</span>
            <span className="text-emerald-300/80 hidden sm:inline">|</span>
            <span className="text-emerald-200 hidden md:inline">
              Official New Launch Caveats & Developer Unit Absorption Live
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenUraData}
              className="text-emerald-200 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>URA Caveats</span>
            </button>
            <span className="text-emerald-700">|</span>
            <button
              onClick={onToggleProUser}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                isProUser
                  ? 'bg-amber-400 text-slate-900'
                  : 'bg-emerald-800 text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              <Crown className="w-3 h-3 text-amber-500" />
              <span>{isProUser ? 'Agent / Developer PRO' : 'Free Buyer Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-800 transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900">
                    Property<span className="text-emerald-700">Seek</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    SG
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Singapore New Launch Property Portal
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700">
            <button
              onClick={() => setActiveView('home')}
              className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${
                activeView === 'home'
                  ? 'text-emerald-800 font-semibold bg-emerald-50'
                  : 'hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              New Launches
            </button>

            <button
              onClick={() => {
                setActiveView('compare');
                onOpenComparison();
              }}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeView === 'compare'
                  ? 'text-emerald-800 font-semibold bg-emerald-50'
                  : 'hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Floor Plan Compare</span>
              {comparisonCount > 0 && (
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                  {comparisonCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveView('alerts');
                onOpenAlerts();
              }}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeView === 'alerts'
                  ? 'text-emerald-800 font-semibold bg-emerald-50'
                  : 'hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Price Alerts</span>
              {activeAlertsCount > 0 && (
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                  {activeAlertsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveView('vacant-sites');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeView === 'vacant-sites'
                  ? 'text-emerald-800 font-semibold bg-emerald-50'
                  : 'hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <LandPlot className="w-4 h-4 text-emerald-600" />
              <span>Vacant Sites</span>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                GLS
              </span>
            </button>

            <button
              onClick={onOpenUraData}
              className="px-3 py-2 rounded-md text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>URA Caveats</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Shortlist button */}
            <button
              onClick={() => {
                setActiveView('shortlist');
                onOpenShortlist();
              }}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
            >
              <Bookmark className="w-4 h-4 text-emerald-700" />
              <span>Shortlist</span>
              {shortlistCount > 0 && (
                <span className="bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1 animate-pulse">
                  {shortlistCount}
                </span>
              )}
            </button>

            {/* Pro upgrade trigger */}
            <button
              onClick={onOpenProModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>{isProUser ? 'Pro Portal' : 'Agent / Developer Plan'}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveView('home');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-between p-3 rounded-lg text-sm font-semibold cursor-pointer ${
                activeView === 'home' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>All Singapore New Launches</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setActiveView('compare');
                onOpenComparison();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-700" />
                <span>Floor Plan Comparisons ({comparisonCount})</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setActiveView('alerts');
                onOpenAlerts();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-700" />
                <span>Price & Star Buy Alerts ({activeAlertsCount})</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setActiveView('vacant-sites');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center justify-between p-3 rounded-lg text-sm font-semibold cursor-pointer ${
                activeView === 'vacant-sites' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <LandPlot className="w-4 h-4 text-emerald-700" />
                <span>URA Vacant Sites &amp; GLS Tenders</span>
              </span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                443 Sites
              </span>
            </button>

            <button
              onClick={() => {
                onOpenUraData();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>URA Market Caveats &amp; PSF Trends</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  onToggleProUser();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-emerald-50 text-emerald-900 font-semibold text-xs cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Current Mode: {isProUser ? 'Agent / Developer PRO' : 'Buyer (Free)'}</span>
                </span>
                <span className="text-[11px] underline">Toggle</span>
              </button>

              <button
                onClick={() => {
                  onOpenProModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 bg-emerald-700 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>Developer & Agent Subscription</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
