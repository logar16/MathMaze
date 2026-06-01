import { useState } from 'react';
import { AppSettings, DEFAULT_SETTINGS, DEFAULT_MAZE_COLORS, SETTINGS_STORAGE_KEY, randomPlayerCharacter } from './settings';

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        mazeColors: { ...DEFAULT_MAZE_COLORS, ...parsed.mazeColors },
      };
    }
  } catch {
    // ignore parse errors
  }
  // First visit: pick a random character
  return { ...DEFAULT_SETTINGS, playerCharacter: randomPlayerCharacter() };
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  const updateSettings = (patch: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  return { settings, updateSettings };
}
