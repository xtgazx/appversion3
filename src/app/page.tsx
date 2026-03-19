"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Brain,
  CalendarDays,
  CheckCircle2,
  Home,
  Sparkles,
  X,
} from "lucide-react";
import { areaColorOptions, defaultColor } from "../lib/data/initialData";
import { readStoredData, saveStoredData } from "../lib/storage/localStorage";
import type {
  Area,
  BrainConvertType,
  ConfirmState,
  IconKey,
  RenameAreaState,
  TabKey,
} from "../lib/types/shared";
import { uid } from "../lib/utils/ids";
import { BottomTab } from "../components/ui/BottomTab";
import { ConfirmDialog } from "../components/shared/ConfirmDialog";
import { AreaGrid } from "../features/areas/components/AreaGrid";
import { AreaDetailView } from "../features/areas/components/AreaDetailView";
import { NewAreaModal } from "../features/areas/components/NewAreaModal";
import { RenameAreaModal } from "../features/areas/components/RenameAreaModal";
import { ProjectDetailView } from "../features/projects/components/ProjectDetailView";
import {
  selectAllTasks,
  selectTodayTasks,
  selectWeekTasks,
} from "../features/tasks/taskSelectors";

export default function Page() {
  const stored = readStoredData();

  const [tab, setTab] = useState<TabKey>("areas");
  const [areas, setAreas] = useState<Area[]>(stored.areas);
  const [brainItems, setBrainItems] = useState(stored.brainItems);

  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [areaMenuOpen, setAreaMenuOpen] = useState<string | null>(null);
  const [editingAreaIconId, setEditingAreaIconId] = useState<string | null>(null);

  const [showNewArea, setShowNewArea] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaColor, setNewAreaColor] =
    useState<(typeof areaColorOptions)[number]>(defaultColor);
  const [newAreaIcon, setNewAreaIcon] = useState<IconKey>("clipboard");

  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [renameAreaState, setRenameAreaState] =
    useState<RenameAreaState>(null);

  const saveTimerRef = useRef<number | null>(null);

  // ✅ LOAD FROM DATABASE ON START
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/load-state");
        const json = await res.json();

        if (json.success && json.data) {
          setAreas(json.data.areas ?? []);
          setBrainItems(json.data.brainItems ?? []);
        }
      } catch (e) {
        console.error("Load failed", e);
      }
    })();
  }, []);

  // ✅ SAVE TO DATABASE (DEBOUNCED)
  useEffect(() => {
    // keep local backup
    saveStoredData({ areas, brainItems });

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      fetch("/api/save-state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ areas, brainItems }),
      });
    }, 500);
  }, [areas, brainItems]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const selectedArea =
    areas.find((area) => area.id === selectedAreaId) ?? null;

  const selectedProject =
    selectedArea?.projects.find((p) => p.id === selectedProjectId) ?? null;

  const allTasks = useMemo(() => selectAllTasks(areas), [areas]);
  const todayTasks = useMemo(() => selectTodayTasks(allTasks), [allTasks]);
  const weekTasks = useMemo(() => selectWeekTasks(allTasks), [allTasks]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20">
      {tab === "areas" && !selectedArea && (
        <AreaGrid
          areas={areas}
          setAreas={setAreas}
          onOpenArea={(id) => setSelectedAreaId(id)}
          areaMenuOpen={areaMenuOpen}
          setAreaMenuOpen={setAreaMenuOpen}
          editingAreaIconId={editingAreaIconId}
          setEditingAreaIconId={setEditingAreaIconId}
          setRenameAreaState={setRenameAreaState}
          setConfirmState={setConfirmState}
        />
      )}

      {selectedArea && !selectedProject && (
        <AreaDetailView
          area={selectedArea}
          setAreas={setAreas}
          onBack={() => setSelectedAreaId(null)}
          onOpenProject={(id) => setSelectedProjectId(id)}
        />
      )}

      {selectedProject && selectedArea && (
        <ProjectDetailView
          area={selectedArea}
          project={selectedProject}
          setAreas={setAreas}
          onBack={() => setSelectedProjectId(null)}
        />
      )}

      <BottomTab tab={tab} setTab={setTab} />

      <NewAreaModal
        open={showNewArea}
        setOpen={setShowNewArea}
        newAreaName={newAreaName}
        setNewAreaName={setNewAreaName}
        newAreaColor={newAreaColor}
        setNewAreaColor={setNewAreaColor}
        newAreaIcon={newAreaIcon}
        setNewAreaIcon={setNewAreaIcon}
        onCreate={() => {
          if (!newAreaName.trim()) return;

          setAreas([
            ...areas,
            {
              id: uid(),
              name: newAreaName,
              color: newAreaColor,
              icon: newAreaIcon,
              projects: [],
              tasks: [],
            },
          ]);

          setNewAreaName("");
          setShowNewArea(false);
        }}
      />

      <RenameAreaModal
        state={renameAreaState}
        setState={setRenameAreaState}
        setAreas={setAreas}
      />

      <ConfirmDialog
        state={confirmState}
        setState={setConfirmState}
      />
    </div>
  );
}