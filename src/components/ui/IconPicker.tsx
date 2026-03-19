import React from "react";
import { iconKeys, iconMap } from "../../lib/icons/iconMap";
import type { IconKey } from "../../lib/types/shared";

export function IconPicker({
  selected,
  onSelect,
}: {
  selected: IconKey;
  onSelect: (icon: IconKey) => void;
}) {
  const pageSize = 5;
  const pages = Array.from(
    { length: Math.ceil(iconKeys.length / pageSize) },
    (_, index) => iconKeys.slice(index * pageSize, index * pageSize + pageSize)
  );

  return (
    <div className="space-y-2">
      <div className="sm:hidden">
        <div className="overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex snap-x snap-mandatory gap-3">
            {pages.map((page, pageIndex) => (
              <div
                key={pageIndex}
                className="grid min-w-full shrink-0 snap-start grid-cols-5 gap-2"
              >
                {page.map((key) => {
                  const Icon = iconMap[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onSelect(key)}
                      className={`flex h-11 items-center justify-center rounded-xl border ${
                        key === selected
                          ? "border-slate-900 bg-slate-100 dark:border-slate-100 dark:bg-slate-700"
                          : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          Swipe to see more icons
        </div>
      </div>

      <div className="hidden sm:grid sm:grid-cols-6 sm:gap-2">
        {iconKeys.map((key) => {
          const Icon = iconMap[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`flex h-11 items-center justify-center rounded-xl border ${
                key === selected
                  ? "border-slate-900 bg-slate-100 dark:border-slate-100 dark:bg-slate-700"
                  : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
              }`}
            >
              <Icon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            </button>
          );
        })}
      </div>
    </div>
  );
}