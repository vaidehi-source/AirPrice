import React, { useState } from 'react';
import {
  CalendarCheck,
  Sparkles,
  TrendingDown,
  Bell,
  Clock,
  ShieldCheck,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { RouteData, ScreenId, Language } from '../../types';
import { BOOKING_WINDOW_CURVE, ROUTES_DATA } from '../../data/mockData';
import { TRANSLATIONS } from '../../i18n/translations';

interface WhenToBookViewProps {
  selectedRouteId: string;
  onSelectRoute: (id: string) => void;
  onNavigate: (screen: ScreenId) => void;
  language: Language;
  onOpenAlertModal: () => void;
}

export const WhenToBookView: React.FC<WhenToBookViewProps> = ({
  selectedRouteId,
  onSelectRoute,
  onNavigate,
  language,
  onOpenAlertModal,
}) => {
  const t = TRANSLATIONS[language];
  const [activeRouteId, setActiveRouteId] = useState(selectedRouteId || 'DEL-BOM');
  const [interactiveDays, setInteractiveDays] = useState(30);

  const route = ROUTES_DATA.find((r) => r.id === activeRouteId) || ROUTES_DATA[0];

  // Dynamic curve scaling based on route base fare
  const multiplier = route.currentFare / 5240;
  const scaledCurve = BOOKING_WINDOW_CURVE.map((item) => ({
    ...item,
    fare: Math.round(item.fare * multiplier),
  }));

  // Find price at interactive slider
  const getInterpolatedFare = (days: number) => {
    if (days <= 1) return Math.round(8400 * multiplier);
    if (days <= 7) return Math.round((8400 - ((8400 - 6500) * (days - 1)) / 6) * multiplier);
    if (days <= 15) return Math.round((6500 - ((6500 - 5200) * (days - 7)) / 8) * multiplier);
    if (days <= 30) return Math.round((5200 - ((5200 - 3240) * (days - 15)) / 15) * multiplier);
    if (days <= 45) return Math.round((3240 + ((3650 - 3240) * (days - 30)) / 15) * multiplier);
    return Math.round((3650 + ((4100 - 3650) * (days - 45)) / 15) * multiplier);
  };

  const currentSliderFare = getInterpolatedFare(interactiveDays);
  const potentialSavingAmount = route.potentialSavings || 2000;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              {t.whenToBookTitle}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#1769E0] text-xs font-bold border border-[#1769E0]/20 flex items-center gap-1 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI RECOMMENDATION</span>
            </span>
          </div>
          <p className="text-sm text-[#627D98] mt-1 font-medium">
            {t.whenToBookSubtitle}
          </p>
        </div>

        {/* Route Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {ROUTES_DATA.slice(0, 4).map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setActiveRouteId(r.id);
                onSelectRoute(r.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                activeRouteId === r.id
                  ? 'bg-[#1769E0] text-white border-[#1769E0] shadow-xs'
                  : 'bg-white text-[#102A43] border-[#E2E8F0] hover:bg-[#F6F9FC]'
              }`}
            >
              {r.originCode}–{r.destinationCode}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Highlight Card: Star Best Booking Window */}
      <div className="bg-gradient-to-br from-[#0B1F3A] via-[#102A43] to-[#1769E0] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2F80ED]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-extrabold uppercase tracking-wider">
              <span>⭐ BEST BOOKING WINDOW</span>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black tracking-tight text-white font-mono">
                {t.bestWindowVal}
              </div>
              <p className="text-sm sm:text-base text-[#CBD5E1] max-w-2xl font-medium pt-1">
                For corridor <strong className="text-white">{route.originCity} ({route.originCode}) → {route.destinationCity} ({route.destinationCode})</strong>, purchasing tickets during this window delivers the lowest empirical fare before algorithmic yield buckets hike prices.
              </p>
            </div>

            {/* Savings stats */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/15">
                <span className="text-[11px] text-[#93C5FD] block uppercase tracking-wider font-semibold">
                  {t.estSavings}
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                  ₹{potentialSavingAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/15">
                <span className="text-[11px] text-[#93C5FD] block uppercase tracking-wider font-semibold">
                  Relative Saving
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
                  {t.potentialSavingsPercent}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
            <button
              onClick={onOpenAlertModal}
              className="w-full lg:w-auto px-8 py-4 bg-white hover:bg-[#EAF3FF] text-[#0B1F3A] font-extrabold text-base rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <Bell className="w-5 h-5 text-[#1769E0]" />
              <span>{t.setFareAlert}</span>
            </button>
            <span className="text-[11px] text-[#CBD5E1] mt-2.5 text-center lg:text-right block w-full">
              Free WhatsApp / Email alerts on target price reach
            </span>
          </div>
        </div>
      </div>

      {/* Booking Window Interactive Curve Visualization */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0] shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1769E0]" />
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A]">
              Booking Window Dynamics: 1 Day → 7 Days → 15 Days → 30 Days → 45 Days
            </h3>
          </div>
          <p className="text-xs text-[#627D98] mt-0.5">
            How domestic airfare changes as your travel date approaches.
          </p>
        </div>

        {/* Milestone Cards across booking window */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {scaledCurve.slice(0, 6).map((item) => (
            <div
              key={item.label}
              onClick={() => setInteractiveDays(item.daysBefore)}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                item.isBest
                  ? 'bg-[#EAF3FF] border-[#1769E0] ring-2 ring-[#1769E0]/20 shadow-xs'
                  : interactiveDays === item.daysBefore
                  ? 'bg-[#F6F9FC] border-[#1769E0]'
                  : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              {item.isBest && (
                <span className="inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#1769E0] text-white mb-1">
                  Sweet Spot
                </span>
              )}
              <div className="text-xs font-bold text-[#102A43]">{item.label}</div>
              <div className="font-mono text-base font-extrabold text-[#0B1F3A] my-1">
                ₹{item.fare.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-[#627D98] leading-tight">
                {item.note}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Departure Slider */}
        <div className="bg-[#F6F9FC] p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#102A43]">
              Simulate Your Advance Booking:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#627D98]">Booking:</span>
              <span className="font-mono text-sm font-bold text-[#1769E0] bg-white px-2.5 py-0.5 rounded-md border border-[#CBD5E1]">
                {interactiveDays} Days in advance
              </span>
            </div>
          </div>

          <input
            type="range"
            min="1"
            max="60"
            step="1"
            value={interactiveDays}
            onChange={(e) => setInteractiveDays(Number(e.target.value))}
            className="w-full h-2.5 bg-[#CBD5E1] rounded-lg appearance-none cursor-pointer accent-[#1769E0]"
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[#627D98]">Expected Fare:</span>
              <span className="font-mono text-lg font-black text-[#0B1F3A]">
                ₹{currentSliderFare.toLocaleString('en-IN')}
              </span>
            </div>

            {interactiveDays >= 26 && interactiveDays <= 34 ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are in the Prime Savings Zone!</span>
              </span>
            ) : interactiveDays < 7 ? (
              <span className="text-red-500 font-bold">
                ⚠️ Last-minute surcharge zone (+60% to +100%)
              </span>
            ) : (
              <span className="text-[#627D98]">
                Moderate advance pricing
              </span>
            )}
          </div>
        </div>

        {/* Official AI Recommendation Box */}
        <div className="p-5 rounded-2xl bg-[#FAFCFF] border border-[#2F80ED]/30 space-y-2">
          <div className="flex items-center gap-2 text-[#1769E0] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{t.aiRecHeading}</span>
          </div>
          <p className="text-xs sm:text-sm text-[#102A43] leading-relaxed font-medium">
            &ldquo;{t.aiRecBody}&rdquo;
          </p>
          <div className="text-[11px] text-[#627D98] pt-1">
            Algorithm backtested against 1.2 million domestic seat transactions logged across DGCA scheduled corridors.
          </div>
        </div>
      </div>
    </div>
  );
};
