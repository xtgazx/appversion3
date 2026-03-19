import React, { useEffect, useRef } from "react";
import { GripVertical, MoreVertical } from "lucide-react";
import { iconMap } from "../../../lib/icons/iconMap";
import type { Area, IconKey } from "../../../lib/types/shared";
import { AreaMenu } from "./AreaMenu";

export function AreaTile({
  area,
  isMenuOpen,
  isEditingIcon,
  onOpenArea,
  onToggleMenu,
  onToggleEditingIcon,
  onRenameArea,
  onCycleAreaColor,
  onDeleteArea,
  onSetAreaIcon,
}: {
  area: Area;
  isMenuOpen: boolean;
  isEditingIcon: boolean;
  onOpenArea: () => void;
  onToggleMenu: () => void;
  onToggleEditingIcon: () => void;
  onRenameArea: () => void;
  onCycleAreaColor: () => void;
  onDeleteArea: () => void;
  onSetAreaIcon: (iconKey: IconKey) => void;
}) {
  const tileRef = useRef<HTMLDivElement | null>(null);
  const Icon =
    iconMap[area.iconKey as keyof typeof iconMap] ?? iconMap.clipboard;

  useEffect(() => {
    if (!isMenuOpen) return;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!tileRef.current) return;
      if (!tileRef.current.contains(event.target as Node)) {
        onToggleMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onToggleMenu();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, onToggleMenu]);

  return (
    <div ref={tileRef} className="relative">
      <div
        className={`relative w-full rounded-2xl border border-slate-200 bg-gradient-to-b p-4 text-left shadow-lg shadow-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-700 dark:from-slate-800 dark:to-slate-700/90 dark:shadow-black/30 ${area.color}`}
      >
        <button
          type="button"
          aria-label={`Open ${area.name}`}
          onClick={onOpenArea}
          className="absolute inset-0 z-0 rounded-2xl"
        />

        <div className="relative z-10 mb-3 flex items-start justify-between gap-3">
          <div className="pointer-events-none rounded-2xl bg-white/85 p-2.5 shadow-sm dark:bg-slate-900/80">
            <Icon className="h-5 w-5 text-slate-700 dark:text-slate-100" />
          </div>

          <div className="relative z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMenu();
              }}
              className="rounded-full bg-white/85 p-2 text-slate-500 shadow-sm hover:text-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-slate-100"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            <div className="pointer-events-none rounded-full bg-white/85 p-2 text-slate-400 shadow-sm dark:bg-slate-900/80 dark:text-slate-500">
              <GripVertical className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        <div className="pointer-events-none relative z-10 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {area.name}
        </div>

        <div className="pointer-events-none relative z-10 mt-1 text-xs text-slate-600 dark:text-slate-400">
          {area.projects.length} projects · {area.tasks.length} tasks
        </div>
      </div>

      {isMenuOpen && (
        <AreaMenu
          area={area}
          isEditingIcon={isEditingIcon}
          onRenameArea={onRenameArea}
          onCycleAreaColor={onCycleAreaColor}
          onToggleEditingIcon={onToggleEditingIcon}
          onOpenArea={onOpenArea}
          onDeleteArea={onDeleteArea}
          onSetAreaIcon={onSetAreaIcon}
        />
      )}
    </div>
  );
}