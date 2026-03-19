import {
  areaColorOptions,
  initialAreas,
  initialBrainItems,
} from "../data/initialData";
import type { StoredData } from "../types/shared";
import { normalizeArea, normalizeBrainItem } from "../utils/normalize";

export const STORAGE_KEY = "life-dashboard-canvas-v1";

export function readStoredData(): StoredData {
  if (typeof window === "undefined") {
    return { areas: initialAreas, brainItems: initialBrainItems };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { areas: initialAreas, brainItems: initialBrainItems };
    }

    const parsed = JSON.parse(raw) as {
      areas?: unknown[];
      brainItems?: unknown[];
    };

    const areas = Array.isArray(parsed.areas)
      ? (parsed.areas
          .map((value) => normalizeArea(value, areaColorOptions))
          .filter(Boolean) as StoredData["areas"])
      : initialAreas;

    const brainItems = Array.isArray(parsed.brainItems)
      ? (parsed.brainItems
          .map(normalizeBrainItem)
          .filter(Boolean) as StoredData["brainItems"])
      : initialBrainItems;

    return {
      areas: areas.length ? areas : initialAreas,
      brainItems,
    };
  } catch {
    return { areas: initialAreas, brainItems: initialBrainItems };
  }
}

export function saveStoredData(data: StoredData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}