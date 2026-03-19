import React from "react";
import { Plus } from "lucide-react";
import type { Area, IconKey } from "../../../lib/types/shared";
import { Card } from "../../../components/ui/Card";
import { AreaTile } from "./AreaTile";

export function AreaGrid({
  areas,
  areaMenuOpen,
  editingAreaIconId,
  onOpenArea,
  onOpenNewArea,
  onToggleAreaMenu,
  onToggleEditingAreaIcon,
  onRenameArea,
  onCycleAreaColor,
  onDeleteArea,
  onSetAreaIcon,
}: {
  areas: Area[];
  areaMenuOpen: string | null;
  editingAreaIconId: string | null;
  onOpenArea: (areaId: string) => void;
  onOpenNewArea: () => void;
  onToggleAreaMenu: (areaId: string) => void;
  onToggleEditingAreaIcon: (areaId: string) => void;
  onRenameArea: (areaId: string) => void;
  onCycleAreaColor: (areaId: string) => void;
  onDeleteArea: (areaId: string) => void;
  onSetAreaIcon: (areaId: string, iconKey: IconKey) => void;
}) {
  return (
    <Card className="shadow-xl shadow-indigo-100/50 dark:shadow-black/30">
      <div className="px-5 pb-3 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Life Areas
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Tap a tile to open the area.
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenNewArea}
            className="rounded-full bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            <Plus className="mr-1 inline h-4 w-4" /> New Area
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-5 pb-5 md:grid-cols-4">
        {areas.map((area) => (
          <AreaTile
            key={area.id}
            area={area}
            isMenuOpen={areaMenuOpen === area.id}
            isEditingIcon={editingAreaIconId === area.id}
            onOpenArea={() => onOpenArea(area.id)}
            onToggleMenu={() => onToggleAreaMenu(area.id)}
            onToggleEditingIcon={() => onToggleEditingAreaIcon(area.id)}
            onRenameArea={() => onRenameArea(area.id)}
            onCycleAreaColor={() => onCycleAreaColor(area.id)}
            onDeleteArea={() => onDeleteArea(area.id)}
            onSetAreaIcon={(iconKey) => onSetAreaIcon(area.id, iconKey)}
          />
        ))}
      </div>
    </Card>
  );
}