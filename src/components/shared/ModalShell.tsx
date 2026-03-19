import React from "react";

export function ModalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/35 px-4 pb-24 pt-8">
      {children}
    </div>
  );
}