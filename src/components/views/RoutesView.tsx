import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Plane,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { RouteData, ScreenId, Language } from '../../types';
import { ROUTES_DATA } from '../../data/mockData';
import { TRANSLATIONS } from '../../i18n/translations';
import { RouteTrendChart } from '../charts/RouteTrendChart';

interface RoutesViewProps {
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  onNavigate: (screen: ScreenId) => void;
  language: Language;
  onOpenAlertModal: () => void;
  onOpenReliabilityModal: (route: RouteData) => void;
}

export const RoutesView: React.FC<RoutesViewProps> = ({
  selectedRouteId,
  onSelectRoute,
  onNavigate,
  language,
  onOpenAlertModal,
  onOpenReliabilityModal,
}) => {
  const t = TRANSLATIONS[language];

  // Search state
  const [origin, setOrigin] = useState('DEL');
  const [destination, setDestination] = useState('BOM');
  const [travelDate, setTravelDate] = useState('2026-10-15');
  const [bookingWindowDays, setBookingWindowDays] = useState('30');

  // Currently active route
  const currentRoute =
    ROUTES_DATA.find((r) => r.id === selectedRouteId) ||
    ROUTES_DATA.find((r) => r.originCode === origin && r.destinationCode === destination) ||
    ROUTES_DATA[0];

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const found = ROUTES_DATA.find(
      (r) =>
        (r.originCode === origin && r.destinationCode === destination) ||
        (r.originCode === destination && r.destinationCode === origin)
    );
    if (found) {
      onSelectRoute(found.id);
    } else {
      // Pick first or fallback
      onSelectRoute('DEL-BOM');
    }
  };

  const swapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              {t.routeIntelligence}
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EAF3FF] text-[#1769E0]">
              48 Corridors
            </span>
          </div>
          <p className="text-sm text-[#627D98] mt-1 font-medium">
            Granular sector analytics, carrier pricing spreads and booking window models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('when-to-book')}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#EAF3FF] text-[#1769E0] hover:bg-[#D8E8FC] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kab Book Karein?</span>
          </button>
          <button
            onClick={onOpenAlertModal}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#1769E0] text-white hover:bg-[#1253B3] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Set Fare Alert</span>
          </button>
        </div>
      </div>

      {/* Route Search Form */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0] shadow-xs">
        <form onSubmit={handleAnalyze} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {/* Origin */}
          <div>
            <label className="block text-xs font-bold text-[#102A43] mb-1.5 uppercase tracking-wider">
              {t.origin}
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-bold rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#1769E0]"
            >
              <option value="DEL">Delhi (DEL) — Indira Gandhi Intl</option>
              <option value="BOM">Mumbai (BOM) — Chhatrapati Shivaji</option>
              <option value="BLR">Bengaluru (BLR) — Kempegowda Intl</option>
              <option value="HYD">Hyderabad (HYD) — Rajiv Gandhi Intl</option>
              <option value="CCU">Kolkata (CCU) — Netaji Subhash Intl</option>
              <option value="MAA">Chennai (MAA) — Chennai Intl</option>
              <option value="JAI">Jaipur (JAI) — Jaipur Intl</option>
              <option value="IXB">Bagdogra (IXB) — Bagdogra Airport</option>
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs font-bold text-[#102A43] mb-1.5 uppercase tracking-wider">
              {t.destination}
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-bold rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#1769E0]"
            >
              <option value="BOM">Mumbai (BOM) — Chhatrapati Shivaji</option>
              <option value="DEL">Delhi (DEL) — Indira Gandhi Intl</option>
              <option value="BLR">Bengaluru (BLR) — Kempegowda Intl</option>
              <option value="HYD">Hyderabad (HYD) — Rajiv Gandhi Intl</option>
              <option value="CCU">Kolkata (CCU) — Netaji Subhash Intl</option>
              <option value="MAA">Chennai (MAA) — Chennai Intl</option>
              <option value="JAI">Jaipur (JAI) — Jaipur Intl</option>
              <option value="GAU">Guwahati (GAU) — Lokpriya Gopinath</option>
            </select>
          </div>

          {/* Travel Date */}
          <div>
            <label className="block text-xs font-bold text-[#102A43] mb-1.5 uppercase tracking-wider">
              {t.travelDate}
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#627D98] absolute left-3 top-2.5" />
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#1769E0]"
              />
            </div>
          </div>

          {/* Booking Window */}
          <div>
            <label className="block text-xs font-bold text-[#102A43] mb-1.5 uppercase tracking-wider">
              {t.bookingWindow}
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-[#627D98] absolute left-3 top-2.5" />
              <select
                value={bookingWindowDays}
                onChange={(e) => setBookingWindowDays(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#1769E0]"
              >
                <option value="7">7 days before travel</option>
                <option value="15">15 days before travel</option>
                <option value="30">30 days before travel (Sweet Spot)</option>
                <option value="45">45 days before travel</option>
                <option value="60">60 days before travel</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#1769E0] hover:bg-[#1253B3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer h-[38px]"
            >
              <span>{t.analyzeRoute}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Selected Route Hero Banner */}
      <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1769E0] text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-white/15 text-[11px] font-bold tracking-wider font-mono">
              SECTOR #{currentRoute.id}
            </span>
            {currentRoute.status === 'critical' ? (
              <span className="px-2 py-0.5 rounded bg-red-500 text-white text-[11px] font-bold animate-pulse">
                FARE SHOCK ACTIVE
              </span>
            ) : currentRoute.status === 'warning' ? (
              <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-[11px] font-bold">
                MODERATE PRESSURE
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[11px] font-bold">
                STABLE CORRIDOR
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {currentRoute.originCity} ({currentRoute.originCode}) → {currentRoute.destinationCity} ({currentRoute.destinationCode})
          </h2>
          <p className="text-xs text-[#CBD5E1] mt-1">
            {currentRoute.dailyFlights.toLocaleString('en-IN')} monitored flights daily across {currentRoute.sourcesCount} verified booking engines.
          </p>
        </div>

        <div className="text-left md:text-right bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/15">
          <span className="text-xs text-[#CBD5E1] block uppercase tracking-wider font-semibold">
            Current Fare
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-black text-white">
            ₹{currentRoute.currentFare.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-emerald-300 font-bold">
            Live Median Price
          </span>
        </div>
      </div>

      {/* 4 Cards: Current Fare, 30D Average, Fare Change, Data Confidence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs text-[#627D98] font-semibold uppercase tracking-wider block mb-1">
            {t.currentFare}
          </span>
          <div className="font-mono text-3xl font-black text-[#0B1F3A]">
            ₹{currentRoute.currentFare.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-[#627D98] mt-2 flex items-center gap-1 font-medium">
            <span>Range:</span>
            <span className="font-mono font-bold text-[#102A43]">
              ₹{currentRoute.minFare} – ₹{currentRoute.maxFare}
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs text-[#627D98] font-semibold uppercase tracking-wider block mb-1">
            {t.avg30D}
          </span>
          <div className="font-mono text-3xl font-black text-[#0B1F3A]">
            ₹{currentRoute.avg30DFare.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-[#627D98] mt-2 font-medium">
            Baseline normal: ₹{currentRoute.normalFare}
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <span className="text-xs text-[#627D98] font-semibold uppercase tracking-wider block mb-1">
            {t.fareChange}
          </span>
          <div
            className={`font-mono text-3xl font-black ${
              currentRoute.changePercent > 30 ? 'text-[#EF4444]' : 'text-emerald-600'
            }`}
          >
            +{currentRoute.changePercent}%
          </div>
          <div className="text-xs text-[#627D98] mt-2 font-medium">
            vs 30D historical moving avg
          </div>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => onOpenReliabilityModal(currentRoute)}
          className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:border-[#1769E0]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#627D98] font-semibold uppercase tracking-wider">
              {t.dataConfidence}
            </span>
            <span className="text-[10px] text-[#1769E0] font-bold group-hover:underline">
              Why? →
            </span>
          </div>
          <div className="font-mono text-3xl font-black text-[#0B1F3A] flex items-center gap-1.5">
            <span>{currentRoute.reliabilityScore}</span>
            <span className="text-base text-[#627D98]">/100</span>
          </div>
          <div className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>High Reliability ({currentRoute.sourcesCount} Feeds)</span>
          </div>
        </div>
      </div>

      {/* Route Price Trend Chart */}
      <RouteTrendChart
        routeId={currentRoute.id}
        routeLabel={`${currentRoute.originCode} → ${currentRoute.destinationCode}`}
      />

      {/* Airlines / Carriers Breakdown Table */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0B1F3A]">
              Live Carrier Spreads & Punctuality ({currentRoute.originCode}–{currentRoute.destinationCode})
            </h3>
            <p className="text-xs text-[#627D98] mt-0.5">
              Real-time fare variations across scheduled operating airlines.
            </p>
          </div>
          <span className="text-xs text-[#627D98] font-mono">
            {currentRoute.carriers.length} Active Airlines
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#627D98] font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Carrier</th>
                <th className="py-2.5 px-3">Live Starting Fare</th>
                <th className="py-2.5 px-3">Daily Flights</th>
                <th className="py-2.5 px-3">On-Time Performance (OTP)</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]/60">
              {currentRoute.carriers.map((carrier) => (
                <tr key={carrier.airline} className="hover:bg-[#F6F9FC] transition-colors">
                  <td className="py-3 px-3 font-bold text-[#102A43] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1769E0]" />
                    <span>{carrier.airline}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-sm text-[#0B1F3A]">
                    ₹{carrier.fare.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#627D98]">
                    {carrier.flightsPerDay} flights
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${carrier.onTimeRate}%` }}
                        />
                      </div>
                      <span className="font-mono font-semibold text-[#102A43]">
                        {carrier.onTimeRate}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={onOpenAlertModal}
                      className="px-2.5 py-1 text-[11px] font-bold text-[#1769E0] bg-[#EAF3FF] hover:bg-[#D8E8FC] rounded-lg transition-colors cursor-pointer"
                    >
                      Track Fare
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
