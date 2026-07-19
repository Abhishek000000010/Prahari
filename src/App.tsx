import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserSession, ScreenType, IncidentReport, OfficerSignupRequest } from "./types";
import { INITIAL_REPORTS } from "./data";

// Component Imports
import CommandCentre from "./components/CommandCentre";
import ScamAnalyser from "./components/ScamAnalyser";
import CurrencyForensics from "./components/CurrencyForensics";
import NetworkIntelligence from "./components/NetworkIntelligence";
import AISecurityAssistant from "./components/AISecurityAssistant";
import CitizenPortal from "./components/CitizenPortal";

// Icons
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Search,
  Phone,
  Activity,
  Coins,
  Brain,
  Mail,
  User,
  Users,
  Building,
  Briefcase,
  Lock,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Plus,
  RefreshCw,
  Clock,
  ArrowRight,
  Sliders,
  Sparkles,
  MapPin,
  Check,
  TrendingUp,
  UserCheck
} from "lucide-react";

const ADVISORIES_DATA = [
  {
    id: "adv-1",
    category: "arrest",
    title: "Virtual Custody / CBI Digital Arrest",
    severity: "CRITICAL",
    description: "Fraudsters impersonate CBI, Mumbai Police, or narcotics cells on WhatsApp video, claiming you are accused of money laundering or contraband courier packages.",
    modusOperandi: "They order you to stay on a 24-hour Skype/WhatsApp surveillance call, forbidding you from talking to family, and demand that you transfer security deposits.",
    prevention: "Remember, no law enforcement agency conducts online jail or 'virtual custody' via video call. Real officers will never ask for personal bank transfers.",
    quiz: {
      question: "An agent calling from 'CBI' asks you to stay on an active WhatsApp video call for verification. What is the correct action?",
      options: [
        { text: "Follow their orders and remain silent to avoid arrest.", isCorrect: false },
        { text: "Disconnect immediately, block the number, and dial 1930 or report on cybercrime.gov.in.", isCorrect: true },
        { text: "Share your Aadhaar photo to prove your innocence quickly.", isCorrect: false }
      ]
    }
  },
  {
    id: "adv-2",
    category: "courier",
    title: "Customs / FedEx Seizure Scam",
    severity: "HIGH RISK",
    description: "An SMS or automated IVR call states that a package sent in your name containing illegal drugs has been intercepted and seized.",
    modusOperandi: "The caller offers to connect you to a cybercrime branch. They ask for your Aadhaar card and state that your bank accounts are under scrutiny.",
    prevention: "DHL, FedEx, or Customs departments never transfer calls to police agencies. They communicate through official physical tracking coordinates.",
    quiz: {
      question: "You receive a call claiming a seized FedEx parcel has drugs linked to your ID. What should you do?",
      options: [
        { text: "Ask for their employee code and pay the customs fine over UPI.", isCorrect: false },
        { text: "Refuse to share personal details and report the call on the SafeNet Portal.", isCorrect: true },
        { text: "Install a screensharing application so they can inspect your phone.", isCorrect: false }
      ]
    }
  },
  {
    id: "adv-3",
    category: "financial",
    title: "Part-Time Job & Telegram Task bait",
    severity: "CRITICAL",
    description: "You are invited to join Telegram or WhatsApp groups where you earn money by simply liking YouTube videos or writing reviews.",
    modusOperandi: "After a few small payouts, they request a 'prepaid deposit' to unlock premium tasks. The demands escalate, preventing you from withdrawing your accumulated funds.",
    prevention: "No genuine job requires you to pay money to receive salary or unlock commissions. Cut contact at the first mention of any deposit requirement.",
    quiz: {
      question: "A Telegram recruiter asks you to transfer ₹5,000 to unlock your accumulated ratings payout of ₹8,000. Do you:",
      options: [
        { text: "Pay the ₹5,000 using UPI - it's a small fee to get ₹8,000.", isCorrect: false },
        { text: "Realize this is a classic deposit task scam, withdraw from the group, and report the UPI handle.", isCorrect: true }
      ]
    }
  },
  {
    id: "adv-4",
    category: "credentials",
    title: "Urgent SIM Block & KYC Panic",
    severity: "MEDIUM RISK",
    description: "An SMS warns your Airtel/Jio number will be permanently deactivated in 1 hour unless you call a specific mobile number to update your KYC.",
    modusOperandi: "They direct you to download a remote monitoring app (such as AnyDesk or a custom .APK file) or share OTPs to verify your identity.",
    prevention: "Official telecom operators never threaten immediate hourly blockages via generic mobile numbers, and never request APK installations over chat.",
    quiz: {
      question: "An SMS says your SIM will be suspended unless you immediately download 'Airtel_Support.apk' from a link. What is the safest choice?",
      options: [
        { text: "Download the file since it comes directly from a customer care link.", isCorrect: false },
        { text: "Ignore the SMS, open the official app directly to verify status, or call customer care (198).", isCorrect: true }
      ]
    }
  }
];

export default function App() {
  // Navigation State
  const [activeScreen, setActiveScreen] = useState<ScreenType>("landing");
  const [session, setSession] = useState<UserSession>({
    id: "USER-001",
    name: "Arjun Singh",
    role: "citizen",
    email: "arjun.singh@cert-in.gov.in",
    isLoggedIn: false,
  });

  // Step-by-Step Registration state
  const [selectedRole, setSelectedRole] = useState<"officer" | "bank_rep" | "admin" | "citizen">("citizen");
  const [regForm, setRegForm] = useState({
    name: "Rajesh Kumar",
    phone: "+91 98234 88392",
    organisation: "Delhi Police Cyber Cell",
    employeeId: "DP-2024-8839",
    password: "",
  });
  const [otpCodes, setOtpCodes] = useState(["", "", "", "", "", ""]);
  const [uploadedIdName, setUploadedIdName] = useState<string | null>(null);

  // Reports Page State
  const [reports, setReports] = useState<IncidentReport[]>(INITIAL_REPORTS);
  const [reportSearch, setReportSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    category: "Digital Arrest Impersonation",
    reporter: "",
    targetEntity: "",
    description: "",
    state: "Delhi NCR",
    amountLoss: "",
  });

  // Audit Logs Terminal drawer at the bottom
  const [auditLogs, setAuditLogs] = useState<string[]>([
    "SafeNet National Cyber Security Engine initialized...",
    "Vulnerability indices matching CERT-In protocol loaded.",
    "Ready to secure digital assets."
  ]);
  const [showAuditDrawer, setShowAuditDrawer] = useState(false);

  // Settings form states
  const [language, setLanguage] = useState("en");

  // Officer / Bank Rep signup requests state
  const [officerRequests, setOfficerRequests] = useState<OfficerSignupRequest[]>([
    {
      id: "REQ-2026-1042",
      name: "Inspector Vikram Rathore",
      organisation: "Mumbai Cyber Crime Branch",
      employeeId: "MUM-POL-8821",
      phone: "+91 98112 34567",
      role: "officer",
      status: "PENDING",
      date: "17/07/2026"
    },
    {
      id: "REQ-2026-1039",
      name: "Anjali Sharma",
      organisation: "ICICI Bank Fraud Control Cell",
      employeeId: "ICICI-FCC-9912",
      phone: "+91 99223 88123",
      role: "bank_rep",
      status: "PENDING",
      date: "17/07/2026"
    },
    {
      id: "REQ-2026-1025",
      name: "ACP Pradeep Sathe",
      organisation: "Pune Police Cyber Lab",
      employeeId: "PUN-POL-7731",
      phone: "+91 97654 32109",
      role: "officer",
      status: "APPROVED",
      date: "16/07/2026"
    },
    {
      id: "REQ-2026-1011",
      name: "Suresh Pillai",
      organisation: "HDFC Risk & Vigilance",
      employeeId: "HDFC-VIG-2294",
      phone: "+91 98450 11223",
      role: "bank_rep",
      status: "REJECTED",
      date: "15/07/2026"
    }
  ]);

  // Interactive Scam Simulator state
  const [simCategory, setSimCategory] = useState("digital_arrest");
  const [simChannel, setSimChannel] = useState("whatsapp_call");
  const [simDescription, setSimDescription] = useState("");
  const [simDemandedAmount, setSimDemandedAmount] = useState("");
  const [simIsScanning, setSimIsScanning] = useState(false);
  const [simScanStep, setSimScanStep] = useState(0);
  const [simResult, setSimResult] = useState<{
    score: number;
    dangerLevel: string;
    detectedTactics: string[];
    actionSteps: string[];
  } | null>(null);

  // Interactive Advisory states
  const [activeAdvisoryTab, setActiveAdvisoryTab] = useState("all");
  const [expandedAdvisoryId, setExpandedAdvisoryId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [simChecklist, setSimChecklist] = useState<Record<number, boolean>>({});

  const runSimulatedRiskCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simDescription.trim()) return;
    setSimIsScanning(true);
    setSimResult(null);
    setSimChecklist({});
    setSimScanStep(1);

    setTimeout(() => setSimScanStep(2), 600);
    setTimeout(() => setSimScanStep(3), 1200);
    setTimeout(() => {
      setSimScanStep(4);
      // Generate results based on input or category
      let score = 85;
      let dangerLevel = "CRITICAL RISK";
      let tactics = ["Authority Impersonation", "Urgency Pressure", "Sovereign Coercion"];
      let actionSteps = [
        "IMMEDIATELY Disconnect and block this caller's number.",
        "Do NOT share any PINs, OTPs, or transfer any security deposit funds.",
        "Report the phone number and handle directly to Citizen Portal above.",
        "Call the National Anti-Fraud Helpline '1930' if funds were compromised."
      ];

      if (simCategory === "fedex_courier") {
        score = 92;
        dangerLevel = "SEVERE DANGER";
        tactics = ["Customs seizure scare tactics", "Aadhaar linked drugs claims", "False police transfer"];
        actionSteps = [
          "Do NOT share any Aadhar cards, photos, or sign any documents.",
          "Under official rules, customs or narcotics departments NEVER hold Skype/WhatsApp video calls.",
          "File an immediate incident report in our Citizen Portal for safe police tracking."
        ];
      } else if (simCategory === "upi_request") {
        score = 78;
        dangerLevel = "HIGH FRAUD PROBABILITY";
        tactics = ["Double-benefit refund bait", "Incorrect credit claim", "Collect-request impersonation"];
        actionSteps = [
          "Remember: Entering your UPI PIN is ONLY required to SEND money, never to receive it.",
          "Reject the UPI collect request in your GPay/PhonePe/BHIM app instantly.",
          "Do not scan any QR codes received over chat under any pretense."
        ];
      } else if (simCategory === "part_time") {
        score = 95;
        dangerLevel = "CRITICAL SCHEME DETECTED";
        tactics = ["Prepaid task scam", "Telegram task rewards", "Escalating deposit requirements"];
        actionSteps = [
          "Immediately withdraw from any Telegram/WhatsApp task groups.",
          "Any job requiring you to deposit money to unlock high-return earnings is 100% fraudulent.",
          "Report the beneficiary accounts to our Bank Nodal network via the Citizen Portal."
        ];
      } else if (simCategory === "kyc_block") {
        score = 88;
        dangerLevel = "CYBER IMPOSTER DETECTED";
        tactics = ["Imminent SIM deactivation threat", "APK file side-loading bait", "Bank Account suspension panic"];
        actionSteps = [
          "Do NOT install any APK file or screen-sharing app (Anydesk, TeamViewer) sent by anyone.",
          "Official telecom operators never threaten deactivation over an SMS with personal mobile numbers.",
          "Verify the status independently by visiting your telecom operator's official app or store."
        ];
      }

      setSimResult({ score, dangerLevel, tactics, actionSteps });
      setSimIsScanning(false);
      setSimScanStep(0);
      addAuditLog(`Citizen run simulation risk scan: Category ${simCategory} evaluated. Threat level: ${score}%.`);
    }, 1800);
  };

  const addAuditLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setAuditLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  // Auth flow handlers
  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog(`Saved account details for ${regForm.name} (${regForm.organisation})`);
    setActiveScreen("final_verification");
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog(`OTP validated and Government ID parsed. Submitting for approval.`);
    if (selectedRole === "officer" || selectedRole === "bank_rep") {
      const newReq: OfficerSignupRequest = {
        id: `REQ-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
        name: regForm.name || "Unknown Professional",
        organisation: regForm.organisation || "Nodal Department",
        employeeId: regForm.employeeId || "GOVT-ID-9932",
        phone: regForm.phone || "+91 99999 99999",
        role: selectedRole,
        status: "PENDING",
        date: new Date().toLocaleDateString("en-GB")
      };
      setOfficerRequests((prev) => [newReq, ...prev]);
      addAuditLog(`Created pending signup request for ${newReq.name} (${newReq.organisation})`);
    }
    setActiveScreen("success");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog(`Sovereign sign-in completed for role: ${selectedRole.toUpperCase()}`);
    setSession({
      id: `USER-${Math.floor(Math.random() * 10000)}`,
      name: regForm.name || "Arjun Singh",
      role: selectedRole,
      email: regForm.employeeId ? `${regForm.name.toLowerCase().replace(" ", ".")}@govt.in` : "arjun.singh@cert-in.gov.in",
      isLoggedIn: true,
    });
    setActiveScreen("dashboard");
  };

  const handleLogout = () => {
    addAuditLog(`User logged out. Session destroyed.`);
    setSession((prev) => ({ ...prev, isLoggedIn: false }));
    setActiveScreen("landing");
  };

  const handleCreateReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: IncidentReport = {
      id: `INC-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      category: newReport.category,
      reporter: newReport.reporter || "Anonymous Citizen",
      targetEntity: newReport.targetEntity,
      description: newReport.description,
      state: newReport.state,
      date: new Date().toLocaleDateString("en-IN"),
      status: "PENDING",
      amountLoss: newReport.amountLoss ? `₹${newReport.amountLoss}` : undefined,
    };
    setReports([created, ...reports]);
    setShowAddReportModal(false);
    addAuditLog(`New incident filed: ${created.id} - ${created.category}`);
    setNewReport({
      category: "Digital Arrest Impersonation",
      reporter: "",
      targetEntity: "",
      description: "",
      state: "Delhi NCR",
      amountLoss: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. Global Navigation Bar */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex justify-between items-center" id="main-navigation">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveScreen("landing")} id="brand-logo">
          <Shield className="w-6 h-6 text-amber-500" />
          <div>
            <h1 className="text-sm font-black tracking-tight text-slate-100 flex items-center gap-1.5">
              <span>SAFENET AI</span>
              <span className="text-[10px] bg-rose-500/10 text-rose-400 font-bold px-1.5 py-0.2 rounded border border-rose-500/20">CERT-In</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-mono tracking-wider">Cyber Swachhta Kendra Anti-Fraud Portal</p>
          </div>
        </div>

        {/* Dynamic navigation links depending on auth */}
        <div className="hidden md:flex items-center gap-4 text-xs" id="nav-links">
          {session.isLoggedIn ? (
            <>
              <button
                id="tab-btn-dashboard"
                onClick={() => setActiveScreen("dashboard")}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeScreen === "dashboard" ? "bg-slate-900 text-slate-100" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Command Centre
              </button>
              <button
                id="tab-btn-scam"
                onClick={() => setActiveScreen("scam_analyser")}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeScreen === "scam_analyser" ? "bg-slate-900 text-slate-100" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Scam Analyser
              </button>
              <button
                id="tab-btn-currency"
                onClick={() => setActiveScreen("currency_detector")}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeScreen === "currency_detector" ? "bg-slate-900 text-slate-100" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Currency Forensics
              </button>
              <button
                id="tab-btn-network"
                onClick={() => setActiveScreen("network_intel")}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeScreen === "network_intel" ? "bg-slate-900 text-slate-100" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Network Intel
              </button>
              <button
                id="tab-btn-ai"
                onClick={() => setActiveScreen("ai_assistant")}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeScreen === "ai_assistant" ? "bg-slate-900 text-slate-100" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                AI Advisor
              </button>
              <button
                id="tab-btn-reports"
                onClick={() => setActiveScreen("reports")}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeScreen === "reports" ? "bg-slate-900 text-slate-100" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Investigations
              </button>
              {session.role === "admin" && (
                <button
                  id="tab-btn-signup-requests"
                  onClick={() => setActiveScreen("signup_requests")}
                  className={`px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-1.5 relative ${
                    activeScreen === "signup_requests"
                      ? "bg-amber-500 text-slate-950"
                      : "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Officer Requests</span>
                  {officerRequests.filter((r) => r.status === "PENDING").length > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                      {officerRequests.filter((r) => r.status === "PENDING").length}
                    </span>
                  )}
                </button>
              )}
              <button
                id="tab-btn-settings"
                onClick={() => setActiveScreen("settings")}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeScreen === "settings" ? "bg-slate-900 text-slate-100" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Settings
              </button>
            </>
          ) : (
            <>
              <button
                id="tab-btn-citizen"
                onClick={() => setActiveScreen("citizen_portal")}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeScreen === "citizen_portal" ? "bg-slate-900 text-slate-100" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Use Citizen Shield
              </button>
            </>
          )}
        </div>

        {/* User Account Controls */}
        <div className="flex items-center gap-3" id="nav-user-controls">
          {session.isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <span className="text-[10px] font-bold text-slate-300 block">{session.name}</span>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">{session.role.replace("_", " ")}</span>
              </div>
              <button
                id="logout-btn"
                onClick={handleLogout}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="login-trigger-btn"
                onClick={() => {
                  setActiveScreen("login");
                  addAuditLog("Navigation triggered: Login Portal");
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-slate-100 transition-all cursor-pointer"
              >
                Welcome Sign In
              </button>
              <button
                id="signup-trigger-btn"
                onClick={() => {
                  setActiveScreen("signup");
                  addAuditLog("Navigation triggered: Citizen Signup");
                }}
                className="px-4 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg transition-all cursor-pointer"
              >
                Fast Track Register
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 2. Main Content Canvas */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto" id="screen-viewport">
        
        {/* ==========================================
            SCREEN: LANDING / HOME PAGE
           ========================================== */}
        {activeScreen === "landing" && (
          <div className="space-y-12 pb-12" id="landing-screen">
            {/* Ambient Background Spotlights */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
            <div className="absolute bottom-40 right-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: "2s" }} />

            {/* Top Interactive Cybersecurity Ticker Banner */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-slate-900/80 border border-amber-500/15 rounded-xl px-4 py-3 flex items-center gap-3 overflow-hidden shadow-lg shadow-amber-500/5 backdrop-blur-sm" 
              id="live-cyber-ticker"
            >
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider flex-shrink-0 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 shadow-inner">
                Live Threat Monitor
              </span>
              <div className="text-xs font-mono text-slate-300 flex-1 whitespace-nowrap overflow-hidden relative">
                <div className="inline-block animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] space-x-8 cursor-help">
                  <span>⚠️ [MUMBAI CYBER LAB] Flagged FedEx Courier Impersonation scam blocked via UPI freeze •</span>
                  <span>⚠️ [NEW DELHI] Digital Arrest wave isolated - 18 fake CBI credentials revoked •</span>
                  <span>⚠️ [BENGALURU] Bank rep impersonator trace locked by central AI engine •</span>
                  <span>⚠️ [HYDERABAD] WhatsApp phishing campaign from +92 flagged under active quarantine</span>
                </div>
              </div>
            </motion.div>

            {/* Split Hero layout with interactive Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2 relative">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="lg:col-span-7 flex flex-col justify-center space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 text-xs font-semibold w-fit shadow-inner">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Sovereign AI-Forensic Defense Ecosystem</span>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100 font-display leading-tight">
                  Protecting India’s Citizens Against <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-rose-400">Digital Scams</span>
                </h2>
                
                <p className="text-sm md:text-base text-slate-400 max-w-xl leading-relaxed">
                  Safeguarding the nation's digital financial frontier. SafeNet AI intercepts highly coordinated digital arrest threats, KYC blocks, courier scams, and UPI trickery before they compromise your hard-earned assets.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.2)" }}
                    whileTap={{ scale: 0.97 }}
                    id="landing-btn-citizen"
                    onClick={() => setActiveScreen("citizen_portal")}
                    className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold rounded-xl text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Enter Citizen Shield Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    id="landing-btn-login"
                    onClick={() => setActiveScreen("request_access")}
                    className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold rounded-xl text-xs transition-all duration-300 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Request Investigator Access</span>
                  </motion.button>
                </div>

                <div className="flex items-center gap-6 pt-6 border-t border-slate-900 text-slate-500 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-amber-500" />
                    <span>CERT-In Nodal Directives</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-amber-500" />
                    <span>RBI Fraud Prevention Aligned</span>
                  </div>
                </div>
              </motion.div>

              {/* Interactive side Risk Estimator Simulator */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="lg:col-span-5"
              >
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden h-full group" id="fast-lookup-card">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-700"></div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4.5 h-4.5 text-amber-500" />
                        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-200 font-display">Instant AI Threat Scan</h3>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Citizen Sandbox
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Suspicious phone call, message, or link? Select the category and enter what they are claiming to run a simulated AI diagnostic check.
                    </p>

                    <form onSubmit={runSimulatedRiskCheck} className="space-y-3.5 pt-1">
                      {/* Scenario category select */}
                      <div>
                        <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Scam Type Category</label>
                        <select
                          value={simCategory}
                          onChange={(e) => {
                            setSimCategory(e.target.value);
                            setSimResult(null);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                        >
                          <option value="digital_arrest">Digital Arrest (Police/CBI/Narcotics Impersonation)</option>
                          <option value="fedex_courier">Courier Scam (DHL/FedEx illegal parcel claim)</option>
                          <option value="upi_request">UPI Refund / Doubling Scheme Request</option>
                          <option value="part_time">Part-Time Jobs (Likes/Ratings / Deposit tasks)</option>
                          <option value="kyc_block">KYC Suspension / SIM Block Warning</option>
                        </select>
                      </div>

                      {/* Scenario Description */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[9px] font-mono text-slate-500 uppercase">What does the caller/text claim?</label>
                          <button
                            type="button"
                            onClick={() => {
                              if (simCategory === "digital_arrest") {
                                setSimDescription("The caller claims to be Mumbai Cyber Cell, says my bank details are leaked in a drug racket, and threatens that I am placed under 'virtual custody' immediately unless I transfer ₹1.5L security deposit.");
                              } else if (simCategory === "fedex_courier") {
                                setSimDescription("SMS says my parcel from DHL containing MDMA drugs has been seized at Customs and asks me to join a Skype call with narcotics bureau.");
                              } else if (simCategory === "upi_request") {
                                setSimDescription("Received a UPI request from 'Paytm Refund Dept' asking me to enter my UPI pin to accept ₹5,000 reward cash.");
                              } else if (simCategory === "part_time") {
                                setSimDescription("Recruited on Telegram to like YouTube videos for ₹50 each, but now they ask me to deposit ₹10,000 in a prepaid pool to unlock my commission rewards.");
                              } else if (simCategory === "kyc_block") {
                                setSimDescription("Urgent SMS: Your Airtel SIM will be deactivated in 1 hour due to pending KYC. Click this link to download 'KycSupport.apk' to update.");
                              }
                            }}
                            className="text-[9px] text-amber-500 hover:underline font-mono"
                          >
                            Suggest Template
                          </button>
                        </div>
                        <textarea
                          rows={2.5}
                          required
                          value={simDescription}
                          onChange={(e) => setSimDescription(e.target.value)}
                          placeholder="Example: Caller claims to be from customs and says illegal drugs are found in my Aadhar name..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-amber-500/50 resize-none placeholder:text-slate-600 transition-all duration-300"
                        />
                      </div>

                      {/* Risk Demanded Funds */}
                      <div>
                        <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Demanded Sum (INR) — Optional</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-xs font-bold text-slate-600">₹</span>
                          <input
                            type="number"
                            value={simDemandedAmount}
                            onChange={(e) => setSimDemandedAmount(e.target.value)}
                            placeholder="Amount requested (e.g. 50000)"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500/50 font-mono transition-all duration-300"
                          />
                        </div>
                      </div>

                      {/* Submit Analyzer */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={simIsScanning}
                        className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-500 font-extrabold rounded-lg text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg cursor-pointer disabled:cursor-not-allowed"
                      >
                        <Brain className={`w-4 h-4 ${simIsScanning ? "animate-spin text-slate-500" : "text-slate-950"}`} />
                        <span>{simIsScanning ? "AI Engine Evaluating..." : "Analyze Risk Probability"}</span>
                      </motion.button>
                    </form>
                  </div>

                  {/* Simulator Live Loading Progress Indicator */}
                  {simIsScanning && (
                    <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-amber-500/10 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-amber-500 animate-pulse font-bold">
                          {simScanStep === 1 && "Connecting Registry Database..."}
                          {simScanStep === 2 && "Analyzing Cognitive Coercion Indicators..."}
                          {simScanStep === 3 && "Correlating Bank Mule Network Signatures..."}
                          {simScanStep === 4 && "Finalizing Security Threat Advisory..."}
                        </span>
                        <span className="text-slate-500 font-bold">{simScanStep * 25}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${simScanStep * 25}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* High fidelity simulation report output */}
                  <AnimatePresence>
                    {simResult && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="mt-4 p-4 bg-slate-950 rounded-xl border border-rose-500/20 space-y-4 overflow-hidden" 
                        id="sim-result-panel"
                      >
                        {/* Interactive gauge & scoring */}
                        <div className="flex items-center gap-4 pb-3 border-b border-slate-900/80">
                          {/* Animated Circular Gauge */}
                          <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle 
                                cx="28" 
                                cy="28" 
                                r="24" 
                                stroke="#1e293b" 
                                strokeWidth="4" 
                                fill="transparent" 
                              />
                              <motion.circle 
                                cx="28" 
                                cy="28" 
                                r="24" 
                                stroke="#f43f5e" 
                                strokeWidth="4" 
                                fill="transparent"
                                strokeDasharray="150"
                                initial={{ strokeDashoffset: 150 }}
                                animate={{ strokeDashoffset: 150 - (150 * simResult.score) / 100 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                              />
                            </svg>
                            <span className="absolute text-xs font-black font-mono text-rose-500">{simResult.score}%</span>
                          </div>

                          <div className="flex-1">
                            <span className="text-[9px] font-mono text-slate-500 uppercase">AI Threat Probability</span>
                            <p className="text-sm font-extrabold text-rose-500 tracking-tight font-display uppercase">{simResult.dangerLevel}</p>
                          </div>
                        </div>

                        {/* Psychological Tactics Detected */}
                        <div>
                          <span className="block text-[9px] font-mono text-slate-500 uppercase mb-1.5">Detected Deception Tactics:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {simResult.detectedTactics.map((tactic, idx) => (
                              <span key={idx} className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-semibold font-mono px-2 py-0.5 rounded">
                                {tactic}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Interactive emergency checklist */}
                        <div className="space-y-2 pt-1 border-t border-slate-900/80">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-mono text-slate-500 uppercase">Emergency Safety Protocols:</span>
                            <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                              {Object.values(simChecklist).filter(Boolean).length} of {simResult.actionSteps.length} Safe
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            {simResult.actionSteps.map((step, idx) => {
                              const isChecked = !!simChecklist[idx];
                              return (
                                <label 
                                  key={idx} 
                                  className={`flex items-start gap-2.5 p-2 rounded-lg border text-[11px] leading-relaxed cursor-pointer transition-all ${
                                    isChecked 
                                      ? "bg-emerald-950/20 border-emerald-500/20 text-slate-300" 
                                      : "bg-slate-900/40 border-slate-800/60 text-slate-400 hover:border-rose-500/20"
                                  }`}
                                >
                                  <input 
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      setSimChecklist(prev => ({
                                        ...prev,
                                        [idx]: e.target.checked
                                      }));
                                      addAuditLog(`Citizen updated safety checklist step ${idx+1}: ${e.target.checked ? 'COMPLETED' : 'PENDING'}`);
                                    }}
                                    className="mt-0.5 accent-emerald-500 cursor-pointer h-3.5 w-3.5"
                                  />
                                  <span>{step}</span>
                                </label>
                              );
                            })}
                          </div>

                          {/* Progress completion bar */}
                          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1.5">
                            <div 
                              className="bg-emerald-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${(Object.values(simChecklist).filter(Boolean).length / simResult.actionSteps.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* National Real-time Security Statistics Counter Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4" 
              id="national-security-stats"
            >
              <motion.div 
                whileHover={{ y: -5, borderColor: "rgba(16, 185, 129, 0.3)" }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 shadow-md relative overflow-hidden cursor-help"
              >
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Total Intercepted Funds</span>
                <p className="text-xl md:text-2xl font-black font-mono text-emerald-400 mt-1">₹418.42 Cr</p>
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-slate-950 text-[10px] text-slate-400 font-mono">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+₹1.28 Cr today</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5, borderColor: "rgba(245, 158, 11, 0.3)" }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 shadow-md relative overflow-hidden cursor-help"
              >
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Citizen Shield Members</span>
                <p className="text-xl md:text-2xl font-black font-mono text-slate-100 mt-1">1,421,908</p>
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-slate-950 text-[10px] text-slate-400 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>9.2K registering weekly</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5, borderColor: "rgba(139, 92, 246, 0.3)" }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 shadow-md relative overflow-hidden cursor-help"
              >
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Verified Nodal Banks</span>
                <p className="text-xl md:text-2xl font-black font-mono text-purple-400 mt-1">42 Public & Private</p>
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-slate-950 text-[10px] text-slate-400 font-mono">
                  <Check className="w-3.5 h-3.5 text-purple-400" />
                  <span>Instant block connection</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5, borderColor: "rgba(245, 158, 11, 0.3)" }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 shadow-md relative overflow-hidden cursor-help"
              >
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Cyber Nodal Officers</span>
                <p className="text-xl md:text-2xl font-black font-mono text-amber-500 mt-1">14,801 Active</p>
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-slate-950 text-[10px] text-slate-400 font-mono">
                  <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>State police wings linked</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Deep-Tech Interactive Playground / Bento-Grid Demonstration */}
            <div className="space-y-6 pt-4">
              <div>
                <h3 className="text-xl font-bold text-slate-100 font-display">Deep-Tech Scam Interception Capabilities</h3>
                <p className="text-xs text-slate-400 mt-1">Hover over each capability to trigger our live cyber-simulation radars.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="feature-highlights-row">
                {/* Cognitive Transcript Card */}
                <motion.div 
                  whileHover={{ y: -6, borderColor: "rgba(168, 85, 247, 0.3)" }}
                  className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 hover:bg-slate-900 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-200 tracking-wide">AI Cognitive Transcript Scanner</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                        Analyses chat strings or voice logs for linguistic coercion. Detects authority stress claims and high-pressure threat keywords instantly.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Mini-Simulation Graphic */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 font-mono text-[9px] space-y-1 relative group-hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex justify-between text-[8px] text-slate-500 border-b border-slate-900 pb-1 mb-1">
                      <span>SEC_LXP_RADAR.LOG</span>
                      <span className="text-purple-400 animate-pulse">ACTIVE</span>
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      &quot;You must deposit money inside <span className="text-rose-400 font-bold bg-rose-500/10 px-1 rounded hover:scale-105 inline-block cursor-help" title="Coercion Trigger Word">virtual custody</span> in 30 mins or your Aadhaar is <span className="text-rose-400 font-bold bg-rose-500/10 px-1 rounded hover:scale-105 inline-block cursor-help">blocked</span>&quot;
                    </div>
                    <div className="pt-1.5 text-[8px] text-purple-400 font-bold flex items-center gap-1">
                      <span>➔ AI Threat Match: 94.8% Social Eng. Risk</span>
                    </div>
                  </div>
                </motion.div>

                {/* Currency Forensic Card */}
                <motion.div 
                  whileHover={{ y: -6, borderColor: "rgba(245, 158, 11, 0.3)" }}
                  className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 hover:bg-slate-900 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-200 tracking-wide">Currency Forensic Laboratory</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                        Analyzes banknote tenders through spectral imaging. Cross-references watermark depth, micro-letterings, and security threads.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Mini-Simulation Graphic */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 font-mono text-[9px] relative overflow-hidden h-[54px] flex flex-col justify-between group-hover:border-amber-500/30 transition-all duration-300">
                    <div className="flex justify-between text-[8px] text-slate-500 border-b border-slate-900 pb-1 mb-1">
                      <span>BANKNOTE_FORENSIC_SPECTRAL</span>
                      <span className="text-amber-500">READY</span>
                    </div>
                    
                    {/* Floating animated laser scan line */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-[bounce_2s_infinite] pointer-events-none"></div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-5 bg-amber-500/10 border border-amber-500/20 rounded flex items-center justify-center text-[7px] text-amber-500 font-bold">
                        ₹500
                      </div>
                      <div className="text-[9px] text-slate-300">
                        Analyzing latent intaglio ink watermark...
                      </div>
                    </div>
                    <div className="text-[8px] text-emerald-400 font-bold flex items-center gap-1">
                      <span>➔ Spectral alignment: GENUINE RBI SPECS</span>
                    </div>
                  </div>
                </motion.div>

                {/* Network Syndicate Card */}
                <motion.div 
                  whileHover={{ y: -6, borderColor: "rgba(16, 185, 129, 0.3)" }}
                  className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 hover:bg-slate-900 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-200 tracking-wide">Account Syndicate Trailing</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                        Enables risk officers to trace mule transfer layers recursively. Tracks transaction velocities and triggers automated inter-bank holds.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Mini-Simulation Graphic */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 font-mono text-[9px] space-y-1 relative group-hover:border-emerald-500/30 transition-all duration-300">
                    <div className="flex justify-between text-[8px] text-slate-500 border-b border-slate-900 pb-1 mb-1">
                      <span>MULE_FLOW_MAPPING_V3</span>
                      <span className="text-emerald-400 animate-pulse">LOCK</span>
                    </div>
                    <div className="flex justify-between items-center text-[8px] text-slate-400">
                      <span className="text-emerald-400">Root Node: Mumbai</span>
                      <span>➔</span>
                      <span className="text-amber-500">Mule 1: Jamtara</span>
                      <span>➔</span>
                      <span className="text-rose-400">Mule 2: Surat</span>
                    </div>
                    <div className="pt-1.5 text-[8px] text-emerald-400 font-bold flex justify-between">
                      <span>➔ Automatic Bank Freeze Sent</span>
                      <span className="bg-rose-500/20 text-rose-400 px-1 rounded">₹18,500 Hold</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Active Security Advisories & Interactive Quizzes */}
            <div className="space-y-6 pt-6" id="cyber-security-feeds">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-[10px] font-mono text-rose-400 font-bold mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                    <span>CENTRAL SECURITY BROADCAST</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-100 font-display">Active National Cyber Threat Advisories</h3>
                  <p className="text-xs text-slate-400">
                    Learn the exact tactics scammers use and test your digital safety vigilance with our active scenario challenge.
                  </p>
                </div>

                {/* Interactive Category Filter Tabs */}
                <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                  {["all", "arrest", "courier", "financial", "credentials"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveAdvisoryTab(tab);
                        setExpandedAdvisoryId(null);
                        addAuditLog(`Citizen switched threat advisory filter to: ${tab.toUpperCase()}`);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                        activeAdvisoryTab === tab
                          ? "bg-amber-500 text-slate-950 shadow-md"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Staggered Interactive Advisories Grid */}
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                  {ADVISORIES_DATA
                    .filter((adv) => activeAdvisoryTab === "all" || adv.category === activeAdvisoryTab)
                    .map((adv, idx) => {
                      const isExpanded = expandedAdvisoryId === adv.id;
                      const hasSubmittedQuiz = !!quizSubmitted[adv.id];
                      const selectedOptionIdx = quizAnswers[adv.id];
                      const chosenOption = selectedOptionIdx !== undefined ? adv.quiz.options[selectedOptionIdx] : null;
                      const isQuizCorrect = chosenOption ? chosenOption.isCorrect : false;

                      return (
                        <motion.div
                          layout="position"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
                          key={adv.id}
                          className={`bg-slate-900/60 hover:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300 ${
                            isExpanded ? "border-amber-500/30 shadow-xl" : "border-slate-800/80 hover:border-slate-700"
                          }`}
                        >
                          {/* Card Header click trigger */}
                          <div 
                            onClick={() => {
                              setExpandedAdvisoryId(isExpanded ? null : adv.id);
                              addAuditLog(`${isExpanded ? 'Collapsed' : 'Expanded'} advisory: ${adv.title}`);
                            }}
                            className="p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                          >
                            <div className="flex items-start sm:items-center gap-4">
                              <div className={`p-2.5 rounded-xl ${
                                adv.severity === "CRITICAL" ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"
                              }`}>
                                <Shield className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-extrabold text-sm sm:text-base text-slate-100">{adv.title}</h4>
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold border ${
                                    adv.severity === "CRITICAL" 
                                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  }`}>
                                    {adv.severity}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{adv.description}</p>
                              </div>
                            </div>
                            <button className="text-slate-500 hover:text-slate-300 p-1.5 rounded-full hover:bg-slate-950 transition-colors cursor-pointer">
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </motion.div>
                            </button>
                          </div>

                          {/* Expanded content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="border-t border-slate-900 bg-slate-950/40"
                              >
                                <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  {/* Left: Forensic Details */}
                                  <div className="space-y-4">
                                    <div>
                                      <span className="text-[9px] font-mono text-rose-400 font-extrabold uppercase bg-rose-500/10 px-2 py-0.5 rounded">Scammer Modus Operandi</span>
                                      <p className="text-xs text-slate-300 leading-relaxed mt-2">{adv.modusOperandi}</p>
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-mono text-emerald-400 font-extrabold uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Prevention Protocols</span>
                                      <p className="text-xs text-slate-300 leading-relaxed mt-2">{adv.prevention}</p>
                                    </div>
                                  </div>

                                  {/* Right: Gamified Vigilance Challenge Quiz */}
                                  <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-3.5">
                                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-950">
                                      <Sparkles className="w-4 h-4 text-amber-500" />
                                      <span className="text-[10px] font-mono font-bold text-slate-200 uppercase tracking-wider">Citizen Vigilance Challenge</span>
                                    </div>

                                    <p className="text-xs font-bold text-slate-200 leading-relaxed">{adv.quiz.question}</p>

                                    <div className="space-y-2">
                                      {adv.quiz.options.map((opt, oIdx) => {
                                        const isSelected = selectedOptionIdx === oIdx;
                                        return (
                                          <button
                                            key={oIdx}
                                            disabled={hasSubmittedQuiz}
                                            onClick={() => {
                                              setQuizAnswers(prev => ({ ...prev, [adv.id]: oIdx }));
                                            }}
                                            className={`w-full text-left p-3 rounded-lg text-xs leading-relaxed transition-all duration-200 border flex items-center justify-between cursor-pointer disabled:cursor-default ${
                                              hasSubmittedQuiz
                                                ? opt.isCorrect
                                                  ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400 font-semibold"
                                                  : isSelected
                                                    ? "bg-rose-950/20 border-rose-500/40 text-rose-400 font-semibold"
                                                    : "bg-slate-900/10 border-slate-950 text-slate-500"
                                                : isSelected
                                                  ? "bg-amber-500/10 border-amber-500/50 text-amber-400 font-semibold"
                                                  : "bg-slate-950 border-slate-900 text-slate-300 hover:border-slate-800 hover:bg-slate-900/40"
                                            }`}
                                          >
                                            <span>{opt.text}</span>
                                            {hasSubmittedQuiz && opt.isCorrect && (
                                              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                                            )}
                                            {hasSubmittedQuiz && isSelected && !opt.isCorrect && (
                                              <X className="w-4 h-4 text-rose-400 stroke-[3]" />
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {!hasSubmittedQuiz ? (
                                      <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                          if (selectedOptionIdx === undefined) return;
                                          setQuizSubmitted(prev => ({ ...prev, [adv.id]: true }));
                                          addAuditLog(`Quiz submitted for ${adv.id}. Citizen choice: Option ${selectedOptionIdx}. Correct: ${adv.quiz.options[selectedOptionIdx].isCorrect}`);
                                        }}
                                        disabled={selectedOptionIdx === undefined}
                                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-bold rounded-lg text-[10px] tracking-wider uppercase transition-all cursor-pointer disabled:cursor-not-allowed"
                                      >
                                        Submit Answer
                                      </motion.button>
                                    ) : (
                                      <div className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-lg border border-slate-900 text-[10px] font-mono leading-relaxed">
                                        <div className={`p-1 rounded ${isQuizCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                                          {isQuizCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className={isQuizCorrect ? "text-emerald-400" : "text-rose-400"}>
                                          {isQuizCorrect 
                                            ? "Vigilant Response! You followed proper cyber safety protocol. Keep it up!" 
                                            : "Critical Vulnerability. Never follow direct calls or download unverified packages. Review prevention protocol."
                                          }
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            SCREEN: SIGN-UP PAGE / CITIZEN FAST TRACK
           ========================================== */}
        {activeScreen === "signup" && (
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12" id="signup-screen">
            {/* Left promo */}
            <div className="md:col-span-5 bg-slate-950 p-8 flex flex-col justify-between border-r border-slate-800">
              <div className="space-y-4">
                <Shield className="w-8 h-8 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-100">National AI Fraud Shield Portal</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Register as an Indian citizen today. Get real-time advisories, trace financial cybercrime attempts, and access the fast-track reporting mainframe.
                </p>
              </div>

              <div className="space-y-2 text-[10px] text-slate-500 font-mono border-t border-slate-900 pt-4">
                <p>• Under the aegis of Cyber Swachhta Kendra</p>
                <p>• Verified secure encryption standards</p>
              </div>
            </div>

            {/* Right form */}
            <form onSubmit={handleRegSubmit} className="md:col-span-7 p-8 space-y-4" id="signup-form">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">Citizen Registration</h3>
              
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Mobile Connection (Linked with Aadhaar)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="signup-submit-btn"
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Continue To Verification</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-500 mt-2">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => setActiveScreen("login")}
                  className="text-amber-400 hover:underline"
                >
                  Log in here
                </button>
              </p>
            </form>
          </div>
        )}

        {/* ==========================================
            SCREEN: REQUEST ACCESS / ROLE SELECTION
           ========================================== */}
        {activeScreen === "request_access" && (
          <div className="max-w-3xl mx-auto space-y-6" id="request-access-screen">
            <div className="text-center space-y-2">
              <span className="text-[9px] font-mono font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 px-2 py-0.5 rounded">
                Credentials Setup
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-100">Request Professional Security Access</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Access to the live threat database, network intelligence tool, and currency scanner is strictly regulated. Please select your official role.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="role-cards-grid">
              {[
                {
                  id: "officer",
                  title: "Law Enforcement",
                  desc: "Police officers, investigators, and intelligence agencies tracing cyber crime trails.",
                  icon: Shield
                },
                {
                  id: "bank_rep",
                  title: "Bank / Financial Rep",
                  desc: "Nodal bank officers and fraud clearance teams managing account freezes.",
                  icon: Building
                },
                {
                  id: "admin",
                  title: "Portal Administrator",
                  desc: "CERT-In systems admins managing threat database registrations.",
                  icon: Sliders
                }
              ].map((role) => (
                <div
                  key={role.id}
                  id={`role-card-${role.id}`}
                  onClick={() => {
                    setSelectedRole(role.id as any);
                    setActiveScreen("your_details");
                    addAuditLog(`Role configuration selected: ${role.title}`);
                  }}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-5 rounded-xl cursor-pointer text-center space-y-3 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                    <role.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-200 text-xs uppercase">{role.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{role.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                id="request-back-btn"
                onClick={() => setActiveScreen("landing")}
                className="text-[11px] text-slate-500 hover:text-slate-400 underline font-mono cursor-pointer"
              >
                Return to general portal
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            SCREEN: YOUR DETAILS PAGE (STEP 2 OF 3)
           ========================================== */}
        {activeScreen === "your_details" && (
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-5" id="details-screen">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-mono text-amber-500 uppercase">Step 2 of 3</span>
                <h3 className="font-bold text-slate-100 text-sm uppercase">Professional Credentials</h3>
              </div>
              <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded font-mono text-slate-400 uppercase tracking-wide">
                Role: {selectedRole.replace("_", " ")}
              </span>
            </div>

            <form onSubmit={handleRegSubmit} className="space-y-4" id="details-form">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Official Nodal Organisation</label>
                <input
                  type="text"
                  required
                  value={regForm.organisation}
                  onChange={(e) => setRegForm({ ...regForm, organisation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                  placeholder="e.g. State Bank of India Nodal Cell, Delhi Police"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Official Government/Employee ID</label>
                <input
                  type="text"
                  required
                  value={regForm.employeeId}
                  onChange={(e) => setRegForm({ ...regForm, employeeId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveScreen("request_access")}
                  className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Back
                </button>
                <button
                  id="details-submit-btn"
                  type="submit"
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-all cursor-pointer"
                >
                  Continue to Step 3
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==========================================
            SCREEN: FINAL VERIFICATION (STEP 3 OF 3)
           ========================================== */}
        {activeScreen === "final_verification" && (
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-5" id="final-verification-screen">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[9px] font-mono text-amber-500 uppercase">Step 3 of 3</span>
              <h3 className="font-bold text-slate-100 text-sm uppercase">Official Document & OTP Code Validation</h3>
            </div>

            <form onSubmit={handleVerificationSubmit} className="space-y-4" id="final-verify-form">
              {/* Document Upload Area */}
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Official Nodal Authorization Document (PDF/ID Photo)</label>
                <div className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950 rounded-lg p-5 text-center transition-all">
                  <Mail className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                  {uploadedIdName ? (
                    <span className="text-xs text-slate-200 font-semibold block">{uploadedIdName}</span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setUploadedIdName("Nodal_Authorization_Cert_CERT-In.pdf")}
                        className="text-xs text-amber-400 font-semibold hover:underline cursor-pointer"
                      >
                        Click to upload credential ID certificate
                      </button>
                      <span className="text-[10px] text-slate-500 block mt-1">PDF, JPG up to 10MB</span>
                    </>
                  )}
                </div>
              </div>

              {/* OTP Input Fields */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-slate-500 uppercase">Enter 6-Digit Nodal OTP Passcode</label>
                <div className="flex justify-between gap-2 max-w-sm" id="otp-input-row">
                  {otpCodes.map((code, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={code}
                      onChange={(e) => {
                        const newCodes = [...otpCodes];
                        newCodes[idx] = e.target.value;
                        setOtpCodes(newCodes);
                      }}
                      className="w-10 h-10 bg-slate-950 border border-slate-800 text-center text-sm font-bold text-slate-200 outline-none rounded focus:border-amber-500/50 font-mono"
                    />
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">A security verification passcode was sent to official email credentials.</p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveScreen("your_details")}
                  className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Back
                </button>
                <button
                  id="final-verify-submit-btn"
                  type="submit"
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-all cursor-pointer"
                >
                  Submit Nodal Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==========================================
            SCREEN: REQUEST SUBMITTED SUCCESS PAGE
           ========================================== */}
        {activeScreen === "success" && (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-center space-y-4" id="submitted-success-screen">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            <h3 className="font-extrabold text-slate-100 text-sm uppercase tracking-wide">Request Submitted Under Review</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our regional CERT-In credentials committee verifies nodal profiles within 4 working hours.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-left text-[11px] text-slate-400 space-y-1">
              <p><span className="font-semibold text-slate-300">Name:</span> {regForm.name}</p>
              <p><span className="font-semibold text-slate-300">Organisation:</span> {regForm.organisation}</p>
              <p><span className="font-semibold text-slate-300">Aadhaar Handset Link:</span> Linked</p>
            </div>

            <div className="pt-2">
              <button
                id="success-login-btn"
                onClick={handleLogin}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-all cursor-pointer"
              >
                Launch Professional Command Console
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            SCREEN: WELCOME BACK / LOGIN PAGE
           ========================================== */}
        {activeScreen === "login" && (
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-5" id="login-screen">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase">Authorized Portal</span>
                <h3 className="font-bold text-slate-100 text-sm uppercase">Welcome back</h3>
              </div>
              <span className="text-[10px] text-amber-500 font-mono">CERT-In Secured</span>
            </div>

            {/* Quick role selection tabs */}
            <div>
              <span className="block text-[10px] font-mono text-slate-500 uppercase mb-2">Select Investigator Profile</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "citizen", label: "Citizen" },
                  { id: "officer", label: "Officer" },
                  { id: "bank_rep", label: "Bank Rep" },
                  { id: "admin", label: "Admin" }
                ].map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id as any)}
                    className={`py-1.5 rounded border font-mono text-[10px] text-center transition-all ${
                      selectedRole === role.id
                        ? "bg-slate-800 border-amber-500/50 text-slate-100"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-500"
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4" id="login-form">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Official Nodal Email / ID</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    required
                    value={regForm.employeeId ? `${regForm.name.toLowerCase().replace(" ", ".")}@govt.in` : "arjun.singh@cert-in.gov.in"}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Passcode Credential</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <button type="button" className="hover:underline">Forgot password?</button>
                <button type="button" onClick={() => setActiveScreen("request_access")} className="text-amber-500 hover:underline font-semibold">Request Nodal Credentials</button>
              </div>

              <div className="pt-2">
                <button
                  id="login-submit-btn"
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-all cursor-pointer"
                >
                  Sovereign Sign In
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==========================================
            SCREEN: COMMAND CENTRE (DASHBOARD)
           ========================================== */}
        {activeScreen === "dashboard" && (
          <CommandCentre onAddAuditLog={addAuditLog} />
        )}

        {/* ==========================================
            SCREEN: SCAM CALL ANALYSER
           ========================================== */}
        {activeScreen === "scam_analyser" && (
          <ScamAnalyser onAddAuditLog={addAuditLog} />
        )}

        {/* ==========================================
            SCREEN: CURRENCY DETECTOR
           ========================================== */}
        {activeScreen === "currency_detector" && (
          <CurrencyForensics onAddAuditLog={addAuditLog} />
        )}

        {/* ==========================================
            SCREEN: NETWORK INTELLIGENCE
           ========================================== */}
        {activeScreen === "network_intel" && (
          <NetworkIntelligence onAddAuditLog={addAuditLog} />
        )}

        {/* ==========================================
            SCREEN: CITIZEN SHIELD PUBLIC PORTAL
           ========================================== */}
        {activeScreen === "citizen_portal" && (
          <CitizenPortal onAddAuditLog={addAuditLog} />
        )}

        {/* ==========================================
            SCREEN: AI SECURITY ASSISTANT
           ========================================== */}
        {activeScreen === "ai_assistant" && (
          <AISecurityAssistant />
        )}

        {/* ==========================================
            SCREEN: REPORTS & INVESTIGATIONS LIST
           ========================================== */}
        {activeScreen === "reports" && (
          <div className="space-y-6" id="reports-screen">
            {/* Header and Controller */}
            <div className="flex justify-between items-center flex-wrap gap-4" id="reports-header-panel">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <span>Central Investigation Records</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">Audit ledgers and compliance files from 36 Indian states.</p>
              </div>

              <button
                id="file-complaint-btn"
                onClick={() => setShowAddReportModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>File Incident Report</span>
              </button>
            </div>

            {/* Static Incident Trend CSS Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5" id="reports-chart-card">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Incident Trend Dynamics</h4>
                  <span className="text-[10px] text-slate-500">Weekly national cyber crime submission count</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <TrendingUp className="w-4 h-4" />
                  <span>+14.2% Increase</span>
                </div>
              </div>

              {/* Pure CSS Area Chart Mock */}
              <div className="h-28 w-full flex items-end gap-3 pt-4 border-b border-slate-800 pb-1" id="reports-trends-bar">
                {[45, 60, 52, 78, 95, 80, 110, 125, 98, 142].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      style={{ height: `${val / 1.5}px` }}
                      className="w-full bg-amber-500/10 hover:bg-amber-500/30 border-t-2 border-amber-500/60 rounded-t transition-all group relative cursor-pointer"
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-[8px] font-mono text-slate-300 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                        {val}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-slate-500">W{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Filter Tools */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-4 items-center" id="reports-filter-tools">
              {/* Query search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  placeholder="Search by reporter name or flagged entity..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                />
              </div>

              {/* State Filter dropdown */}
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 outline-none"
              >
                <option>All States</option>
                <option>Maharashtra</option>
                <option>Karnataka</option>
                <option>Tamil Nadu</option>
                <option>Haryana</option>
                <option>Delhi NCR</option>
              </select>

              {/* Status Filter dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 outline-none"
              >
                <option>All Status</option>
                <option>UNDER INVESTIGATION</option>
                <option>FROZEN</option>
                <option>RESOLVED</option>
                <option>PENDING</option>
              </select>
            </div>

            {/* Table listing */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden" id="reports-list-table">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Case Reference</th>
                      <th className="p-4">Deception Class</th>
                      <th className="p-4">Flagged Entity</th>
                      <th className="p-4">Filer / State</th>
                      <th className="p-4 text-right">Fund Intercepted</th>
                      <th className="p-4">Ledger Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {reports
                      .filter((rep) => {
                        const sQuery = reportSearch.toLowerCase();
                        const matchText = (rep.reporter + rep.targetEntity + rep.category + rep.id).toLowerCase();
                        const matchSearch = matchText.includes(sQuery);
                        const matchState = stateFilter === "All States" || rep.state === stateFilter;
                        const matchStatus = statusFilter === "All Status" || rep.status === statusFilter;
                        return matchSearch && matchState && matchStatus;
                      })
                      .map((rep) => (
                        <tr key={rep.id} className="hover:bg-slate-950/40 transition-all">
                          <td className="p-4">
                            <span className="font-bold text-slate-200 block">{rep.id}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{rep.date}</span>
                          </td>
                          <td className="p-4 font-semibold text-slate-300">{rep.category}</td>
                          <td className="p-4 font-mono text-amber-500 font-bold">{rep.targetEntity}</td>
                          <td className="p-4">
                            <span className="block">{rep.reporter}</span>
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {rep.state}
                            </span>
                          </td>
                          <td className="p-4 text-right font-mono font-bold text-slate-100">
                            {rep.amountLoss || "N/A"}
                          </td>
                          <td className="p-4">
                            <select
                              value={rep.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as any;
                                setReports(reports.map((r) => (r.id === rep.id ? { ...r, status: newStatus } : r)));
                                addAuditLog(`Updated state of Case: ${rep.id} to ${newStatus}`);
                              }}
                              className={`p-1.5 rounded text-[10px] font-bold font-mono outline-none cursor-pointer uppercase ${
                                rep.status === "RESOLVED"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : rep.status === "FROZEN"
                                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                    : rep.status === "UNDER INVESTIGATION"
                                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                      : "bg-slate-800 text-slate-400 border border-slate-700"
                              }`}
                            >
                              <option>PENDING</option>
                              <option>UNDER INVESTIGATION</option>
                              <option>FROZEN</option>
                              <option>RESOLVED</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            SCREEN: ADMIN SIGNUP APPROVAL CONSOLE
           ========================================== */}
        {activeScreen === "signup_requests" && (
          <div className="space-y-6" id="signup-requests-screen">
            {/* Header and Controller */}
            <div className="flex justify-between items-center flex-wrap gap-4" id="requests-header-panel">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-500" />
                  <span>Nodal Registration Approvals</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">Review and verify professional sign-up requests from Law Enforcement and Banks.</p>
              </div>
            </div>

            {/* Admin Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="requests-stats-grid">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Total Requests</span>
                <p className="text-xl font-bold font-mono text-slate-100 mt-1">{officerRequests.length}</p>
              </div>
              <div className="bg-slate-900 border border-amber-500/20 rounded-xl p-4">
                <span className="text-[10px] text-amber-500 uppercase font-mono">Pending Review</span>
                <p className="text-xl font-bold font-mono text-amber-400 mt-1">
                  {officerRequests.filter((r) => r.status === "PENDING").length}
                </p>
              </div>
              <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-4">
                <span className="text-[10px] text-emerald-400 uppercase font-mono">Approved Personnel</span>
                <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  {officerRequests.filter((r) => r.status === "APPROVED").length}
                </p>
              </div>
              <div className="bg-slate-900 border border-rose-500/20 rounded-xl p-4">
                <span className="text-[10px] text-rose-400 uppercase font-mono">Rejected Requests</span>
                <p className="text-xl font-bold font-mono text-rose-400 mt-1">
                  {officerRequests.filter((r) => r.status === "REJECTED").length}
                </p>
              </div>
            </div>

            {/* List Table Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden" id="requests-list-card">
              <div className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-950/40">
                <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">National Credentials Inbox</h3>
                <div className="flex gap-2 text-[10px]">
                  <span className="bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-1 rounded">
                    CERT-In Gov Verification Mainframe
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Reference</th>
                      <th className="p-4">Investigator Name & Role</th>
                      <th className="p-4">Official Organisation</th>
                      <th className="p-4 font-mono">Government ID</th>
                      <th className="p-4">Mobile Contact</th>
                      <th className="p-4">Requested On</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Credential Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {officerRequests.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500 font-mono text-xs">
                          No registration requests logged in the credentials directory.
                        </td>
                      </tr>
                    ) : (
                      officerRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-950/40 transition-all">
                          <td className="p-4 font-bold text-slate-400 font-mono">{req.id}</td>
                          <td className="p-4">
                            <span className="font-bold text-slate-200 block">{req.name}</span>
                            <span className="text-[10px] text-amber-500 uppercase tracking-wider font-semibold font-mono">
                              {req.role.replace("_", " ")}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-slate-300">{req.organisation}</td>
                          <td className="p-4 font-mono text-slate-100 font-semibold">{req.employeeId}</td>
                          <td className="p-4 font-mono text-slate-400">{req.phone}</td>
                          <td className="p-4 text-slate-400 font-mono">{req.date}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border uppercase ${
                                req.status === "APPROVED"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : req.status === "REJECTED"
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2 justify-center">
                              {req.status === "PENDING" ? (
                                <>
                                  <button
                                    onClick={() => {
                                      setOfficerRequests(
                                        officerRequests.map((r) =>
                                          r.id === req.id ? { ...r, status: "APPROVED" } : r
                                        )
                                      );
                                      addAuditLog(`APPROVED government credentials for ${req.name} (${req.organisation})`);
                                    }}
                                    className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <Check className="w-3 h-3 stroke-[3px]" />
                                    <span>Accept</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setOfficerRequests(
                                        officerRequests.map((r) =>
                                          r.id === req.id ? { ...r, status: "REJECTED" } : r
                                        )
                                      );
                                      addAuditLog(`REJECTED government credentials for ${req.name} (${req.organisation})`);
                                    }}
                                    className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-slate-950 font-extrabold rounded text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <X className="w-3 h-3 stroke-[3px]" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-mono italic">
                                  Processed
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            SCREEN: USER SETTINGS
           ========================================== */}
        {activeScreen === "settings" && (
          <div className="max-w-3xl mx-auto space-y-6" id="settings-screen">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center" id="investigator-profile-summary">
              {/* Avatar Photo */}
              <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-slate-500" />
              </div>

              <div className="text-center md:text-left space-y-1">
                <h3 className="font-extrabold text-slate-100 text-sm uppercase">Arjun Singh</h3>
                <p className="text-xs text-slate-400 font-medium">Senior Cyber Investigator @ CERT-In Division</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1 text-[10px]">
                  <span className="bg-slate-950 text-slate-500 font-mono px-2 py-0.5 rounded">ID: CERT-2026-993</span>
                  <span className="bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded font-bold">Clearance Level III</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Sidebar Tabs Mock */}
              <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1.5 h-fit">
                {["investigator-profile", "security-policy", "localization-key", "system-mainframes"].map((tb, idx) => (
                  <button
                    key={idx}
                    className={`w-full text-left p-2.5 rounded-lg text-xs capitalize transition-all ${
                      idx === 0 ? "bg-slate-800 text-slate-100 font-semibold" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tb.replace("-", " ")}
                  </button>
                ))}
              </div>

              {/* Tab Form Content */}
              <div className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 space-y-4" id="settings-form-pane">
                <h4 className="font-semibold text-xs text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800">Investigator Profile settings</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Official Email</label>
                    <input
                      type="email"
                      disabled
                      value="arjun.singh@cert-in.gov.in"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-400 outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Phone</label>
                    <input
                      type="text"
                      disabled
                      value="+91 98382 11093"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-400 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Localization Settings</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="radio"
                        name="lang"
                        checked={language === "en"}
                        onChange={() => setLanguage("en")}
                        className="accent-amber-500"
                      />
                      <span>English Interface (UK)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="radio"
                        name="lang"
                        checked={language === "hi"}
                        onChange={() => setLanguage("hi")}
                        className="accent-amber-500"
                      />
                      <span>हिंदी (Hindi Translation)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/60 text-right">
                  <button
                    onClick={() => {
                      addAuditLog("System parameters saved successfully.");
                      alert("Profile configuration update complete.");
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. Bottom Audit Logs Console Drawer (for forensic reality) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-900 shadow-2xl" id="audit-drawer-console">
        {/* Drawer Trigger */}
        <div
          onClick={() => setShowAuditDrawer(!showAuditDrawer)}
          className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 flex justify-between items-center cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">CERT-In Ledger Audit Terminal</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">{showAuditDrawer ? "Collapse Terminal" : "Expand logs"}</span>
        </div>

        {/* Drawer logs area */}
        {showAuditDrawer && (
          <div className="p-5 font-mono text-[10px] text-slate-400 bg-slate-950 max-h-44 overflow-y-auto space-y-1">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-amber-500">[LEDGER]</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Compliant Modals: File Complaint Modal */}
      {showAddReportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" id="complaint-modal-layer">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl" id="complaint-modal-content">
            <div className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-950">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4.5 h-4.5 text-amber-500" />
                <span>Submit Nodal Cyber Incident</span>
              </h3>
              <button
                onClick={() => setShowAddReportModal(false)}
                className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreateReportSubmit} className="p-5 space-y-4 text-xs" id="new-incident-form">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Deception Category</label>
                <select
                  value={newReport.category}
                  onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 outline-none text-slate-300"
                >
                  <option>Digital Arrest Impersonation</option>
                  <option>UPI Merchant QR Phishing</option>
                  <option>Electricity Suspension Threat</option>
                  <option>Part-Time Job YouTube Bait</option>
                  <option>Aadhaar e-KYC Malicious APK</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Filer Full Name</label>
                  <input
                    type="text"
                    required
                    value={newReport.reporter}
                    onChange={(e) => setNewReport({ ...newReport, reporter: e.target.value })}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 outline-none text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Flagged suspect entity (Phone/UPI/Link)</label>
                  <input
                    type="text"
                    required
                    value={newReport.targetEntity}
                    onChange={(e) => setNewReport({ ...newReport, targetEntity: e.target.value })}
                    placeholder="e.g. +91 91029..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 outline-none text-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Filer State Location</label>
                  <select
                    value={newReport.state}
                    onChange={(e) => setNewReport({ ...newReport, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 outline-none text-slate-300"
                  >
                    <option>Delhi NCR</option>
                    <option>Maharashtra</option>
                    <option>Karnataka</option>
                    <option>Tamil Nadu</option>
                    <option>Jharkhand</option>
                    <option>Haryana</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Funds lost (INR)</label>
                  <input
                    type="number"
                    value={newReport.amountLoss}
                    onChange={(e) => setNewReport({ ...newReport, amountLoss: e.target.value })}
                    placeholder="e.g. 45000 (Optional)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 outline-none text-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Operational Description</label>
                <textarea
                  required
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 outline-none text-slate-300 resize-none leading-relaxed"
                  placeholder="Provide detailed logs or evidence pointers of extortion/baiting tactics..."
                />
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddReportModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="modal-submit-complaint"
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-all cursor-pointer"
                >
                  Transmit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
