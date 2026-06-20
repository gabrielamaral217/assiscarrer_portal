"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Imprimir / PDF" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="btn-accent inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold no-print"
    >
      <Printer size={15} /> {label}
    </button>
  );
}
