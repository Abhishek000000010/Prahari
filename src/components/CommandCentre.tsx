import React from "react";
import { LIVE_ALERTS } from "../data";
import {
  MapPin,
  Activity,
  TrendingUp,
  FlaskConical,
  Coins,
  Phone,
  ShieldCheck,
  Inbox,
} from "lucide-react";
import { useActivityLog, formatAgo, MODULE_LABELS, ActivitySeverity } from "../activityLog";

interface CommandCentreProps {
  onAddAuditLog: (msg: string) => void;
}

const SEVERITY_DOT: Record<ActivitySeverity, string> = {
  critical: "bg-[var(--color-critical)]",
  high: "bg-[var(--color-critical)]",
  medium: "bg-[var(--color-medium)]",
  safe: "bg-[var(--color-safe)]",
};

export default function CommandCentre({ onAddAuditLog }: CommandCentreProps) {
  // Real events this deployment produced. Starts empty and grows only when a
  // module actually runs — which is the point: a small number that moves while
  // someone watches carries more weight than a large invented one.
  const { entries, now } = useActivityLog();

  const notesScanned = entries.filter((e) => e.module === "netra").length;
  const counterfeits = entries.filter(
    (e) => e.module === "netra" && e.severity === "critical"
  ).length;
  const callsAnalysed = entries.filter((e) => e.module === "scam").length;
  const identifiersChecked = entries.filter((e) => e.module === "citizen").length;

  const liveStats = [
    { label: "Banknotes analysed", value: notesScanned, icon: Coins },
    { label: "Counterfeits flagged", value: counterfeits, icon: ShieldCheck },
    { label: "Call transcripts analysed", value: callsAnalysed, icon: Phone },
    { label: "Identifiers checked", value: identifiersChecked, icon: Activity },
  ];

  // Illustrative national figures. Labelled rather than deleted so the page
  // still shows what the system would look like deployed at scale — but never
  // presented as something this build measured.
  const projectedStats = [
    { label: "Threats neutralised", value: "48,931", note: "+14.2% YoY" },
    { label: "Mule accounts frozen", value: "11,842", note: "+9.6% MoM" },
    { label: "Call scams blocked", value: "1,45,920", note: "+24.5%" },
    { label: "Losses intercepted", value: "₹412.5Cr", note: "Golden-hour holds" },
  ];

  const hotspots = [
    { state: "Jharkhand (Jamtara)", risk: "CRITICAL", incidents: "4,120", trend: "UP" },
    { state: "Delhi NCR", risk: "CRITICAL", incidents: "5,849", trend: "UP" },
    { state: "Haryana (Mewat)", risk: "HIGH", incidents: "2,980", trend: "DOWN" },
    { state: "Maharashtra", risk: "HIGH", incidents: "3,110", trend: "UP" },
    { state: "Karnataka", risk: "MEDIUM", incidents: "1,850", trend: "STABLE" },
  ];

  return (
    <div className="space-y-8" id="command-centre-root">
      {/* ==========================================================
          LIVE — everything in this block is real
          ========================================================== */}
      <section className="space-y-4" id="live-section">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-semibold text-[var(--color-ink)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-safe)]" />
            <span>Live — processed by this deployment</span>
          </h3>
          <span className="text-[10px] font-mono text-[var(--color-ink-3)]">
            Counted from real analyses run in this browser
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="live-stats-grid">
          {liveStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[var(--color-paper)] border border-[var(--color-line)] rounded-[3px] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[var(--color-ink-3)] uppercase tracking-wider">
                  {stat.label}
                </span>
                <stat.icon className="w-3.5 h-3.5 text-[var(--color-ink-3)]" />
              </div>
              <h3 className="text-2xl font-semibold mt-2 font-mono text-[var(--color-ink)]">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Real activity ledger */}
        <div
          className="bg-[var(--color-paper)] border border-[var(--color-line)] rounded-[3px] p-5"
          id="live-activity-feed"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-[var(--color-ink)] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--color-safe)]" />
              <span>Activity ledger</span>
            </h3>
            <span className="text-[10px] font-mono text-[var(--color-ink-3)]">
              {entries.length} event{entries.length === 1 ? "" : "s"}
            </span>
          </div>

          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-10 border border-dashed border-[var(--color-line)] rounded-[3px]">
              <Inbox className="w-7 h-7 text-[var(--color-ink-3)] mb-2" />
              <p className="text-xs text-[var(--color-ink-2)] font-medium">Nothing processed yet</p>
              <p className="text-[11px] text-[var(--color-ink-3)] max-w-sm mt-1 leading-relaxed">
                Scan a banknote, analyse a call recording or check an identifier — each one is
                recorded here with the time it actually happened.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[260px] overflow-y-auto" id="activity-entries">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex justify-between items-start gap-3 p-3 bg-[var(--color-paper)] border border-[var(--color-line)]/80 rounded-[3px] text-xs"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${SEVERITY_DOT[entry.severity]}`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[var(--color-ink)] font-semibold">{entry.title}</span>
                        <span className="text-[9px] text-[var(--color-ink-3)] font-mono">
                          {MODULE_LABELS[entry.module]}
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--color-ink-2)] mt-0.5 font-mono break-words">
                        {entry.detail}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] text-[var(--color-ink-3)] font-mono shrink-0 mt-0.5">
                    {formatAgo(entry.at, now)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==========================================================
          SIMULATED — illustrative only, and said so plainly
          ========================================================== */}
      <section className="space-y-4" id="simulated-section">
        <div className="flex items-start gap-2.5 p-3 border border-[var(--color-line)] border-dashed rounded-[3px] bg-[var(--color-surface)]">
          <FlaskConical className="w-4 h-4 text-[var(--color-ink-3)] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[var(--color-ink)] text-xs">
              Simulated dataset — illustrative national view
            </h3>
            <p className="text-[11px] text-[var(--color-ink-2)] leading-relaxed mt-0.5">
              Everything below this line is sample data showing how the platform would present
              national-scale intelligence. It is not measured by this build and does not come from
              any live source.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="projected-stats-grid">
          {projectedStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[var(--color-paper)] border border-[var(--color-line)] rounded-[3px] p-5 flex flex-col justify-between opacity-80"
            >
              <div>
                <span className="text-[10px] font-mono text-[var(--color-ink-3)] uppercase tracking-wider">
                  {stat.label}
                </span>
                <h3 className="text-xl font-semibold mt-1 font-mono text-[var(--color-ink-2)]">
                  {stat.value}
                </h3>
              </div>
              <div className="flex justify-between items-center mt-3 text-[10px] text-[var(--color-ink-3)] border-t border-[var(--color-line)]/60 pt-2">
                <span>Simulated</span>
                <span className="font-semibold">{stat.note}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {/* Regional hotspots */}
            <div
              className="bg-[var(--color-paper)] border border-[var(--color-line)] rounded-[3px] p-5"
              id="regional-hotspots-card"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[var(--color-ink)] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--color-ink-3)]" />
                  <span>Regional hotspots</span>
                </h3>
                <span className="text-[10px] font-mono text-[var(--color-ink-3)]">Simulated</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {hotspots.map((hot, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2.5 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-[3px] text-xs"
                    >
                      <div>
                        <span className="text-[var(--color-ink-2)] font-medium">{hot.state}</span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-[var(--color-ink-3)]">
                          <span>{hot.incidents} monthly records</span>
                          <span>•</span>
                          <span
                            className={`font-mono font-semibold ${
                              hot.trend === "UP"
                                ? "text-[var(--color-critical)]"
                                : hot.trend === "DOWN"
                                ? "text-[var(--color-safe)]"
                                : "text-[var(--color-ink-2)]"
                            }`}
                          >
                            Trend {hot.trend}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded ${
                          hot.risk === "CRITICAL"
                            ? "bg-[var(--color-critical-tint)] text-[var(--color-critical)]"
                            : hot.risk === "HIGH"
                            ? "bg-[var(--color-navy-tint)] text-[var(--color-navy)]"
                            : "bg-[var(--color-safe-tint)] text-[var(--color-safe)]"
                        }`}
                      >
                        {hot.risk}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-[var(--color-paper)] border border-[var(--color-line)] rounded-[3px] p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-mono text-[var(--color-ink-3)] uppercase mb-2">
                      Target interception rates
                    </h4>
                    <div className="space-y-2" id="lead-time-indicators">
                      {[
                        { label: "Golden-hour freeze rate", pct: "88.4%", bar: "bg-[var(--color-safe)]" },
                        { label: "Telecom block rate", pct: "76.1%", bar: "bg-[var(--color-medium)]" },
                        { label: "APK signature takedown", pct: "91.5%", bar: "bg-[var(--color-navy)]" },
                      ].map((row, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-[10px] text-[var(--color-ink-2)] mb-1">
                            <span>{row.label}</span>
                            <span className="font-mono font-semibold">{row.pct}</span>
                          </div>
                          <div className="w-full bg-[var(--color-paper)] rounded-full h-1.5">
                            <div className={`${row.bar} h-1.5 rounded-full`} style={{ width: row.pct }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[9px] text-[var(--color-ink-3)] leading-relaxed mt-4 border-t border-[var(--color-line)]/60 pt-2">
                    Design targets for a deployed system, not measurements.
                  </p>
                </div>
              </div>
            </div>

            {/* Sample threat ledger — timestamps derived from page load */}
            <div
              className="bg-[var(--color-paper)] border border-[var(--color-line)] rounded-[3px] p-5"
              id="sample-threat-feed"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[var(--color-ink)] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--color-ink-3)]" />
                  <span>Sample threat ledger</span>
                </h3>
                <span className="text-[10px] font-mono text-[var(--color-ink-3)]">Simulated</span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto" id="threat-ledger">
                {LIVE_ALERTS.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex justify-between items-center p-3 bg-[var(--color-paper)] border border-[var(--color-line)]/80 rounded-[3px] text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                          alert.status === "CRITICAL"
                            ? "bg-[var(--color-critical)]"
                            : "bg-[var(--color-navy)]"
                        }`}
                      />
                      <div>
                        <span className="text-[var(--color-ink)] font-semibold">{alert.type}</span>
                        <p className="text-[10px] text-[var(--color-ink-2)] mt-0.5 font-mono">
                          {alert.source} • {alert.location}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] text-[var(--color-ink-3)] font-mono shrink-0">
                      {formatAgo(now - alert.minutesAgo * 60_000, now)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right analytics column */}
          <div
            className="lg:col-span-4 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-[3px] p-5 space-y-6"
            id="dashboard-right-analytics"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-[var(--color-ink)] text-xs uppercase tracking-wider">
                  Top deception methods
                </h3>
                <span className="text-[9px] font-mono text-[var(--color-ink-3)]">Simulated</span>
              </div>
              <div className="space-y-3 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-[3px] p-4">
                {[
                  { label: "Digital arrest", percentage: "34%" },
                  { label: "Aadhaar KYC suspension", percentage: "28%" },
                  { label: "UPI QR prize phishing", percentage: "20%" },
                  { label: "Job offer baiting", percentage: "18%" },
                ].map((scam, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--color-ink-2)] font-medium">{scam.label}</span>
                      <span className="font-mono text-[var(--color-ink-2)]">{scam.percentage}</span>
                    </div>
                    <div className="w-full bg-[var(--color-paper)] rounded-full h-1">
                      <div
                        className="bg-[var(--color-navy)] h-1 rounded-full"
                        style={{ width: scam.percentage }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-[var(--color-ink)] text-xs uppercase tracking-wider">
                  Joint operations
                </h3>
                <span className="text-[9px] font-mono text-[var(--color-ink-3)]">Simulated</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { name: "Regional mule-network trace", status: "Phase 3", scope: "142 accounts" },
                  { name: "Loan-app harassment ring", status: "Mapping", scope: "92 handles" },
                  { name: "Digital-arrest call cluster", status: "Evidence", scope: "18 locations" },
                ].map((op, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[var(--color-paper)] border border-[var(--color-line)]/80 rounded-[3px] text-xs"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[var(--color-ink)] font-semibold">{op.name}</span>
                      <span className="text-[8px] font-mono px-1.5 bg-[var(--color-paper)] text-[var(--color-ink-2)] rounded uppercase font-semibold border border-[var(--color-line)]">
                        {op.status}
                      </span>
                    </div>
                    <div className="mt-2 text-[10px] text-[var(--color-ink-3)]">
                      Scope: {op.scope}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
