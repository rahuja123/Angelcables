"use client";

import { useState } from "react";
import { Lock, Users, MessageSquare, BarChart3, RefreshCw, LogOut } from "lucide-react";
import { API_URL } from "@/lib/site";

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white border border-slate-200 p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" aria-hidden="true" />
      </div>
      <div>
        <div className="text-2xl font-black text-navy">{value ?? "—"}</div>
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
              <th key={c.key} scope="col" className="text-left px-4 py-3 font-semibold text-slate-600 uppercase tracking-wider text-xs">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-slate-700">
                  {c.render ? c.render(row[c.key], row) : row[c.key] || "—"}
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

const clamp = (v) => <span className="line-clamp-2 max-w-xs block">{v}</span>;

const contactCols = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "subject", label: "Subject" },
  { key: "message", label: "Message", render: clamp },
  { key: "created_at", label: "Date", render: formatDate },
];

const dealerCols = [
  { key: "name", label: "Name" },
  { key: "company", label: "Company" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "city", label: "City" },
  { key: "message", label: "Message", render: clamp },
  { key: "created_at", label: "Date", render: formatDate },
];

export default function AdminDashboard() {
  // The key lives only in memory for this tab — it is never bundled into the site's JavaScript.
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [keyError, setKeyError] = useState("");
  const [stats, setStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");

  async function fetchAll(key) {
    setLoading(true);
    setKeyError("");
    try {
      const headers = { "x-admin-key": key };
      const [s, c, d] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/contacts`, { headers }),
        fetch(`${API_URL}/api/admin/dealer-enquiries`, { headers }),
      ]);
      if (!s.ok || !c.ok || !d.ok) {
        setAdminKey("");
        setKeyError(s.status === 401 || s.status === 403 ? "Invalid admin key." : "Could not load data. Try again.");
        return;
      }
      setStats(await s.json());
      setContacts(await c.json());
      setDealers(await d.json());
      setAdminKey(key);
    } catch {
      setKeyError("Server unreachable — it may be waking up. Try again in a minute.");
    } finally {
      setLoading(false);
    }
  }

  if (!adminKey) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-surface">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!keyInput.trim()) return setKeyError("Enter the admin key.");
            fetchAll(keyInput.trim());
          }}
          className="bg-white border border-slate-200 shadow-sm p-10 w-full max-w-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock size={20} className="text-brand" aria-hidden="true" />
            <h1 className="text-xl font-black text-navy">Admin Login</h1>
          </div>
          <label htmlFor="admin-key" className="block text-xs font-mono uppercase tracking-wider text-slate-600 mb-2">
            Admin Key
          </label>
          <input
            id="admin-key"
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="w-full border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:border-brand mb-1"
            placeholder="Enter admin key"
            autoComplete="current-password"
          />
          {keyError && <p className="text-red-500 text-xs mb-3" role="alert">{keyError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-brand text-white py-2.5 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating…" : "Sign In"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-navy text-white px-6 py-4 flex items-center justify-between">
        <h1 className="flex items-center gap-3 font-black text-lg">
          <BarChart3 size={20} className="text-brand" aria-hidden="true" /> Angel Cables Admin
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchAll(adminKey)}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} aria-hidden="true" /> Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              setAdminKey("");
              setKeyInput("");
            }}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-red-400 transition-colors"
          >
            <LogOut size={14} aria-hidden="true" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Products" value={stats?.products} icon={BarChart3} color="bg-blue-500" />
          <StatCard label="Contact Messages" value={stats?.contacts} icon={MessageSquare} color="bg-brand" />
          <StatCard label="Dealer Enquiries" value={stats?.dealer_enquiries} icon={Users} color="bg-green-600" />
        </div>

        <div className="flex gap-2 border-b border-slate-200 mb-6" role="tablist">
          {[
            { id: "contacts", label: `Contact Messages (${contacts.length})`, icon: MessageSquare },
            { id: "dealers", label: `Dealer Enquiries (${dealers.length})`, icon: Users },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === t.id ? "border-brand text-brand" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <t.icon size={14} aria-hidden="true" /> {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 shadow-sm">
          {activeTab === "contacts" ? (
            <Table columns={contactCols} rows={contacts} emptyMsg="No contact messages yet." />
          ) : (
            <Table columns={dealerCols} rows={dealers} emptyMsg="No dealer enquiries yet." />
          )}
        </div>
      </div>
    </div>
  );
}
