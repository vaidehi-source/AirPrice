import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Copy,
  Download,
  Check,
  Code2,
  Server,
  Key,
  Database,
} from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { ROUTES_DATA, SYSTEM_METRICS, FARE_SHOCK_ALERTS } from '../../data/mockData';

interface ApiDataViewProps {
  language: Language;
}

export const ApiDataView: React.FC<ApiDataViewProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  // Playground state
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    '/api/index' | '/api/route' | '/api/inflation/contribution' | '/api/alerts'
  >('/api/index');
  const [selectedRoute, setSelectedRoute] = useState('DEL-BOM');
  const [selectedDate, setSelectedDate] = useState('2026-09-04');
  const [selectedFrequency, setSelectedFrequency] = useState<'15min' | 'daily' | 'monthly'>('15min');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [responseTimestamp, setResponseTimestamp] = useState(new Date().toISOString());

  // Generate realistic JSON response
  const generateJsonResponse = () => {
    switch (selectedEndpoint) {
      case '/api/index':
        return {
          status: 'success',
          code: 200,
          timestamp: responseTimestamp,
          frequency: selectedFrequency,
          base_period: '2024-01',
          data: {
            apix_current: SYSTEM_METRICS.apixCurrent,
            apix_previous_month: SYSTEM_METRICS.apixPrevMonth,
            percentage_change: SYSTEM_METRICS.apixChangePercent,
            national_avg_fare_inr: SYSTEM_METRICS.avgFareIndia,
            monitored_corridors: SYSTEM_METRICS.routesMonitored,
            reliability_score: SYSTEM_METRICS.reliabilityScore,
            status: 'operational',
          },
          meta: {
            publisher: 'Ministry of Statistics and Programme Implementation (MoSPI) / DGCA Feed',
            api_version: 'v2.4-production',
            latency_ms: 24,
          },
        };

      case '/api/route': {
        const r = ROUTES_DATA.find((item) => item.id === selectedRoute) || ROUTES_DATA[0];
        return {
          status: 'success',
          code: 200,
          timestamp: responseTimestamp,
          route_id: r.id,
          origin: { code: r.originCode, city: r.originCity },
          destination: { code: r.destinationCode, city: r.destinationCity },
          pricing: {
            current_spot_fare_inr: r.currentFare,
            baseline_normal_fare_inr: r.normalFare,
            historical_30d_avg_inr: r.avg30DFare,
            minimum_fare_inr: r.minFare,
            maximum_fare_inr: r.maxFare,
            deviation_percent: r.changePercent,
            shock_state: r.status,
          },
          ai_recommendation: {
            optimal_booking_window: r.bestBookingWindowDays,
            potential_savings_inr: r.potentialSavings,
          },
          data_quality: {
            confidence_score: r.reliabilityScore,
            active_scraped_feeds: r.sourcesCount,
            daily_scheduled_flights: r.dailyFlights,
            missing_rate_pct: r.missingDataPercent,
          },
        };
      }

      case '/api/inflation/contribution':
        return {
          status: 'success',
          code: 200,
          timestamp: responseTimestamp,
          headline_airfare_inflation_pct: 8.0,
          top_contributing_corridors: [
            { route: 'DEL-BOM', contribution_pct: 2.4, weight: 0.18 },
            { route: 'DEL-BLR', contribution_pct: 1.7, weight: 0.14 },
            { route: 'BOM-BLR', contribution_pct: 1.2, weight: 0.11 },
            { route: 'OTHERS', contribution_pct: 2.7, weight: 0.57 },
          ],
          shapley_decomposition_inr: {
            total_aggregate_fare_increase: 1000,
            demand_pressure: 400,
            seasonal_festival: 250,
            booking_window_compression: 150,
            taxes_fuel_atf: 100,
            fleet_slot_constraints: 100,
          },
        };

      case '/api/alerts':
        return {
          status: 'success',
          code: 200,
          timestamp: responseTimestamp,
          active_anomalies_count: FARE_SHOCK_ALERTS.length,
          alerts: FARE_SHOCK_ALERTS.map((a) => ({
            id: a.id,
            route: a.routeLabel,
            severity: a.severity,
            current_fare_inr: a.currentFare,
            normal_fare_inr: a.normalFare,
            deviation_pct: a.deviationPercent,
            reason: a.reason,
            detected_at: a.detectedTime,
            regulatory_flag: a.detailedAnalysis.regulatoryFlag,
          })),
        };
    }
  };

  const jsonString = JSON.stringify(generateJsonResponse(), null, 2);

  const handleRunRequest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setResponseTimestamp(new Date().toISOString());
      setIsLoading(false);
    }, 280);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Route,Current_Fare,Normal_Fare,Deviation_Pct,Reliability\n' +
      ROUTES_DATA.map((r) => `${r.id},${r.currentFare},${r.normalFare},${r.changePercent}%,${r.reliabilityScore}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `airprice_apix_export_${selectedEndpoint.replace(/\//g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              {t.govApiTitle}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold font-mono">
              🟢 API Status: Operational
            </span>
          </div>
          <p className="text-sm text-[#627D98] mt-1 font-medium">
            Programmatic REST endpoints for DGCA, RBI Research and national economic researchers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs bg-white px-3 py-1.5 rounded-xl border border-[#E2E8F0] shadow-2xs font-mono text-[#627D98]">
            SLA: 99.98% • Latency &lt;35ms
          </div>
        </div>
      </div>

      {/* Endpoint Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            path: '/api/index' as const,
            name: 'Airfare Index (APIx)',
            desc: 'Aggregate national price index and 30-day velocity',
          },
          {
            path: '/api/route' as const,
            name: 'Corridor Intelligence',
            desc: 'Granular pricing, booking windows and seat spreads',
          },
          {
            path: '/api/inflation/contribution' as const,
            name: 'Inflation Factors',
            desc: 'Econometric Shapley factor decomposition values',
          },
          {
            path: '/api/alerts' as const,
            name: 'Fare Shock Anomalies',
            desc: 'Real-time Z-score &gt;2.5σ price surge notifications',
          },
        ].map((ep) => (
          <button
            key={ep.path}
            onClick={() => setSelectedEndpoint(ep.path)}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedEndpoint === ep.path
                ? 'bg-[#EAF3FF] border-[#1769E0] ring-2 ring-[#1769E0]/20 shadow-xs'
                : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#1769E0] mb-1">
              <span className="px-1.5 py-0.5 rounded bg-[#1769E0] text-white text-[9px]">
                GET
              </span>
              <span>{ep.path}</span>
            </div>
            <div className="text-xs font-bold text-[#102A43]">{ep.name}</div>
            <p className="text-[11px] text-[#627D98] mt-0.5 leading-snug">
              {ep.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Interactive Playground Control Bar */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#1769E0]" />
            <h3 className="text-base font-bold text-[#0B1F3A]">
              Live API Request Playground
            </h3>
          </div>
          <span className="text-xs text-[#627D98] font-mono">
            Auth: Bearer gov_apix_live_token_verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Endpoint */}
          <div>
            <label className="block text-[11px] font-bold text-[#102A43] uppercase mb-1">
              Target Endpoint
            </label>
            <select
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
            >
              <option value="/api/index">GET /api/index</option>
              <option value="/api/route">GET /api/route</option>
              <option value="/api/inflation/contribution">GET /api/inflation/contribution</option>
              <option value="/api/alerts">GET /api/alerts</option>
            </select>
          </div>

          {/* Route Parameter (disabled for non-route endpoints) */}
          <div>
            <label className="block text-[11px] font-bold text-[#102A43] uppercase mb-1">
              Sector / Route ID
            </label>
            <select
              value={selectedRoute}
              disabled={selectedEndpoint !== '/api/route'}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className={`w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-[#CBD5E1] ${
                selectedEndpoint === '/api/route' ? 'bg-[#F8FAFC]' : 'bg-gray-100 opacity-60 cursor-not-allowed'
              }`}
            >
              {ROUTES_DATA.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} ({r.originCode} → {r.destinationCode})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-[11px] font-bold text-[#102A43] uppercase mb-1">
              Date Filter
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-[11px] font-bold text-[#102A43] uppercase mb-1">
              Sampling Frequency
            </label>
            <select
              value={selectedFrequency}
              onChange={(e) => setSelectedFrequency(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
            >
              <option value="15min">Real-Time (15 Minutes)</option>
              <option value="daily">Daily Aggregated (EOD)</option>
              <option value="monthly">Monthly National Index</option>
            </select>
          </div>
        </div>

        {/* Run Request Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleRunRequest}
            disabled={isLoading}
            className="px-5 py-2.5 bg-[#1769E0] hover:bg-[#1253B3] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Executing Query...' : t.runApiRequest}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="px-3 py-2 bg-white border border-[#CBD5E1] hover:bg-[#F6F9FC] text-[#102A43] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : t.copyJson}</span>
            </button>
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-2 bg-white border border-[#CBD5E1] hover:bg-[#F6F9FC] text-[#102A43] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#1769E0]" />
              <span>{t.downloadCsv}</span>
            </button>
          </div>
        </div>

        {/* Realistic JSON Response Display Code Block */}
        <div className="relative rounded-2xl bg-[#0B1F3A] text-white p-4 font-mono text-xs overflow-hidden border border-[#1E293B]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px] text-[#9FB3C8]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-bold">HTTP 200 OK</span>
              <span>•</span>
              <span>Content-Type: application/json</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Latency: 24ms</span>
              <span>Size: {(jsonString.length / 1024).toFixed(1)} KB</span>
            </div>
          </div>

          <pre className="overflow-x-auto max-h-96 text-[#E2E8F0] leading-relaxed select-all">
            {jsonString}
          </pre>
        </div>
      </div>
    </div>
  );
};
