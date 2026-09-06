import React, { useState } from 'react';
import {
  Plane,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Search,
  Calendar,
  ChevronRight,
  BarChart3,
  Database,
  Globe,
  Users,
  Building2,
  Sparkles,
  ExternalLink,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Bell,
  Activity,
  Layers,
  FileSpreadsheet,
  Lock,
  Landmark,
  Download,
  PieChart,
  Info,
  Percent,
  Clock,
  Terminal,
} from 'lucide-react';
import { ScreenId, UserMode, Language, RouteData } from '../../types';
import {
  ROUTES_DATA,
  FARE_SHOCK_ALERTS,
  SYSTEM_METRICS,
  AIRPORT_COORDINATES,
  INFLATION_FACTORS,
  HISTORICAL_TREND_DATA,
} from '../../data/mockData';

interface LandingViewProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectRoute: (routeId: string) => void;
  userMode: UserMode;
  onToggleUserMode: (mode: UserMode) => void;
  language: Language;
  onOpenAlertModal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  onSelectRoute,
  userMode,
  onToggleUserMode,
  language,
  onOpenAlertModal,
}) => {
  // Quick Route Checker state
  const [quickOrigin, setQuickOrigin] = useState('DEL');
  const [quickDestination, setQuickDestination] = useState('BOM');
  const [activeAudienceTab, setActiveAudienceTab] = useState<UserMode>(userMode);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [cpiTimeframe, setCpiTimeframe] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const [activeCpiFactor, setActiveCpiFactor] = useState<string | null>(null);

  // API Index State on Landing Page (at start)
  const [apiIndexTab, setApiIndexTab] = useState<'overview' | 'corridors'>('overview');
  const [apiTimestamp] = useState(() => new Date().toISOString());

  const apiIndexResponse = {
    top_weighted_corridors: [
      { route: 'DEL-BOM', origin: 'Delhi', destination: 'Mumbai', weight_pct: 18.2, fare_inr: 5240, change_pct: 13.4 },
      { route: 'BLR-HYD', origin: 'Bengaluru', destination: 'Hyderabad', weight_pct: 12.4, fare_inr: 7900, change_pct: 97.5 },
      { route: 'BOM-BLR', origin: 'Mumbai', destination: 'Bengaluru', weight_pct: 11.0, fare_inr: 4450, change_pct: 6.5 },
      { route: 'DEL-CCU', origin: 'Delhi', destination: 'Kolkata', weight_pct: 8.5, fare_inr: 5600, change_pct: 8.7 },
    ],
  };

  // Available unique origins and destinations
  const origins = Array.from(new Set(ROUTES_DATA.map((r) => r.originCode)));
  const availableDestinations = ROUTES_DATA
    .filter((r) => r.originCode === quickOrigin)
    .map((r) => r.destinationCode);

  // Find matching route or fallback to DEL-BOM
  const selectedRouteMatch =
    ROUTES_DATA.find(
      (r) => r.originCode === quickOrigin && r.destinationCode === quickDestination
    ) ||
    ROUTES_DATA.find((r) => r.id === `${quickOrigin}-${quickDestination}`) ||
    ROUTES_DATA[0];

  const handleOriginChange = (code: string) => {
    setQuickOrigin(code);
    const validDests = ROUTES_DATA.filter((r) => r.originCode === code).map((r) => r.destinationCode);
    if (validDests.length > 0 && !validDests.includes(quickDestination)) {
      setQuickDestination(validDests[0]);
    }
  };

  const handleLaunchRouteExplorer = () => {
    if (selectedRouteMatch) {
      onSelectRoute(selectedRouteMatch.id);
      onNavigate('routes');
    }
  };

  const handleDownloadCpiData = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Indicator,Value,Unit,Base_Year,Notes\n' +
      'APIx CPI Airfare Sub-Index,122.3,Index (Base 100),2012,Daily volume-weighted domestic composite\n' +
      'YoY Airfare Inflation,+8.2,%,2025-2026,Headline change vs 113.0 last period\n' +
      'CPI National Transport Basket Weight,0.87,%,MoSPI,Weight in All-India General CPI\n' +
      'Core Services CPI Pass-Through,+0.07,Percentage Points,RBI MPC,Estimated second-round impact\n' +
      'MoSPI Reporting Lead Time,14,Days Ahead,Nowcast,Eliminates 15-day delayed publication lag\n\n' +
      'Factor_Attribution,Amount_INR,Percentage,Description\n' +
      'Demand Pressure,400,40%,Passenger load factor (>87% PLF)\n' +
      'Festival & Seasonal Peak,250,25%,Advance booking holiday blocks\n' +
      'Booking Window Compression,150,15%,Late bookings under 7 days\n' +
      'Aviation Turbine Fuel (ATF) & State VAT,100,10%,Crude oil and state taxes\n' +
      'Fleet & Slot Constraints,100,10%,Engine groundings and airport congestion\n\n' +
      'Top_Corridor_Contributors,Route_ID,Current_Fare_INR,YoY_Change_Percent,CPI_Contribution_Percent\n' +
      'Delhi - Mumbai,DEL-BOM,5240,+13.4%,+2.4%\n' +
      'Bengaluru - Hyderabad,BLR-HYD,7900,+97.5%,+1.8%\n' +
      'Mumbai - Bengaluru,BOM-BLR,4450,+6.5%,+1.2%\n' +
      'Delhi - Kolkata,DEL-CCU,5600,+8.7%,+0.9%\n' +
      'Bagdogra - Guwahati,IXB-GAU,4850,+56.4%,+0.6%\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'AirPrice_APIx_CPI_Air_Transport_Index_MoSPI.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'How does the AirPrice CPI Airfare Sub-Index connect to official Government statistics?',
      a: 'Official Consumer Price Index (CPI) releases published monthly by the Ministry of Statistics and Programme Implementation (MoSPI) suffer from an inherent 12–15 day publication delay. AirPrice APIx models the official Air Passenger Transport sub-group (0.87% weight in General CPI, calibrated to Base Year 2012 = 100.0) across 12,480+ domestic daily flights. This supplies the Reserve Bank of India (RBI) and economic analysts with high-frequency nowcasts to evaluate core services inflation pressure (+7 bps currently) without waiting for month-end bulletins.',
    },
    {
      q: 'What is the AirPrice APIx Index and how is it calculated?',
      a: 'The Airfare Price Index (APIx) is India’s high-frequency composite price index for domestic air travel, calibrated against a baseline of 100. It synthesizes real-time pricing across 500+ commercial sectors, weighting routes by MoSPI national transport consumption patterns, passenger load factors, and seat capacity. This provides an unbiased macro benchmark for inflation tracking and consumer guidance.',
    },
    {
      q: 'Why do domestic airfares in India fluctuate so drastically?',
      a: 'Aviation pricing uses automated dynamic yield algorithms where prices escalate non-linearly as seat inventory depletes. Our econometric decomposition reveals that fare hikes are driven by passenger demand surges (40%), festive and seasonal compression (25%), last-minute booking windows within 72 hours (15%), Aviation Turbine Fuel (ATF) pass-throughs (10%), and fleet maintenance groundings (10%).',
    },
    {
      q: 'How does "Kab Book Karein?" help travelers save money?',
      a: 'By analyzing millions of historical price points across airline inventory cycles, our algorithms identified an empirical "Sweet Spot" between 28 and 32 days prior to scheduled departure. Travelers booking in this golden window save up to 38% (average ₹1,850 per ticket) compared to buying within 7 days of departure, where emergency corporate demand causes steep price spikes.',
    },
    {
      q: 'How do regulatory bodies like MoSPI, RBI, and DGCA utilize APIx?',
      a: 'MoSPI and the Reserve Bank of India (RBI) require timely, high-frequency transport cost indicators before traditional monthly CPI releases. APIx provides daily transport sub-index estimates, while DGCA uses our Z-score anomaly detector (>2.5σ) to flag sudden route cartelization, predatory surge pricing during disruptions, and capacity bottlenecks.',
    },
    {
      q: 'Where does AirPrice APIx source its fare data?',
      a: 'APIx ingests data through 5 redundant direct connectors, including direct airline GDS and web pricing (IndiGo, Air India) and major Indian Online Travel Agencies (MakeMyTrip, EaseMyTrip, Ixigo). All fares undergo cross-validation algorithms to eliminate non-bookable phantom rates, yielding an average cross-source consistency score of 94.2%.',
    },
  ];

  return (
    <div className="w-full bg-[#F6F9FC] text-[#102A43] overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 border-b border-[#E2E8F0] bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFD] to-[#F6F9FC]">
        {/* Subtle geometric background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Live System Beacon */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF3FF] border border-[#1769E0]/30 text-xs font-semibold text-[#1769E0] shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>LIVE DATA ENGINE</span>
              <span className="text-[#627D98]">·</span>
              <span className="font-mono font-bold text-[#0B1F3A]">API Index: 122.3 (+8.2% YoY)</span>
              <span className="text-[#627D98]">·</span>
              <span className="text-[#486581]">14,280 Flights Indexed</span>
            </div>
          </div>

          {/* Hero Headlines */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0B1F3A] tracking-tight leading-[1.12]">
              Decoding India's skies with{' '}
              <span className="text-[#1769E0]">
                AirPrice APIx
              </span>
            </h1>

            <p className="text-base sm:text-xl text-[#486581] leading-relaxed max-w-2xl mx-auto">
              India's real-time airfare price index — tracking every fare, explaining every spike, for citizens, policymakers and developers.
            </p>

            {/* Primary Action Group: One solid filled button + 3 plain text links below */}
            <div className="pt-4 flex flex-col items-center gap-3.5">
              <button
                id="btn-hero-launch-dashboard"
                onClick={() => onNavigate('overview')}
                className="px-6 py-3.5 rounded-xl bg-[#1769E0] hover:bg-[#1253B3] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Launch Live Dashboard →</span>
              </button>

              {/* Plain text links in a single row below the primary button */}
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-1">
                <button
                  id="link-hero-when-to-book"
                  onClick={() => onNavigate('when-to-book')}
                  className="text-sm font-medium text-[#486581] hover:text-[#0B1F3A] pb-0.5 border-b border-[#CBD5E1] hover:border-[#1769E0] transition-colors cursor-pointer"
                >
                  When should you book?
                </button>

                <a
                  id="link-hero-api-index"
                  href="#api-index-section"
                  className="text-sm font-medium text-[#486581] hover:text-[#0B1F3A] pb-0.5 border-b border-[#CBD5E1] hover:border-[#1769E0] transition-colors cursor-pointer"
                >
                  Explore the API index
                </a>

                <button
                  id="link-hero-policy-mode"
                  onClick={() => {
                    onToggleUserMode('policy');
                    onNavigate('overview');
                  }}
                  className="text-sm font-medium text-[#486581] hover:text-[#0B1F3A] pb-0.5 border-b border-[#CBD5E1] hover:border-[#1769E0] transition-colors cursor-pointer"
                >
                  Switch to policy mode
                </button>
              </div>
            </div>
          </div>

          {/* REAL-TIME API INDEX (APIx) SECTION ON START */}
          <div id="api-index-section" className="mt-10 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#CBD5E1] shadow-xl relative overflow-hidden transition-all">
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1769E0] via-[#38BDF8] to-[#10B981]" />

              {/* Module Header & Tab Switcher */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#1769E0] text-[11px] font-mono font-bold tracking-wider uppercase border border-[#1769E0]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      APIx™ Live Index
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] text-[10px] font-mono font-semibold">
                      Base Jan 2024 = 100.0
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-mono font-semibold border border-emerald-200">
                      DGCA & MoSPI Ingest Feed
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#1769E0]" />
                    AirPrice API Index & Ingestion Telemetry
                  </h2>
                  <p className="text-xs sm:text-sm text-[#627D98] mt-0.5">
                    India’s high-frequency composite airfare price index, tracking market velocity across 48 key corridors with sub-15 min refresh.
                  </p>
                </div>

                {/* Tab Selector */}
                <div className="flex items-center bg-[#F6F9FC] p-1 rounded-xl border border-[#E2E8F0] self-start md:self-auto shrink-0">
                  <button
                    id="tab-api-overview"
                    onClick={() => setApiIndexTab('overview')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      apiIndexTab === 'overview'
                        ? 'bg-[#1769E0] text-white shadow-xs'
                        : 'text-[#627D98] hover:text-[#0B1F3A]'
                    }`}
                  >
                    Index Overview
                  </button>
                  <button
                    id="tab-api-corridors"
                    onClick={() => setApiIndexTab('corridors')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      apiIndexTab === 'corridors'
                        ? 'bg-[#1769E0] text-white shadow-xs'
                        : 'text-[#627D98] hover:text-[#0B1F3A]'
                    }`}
                  >
                    Corridor Weights
                  </button>
                </div>
              </div>

              {/* TAB 1: INDEX OVERVIEW */}
              {apiIndexTab === 'overview' && (
                <div className="pt-5 space-y-5 animate-in fade-in duration-150">
                  {/* 4 Bento KPI Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E2E8F0] hover:border-[#1769E0]/40 transition-all">
                      <div className="flex items-center justify-between text-[#627D98] mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Composite APIx</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          +{SYSTEM_METRICS.apixChangePercent}% YoY
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-[#0B1F3A] tracking-tight">
                        {SYSTEM_METRICS.apixCurrent}
                      </div>
                      <div className="text-[11px] text-[#627D98] mt-1 font-medium">
                        +22.3 pts above Jan 2024 Base (100.0)
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E2E8F0] hover:border-[#1769E0]/40 transition-all">
                      <div className="flex items-center justify-between text-[#627D98] mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">National Spot Avg</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          +6.4% MoM
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-[#0B1F3A] tracking-tight">
                        ₹{SYSTEM_METRICS.avgFareIndia.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-[#627D98] mt-1 font-medium">
                        Volume-weighted one-way ticket
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E2E8F0] hover:border-[#1769E0]/40 transition-all">
                      <div className="flex items-center justify-between text-[#627D98] mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Daily Flights</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          48 Routes
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-[#0B1F3A] tracking-tight">
                        14,280+
                      </div>
                      <div className="text-[11px] text-[#627D98] mt-1 font-medium">
                        Audited across 5 airline connectors
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E2E8F0] hover:border-[#1769E0]/40 transition-all">
                      <div className="flex items-center justify-between text-[#627D98] mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Data Reliability</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Verified
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 tracking-tight flex items-center gap-1.5">
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        {SYSTEM_METRICS.reliabilityScore}%
                      </div>
                      <div className="text-[11px] text-[#627D98] mt-1 font-medium">
                        Cross-source price consensus score
                      </div>
                    </div>
                  </div>

                  {/* Trajectory & Index Insights */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#1769E0]" />
                        <span className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">
                          7-Day Index Trajectory & Velocity
                        </span>
                      </div>
                      <p className="text-xs text-[#486581] max-w-xl leading-relaxed">
                        The API Index accelerated from <span className="font-mono font-bold text-[#0B1F3A]">119.8</span> to <span className="font-mono font-bold text-[#0B1F3A]">122.3</span> over the past week, propelled by heavy corporate demand on the Mumbai-Delhi and Bengaluru corridors.
                      </p>
                    </div>

                    {/* Visual 7-Day Sparkline */}
                    <div className="flex items-end gap-2 sm:gap-3 bg-[#F6F9FC] p-3 rounded-xl border border-[#E2E8F0] shrink-0">
                      {[
                        { day: 'D-6', val: 119.8, h: '42%' },
                        { day: 'D-5', val: 120.4, h: '50%' },
                        { day: 'D-4', val: 121.1, h: '62%' },
                        { day: 'D-3', val: 121.5, h: '68%' },
                        { day: 'D-2', val: 121.9, h: '76%' },
                        { day: 'D-1', val: 122.1, h: '82%' },
                        { day: 'Today', val: 122.3, h: '92%' },
                      ].map((bar, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 group relative">
                          <span className="text-[9px] font-mono text-[#627D98]">{bar.day}</span>
                          <div className="w-5 sm:w-6 h-14 bg-[#E2E8F0] rounded-md relative flex items-end p-0.5">
                            <div
                              style={{ height: bar.h }}
                              className={`w-full rounded-sm transition-all ${
                                i === 6 ? 'bg-[#1769E0]' : 'bg-[#93C5FD]'
                              }`}
                            />
                          </div>
                          <span className="text-[9px] font-mono font-bold text-[#0B1F3A]">{bar.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onNavigate('overview')}
                        className="px-4 py-2 rounded-xl bg-[#1769E0] hover:bg-[#1253B3] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Full Dashboard Explorer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onNavigate('when-to-book')}
                        className="px-4 py-2 rounded-xl bg-[#F6F9FC] hover:bg-[#EAF3FF] text-[#0B1F3A] border border-[#CBD5E1] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#1769E0]" />
                        <span>When Should You Book?</span>
                      </button>

                      {userMode === 'policy' && (
                        <button
                          onClick={() => onNavigate('api')}
                          className="px-4 py-2 rounded-xl bg-[#F6F9FC] hover:bg-[#EAF3FF] text-[#1769E0] border border-[#CBD5E1] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Query /api/index API</span>
                        </button>
                      )}
                    </div>

                    <span className="text-[11px] text-[#627D98] font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#1769E0]" />
                      Refreshed {new Date(apiTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: CORRIDOR WEIGHTS */}
              {apiIndexTab === 'corridors' && (
                <div className="pt-5 space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#0B1F3A]">Top Weighted Sectors in the Index</h3>
                      <p className="text-xs text-[#627D98]">
                        The APIx basket is volume-weighted based on DGCA domestic passenger share.
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('routes')}
                      className="text-xs font-bold text-[#1769E0] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore all 48 corridors</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {apiIndexResponse.top_weighted_corridors.map((c) => (
                      <div
                        key={c.route}
                        onClick={() => {
                          onSelectRoute(c.route);
                          onNavigate('routes');
                        }}
                        className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E2E8F0] hover:border-[#1769E0] hover:bg-[#F0F7FF] cursor-pointer transition-all group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-black text-sm text-[#0B1F3A] group-hover:text-[#1769E0] transition-colors">
                            {c.route}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAF3FF] text-[#1769E0]">
                            {c.weight_pct}% weight
                          </span>
                        </div>
                        <div className="text-xs text-[#486581] mb-2">
                          {c.origin} ⇄ {c.destination}
                        </div>
                        <div className="flex items-baseline justify-between pt-2 border-t border-[#E2E8F0]/70">
                          <span className="font-mono font-bold text-sm text-[#0B1F3A]">
                            ₹{c.fare_inr.toLocaleString('en-IN')}
                          </span>
                          <span
                            className={`text-xs font-mono font-bold ${
                              c.change_pct > 30
                                ? 'text-rose-600'
                                : c.change_pct > 10
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            +{c.change_pct}% YoY
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Sector Divergence Notice:</span> BLR-HYD is exhibiting +97.5% fare escalation due to sudden weekend convention demand, contributing 1.2 pts directly to this morning's API Index reading.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Ticker Strip */}
          <div className="mt-12 pt-6 border-t border-[#E2E8F0]/70">
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 text-xs font-bold uppercase tracking-wider text-[#627D98]">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="flex items-center gap-1.5 text-[#0B1F3A]">
                  <Activity className="w-3.5 h-3.5 text-[#1769E0]" />
                  <span>Live Corridor Ticker</span>
                </span>
                <a
                  href="#cpi-index-section"
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF3FF] hover:bg-[#D8EAFF] text-[#1769E0] text-[11px] font-mono font-bold border border-[#1769E0]/20 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <Landmark className="w-3 h-3 text-[#1769E0]" />
                  <span>MoSPI CPI Sub-Index: 122.3 (+8.2% YoY)</span>
                </a>
              </div>
              <span className="text-[#10B981] flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Active Feed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {ROUTES_DATA.slice(0, 6).map((route) => (
                <div
                  key={route.id}
                  onClick={() => {
                    onSelectRoute(route.id);
                    onNavigate('routes');
                  }}
                  className="bg-white rounded-xl p-3 border border-[#E2E8F0] shadow-2xs hover:border-[#1769E0] hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#0B1F3A] group-hover:text-[#1769E0] transition-colors">
                      {route.originCode} → {route.destinationCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        route.status === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : route.status === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      +{route.changePercent}%
                    </span>
                  </div>
                  <div className="font-mono font-bold text-sm text-[#102A43]">
                    ₹{route.currentFare.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#627D98] truncate">
                    Normal ₹{route.normalFare.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE ROUTE FARE QUICK-CHECKER */}
      <section className="py-12 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0B1F3A] via-[#102A43] to-[#1769E0] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            {/* Background vector glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#1769E0]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/10 text-[#93C5FD] border border-white/15 tracking-wider">
                    Instant Flight Sector Scanner
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold mt-2">
                    Check Real-Time Fares & Best Booking Window
                  </h2>
                  <p className="text-xs sm:text-sm text-[#CBD5E1] mt-1">
                    Select any origin and destination to see current spot rates, surge status, and potential savings.
                  </p>
                </div>
                <button
                  onClick={onOpenAlertModal}
                  className="self-start md:self-auto px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-300" />
                  <span>Set Fare Alert</span>
                </button>
              </div>

              {/* Selector Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 mb-6">
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#93C5FD]">
                    Origin City (Departing From)
                  </label>
                  <select
                    value={quickOrigin}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    className="w-full bg-white text-[#0B1F3A] font-bold text-sm px-3.5 py-2.5 rounded-xl border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-[#93C5FD] cursor-pointer"
                  >
                    {origins.map((code) => (
                      <option key={code} value={code}>
                        {AIRPORT_COORDINATES[code]?.name || code} ({code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-center justify-center pt-4 sm:pt-6">
                  <div className="p-2 rounded-full bg-white/20 text-white">
                    <Plane className="w-4 h-4" />
                  </div>
                </div>

                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#93C5FD]">
                    Destination City (Arriving At)
                  </label>
                  <select
                    value={quickDestination}
                    onChange={(e) => setQuickDestination(e.target.value)}
                    className="w-full bg-white text-[#0B1F3A] font-bold text-sm px-3.5 py-2.5 rounded-xl border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-[#93C5FD] cursor-pointer"
                  >
                    {availableDestinations.map((code) => (
                      <option key={code} value={code}>
                        {AIRPORT_COORDINATES[code]?.name || code} ({code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Preview Result Box */}
              {selectedRouteMatch && (
                <div className="bg-white text-[#0B1F3A] rounded-2xl p-5 border border-white/20 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-[#0B1F3A]">
                          {selectedRouteMatch.originCity} ({selectedRouteMatch.originCode}) →{' '}
                          {selectedRouteMatch.destinationCity} ({selectedRouteMatch.destinationCode})
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            selectedRouteMatch.status === 'critical'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : selectedRouteMatch.status === 'warning'
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {selectedRouteMatch.status === 'critical'
                            ? '🚨 Severe Fare Shock'
                            : selectedRouteMatch.status === 'warning'
                            ? '⚠️ Moderate Surge'
                            : '🟢 Stable Pricing'}
                        </span>
                      </div>
                      <p className="text-xs text-[#627D98] mt-1">
                        {selectedRouteMatch.reason || 'Normal demand corridor distribution.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[11px] text-[#627D98] block">Live Spot Fare</span>
                        <span className="font-mono font-black text-2xl text-[#0B1F3A]">
                          ₹{selectedRouteMatch.currentFare.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Quick Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                    <div className="p-3.5 rounded-xl bg-[#F6F9FC] border border-[#E2E8F0]">
                      <span className="text-[11px] text-[#627D98] block font-semibold">
                        Prime Booking Window (Sweet Spot)
                      </span>
                      <span className="text-base font-bold text-[#1769E0] block mt-0.5">
                        {selectedRouteMatch.bestBookingWindowDays}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        Save up to ₹{selectedRouteMatch.potentialSavings.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F6F9FC] border border-[#E2E8F0]">
                      <span className="text-[11px] text-[#627D98] block font-semibold">
                        Price Velocity (30D Change)
                      </span>
                      <span
                        className={`text-base font-mono font-bold block mt-0.5 ${
                          selectedRouteMatch.changePercent > 30
                            ? 'text-red-600'
                            : selectedRouteMatch.changePercent > 10
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        +{selectedRouteMatch.changePercent}%
                      </span>
                      <span className="text-[10px] text-[#627D98]">
                        Baseline: ₹{selectedRouteMatch.normalFare.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F6F9FC] border border-[#E2E8F0]">
                      <span className="text-[11px] text-[#627D98] block font-semibold">
                        Reliability & Sample Depth
                      </span>
                      <span className="text-base font-bold text-[#0B1F3A] block mt-0.5">
                        {selectedRouteMatch.reliabilityScore}/100 Data Reliability
                      </span>
                      <span className="text-[10px] text-[#627D98]">
                        {selectedRouteMatch.dailyFlights} daily scheduled seats
                      </span>
                    </div>
                  </div>

                  {/* Carrier Breakdown Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[#627D98] font-medium">Airlines on sector:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedRouteMatch.carriers.map((c) => (
                          <span
                            key={c.airline}
                            className="px-2 py-0.5 rounded bg-[#EAF3FF] text-[#1769E0] font-bold text-[11px]"
                          >
                            {c.airline}: ₹{c.fare.toLocaleString('en-IN')}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleLaunchRouteExplorer}
                      className="text-xs font-bold text-[#1769E0] hover:text-[#1253B3] flex items-center gap-1 group cursor-pointer"
                    >
                      <span>Open Full Corridor Analytics</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. NATIONAL CPI AIRFARE SUB-INDEX & MACRO INFLATION NOWCAST */}
      <section id="cpi-index-section" className="py-16 bg-[#F8FAFD] border-b border-[#E2E8F0] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF3FF] border border-[#1769E0]/20 text-[#1769E0] text-xs font-bold font-mono">
                <Landmark className="w-3.5 h-3.5" />
                <span>MoSPI CPI Air Transport Sub-Index · Base Year 2012 = 100.0</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
                National CPI Airfare Sub-Index & Inflation Nowcast
              </h2>
              <p className="text-sm text-[#486581] leading-relaxed">
                High-frequency passenger transport deflation and price acceleration index tracking India’s aviation sector across 12,480+ daily flights. Eliminates official MoSPI 15-day reporting lag for proactive monetary policy and economic planning.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownloadCpiData}
                className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F6F9FC] text-[#0B1F3A] font-bold text-xs shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#1769E0]" />
                <span>Download MoSPI CSV</span>
              </button>
              <button
                onClick={() => onNavigate('inflation')}
                className="px-4 py-2.5 rounded-xl bg-[#1769E0] hover:bg-[#1253B3] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <PieChart className="w-4 h-4" />
                <span>Full Econometric Model</span>
              </button>
            </div>
          </div>

          {/* 4 Key CPI Indicators Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Metric 1 */}
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-2xs space-y-2 hover:border-[#1769E0]/40 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#627D98] uppercase tracking-wider text-[11px]">
                  CPI Airfare Sub-Index
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#1769E0] font-bold text-[11px] font-mono">
                  +8.2% YoY
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#0B1F3A]">
                  122.3
                </span>
                <span className="text-xs font-semibold text-[#627D98]">
                  Base 100.0
                </span>
              </div>
              <p className="text-[11px] text-[#486581]">
                Accelerated by <strong>+180 bps</strong> over previous quarterly reading (113.0).
              </p>
            </div>

            {/* Metric 2 */}
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-2xs space-y-2 hover:border-[#1769E0]/40 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#627D98] uppercase tracking-wider text-[11px]">
                  CPI Headline Weight
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] font-mono">
                  ~7 bps Pass-Through
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#0B1F3A]">
                  0.87%
                </span>
                <span className="text-xs font-semibold text-[#627D98]">
                  National Basket
                </span>
              </div>
              <p className="text-[11px] text-[#486581]">
                Evaluated by RBI MPC for second-round core services inflation pressure.
              </p>
            </div>

            {/* Metric 3 */}
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-2xs space-y-2 hover:border-[#1769E0]/40 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#627D98] uppercase tracking-wider text-[11px]">
                  Reporting Lead Time
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[11px] font-mono">
                  Zero Delay
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#0B1F3A]">
                  14 Days
                </span>
                <span className="text-xs font-semibold text-[#627D98]">
                  Ahead of MoSPI
                </span>
              </div>
              <p className="text-[11px] text-[#486581]">
                Real-time daily nowcasts replace the 15-day delayed official monthly publication.
              </p>
            </div>

            {/* Metric 4 */}
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-2xs space-y-2 hover:border-[#1769E0]/40 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#627D98] uppercase tracking-wider text-[11px]">
                  Average Fare Drift
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[11px] font-mono">
                  +23.6% Drift
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#0B1F3A]">
                  +₹1,000
                </span>
                <span className="text-xs font-semibold text-[#627D98]">
                  Per Ticket
                </span>
              </div>
              <p className="text-[11px] text-[#486581]">
                National volume-weighted ticket is currently ₹5,240 vs ₹4,240 normal benchmark.
              </p>
            </div>
          </div>

          {/* Main Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive CPI Trajectory & Shapley Decomposition (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Timeframe Explorer & Trajectory */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#1769E0]" />
                      <span>CPI Index Trajectory & Historical Drift</span>
                    </h3>
                    <p className="text-xs text-[#627D98] mt-0.5">
                      Tracking index movements against the 100.0 baseline across domestic sectors.
                    </p>
                  </div>

                  {/* Timeframe Tabs */}
                  <div className="inline-flex p-1 rounded-xl bg-[#F0F4F8] border border-[#CBD5E1]/70 self-start sm:self-auto">
                    {(['7D', '30D', '90D', '1Y'] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setCpiTimeframe(period)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          cpiTimeframe === period
                            ? 'bg-[#1769E0] text-white shadow-2xs'
                            : 'text-[#627D98] hover:text-[#0B1F3A]'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trajectory Visualizer */}
                <div className="bg-[#F8FAFD] rounded-xl p-4 border border-[#E2E8F0]">
                  <div className="flex items-center justify-between text-xs text-[#627D98] mb-3 pb-2 border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 font-bold text-[#0B1F3A]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1769E0]" />
                        APIx CPI: {SYSTEM_METRICS.apixCurrent}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-[#627D98]">
                        <span className="w-2.5 h-0.5 bg-[#94A3B8]" />
                        MoSPI Base: 100.0
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#1769E0]">
                      {HISTORICAL_TREND_DATA[cpiTimeframe]?.[0]?.date} → {HISTORICAL_TREND_DATA[cpiTimeframe]?.slice(-1)[0]?.date}
                    </span>
                  </div>

                  {/* SVG Line Chart */}
                  <div className="h-44 w-full relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="#E2E8F0" strokeDasharray="3 3" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="#E2E8F0" strokeDasharray="3 3" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="#E2E8F0" strokeDasharray="3 3" />

                      {/* 100.0 Base Reference line */}
                      <line x1="0" y1="135" x2="500" y2="135" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />
                      <text x="5" y="130" fill="#94A3B8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        Base 100.0
                      </text>

                      {/* Area Fill */}
                      <defs>
                        <linearGradient id="cpiGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1769E0" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#1769E0" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Polyline Path */}
                      {(() => {
                        const data = HISTORICAL_TREND_DATA[cpiTimeframe] || HISTORICAL_TREND_DATA['30D'];
                        const count = data.length;
                        const min = 98;
                        const max = 126;
                        const points = data.map((d, i) => {
                          const x = (i / (count - 1)) * 480 + 10;
                          const y = 145 - ((d.current - min) / (max - min)) * 125;
                          return `${x},${y}`;
                        });
                        const areaPoints = `${points[0].split(',')[0]},145 ${points.join(' ')} ${points[points.length - 1].split(',')[0]},145`;

                        return (
                          <>
                            <polygon points={areaPoints} fill="url(#cpiGradient)" />
                            <polyline
                              fill="none"
                              stroke="#1769E0"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={points.join(' ')}
                            />
                            {data.map((d, i) => {
                              const x = (i / (count - 1)) * 480 + 10;
                              const y = 145 - ((d.current - min) / (max - min)) * 125;
                              const isLast = i === count - 1;
                              return (
                                <g key={i}>
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r={isLast ? '5' : '3.5'}
                                    fill={isLast ? '#1769E0' : '#FFFFFF'}
                                    stroke="#1769E0"
                                    strokeWidth="2"
                                  />
                                  <text
                                    x={x}
                                    y={y - 8}
                                    textAnchor="middle"
                                    fill="#0B1F3A"
                                    fontSize={isLast ? '10' : '8'}
                                    fontWeight="bold"
                                    fontFamily="monospace"
                                  >
                                    {d.current}
                                  </text>
                                  <text
                                    x={x}
                                    y={155}
                                    textAnchor="middle"
                                    fill="#627D98"
                                    fontSize="8"
                                    fontWeight="medium"
                                  >
                                    {d.date}
                                  </text>
                                </g>
                              );
                            })}
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Benchmark Indicators comparison bar */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#E2E8F0] text-center text-xs">
                    <div className="p-2 rounded-lg bg-white border border-[#E2E8F0]">
                      <span className="text-[10px] text-[#627D98] block">AirPrice APIx (Daily)</span>
                      <span className="font-mono font-black text-sm text-[#1769E0]">122.3</span>
                      <span className="text-[9px] text-emerald-600 block font-bold">Real-time Nowcast</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-[#E2E8F0]">
                      <span className="text-[10px] text-[#627D98] block">MoSPI Monthly (Lagged)</span>
                      <span className="font-mono font-black text-sm text-[#0B1F3A]">118.6</span>
                      <span className="text-[9px] text-[#627D98] block font-medium">14-Day Reporting Gap</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-[#E2E8F0]">
                      <span className="text-[10px] text-[#627D98] block">WPI Jet Fuel (ATF)</span>
                      <span className="font-mono font-black text-sm text-[#0B1F3A]">115.2</span>
                      <span className="text-[9px] text-amber-600 block font-medium">Refinery Pass-Through</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Econometric Shapley Decomposition */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-[#1769E0]" />
                      <span>Why is the CPI Sub-Index at 122.3? (Factor Breakdown)</span>
                    </h3>
                    <p className="text-xs text-[#627D98]">
                      Shapley econometric attribution decomposing the +₹1,000 aggregate ticket hike.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#EAF3FF] text-[#1769E0] font-mono text-xs font-bold border border-[#1769E0]/20 self-start sm:self-auto">
                    +₹1,000 / Ticket
                  </span>
                </div>

                {/* Stacked Progress Bar */}
                <div className="w-full h-8 rounded-xl overflow-hidden flex shadow-2xs border border-[#CBD5E1]">
                  {INFLATION_FACTORS.map((f) => (
                    <div
                      key={f.category}
                      onClick={() => setActiveCpiFactor(activeCpiFactor === f.category ? null : f.category)}
                      className={`h-full flex items-center justify-center text-[11px] font-bold text-white transition-all cursor-pointer hover:brightness-110 ${
                        activeCpiFactor === f.category ? 'ring-2 ring-white ring-inset brightness-110' : ''
                      }`}
                      style={{
                        width: `${f.percentage}%`,
                        backgroundColor: f.color,
                      }}
                      title={`${f.category}: ₹${f.amount} (${f.percentage}%)`}
                    >
                      {f.percentage >= 15 ? `${f.percentage}%` : ''}
                    </div>
                  ))}
                </div>

                {/* Interactive Factor Buttons & Notes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {INFLATION_FACTORS.map((f) => {
                    const isSelected = activeCpiFactor === f.category;
                    return (
                      <button
                        key={f.category}
                        onClick={() => setActiveCpiFactor(isSelected ? null : f.category)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#EAF3FF] border-[#1769E0] shadow-2xs'
                            : 'bg-[#F8FAFD] border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: f.color }}
                          />
                          <span className="font-mono text-xs font-black text-[#0B1F3A]">
                            {f.percentage}%
                          </span>
                        </div>
                        <div className="font-bold text-[11px] text-[#102A43] truncate leading-tight">
                          {f.category}
                        </div>
                        <div className="text-[10px] text-[#627D98] font-mono mt-0.5">
                          +₹{f.amount}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Factor Explainer Callout */}
                {activeCpiFactor ? (
                  <div className="p-3.5 rounded-xl bg-[#EAF3FF] border border-[#1769E0]/30 text-xs space-y-1 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between font-bold text-[#1769E0]">
                      <span>{activeCpiFactor}</span>
                      <span>
                        ₹{INFLATION_FACTORS.find((f) => f.category === activeCpiFactor)?.amount} (
                        {INFLATION_FACTORS.find((f) => f.category === activeCpiFactor)?.percentage}% of total hike)
                      </span>
                    </div>
                    <p className="text-[#486581]">
                      {INFLATION_FACTORS.find((f) => f.category === activeCpiFactor)?.description}
                    </p>
                  </div>
                ) : (
                  <div className="text-[11px] text-[#627D98] flex items-center gap-1.5 italic">
                    <Info className="w-3.5 h-3.5 text-[#1769E0]" />
                    <span>Click any factor above to view econometric drivers and policy implications.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Top Route Contributors & MoSPI Policy Note (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card 3: Top Corridor Drivers */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <div>
                    <h3 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#1769E0]" />
                      <span>Top Corridor Drivers of CPI Drift</span>
                    </h3>
                    <p className="text-xs text-[#627D98] mt-0.5">
                      Routes generating the highest weight in national price inflation.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#627D98] uppercase">
                    CPI Impact
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'DEL-BOM',
                      label: 'DEL ⇄ BOM',
                      cityPair: 'Delhi - Mumbai',
                      fare: 5240,
                      change: 13.4,
                      cpiContribution: 2.4,
                      seats: '2,840 daily seats',
                      status: 'warning',
                    },
                    {
                      id: 'BLR-HYD',
                      label: 'BLR ⇄ HYD',
                      cityPair: 'Bengaluru - Hyderabad',
                      fare: 7900,
                      change: 97.5,
                      cpiContribution: 1.8,
                      seats: '1,420 daily seats',
                      status: 'critical',
                    },
                    {
                      id: 'BOM-BLR',
                      label: 'BOM ⇄ BLR',
                      cityPair: 'Mumbai - Bengaluru',
                      fare: 4450,
                      change: 6.5,
                      cpiContribution: 1.2,
                      seats: '2,100 daily seats',
                      status: 'normal',
                    },
                    {
                      id: 'DEL-CCU',
                      label: 'DEL ⇄ CCU',
                      cityPair: 'Delhi - Kolkata',
                      fare: 5600,
                      change: 8.7,
                      cpiContribution: 0.9,
                      seats: '1,850 daily seats',
                      status: 'normal',
                    },
                    {
                      id: 'IXB-GAU',
                      label: 'IXB ⇄ GAU',
                      cityPair: 'Bagdogra - Guwahati',
                      fare: 4850,
                      change: 56.4,
                      cpiContribution: 0.6,
                      seats: '540 daily seats',
                      status: 'critical',
                    },
                  ].map((route) => (
                    <div
                      key={route.id}
                      onClick={() => {
                        onSelectRoute(route.id);
                        onNavigate('routes');
                      }}
                      className="p-3 rounded-xl border border-[#E2E8F0] hover:border-[#1769E0] hover:shadow-xs transition-all cursor-pointer group bg-[#FAFCFF] hover:bg-white"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#0B1F3A] group-hover:text-[#1769E0] transition-colors">
                            {route.label}
                          </span>
                          <span className="text-[11px] text-[#627D98] hidden sm:inline">
                            ({route.cityPair})
                          </span>
                        </div>
                        <span className="font-mono text-xs font-extrabold text-[#1769E0] bg-[#EAF3FF] px-2 py-0.5 rounded">
                          +{route.cpiContribution}% CPI
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#486581]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#0B1F3A]">
                            ₹{route.fare.toLocaleString('en-IN')}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              route.status === 'critical'
                                ? 'bg-red-100 text-red-700'
                                : route.status === 'warning'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            +{route.change}% YoY
                          </span>
                        </div>
                        <span className="text-[10px] text-[#627D98] flex items-center gap-1 group-hover:text-[#1769E0]">
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 4: MoSPI Policy Briefing Card */}
              <div className="bg-[#0B1F3A] text-white rounded-2xl p-6 border border-white/10 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-[#93C5FD]">
                  <Landmark className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-wider">
                    MoSPI & RBI Policy Briefing
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-[#CBD5E1]">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="font-bold text-white block">
                      1. Second-Round Inflation Dynamics
                    </span>
                    <p className="text-[11px] text-[#9FB3C8]">
                      Air transport accounts for 0.87% of CPI. Current spikes on key business links contribute approximately <strong>+7 bps</strong> to headline core inflation pressure.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="font-bold text-white block">
                      2. Capacity Deficit on Metro Corridors
                    </span>
                    <p className="text-[11px] text-[#9FB3C8]">
                      DGCA recommended peak slot interventions on DEL-BOM and BLR-HYD to temper dynamic surge multipliers.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                  <span className="text-[#9FB3C8] text-[11px]">Format: MoSPI CSV / API JSON</span>
                  <button
                    onClick={handleDownloadCpiData}
                    className="font-bold text-white hover:text-[#93C5FD] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Full Dataset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DUAL-AUDIENCE ARCHITECTURE (Citizen vs Policy Spotlight) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1769E0] bg-[#EAF3FF] px-3 py-1 rounded-full border border-[#1769E0]/20">
            One Engine · Two Purpose-Built Experiences
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] mt-3">
            Tailored for Everyday Citizens & Government Regulators
          </h2>
          <p className="text-sm text-[#486581] mt-2">
            Airfare transparency requires distinct tools: practical booking advice for passengers, and rigorous econometric data for policy formulation.
          </p>

          {/* Toggle Button */}
          <div className="inline-flex p-1 rounded-xl bg-[#E2E8F0] mt-6 border border-[#CBD5E1]">
            <button
              onClick={() => {
                setActiveAudienceTab('citizen');
                onToggleUserMode('citizen');
              }}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeAudienceTab === 'citizen'
                  ? 'bg-white text-[#1769E0] shadow-xs'
                  : 'text-[#627D98] hover:text-[#0B1F3A]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>For Citizens & Travelers</span>
            </button>
            <button
              onClick={() => {
                setActiveAudienceTab('policy');
                onToggleUserMode('policy');
              }}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeAudienceTab === 'policy'
                  ? 'bg-[#0B1F3A] text-white shadow-xs'
                  : 'text-[#627D98] hover:text-[#0B1F3A]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>For MoSPI, RBI & DGCA</span>
            </button>
          </div>
        </div>

        {/* Dynamic Audience View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {activeAudienceTab === 'citizen' ? (
            <>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  <span>🇮🇳 आम नागरिक व यात्री अनुभव</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0B1F3A]">
                  Smart Flight Booking Without the Guesswork
                </h3>
                <p className="text-sm text-[#486581] leading-relaxed">
                  Never get blindsided by festival price surges or fake discount banners. AirPrice APIx analyzes airline algorithms to tell you exactly when to book and when to wait.
                </p>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F3A]">
                        “Kab Book Karein?” Sweet-Spot Indicator
                      </h4>
                      <p className="text-xs text-[#627D98] mt-0.5">
                        Pinpoints the exact 28 to 32-day window where ticket prices are lowest before emergency corporate surges kick in.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F3A]">
                        Real-Time Fare Shock Alerts
                      </h4>
                      <p className="text-xs text-[#627D98] mt-0.5">
                        Know immediately if a route (like Bengaluru to Hyderabad) is experiencing an abnormal 50%+ spike so you can choose alternative dates or transit routes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F3A]">
                        WhatsApp & Email Price Drop Triggers
                      </h4>
                      <p className="text-xs text-[#627D98] mt-0.5">
                        Set custom price ceiling triggers and receive instantaneous notifications the moment airlines drop seat rates on your selected sector.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      onToggleUserMode('citizen');
                      onNavigate('when-to-book');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#1769E0] hover:bg-[#1253B3] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Check When To Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onOpenAlertModal}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F6F9FC] text-[#0B1F3A] font-bold text-xs border border-[#E2E8F0] shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>Create Fare Alert</span>
                  </button>
                </div>
              </div>

              {/* Citizen Mockup Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="font-bold text-sm text-[#0B1F3A]">Citizen Advice Snapshot</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1769E0]">DEL ✈️ BOM</span>
                </div>

                <div className="my-5 p-4 rounded-2xl bg-[#EAF3FF]/60 border border-[#1769E0]/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1769E0]">Optimal Booking Status</span>
                    <span className="text-emerald-700 font-extrabold">BUY NOW (SWEET SPOT)</span>
                  </div>
                  <div className="font-mono text-2xl font-black text-[#0B1F3A]">
                    ₹3,240 <span className="text-xs font-normal text-[#627D98] line-through">₹5,240</span>
                  </div>
                  <p className="text-xs text-[#486581]">
                    You are 29 days out from departure. Booking today secures a <strong>₹2,000 (38%) saving</strong> before prices surge in the final 14 days.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-[#F6F9FC]">
                    <span className="text-[#627D98]">IndiGo 6E-204</span>
                    <span className="font-mono font-bold">₹3,240 (89% OTP)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#F6F9FC]">
                    <span className="text-[#627D98]">Akasa Air QP-1120</span>
                    <span className="font-mono font-bold">₹3,390 (92% OTP)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#F6F9FC]">
                    <span className="text-[#627D98]">Air India AI-805</span>
                    <span className="font-mono font-bold">₹3,850 (84% OTP)</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1F3A] text-[#93C5FD] text-xs font-bold">
                  <span>🏛️ Policy, Regulatory & Central Bank Oversight</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0B1F3A]">
                  Econometric Price Tracking & Surge Diagnostics
                </h3>
                <p className="text-sm text-[#486581] leading-relaxed">
                  Engineered to assist the Ministry of Statistics & Programme Implementation (MoSPI), RBI Monetary Policy Committee, and DGCA with high-frequency transportation deflators.
                </p>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <CheckCircle2 className="w-5 h-5 text-[#1769E0] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F3A]">
                        High-Frequency CPI Airfare Deflator
                      </h4>
                      <p className="text-xs text-[#627D98] mt-0.5">
                        Tracks national airfare inflation daily (APIx Index: 122.3, +8.2% YoY) to feed early nowcasting models before monthly official CPI publication.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <CheckCircle2 className="w-5 h-5 text-[#1769E0] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F3A]">
                        Shapley Econometric Attribution
                      </h4>
                      <p className="text-xs text-[#627D98] mt-0.5">
                        Decomposes fare movements into verified variables: 40% Demand Surge, 25% Festival Factor, 15% Booking Window Compression, 10% ATF Fuel Pass-Through.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <CheckCircle2 className="w-5 h-5 text-[#1769E0] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F3A]">
                        Automated DGCA Surge Inquiries (Z-score &gt; 2.5σ)
                      </h4>
                      <p className="text-xs text-[#627D98] mt-0.5">
                        Instantly flags artificial capacity holding or corridor monopoly pricing, generating one-click regulatory briefing memos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      onToggleUserMode('policy');
                      onNavigate('inflation');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#102A43] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Open Inflation Intelligence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('api')}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F6F9FC] text-[#0B1F3A] font-bold text-xs border border-[#E2E8F0] shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#1769E0]" />
                    <span>Download MoSPI CSV</span>
                  </button>
                </div>
              </div>

              {/* Policy Mockup Card */}
              <div className="bg-[#0B1F3A] text-white rounded-3xl p-6 border border-[#1769E0]/40 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#93C5FD]" />
                    <span className="font-bold text-sm">Policy Econometric Telemetry</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">DGCA COMPLIANT</span>
                </div>

                <div className="my-5 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-[10px] text-[#9FB3C8] block uppercase">National APIx</span>
                    <span className="font-mono text-2xl font-black text-white">122.3</span>
                    <span className="text-[10px] text-amber-300 font-bold block mt-0.5">+8.2% YoY Inflation</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-[10px] text-[#9FB3C8] block uppercase">ATF Pass-Through</span>
                    <span className="font-mono text-2xl font-black text-white">0.42</span>
                    <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">High Elasticity</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[#CBD5E1]">Demand Surge (PLF &gt; 87%)</span>
                    <span className="font-mono font-bold text-amber-300">40% Attribution</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[#CBD5E1]">Festival Seasonal Peak</span>
                    <span className="font-mono font-bold text-blue-300">25% Attribution</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[#CBD5E1]">Fleet / Engine Grounding</span>
                    <span className="font-mono font-bold text-purple-300">10% Attribution</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. PLATFORM PILLARS (Clean Bento Grid) */}
      <section className="py-16 bg-white border-t border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1769E0] bg-[#EAF3FF] px-3 py-1 rounded-full border border-[#1769E0]/20">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B1F3A] mt-3">
              Built on 6 High-Performance Intelligence Modules
            </h2>
            <p className="text-xs sm:text-sm text-[#486581] mt-2">
              Every tool in AirPrice APIx operates with end-to-end data integrity, transparent formulas, and sub-minute ingestion updates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Pillar 1 */}
            <div
              onClick={() => onNavigate('overview')}
              className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#FAFCFF] hover:bg-white hover:border-[#1769E0]/50 hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#1769E0] flex items-center justify-center group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0B1F3A] group-hover:text-[#1769E0] transition-colors">
                Real-Time APIx Index
              </h3>
              <p className="text-xs text-[#627D98] leading-relaxed">
                National composite benchmark tracking domestic airfares across 500+ sectors with 7-day, 30-day, and 1-year historical trends.
              </p>
              <span className="text-xs font-bold text-[#1769E0] flex items-center gap-1 pt-1">
                <span>View Live Heatmap</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Pillar 2 */}
            <div
              onClick={() => onNavigate('when-to-book')}
              className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#FAFCFF] hover:bg-white hover:border-[#1769E0]/50 hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0B1F3A] group-hover:text-[#1769E0] transition-colors">
                Kab Book Karein? (Timing Engine)
              </h3>
              <p className="text-xs text-[#627D98] leading-relaxed">
                Empirical advance booking curve demonstrating why 28–32 days before flight departure saves up to 38% on average fares.
              </p>
              <span className="text-xs font-bold text-[#1769E0] flex items-center gap-1 pt-1">
                <span>Simulate Booking Window</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Pillar 3 */}
            <div
              onClick={() => onNavigate('shocks')}
              className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#FAFCFF] hover:bg-white hover:border-[#1769E0]/50 hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0B1F3A] group-hover:text-[#1769E0] transition-colors">
                Fare Shock Early Warning
              </h3>
              <p className="text-xs text-[#627D98] leading-relaxed">
                Automated anomaly engine detecting corridor price spikes exceeding 2.5 standard deviations (Z-score &gt; 2.5σ) in real time.
              </p>
              <span className="text-xs font-bold text-[#1769E0] flex items-center gap-1 pt-1">
                <span>Inspect Active Fare Shocks</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Pillar 4 */}
            <div
              onClick={() => onNavigate('forecast')}
              className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#FAFCFF] hover:bg-white hover:border-[#1769E0]/50 hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#1769E0] flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0B1F3A] group-hover:text-[#1769E0] transition-colors">
                AI Fare Price Forecasting
              </h3>
              <p className="text-xs text-[#627D98] leading-relaxed">
                Probabilistic price trajectories with 90% confidence bands, modeling festival compression and seat load factor shifts.
              </p>
              <span className="text-xs font-bold text-[#1769E0] flex items-center gap-1 pt-1">
                <span>View 30-Day Projections</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Pillar 5 */}
            <div
              onClick={() => onNavigate('inflation')}
              className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#FAFCFF] hover:bg-white hover:border-[#1769E0]/50 hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0B1F3A] group-hover:text-[#1769E0] transition-colors">
                MoSPI Inflation Intelligence
              </h3>
              <p className="text-xs text-[#627D98] leading-relaxed">
                Transparent Shapley attribution breaking down price increases across Fuel (ATF), Demand, Festivals, and Fleet Constraints.
              </p>
              <span className="text-xs font-bold text-[#1769E0] flex items-center gap-1 pt-1">
                <span>Decompose Airfare Inflation</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Pillar 6 */}
            <div
              onClick={() => onNavigate('reliability')}
              className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#FAFCFF] hover:bg-white hover:border-[#1769E0]/50 hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0B1F3A] group-hover:text-[#1769E0] transition-colors">
                Data Reliability
              </h3>
              <p className="text-xs text-[#627D98] leading-relaxed">
                Multi-agent validation filtering out phantom OTA rates, verifying sample depth across 5 independent airline and GDS feeds.
              </p>
              <span className="text-xs font-bold text-[#1769E0] flex items-center gap-1 pt-1">
                <span>Check Corridor Reliability Scores</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NATIONAL AVIATION METRICS BANNER */}
      <section className="py-12 bg-[#0B1F3A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="col-span-2 sm:col-span-1">
              <div className="font-mono text-3xl sm:text-4xl font-black text-[#93C5FD]">122.3</div>
              <div className="text-xs text-[#9FB3C8] mt-1 font-semibold uppercase tracking-wider">
                CPI Airfare Sub-Index (+8.2% YoY)
              </div>
            </div>

            <div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-white">12,480+</div>
              <div className="text-xs text-[#9FB3C8] mt-1 font-semibold uppercase tracking-wider">
                Daily Domestic Flights Audited
              </div>
            </div>

            <div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-emerald-400">94.2%</div>
              <div className="text-xs text-[#9FB3C8] mt-1 font-semibold uppercase tracking-wider">
                Cross-Source Consensus Score
              </div>
            </div>

            <div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-[#93C5FD]">500+</div>
              <div className="text-xs text-[#9FB3C8] mt-1 font-semibold uppercase tracking-wider">
                Tier-1 & Regional Sectors
              </div>
            </div>

            <div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-amber-300">₹4.2 Cr</div>
              <div className="text-xs text-[#9FB3C8] mt-1 font-semibold uppercase tracking-wider">
                Citizen Booking Savings Realized
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE FAQ SECTION */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1769E0] bg-[#EAF3FF] px-3 py-1 rounded-full border border-[#1769E0]/20">
            Clear Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mt-3">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#486581] mt-1.5">
            Transparent explanations of methodology, regulatory compliance, and practical consumer usage.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#0B1F3A] hover:text-[#1769E0] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#1769E0] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#627D98] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#627D98] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#486581] leading-relaxed border-t border-[#E2E8F0]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. HIGH-IMPACT FINAL CTA */}
      <section className="py-16 bg-gradient-to-r from-[#0B1F3A] via-[#102A43] to-[#1769E0] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase bg-white/10 text-[#93C5FD] border border-white/20">
            Open Access · Public Good
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Explore India’s Real-Time Airfare Intelligence?
          </h2>
          <p className="text-sm sm:text-base text-[#CBD5E1] max-w-xl mx-auto">
            Access live heatmaps, AI forecast trajectories, fare shock inquiries, and econometric inflation data without a paywall.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('overview')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-[#F0F7FF] text-[#0B1F3A] font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#1769E0]" />
            </button>
            <button
              onClick={() => onNavigate('when-to-book')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#1769E0] hover:bg-[#1253B3] text-white font-bold text-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Kab Book Karein?</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-[#08182B] text-[#9FB3C8] text-xs py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-black text-base">
                <Plane className="w-5 h-5 text-[#1769E0]" />
                <span>AirPrice APIx</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#627D98]">
                India’s real-time airfare price index and econometric inflation platform. Built for Indian citizens, travelers, and regulatory bodies (MoSPI, DGCA, RBI).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                For Citizens & Travelers
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button onClick={() => onNavigate('when-to-book')} className="hover:text-white transition-colors cursor-pointer">
                    Kab Book Karein? (Sweet Spot)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('routes')} className="hover:text-white transition-colors cursor-pointer">
                    Corridor Price Matrix
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('forecast')} className="hover:text-white transition-colors cursor-pointer">
                    30-Day Fare Forecast
                  </button>
                </li>
                <li>
                  <button onClick={onOpenAlertModal} className="hover:text-white transition-colors cursor-pointer">
                    Set WhatsApp Fare Alert
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                For MoSPI, RBI & DGCA
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button onClick={() => onNavigate('overview')} className="hover:text-white transition-colors cursor-pointer">
                    National Airfare Index (APIx)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('shocks')} className="hover:text-white transition-colors cursor-pointer">
                    Fare Shock Inquiries (Z &gt; 2.5σ)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('inflation')} className="hover:text-white transition-colors cursor-pointer">
                    Econometric Shapley Decomposition
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('api')} className="hover:text-white transition-colors cursor-pointer">
                    MoSPI-Compliant Datasets (CSV/API)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                System & Methodology
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button onClick={() => onNavigate('reliability')} className="hover:text-white transition-colors cursor-pointer">
                    Data Reliability (94.2% Score)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('health')} className="hover:text-white transition-colors cursor-pointer">
                    Crawler Pipeline & Ingestion Health
                  </button>
                </li>
                <li className="text-[#627D98] pt-1">
                  Calibrated to 2012 Base Year (100.0)
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#627D98]">
            <div>
              © 2026 AirPrice APIx. Dedicated to fair pricing and transparent aviation governance in India.
            </div>
            <div className="flex items-center gap-4">
              <span>MoSPI Transport Sub-Index Alignment</span>
              <span>•</span>
              <span>DGCA Route Anomaly Sentinel</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
