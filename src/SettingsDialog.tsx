import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSettingsContext } from './SettingsContext';
import { MazeColors } from './settings';
import './SettingsDialog.css';

const EMOJI_CATEGORIES: { label: string; emojis: string[] }[] = [
  {
    label: 'Adventurers',
    emojis: ['🧙', '🧝', '🧛', '🧟', '🦸', '🦹', '🧜', '🧚', '👾', '🤖', '👻', '💀', '🥷', '🕵️', '🧑‍🚀'],
  },
  {
    label: 'Animals',
    emojis: ['🐱', '🐶', '🐭', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐙', '🦋', '🐢', '🦄', '🦖', '🦕', '🐉'],
  },
  {
    label: 'Food',
    emojis: ['🍎', '🍕', '🍔', '🌮', '🍦', '🍩', '🧁', '🍪', '🍫', '🍿', '🌯', '🥑', '🍣', '🧋'],
  },
  {
    label: 'Objects',
    emojis: ['⭐', '🌟', '💥', '🔥', '❄️', '⚡', '🌈', '💎', '🎮', '🎯', '🚀', '🛸', '🏆', '🎭', '🎪'],
  },
];

const COLOR_PRESETS: { label: string; colors: MazeColors }[] = [
  { label: 'Classic',  colors: { wall: '#cc2222', empty: '#1a6dcc', exit: '#7ee8f0' } },
  { label: 'Forest',   colors: { wall: '#2d6a1f', empty: '#a8d5a2', exit: '#1b4a12' } },
  { label: 'Ocean',    colors: { wall: '#1a3a6b', empty: '#4fc3f7', exit: '#0d2545' } },
  { label: 'Lava',     colors: { wall: '#ff9500', empty: '#500202', exit: '#f4ec0b' } },
  { label: 'Midnight', colors: { wall: '#020240', empty: '#01152d', exit: '#1b001f' } },
  { label: 'Candy',    colors: { wall: '#d63384', empty: '#ffc8dd', exit: '#8b0042' } },
];

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { settings, updateSettings } = useSettingsContext();
  const [activeCategory, setActiveCategory] = useState(0);

  if (!isOpen) return null;

  const updateColor = (key: keyof MazeColors, value: string) => {
    updateSettings({ mazeColors: { ...settings.mazeColors, [key]: value } });
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-dialog" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <div className="settings-body">
        {/* ── Character Picker ── */}
        <div className="settings-section">
          <div className="settings-label">Player Character</div>
          <div className="character-preview">{settings.playerCharacter}</div>

          <div className="category-tabs">
            {EMOJI_CATEGORIES.map((cat, i) => (
              <button
                key={cat.label}
                className={`category-tab${activeCategory === i ? ' active' : ''}`}
                onClick={() => setActiveCategory(i)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="emoji-grid">
            {EMOJI_CATEGORIES[activeCategory].emojis.map(emoji => (
              <button
                key={emoji}
                className={`emoji-btn${settings.playerCharacter === emoji ? ' selected' : ''}`}
                onClick={() => updateSettings({ playerCharacter: emoji })}
                aria-label={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-divider" />

        {/* ── Maze Colors ── */}
        <div className="settings-section">
          <div className="settings-label">Maze Colors</div>

          <div className="color-presets">
            {COLOR_PRESETS.map(preset => (
              <button
                key={preset.label}
                className="color-preset-btn"
                title={preset.label}
                onClick={() => updateSettings({ mazeColors: preset.colors })}
                style={{
                  '--preset-wall': preset.colors.wall,
                  '--preset-empty': preset.colors.empty,
                } as React.CSSProperties}
              >
                <span className="color-preset-label">{preset.label}</span>
              </button>
            ))}
          </div>

          <div className="color-pickers">
            {([
              { key: 'wall',  label: 'Wall' },
              { key: 'empty', label: 'Path' },
              { key: 'exit',  label: 'Exit' },
            ] as { key: keyof MazeColors; label: string }[]).map(({ key, label }) => (
              <label key={key} className="color-picker-row">
                <span className="color-picker-label">{label}</span>
                <input
                  type="color"
                  value={settings.mazeColors[key]}
                  onChange={e => updateColor(key, e.target.value)}
                  className="color-input"
                />
                <span className="color-hex">{settings.mazeColors[key]}</span>
              </label>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
