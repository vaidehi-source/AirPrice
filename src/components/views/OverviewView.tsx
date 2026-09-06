import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Plane,
  Flame,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { RouteData, ScreenId, Language, UserMode } from '../../types';
import { FARE_SHOCK_ALERTS, SYSTEM_METRICS } from '../../data/mockData';
import { TRANSLATIONS } from '../../i18n/translations';
import { LineChart } from '../charts/LineChart';
import { IndiaMap } from '../IndiaMap';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';

interface OverviewViewProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectRoute: (routeId: string) => void;
  language: Language;
  userMode: UserMode;
  onOpenAlertModal: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onSelectRoute,
  language,
  userMode,
  onOpenAlertModal,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              {t.overviewTitle}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF3FF] text-[#1769E0] border border-[#1769E0]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE DATA</span>
            </span>
          </div>
          <p className="text-sm text-[#627D98] mt-1 font-medium">
            {t.overviewSubtitle}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('routes')}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F6F9FC] text-[#102A43] shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Routes</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#627D98]" />
          </button>
          <button
            onClick={onOpenAlertModal}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-[#1769E0] hover:bg-[#1253B3] text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Set Fare Alert</span>
          </button>
        </div>
      </div>

      {/* Audience Context Mode Banner */}
      {userMode === 'policy' ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1F3A] text-white border border-[#1769E0]/30 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-[#1769E0] text-white tracking-wider">
                  MoSPI · RBI · DGCA Policy Mode
                </span>
                <span className="text-xs text-[#9FB3C8]">
                  National Aviation CPI & Regulatory Oversight
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1] max-w-2xl">
                Real-time tracking of transport component inflation, dynamic pricing variance (Z-score &gt; 2.5σ), passenger load factors, and ATF pass-through indices across top Indian corridors.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('inflation')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Inflation Decomposition</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('api')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#1769E0] hover:bg-[#2F80ED] text-white transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Download MoSPI CSV</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-white/10 text-xs">
            <div>
              <span className="text-[#9FB3C8] block text-[11px]">CPI Transport Weight</span>
              <span className="font-mono font-bold text-sm text-white">0.87% of CPI</span>
            </div>
            <div>
              <span className="text-[#9FB3C8] block text-[11px]">ATF Elasticity Factor</span>
              <span className="font-mono font-bold text-sm text-white">0.42 (High Pass-Through)</span>
            </div>
            <div>
              <span className="text-[#9FB3C8] block text-[11px]">Metro Sector Load Factor</span>
              <span className="font-mono font-bold text-sm text-emerald-400">87.4% Avg PLF</span>
            </div>
            <div>
              <span className="text-[#9FB3C8] block text-[11px]">Shapley Demand Surge</span>
              <span className="font-mono font-bold text-sm text-amber-300">40% of Inflation</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#EAF3FF] to-[#F0F7FF] text-[#0B1F3A] border border-[#1769E0]/20 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-[#1769E0] text-white tracking-wider">
                  Citizen Traveler Mode
                </span>
                <span className="text-xs font-bold text-[#1769E0]">
                  Smart Flight Booking Advice
                </span>
              </div>
              <p className="text-xs text-[#486581] max-w-2xl">
                Fares are currently <span className="font-bold text-amber-700">+8.2% higher</span> than last month. For major routes like Delhi–Mumbai and Bengaluru–Hyderabad, booking <strong>28 to 32 days in advance</strong> can save you up to <strong>₹1,850 per ticket</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('when-to-book')}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#1769E0] hover:bg-[#1253B3] text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Kab Book Karein?</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: APIx */}
        <div
          onClick={() => onNavigate('forecast')}
          className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:border-[#1769E0]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#627D98] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              APIx
            </span>
            <span className="p-1.5 rounded-lg bg-[#EAF3FF] text-[#1769E0] group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black text-[#0B1F3A] tracking-tight">
            122.3
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600">
            <span className="font-bold font-mono">+8.2%</span>
            <span className="text-[#627D98]">{t.vsPreviousMonth}</span>
          </div>
        </div>

        {/* KPI 2: Average Fare */}
        <div
          onClick={() => onNavigate('routes')}
          className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:border-[#1769E0]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#627D98] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Average Fare
            </span>
            <span className="p-1.5 rounded-lg bg-[#EAF3FF] text-[#1769E0] group-hover:scale-110 transition-transform">
              <Plane className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black text-[#0B1F3A] tracking-tight">
            ₹5,240
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600">
            <span className="font-bold font-mono">+6.4%</span>
            <span className="text-[#627D98]">all domestic sectors</span>
          </div>
        </div>

        {/* KPI 3: Active Fare Shocks */}
        <div
          onClick={() => onNavigate('shocks')}
          className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:border-red-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#627D98] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Active Fare Shocks
            </span>
            <span className="p-1.5 rounded-lg bg-red-100 text-red-600 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black text-[#EF4444] tracking-tight flex items-baseline gap-2">
            <span>03</span>
            <span className="text-xs font-sans font-bold text-red-600">
              {t.severeAlertsCount}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-red-600">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Abnormal price anomalies flagged</span>
          </div>
        </div>

        {/* KPI 4: Data Reliability */}
        <div
          onClick={() => onNavigate('reliability')}
          className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:border-[#1769E0]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#627D98] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Data Reliability
            </span>
            <span className="p-1.5 rounded-lg bg-[#EAF3FF] text-[#1769E0] group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black text-[#0B1F3A] tracking-tight">
            94/100
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[#102A43] font-semibold">{t.highConfidence}</span>
            <span className="text-[#627D98]">(5 Feeds)</span>
          </div>
        </div>
      </div>

      {/* Row 2: APIx 30 Day Trend Chart */}
      <div>
        <LineChart title={t.trendTitle} />
      </div>

      {/* Row 3: India Heatmap & Top Inflation Contributors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <IndiaMap
            onSelectRoute={(id) => {
              onSelectRoute(id);
              onNavigate('routes');
            }}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Top Inflation Contributors */}
          <HorizontalBarChart
            onViewFullAnalysis={() => onNavigate('inflation')}
          />

          {/* Real-Time Fare Shock Alerts Panel */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <h3 className="text-base sm:text-lg font-bold text-[#102A43]">
                  {t.realTimeShocksTitle}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('shocks')}
                className="text-xs font-bold text-[#1769E0] hover:underline"
              >
                View Center →
              </button>
            </div>

            <div className="space-y-3">
              {FARE_SHOCK_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => {
                    onSelectRoute(alert.routeId);
                    onNavigate('routes');
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] ${
                    alert.severity === 'severe'
                      ? 'bg-[#FFF5F5] border-red-200 hover:border-red-400'
                      : 'bg-[#FFFBF0] border-amber-200 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        alert.severity === 'severe'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {alert.severity === 'severe' ? '🔴 SEVERE' : '🟠 MODERATE'}
                    </span>
                    <span className="font-mono font-bold text-xs text-[#0B1F3A]">
                      {alert.detectedTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-[#0B1F3A] mb-1">
                    <span className="text-sm font-mono">{alert.routeLabel}</span>
                    <span className="text-sm font-mono text-red-600">
                      ₹{alert.currentFare.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-semibold">
                        (+{alert.deviationPercent}% above normal)
                      </span>
                    </span>
                  </div>

                  <p className="text-xs text-[#627D98] italic mb-2">
                    &ldquo;{alert.reason}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-black/5">
                    <span className="text-[#627D98]">Baseline: ₹{alert.normalFare}</span>
                    <span className="text-[#1769E0] font-bold flex items-center gap-1">
                      <span>Detailed Analysis</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
