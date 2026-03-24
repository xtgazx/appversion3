import React from "react";
import { Card } from "../../../components/ui/Card";

export function ReviewView() {
  return (
    <Card>
      <div className="px-5 pb-3 pt-5">
        <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Weekly Review
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Get your system clean and ready for the week
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Review screen coming next.
        </div>
      </div>
    </Card>
  );
}
