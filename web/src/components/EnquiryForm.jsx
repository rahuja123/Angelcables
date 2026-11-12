"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Send } from "lucide-react";
import { API_URL } from "@/lib/site";

const inputClass =
  "w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-brand transition-colors";

/**
 * Generic enquiry form posting JSON to the FastAPI backend.
 * fields: [{ name, label, type?, required?, placeholder?, rows?, half? }]
 */
export default function EnquiryForm({ endpoint, fields, submitLabel, successTitle, successText, errorText }) {
  const empty = Object.fromEntries(fields.map((f) => [f.name, ""]));
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState(null); // null | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    const missing = fields.filter((f) => f.required && !form[f.name].trim());
    if (missing.length) {
      setStatus("error");
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setStatus("sending");
    try {
      // The free-tier API can take ~30–60 s to wake from sleep, so allow a long timeout.
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 75000);
      const res = await fetch(`${API_URL}/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      setForm(empty);
    } catch {
      setStatus("error");
      setErrorMsg(errorText);
    }
  }

  if (status === "success") {
    return (
      <div className="mt-8 p-6 bg-green-50 border border-green-200 text-center" role="status">
        <CheckCircle size={40} aria-hidden="true" className="text-green-600 mx-auto mb-3" />
        <p className="text-lg font-bold text-green-800 font-display">{successTitle}</p>
        <p className="text-green-700 text-sm mt-1">{successText}</p>
        <button type="button" onClick={() => setStatus(null)} className="mt-4 text-sm font-bold text-green-700 underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5" noValidate>
      {fields.map((f) => {
        const id = `field-${f.name}`;
        return (
          <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
            <label htmlFor={id} className="text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-1.5 block">
              {f.label} {f.required && <span className="text-brand">*</span>}
            </label>
            {f.rows ? (
              <textarea id={id} name={f.name} value={form[f.name]} onChange={onChange} required={f.required} rows={f.rows} placeholder={f.placeholder} className={`${inputClass} resize-none`} />
            ) : (
              <input
                id={id}
                type={f.type || "text"}
                name={f.name}
                value={form[f.name]}
                onChange={onChange}
                required={f.required}
                placeholder={f.placeholder}
                autoComplete={f.autoComplete}
                className={inputClass}
              />
            )}
          </div>
        );
      })}

      {status === "error" && (
        <p className="sm:col-span-2 flex items-center gap-2 text-red-600 text-sm" role="alert">
          <AlertCircle size={16} aria-hidden="true" /> {errorMsg}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-brand text-white px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {status === "sending" ? "Sending…" : (
            <>
              {submitLabel} <Send size={16} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
