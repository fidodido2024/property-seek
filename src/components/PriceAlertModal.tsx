import React, { useState } from 'react';
import {
  Bell,
  X,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Zap,
} from 'lucide-react';
import { Property, PriceAlert } from '../types/property';
import { MOCK_PROPERTIES } from '../data/mockProperties';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProperty?: Property | null;
  alerts: PriceAlert[];
  onSaveAlert: (alert: PriceAlert) => void;
  onDeleteAlert: (id: string) => void;
  onSimulatePriceDrop: (alertId: string) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  targetProperty,
  alerts,
  onSaveAlert,
  onDeleteAlert,
  onSimulatePriceDrop,
}) => {
  if (!isOpen) return null;

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    targetProperty?.id || MOCK_PROPERTIES[0].id
  );
  const [bedroomFilter, setBedroomFilter] = useState<string>('all');
  const [triggerType, setTriggerType] = useState<
    'price_drop' | 'new_stack' | 'star_buy' | 'target_psf'
  >('star_buy');
  const [thresholdValue, setThresholdValue] = useState<number>(50000); // e.g. $50,000 drop
  const [recipientContact, setRecipientContact] = useState<string>('');
  const [channel, setChannel] = useState<'WhatsApp' | 'Email'>('WhatsApp');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const activeProp =
    MOCK_PROPERTIES.find((p) => p.id === selectedPropertyId) || MOCK_PROPERTIES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientContact.trim()) return;

    const newAlert: PriceAlert = {
      id: 'alert-' + Date.now(),
      propertyId: activeProp.id,
      propertyName: activeProp.name,
      bedroomFilter,
      triggerType,
      thresholdValue,
      recipientContact,
      channel,
      active: true,
      createdAt: new Date().toLocaleDateString('en-SG', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      history: [
        {
          date: 'Just now',
          message: `Alert activated for ${activeProp.name} (${bedroomFilter === 'all' ? 'All Units' : bedroomFilter}). Monitoring URA caveats & developer price changes.`,
        },
      ],
    };

    onSaveAlert(newAlert);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Bell className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Real-Time New Launch Price & Star Buy Alerts
              </h3>
              <p className="text-xs text-slate-500">
                Instant notification when developer slashes prices or releases promo stacks
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

        {/* Success confirmation toast */}
        {isSuccess && (
          <div className="my-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-900 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Real-time price alert configured! You will receive instant notifications on {channel}.
            </span>
          </div>
        )}

        {/* Tab 1: Create New Alert Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Target Property */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Development
              </label>
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                {MOCK_PROPERTIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.district}) - Avg ${p.psfAverage} psf
                  </option>
                ))}
              </select>
            </div>

            {/* Bedroom Type */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Unit Type / Bedroom
              </label>
              <select
                value={bedroomFilter}
                onChange={(e) => setBedroomFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="all">All Unit Types</option>
                <option value="1 Bedroom">1 Bedroom</option>
                <option value="2 Bedroom">2 Bedroom</option>
                <option value="3 Bedroom">3 Bedroom</option>
                <option value="4 Bedroom">4 Bedroom</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Alert Trigger Rule */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Alert Trigger Condition
              </label>
              <select
                value={triggerType}
                onChange={(e) =>
                  setTriggerType(
                    e.target.value as 'price_drop' | 'new_stack' | 'star_buy' | 'target_psf'
                  )
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="star_buy">Developer Star Buy / Flash Discount</option>
                <option value="price_drop">Price Drops by ≥ $50,000 SGD</option>
                <option value="new_stack">New High-Floor Stack Released</option>
                <option value="target_psf">PSF Drops Below Average</option>
              </select>
            </div>

            {/* Delivery Channel */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Notification Channel
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('WhatsApp')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    channel === 'WhatsApp'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  WhatsApp Instant
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('Email')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    channel === 'Email'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Email Digest
                </button>
              </div>
            </div>
          </div>

          {/* Contact Input (Guarded: personal data only used for alert) */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Your {channel === 'WhatsApp' ? 'Singapore WhatsApp Number' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type={channel === 'WhatsApp' ? 'tel' : 'email'}
                required
                value={recipientContact}
                onChange={(e) => setRecipientContact(e.target.value)}
                placeholder={
                  channel === 'WhatsApp' ? '+65 9123 4567' : 'name@example.com'
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Privacy protected: We do not store or sell your contact info. Used strictly for PropertySeek URA price alerts.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bell className="w-4 h-4 text-emerald-200" />
            <span>Activate Real-Time Price Alert</span>
          </button>
        </form>

        {/* Active Alerts List & Simulated Live Trigger */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Your Active Alerts ({alerts.length})</span>
            </h4>
            <span className="text-[11px] text-emerald-700 font-semibold">
              Live Monitoring Active
            </span>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-lg border border-slate-100 text-slate-400 text-xs">
              No custom alerts active. Fill out the form above to track price drops!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {alerts.map((alt) => (
                <div
                  key={alt.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-slate-900">
                        {alt.propertyName}
                      </strong>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {alt.channel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {alt.bedroomFilter} · Trigger:{' '}
                      {alt.triggerType === 'star_buy'
                        ? 'Star Buy Promo'
                        : alt.triggerType === 'price_drop'
                        ? 'Price drop ≥ $50k'
                        : 'New Stacks'}
                    </p>
                    {alt.history && alt.history.length > 0 && (
                      <div className="text-[10px] text-emerald-800 font-medium mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>{alt.history[0].message}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Simulated live trigger test */}
                    <button
                      type="button"
                      onClick={() => onSimulatePriceDrop(alt.id)}
                      className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Simulate Developer Flash Price Cut"
                    >
                      <Zap className="w-3 h-3 text-amber-700" />
                      <span>Test Trigger</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteAlert(alt.id)}
                      className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                      title="Delete alert"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
