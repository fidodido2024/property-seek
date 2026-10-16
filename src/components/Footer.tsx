import React from 'react';
import { Building2, ShieldCheck, Heart, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenUraData: () => void;
  onOpenProModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenUraData, onOpenProModal }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-emerald-950 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand & Purpose */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Property<span className="text-emerald-400">Seek</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Singapore&apos;s dedicated new launch discovery portal. Designed for home buyers, property agents, and residential developers to shortlist developments by sector, MRT distance, and elite primary school priority zones.
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Built for Team One</span>
            </span>
          </div>
        </div>

        {/* Quick Criteria Links */}
        <div className="text-xs space-y-2">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
            Search Criteria
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <span className="text-emerald-400">·</span> Core Central Region (CCR Launches)
            </li>
            <li>
              <span className="text-emerald-400">·</span> Rest of Central Region (RCR Launches)
            </li>
            <li>
              <span className="text-emerald-400">·</span> Outside Central Region (OCR Launches)
            </li>
            <li>
              <span className="text-emerald-400">·</span> Sheltered MRT Walk (&lt; 200m)
            </li>
            <li>
              <span className="text-emerald-400">·</span> Within 1km Primary School Radius
            </li>
            <li>
              <span className="text-emerald-400">·</span> Freehold Rare Landmark Condos
            </li>
          </ul>
        </div>

        {/* Interactive Features */}
        <div className="text-xs space-y-2">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
            Key Features
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <span className="text-emerald-400">·</span> Side-by-Side Floor Plan Comparisons
            </li>
            <li>
              <span className="text-emerald-400">·</span> Real-Time Price &amp; Star Buy Alerts
            </li>
            <li>
              <span className="text-emerald-400">·</span> IRAS Buyer&apos;s Stamp Duty (BSD &amp; ABSD)
            </li>
            <li>
              <button
                onClick={onOpenUraData}
                className="hover:text-white transition-colors text-emerald-400 font-semibold cursor-pointer"
              >
                · URA Transacted Caveats Live Feed
              </button>
            </li>
            <li>
              <button
                onClick={onOpenProModal}
                className="hover:text-white transition-colors text-amber-300 font-semibold cursor-pointer"
              >
                · Developer &amp; Agent Pro Subscription
              </button>
            </li>
          </ul>
        </div>

        {/* Mandatory Attribution & Compliance */}
        <div className="text-xs space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <div className="text-white font-extrabold text-sm tracking-wide flex items-center gap-1.5">
            <span>DATA SOURCE</span>
          </div>
          <div className="text-emerald-400 font-black text-base tracking-wider uppercase">
            Data: URA SINGAPORE
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            PropertySeek aggregates public planning information, developer sales declarations, and transacted caveats published by the Urban Redevelopment Authority (URA) Singapore.
          </p>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-700/50">
            Privacy &amp; Guardrails: No confidential or personal data is collected or transmitted to external AI models.
          </div>
        </div>
      </div>

      {/* Bottom Micro Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          © {new Date().getFullYear()} PropertySeek Singapore. All rights reserved. Deployed on Vercel for Team One.
        </div>
        <div className="flex items-center gap-4">
          <span className="font-bold text-emerald-400">Data: URA SINGAPORE</span>
          <span>·</span>
          <span>MAS LTV 75% Compliant</span>
          <span>·</span>
          <span>IRAS BSD / ABSD 2026</span>
        </div>
      </div>
    </footer>
  );
};
