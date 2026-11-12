"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 border border-slate-600 text-slate-300 px-5 py-2.5 text-sm font-bold hover:bg-slate-800 transition-colors"
    >
      <Printer size={15} aria-hidden="true" /> Print
    </button>
  );
}
