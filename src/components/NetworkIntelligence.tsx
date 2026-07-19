import React, { useState } from "react";
import { NETWORK_NODES, NETWORK_LINKS } from "../data";
import { NetworkNode } from "../types";
import { Shield, Users, Activity, HelpCircle, Lock, MapPin, AlertTriangle, Play, Check } from "lucide-react";

interface NetworkIntelligenceProps {
  onAddAuditLog: (msg: string) => void;
}

export default function NetworkIntelligence({ onAddAuditLog }: NetworkIntelligenceProps) {
  const [nodes, setNodes] = useState<NetworkNode[]>(NETWORK_NODES);
  const [links] = useState(NETWORK_LINKS);
  const [selectedEntity, setSelectedEntity] = useState<NetworkNode | null>(NETWORK_NODES[0]);
  
  const [suspectQuery, setSuspectQuery] = useState("");
  const [suspectType, setSuspectType] = useState("upi");
  
  const handleInspectEntity = (node: NetworkNode) => {
    setSelectedEntity(node);
    onAddAuditLog(`Entity Inspection launched for: [${node.id}] ${node.label}`);
  };

  const handleEnforcementAction = (action: string) => {
    if (!selectedEntity) return;
    onAddAuditLog(`ENFORCEMENT MANDATE: [${action}] dispatched against ${selectedEntity.label}`);
    alert(`Enforcement Directive Dispatched:\n${action} has been transmitted to partner banks and telecom mainframes under CERT-In protocol.`);
  };

  const handleSearchAndTrace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspectQuery.trim()) return;

    onAddAuditLog(`Initiated Multi-hop network tracing for ${suspectType.toUpperCase()}: ${suspectQuery}`);
    
    // Add a temporary mock suspect node to show interactivity
    const newId = `S-NEW-${Math.floor(Math.random() * 1000)}`;
    const newNode: NetworkNode = {
      id: newId,
      label: `${suspectType.toUpperCase()}: ${suspectQuery}`,
      type: suspectType as any,
      val: 7,
      details: {
        risk: "HIGH",
        location: "New Delhi, NCR",
        transactionsCount: 15,
        totalValue: "₹4,20,000",
        flaggedDate: "Just Now"
      }
    };

    setNodes((prev) => [newNode, ...prev]);
    setSelectedEntity(newNode);
    setSuspectQuery("");
  };

  // Node position map (for perfect static SVG layout in the frame)
  const nodePositions: Record<string, { cx: number; cy: number }> = {
    "S-1": { cx: 200, cy: 120 },
    "M-1": { cx: 120, cy: 220 },
    "M-2": { cx: 280, cy: 220 },
    "V-1": { cx: 60, cy: 120 },
    "V-2": { cx: 340, cy: 120 },
    "U-1": { cx: 200, cy: 300 },
    "I-1": { cx: 200, cy: 40 }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="network-intel-root">
      {/* Control console */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="trace-suspect-card">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-slate-100">Trace Suspect Node</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Inject suspect bank account, phone number, or UPI address into the CERT-In database to compile multi-hop money laundering trails.
          </p>

          <form onSubmit={handleSearchAndTrace} className="space-y-4" id="trace-suspect-form">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Entity Type</label>
              <div className="grid grid-cols-3 gap-2">
                {["upi", "scammer", "mule_account"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSuspectType(type)}
                    className={`p-2 text-[10px] font-mono capitalize rounded border text-center transition-all ${
                      suspectType === type
                        ? "bg-slate-800 border-emerald-500/50 text-slate-100"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-500"
                    }`}
                  >
                    {type.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Unique Identifier</label>
              <input
                type="text"
                value={suspectQuery}
                onChange={(e) => setSuspectQuery(e.target.value)}
                placeholder="e.g. suspect-pay@ybl, +91 99..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>

            <button
              id="trace-submit-btn"
              type="submit"
              disabled={!suspectQuery.trim()}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 text-slate-100 disabled:text-slate-600 font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Map Syndicate Trail</span>
            </button>
          </form>
        </div>

        {/* Entity Inspector */}
        {selectedEntity && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4" id="entity-inspector">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase">Entity Audit Panel</span>
                <h4 className="font-bold text-slate-200 text-sm mt-0.5 leading-snug">{selectedEntity.label}</h4>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                selectedEntity.details.risk === "CRITICAL"
                  ? "bg-rose-500/15 text-rose-400"
                  : selectedEntity.details.risk === "HIGH"
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-emerald-500/15 text-emerald-400"
              }`}>
                {selectedEntity.details.risk} RISK
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs" id="entity-inspected-details">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-500 block text-[9px] font-mono">Location</span>
                <span className="text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {selectedEntity.details.location}
                </span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-500 block text-[9px] font-mono">Volume Traced</span>
                <span className="text-amber-500 font-semibold block mt-0.5">{selectedEntity.details.totalValue}</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-500 block text-[9px] font-mono">Flagged Date</span>
                <span className="text-slate-300 block mt-0.5 font-mono">{selectedEntity.details.flaggedDate}</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-500 block text-[9px] font-mono">Linked Transactions</span>
                <span className="text-slate-300 block mt-0.5 font-mono">{selectedEntity.details.transactionsCount} entries</span>
              </div>
            </div>

            {/* Direct Intervention Commands */}
            <div className="space-y-2 border-t border-slate-800 pt-3" id="enforcement-commands">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Enforcement Commands</span>
              
              <button
                onClick={() => handleEnforcementAction("FREEZE_UPI_AND_MERCHANT")}
                className="w-full text-left p-2.5 bg-rose-500/10 hover:bg-rose-500/15 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer"
              >
                <span>Freeze Merchant Ledger & UPI</span>
                <Lock className="w-3.5 h-3.5 text-rose-400" />
              </button>

              <button
                onClick={() => handleEnforcementAction("REPUTATION_SANCTION_SIM")}
                className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer"
              >
                <span>Flag SIM on Sanchar Saathi</span>
                <Shield className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Graphical Stage */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5" id="network-visualizer-canvas">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Interactive Money Trail Topology</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-500">Node Cluster: CERT-In Active Maps</span>
        </div>

        {/* SVG Stage representing the graph */}
        <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-hidden min-h-[400px] flex items-center justify-center">
          <svg className="w-full h-[380px]" viewBox="0 0 400 350">
            {/* Draw Links first */}
            {links.map((link, idx) => {
              const start = nodePositions[link.source];
              const end = nodePositions[link.target];
              if (!start || !end) return null;
              
              return (
                <g key={`link-${idx}`}>
                  <line
                    x1={start.cx}
                    y1={start.cy}
                    x2={end.cx}
                    y2={end.cy}
                    stroke="#334155"
                    strokeWidth="1.5"
                    strokeDasharray={link.label.includes("Transfer") ? "4" : undefined}
                  />
                  {/* Link Label */}
                  <text
                    x={(start.cx + end.cx) / 2}
                    y={(start.cy + end.cy) / 2 - 4}
                    fill="#64748b"
                    fontSize="7"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {link.label}
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              const pos = nodePositions[node.id] || { cx: 200 + (Math.random() * 80 - 40), cy: 160 + (Math.random() * 80 - 40) };
              const isSelected = selectedEntity?.id === node.id;

              return (
                <g
                  key={node.id}
                  onClick={() => handleInspectEntity(node)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={pos.cx}
                    cy={pos.cy}
                    r={node.type === "scammer" ? 12 : node.type === "mule_account" ? 9 : 7}
                    fill={
                      node.type === "scammer"
                        ? "#f43f5e"
                        : node.type === "mule_account"
                          ? "#fbbf24"
                          : node.type === "upi"
                            ? "#10b981"
                            : "#3b82f6"
                    }
                    className={`transition-all ${
                      isSelected ? "stroke-slate-100 stroke-2 ring-4 ring-slate-100/20" : "group-hover:stroke-slate-400 group-hover:stroke-1"
                    }`}
                  />
                  {/* Node Title */}
                  <text
                    x={pos.cx}
                    y={pos.cy + 16}
                    fill="#cbd5e1"
                    fontSize="7"
                    textAnchor="middle"
                    className="font-sans font-semibold text-slate-300 pointer-events-none select-none"
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Color Key */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 rounded p-2.5 text-[9px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Scammer Centers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Mule Accounts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Flagged UPI Handles</span>
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-slate-900/95 border border-slate-800 rounded p-3 text-[10px] max-w-xs text-slate-400 flex gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-slate-200">Interactive Map</p>
              <p className="mt-0.5 leading-relaxed text-[9px]">Click individual node circles inside the money trail topology to parse ledger balances and issue enforcement freeze warrants.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
