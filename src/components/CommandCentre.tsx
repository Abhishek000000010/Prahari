import React from "react";
import { LIVE_ALERTS } from "../data";
import { ShieldAlert, AlertTriangle, Building, MapPin, Activity, CheckCircle, TrendingUp } from "lucide-react";

interface CommandCentreProps {
  onAddAuditLog: (msg: string) => void;
}

export default function CommandCentre({ onAddAuditLog }: CommandCentreProps) {
  const stats = [
    { label: "Threats Neutralized", value: "48,931", change: "+14.2% YoY", color: "text-emerald-400" },
    { label: "Mule Accounts Frozen", value: "11,842", change: "+9.6% MoM", color: "text-rose-400" },
    { label: "Call Scams Blocked", value: "1,45,920", change: "+24.5%", color: "text-amber-400" },
    { label: "Losses Intercepted", value: "₹412.5Cr", change: "Emergency Golden Hr", color: "text-purple-400" }
  ];

  const hotspots = [
    { state: "Jharkhand (Jamtara)", risk: "CRITICAL", incidents: "4,120", trend: "UP" },
    { state: "Delhi NCR", risk: "CRITICAL", incidents: "5,849", trend: "UP" },
    { state: "Haryana (Mewat)", risk: "HIGH", incidents: "2,980", trend: "DOWN" },
    { state: "Maharashtra", risk: "HIGH", incidents: "3,110", trend: "UP" },
    { state: "Karnataka", risk: "MEDIUM", incidents: "1,850", trend: "STABLE" }
  ];

  return (
    <div className="space-y-6" id="command-centre-root">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <h3 className={`text-xl font-extrabold mt-1 font-mono ${stat.color}`}>{stat.value}</h3>
            </div>
            <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 border-t border-slate-800/60 pt-2">
              <span>Performance Indicator:</span>
              <span className="font-semibold text-slate-300">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State Hotspots & Live alerts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Indian Threat Hotspots */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="regional-hotspots-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>National Regional Hotspots</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Source: Sanchar Saathi Analytics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hotspots List */}
              <div className="space-y-2">
                {hotspots.map((hot, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                    <div>
                      <span className="text-slate-300 font-medium">{hot.state}</span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-slate-500">
                        <span>{hot.incidents} monthly records</span>
                        <span>•</span>
                        <span className={`font-mono font-bold ${hot.trend === "UP" ? "text-rose-400" : hot.trend === "DOWN" ? "text-emerald-400" : "text-slate-400"}`}>
                          Trend {hot.trend}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                      hot.risk === "CRITICAL"
                        ? "bg-rose-500/10 text-rose-400"
                        : hot.risk === "HIGH"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-emerald-500/10 text-emerald-400"
                    }`}>
                      {hot.risk}
                    </span>
                  </div>
                ))}
              </div>

              {/* Visual mini chart */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-mono text-slate-500 uppercase mb-2">Interception Lead Times</h4>
                  <div className="space-y-2" id="lead-time-indicators">
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Golden Hour Freeze Rate</span>
                        <span className="font-mono text-emerald-400 font-bold">88.4%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5">
                        <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: "88.4%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Telecom Chakshu Block Rate</span>
                        <span className="font-mono text-amber-400 font-bold">76.1%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5">
                        <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: "76.1%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>APK Signature Neutralization</span>
                        <span className="font-mono text-purple-400 font-bold">91.5%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5">
                        <div className="bg-purple-400 h-1.5 rounded-full" style={{ width: "91.5%" }} />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 leading-relaxed mt-4 border-t border-slate-800/60 pt-2">
                  Active algorithms automatically sync flagged records with 22 state cooperative banks to speed up treasury holds.
                </p>
              </div>
            </div>
          </div>

          {/* Scrolling Alerts Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="live-threat-feed">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Live Intercepted Threat Ledger</span>
              </h3>
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto" id="threat-ledger">
              {LIVE_ALERTS.map((alert) => (
                <div key={alert.id} className="flex justify-between items-center p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                      alert.status === "CRITICAL" ? "bg-rose-500" : "bg-amber-500"
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-200 font-semibold">{alert.type}</span>
                        <span className="text-[9px] text-slate-500 font-mono">#{alert.id}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{alert.source} • {alert.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {alert.amount && (
                      <span className="text-[10px] font-bold text-slate-300 font-mono block">{alert.amount}</span>
                    )}
                    <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Threat Analytics */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6" id="dashboard-right-analytics">
          {/* Scam Category Breakdown */}
          <div>
            <h3 className="font-semibold text-slate-100 text-xs uppercase tracking-wider mb-3">Top Deception Methods</h3>
            <div className="space-y-3 bg-slate-950 border border-slate-800 rounded-xl p-4">
              {[
                { label: "Digital Arrest", percentage: "34%", count: "12.4K cases" },
                { label: "Aadhaar KYC Suspensions", percentage: "28%", count: "10.2K cases" },
                { label: "UPI QR Prize Phishing", percentage: "20%", count: "7.3K cases" },
                { label: "Job Offer Baiting", percentage: "18%", count: "6.5K cases" }
              ].map((scam, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{scam.label}</span>
                    <span className="font-mono text-slate-400">{scam.percentage}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1">
                    <div className="bg-amber-500 h-1 rounded-full" style={{ width: scam.percentage }} />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono block">{scam.count} reported</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Investigations */}
          <div>
            <h3 className="font-semibold text-slate-100 text-xs uppercase tracking-wider mb-3">Active Joint Operations</h3>
            <div className="space-y-2.5">
              {[
                { name: "Op Jamtara Shadow", status: "PHASE 3 ACTION", accounts: "142 frozen", officer: "Sandeep Gupta" },
                { name: "Op Mewat Loan Ring", status: "TRACING UPI IDS", accounts: "92 mapped", officer: "Preeti Sinha" },
                { name: "Op Noida Digital Arrest", status: "EVIDENCE SEGMENT", accounts: "18 locations", officer: "Arjun Singh" }
              ].map((op, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-200 font-semibold">{op.name}</span>
                    <span className="text-[8px] font-mono px-1.5 py-0.2 bg-slate-900 text-slate-400 rounded uppercase font-bold border border-slate-800">
                      {op.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500">
                    <span>Ledger: {op.accounts}</span>
                    <span>Lead: {op.officer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
