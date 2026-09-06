import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Database,
  CheckCircle2,
  RefreshCw,
  Cpu,
  HardDrive,
  Clock,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { SCRAPER_SOURCES } from '../../data/mockData';

interface SystemHealthViewProps {
  language: Language;
}

export const SystemHealthView: React.FC<SystemHealthViewProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [secondsUntilNextCrawl, setSecondsUntilNextCrawl] = useState(252); // 4m 12s

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilNextCrawl((prev) => (prev > 1 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const pipelineStages = [
    {
      name: 'Distributed Ingestion Crawlers',
      status: 'operational',
      throughput: '120 req/sec',
      latency: '240ms',
      desc: 'Headless browser cluster scraping 5 primary OTA and airline direct reservation APIs',
    },
    {
      name: 'Anomaly Detection & Cleansing',
      status: 'operational',
      throughput: '14.2k items/batch',
      latency: '45ms',
      desc: 'Removes caching artifacts, code-share duplicates, and erroneous promo codes',
    },
    {
      name: 'APIx Real-Time Calculation Engine',
      status: 'operational',
      throughput: '48 corridors',
      latency: '18ms',
      desc: 'Computes Laspeyres price index weighted by DGCA quarterly passenger volume',
    },
    {
      name: 'Neural Yield Forecast Pipeline',
      status: 'operational',
      throughput: '7D / 15D / 30D spans',
      latency: '180ms',
      desc: 'Multi-horizon gradient boosted price projections with 90% confidence bands',
    },
    {
      name: 'Alert Dispatcher (Web / WhatsApp / SMS)',
      status: 'operational',
      throughput: '99.98% delivery',
      latency: '12ms',
      desc: 'Pushes instant notifications whenever price deviation breaches threshold (Z > 2.5)',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              {t.systemHealthTitle}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold font-mono">
              ALL SYSTEMS HEALTHY
            </span>
          </div>
          <p className="text-sm text-[#627D98] mt-1 font-medium">
            Real-time crawler telemetry, pipeline throughput, and worker cluster uptime.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs text-xs font-mono text-[#0B1F3A]">
            <Clock className="w-3.5 h-3.5 text-[#1769E0]" />
            <span>Next Crawl Cycle: </span>
            <strong className="text-[#1769E0] font-bold">
              {formatCountdown(secondsUntilNextCrawl)}
            </strong>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#627D98] mb-1">
            <span className="font-semibold uppercase tracking-wider">
              {t.scrapedToday}
            </span>
            <Database className="w-4 h-4 text-[#1769E0]" />
          </div>
          <div className="font-mono text-3xl font-black text-[#0B1F3A]">
            14,280
          </div>
          <div className="text-xs text-emerald-600 font-bold mt-2">
            +1,120 flights vs yesterday
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#627D98] mb-1">
            <span className="font-semibold uppercase tracking-wider">
              {t.ingestionLatency}
            </span>
            <Activity className="w-4 h-4 text-[#1769E0]" />
          </div>
          <div className="font-mono text-3xl font-black text-emerald-600">
            240ms
          </div>
          <div className="text-xs text-[#627D98] mt-2">
            p99: 420ms across regions
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#627D98] mb-1">
            <span className="font-semibold uppercase tracking-wider">
              {t.activeScrapers}
            </span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-3xl font-black text-[#0B1F3A]">
            5 / 5 Live
          </div>
          <div className="text-xs text-emerald-600 font-bold mt-2">
            0% failure rate
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#627D98] mb-1">
            <span className="font-semibold uppercase tracking-wider">
              Worker Memory & CPU
            </span>
            <Cpu className="w-4 h-4 text-[#1769E0]" />
          </div>
          <div className="font-mono text-3xl font-black text-[#0B1F3A]">
            28% CPU
          </div>
          <div className="text-xs text-[#627D98] mt-2">
            RAM: 3.4 GB / 16 GB alloc
          </div>
        </div>
      </div>

      {/* Crawl Worker Nodes Status */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0B1F3A]">
              Live Ingestion Connectors (Direct Airline & OTA Feeds)
            </h3>
            <p className="text-xs text-[#627D98]">
              Automated headless workers collecting real-time inventory and pricing tiers.
            </p>
          </div>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>5 Active Proxies</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SCRAPER_SOURCES.map((node) => (
            <div
              key={node.id}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFCFF] space-y-2 hover:border-[#1769E0]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0B1F3A]">
                  {node.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                    node.status === 'operational'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      node.status === 'operational' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span className="capitalize">{node.status}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#E2E8F0]">
                <div>
                  <span className="text-[#627D98] block">Feed Type:</span>
                  <span className="font-mono font-bold text-[#102A43]">
                    {node.type}
                  </span>
                </div>
                <div>
                  <span className="text-[#627D98] block">Avg Latency:</span>
                  <span className="font-mono font-bold text-[#102A43]">
                    {node.avgLatencyMs}ms
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-[#627D98] flex items-center justify-between pt-1">
                <span>Success: {node.successRate}%</span>
                <span>Synced: {node.lastScraped}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* End-to-End Microservice Pipeline */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#0B1F3A]">
            Data Pipeline Topology & Health
          </h3>
          <p className="text-xs text-[#627D98]">
            Sequential stream processing stages from raw scraping to citizen/policy APIs.
          </p>
        </div>

        <div className="space-y-3">
          {pipelineStages.map((stage, idx) => (
            <div
              key={stage.name}
              className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#EAF3FF] text-[#1769E0] font-bold text-xs flex items-center justify-center font-mono">
                  {idx + 1}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#102A43] block">
                    {stage.name}
                  </span>
                  <p className="text-[11px] text-[#627D98]">
                    {stage.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                <span className="text-[#627D98]">Rate: {stage.throughput}</span>
                <span className="text-[#627D98]">Latency: {stage.latency}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  Healthy
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
