export interface MazeColors {
  wall: string;
  empty: string;
  exit: string;
}

export interface AppSettings {
  playerCharacter: string;
  mazeColors: MazeColors;
}

export const DEFAULT_MAZE_COLORS: MazeColors = {
  wall: '#cc2222',
  empty: '#1a6dcc',
  exit: '#7ee8f0',
};

// Pool used for random initial character selection
const RANDOM_CHARACTER_POOL = [
  '🧙', '🧝', '🧛', '🧟', '🦸', '🦹', '🧚', '👾', '🤖', '👻', '💀', '🥷',
  '🐱', '🐶', '🐰', '🦊', '🐻', '🐸', '🦄', '🦖', '🐉',
  '⭐', '🔥', '❄️', '⚡', '💎', '🚀',
];

export function randomPlayerCharacter(): string {
  return RANDOM_CHARACTER_POOL[Math.floor(Math.random() * RANDOM_CHARACTER_POOL.length)];
}

export const DEFAULT_SETTINGS: AppSettings = {
  playerCharacter: '🧙',
  mazeColors: DEFAULT_MAZE_COLORS,
};

export const SETTINGS_STORAGE_KEY = 'mathmaze-settings';
