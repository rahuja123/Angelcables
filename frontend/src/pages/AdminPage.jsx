import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Lock, Users, MessageSquare, BarChart3, RefreshCw, LogOut } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const ADMIN_KEY = "angel-admin-2025";

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white border border-slate-200 p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-black text-[#0F172A]">{value ?? "—"}</div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-500">{label}</div>
      </div>
    </div>
  );
}

function Table({ columns, rows, emptyMsg }) {
  if (!rows?.length) return <p className="text-slate-400 text-sm py-6 text-center">{emptyMsg}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((c) => (
              <th key={c.key} className="text-left px-4 py-3 font-semibold text-slate-600 uppercase tracking-wider text-xs">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-slate-700">
                  {c.render ? c.render(row[c.key], row) : row[c.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [keyError, setKeyError] = useState("");
  const [stats, setStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");

  async function fetchAll(key) {
    setLoading(true);
    try {
      const headers = { "x-admin-key": key };
      const [sRes, cRes, dRes] = await Promise.all([
        fetch(`${API}/api/admin/stats`, { headers }),
        fetch(`${API}/api/admin/contacts`, { headers }),
        fetch(`${API}/api/admin/dealer-enquiries`, { headers }),
      ]);
      if (sRes.status === 403) {
        setAuthed(false);
        setKeyError("Invalid admin key.");
        return;
      }
      setStats(await sRes.json());
      setContacts(await cRes.json());
      setDealers(await dRes.json());
      setAuthed(true);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    setKeyError("");
    if (!keyInput.trim()) { setKeyError("Enter the admin key."); return; }
    fetchAll(keyInput.trim());
  }

  if (!authed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F8FAFC]">
        <Helmet>
          <title>Admin — Angel Cables</title>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <form onSubmit={handleLogin} className="bg-white border border-slate-200 shadow-sm p-10 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={20} className="text-[#EA580C]" />
            <h1 className="text-xl font-black text-[#0F172A]" style={{ fontFamily: "Chivo" }}>Admin Login</h1>
          </div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 mb-2">Admin Key</label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="w-full border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#EA580C] mb-1"
            placeholder="Enter admin key"
            autoFocus
          />
          {keyError && <p className="text-red-500 text-xs mb-3">{keyError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#EA580C] text-white py-2.5 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating…" : "Sign In"}
          </button>
        </form>
      </div>
    );
  }

  const contactCols = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "subject", label: "Subject" },
    { key: "message", label: "Message", render: (v) => <span className="line-clamp-2 max-w-xs block">{v}</span> },
    { key: "created_at", label: "Date", render: formatDate },
  ];

  const dealerCols = [
    { key: "name", label: "Name" },
    { key: "company", label: "Company" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "message", label: "Message", render: (v) => <span className="line-clamp-2 max-w-xs block">{v}</span> },
    { key: "created_at", label: "Date", render: formatDate },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Helmet>
        <title>Admin — Angel Cables</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      {/* Header */}
      <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 size={20} className="text-[#EA580C]" />
          <span className="font-black text-lg" style={{ fontFamily: "Chivo" }}>Angel Cables Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAll(ADMIN_KEY)}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={() => { setAuthed(false); setKeyInput(""); }}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-red-400 transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Products" value={stats?.products} icon={BarChart3} color="bg-blue-500" />
          <StatCard label="Contact Messages" value={stats?.contacts} icon={MessageSquare} color="bg-[#EA580C]" />
          <StatCard label="Dealer Enquiries" value={stats?.dealer_enquiries} icon={Users} color="bg-green-600" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 mb-6">
          {[
            { id: "contacts", label: `Contact Messages (${contacts.length})`, icon: MessageSquare },
            { id: "dealers", label: `Dealer Enquiries (${dealers.length})`, icon: Users },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === t.id
                  ? "border-[#EA580C] text-[#EA580C]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 shadow-sm">
          {activeTab === "contacts" && (
            <Table columns={contactCols} rows={contacts} emptyMsg="No contact messages yet." />
          )}
          {activeTab === "dealers" && (
            <Table columns={dealerCols} rows={dealers} emptyMsg="No dealer enquiries yet." />
          )}
        </div>
      </div>
    </div>
  );
}
