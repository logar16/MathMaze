export type Difficulty = 'easy' | 'medium' | 'hard';
export type InputMode = 'multiple-choice' | 'keyboard';

export interface Position {
  x: number;
  y: number;
}

export type CellType = 'empty' | 'wall' | 'player' | 'exit';

export interface MathProblem {
  question: string;
  answer: number;
  options: number[];
}

export interface GameState {
  difficulty: Difficulty | null;
  inputMode: InputMode;
  level: number;
  score: number;
  maze: CellType[][];
  playerPos: Position;
  exitPos: Position;
  currentProblem: MathProblem | null;
  previousPos: Position | null;
  gameStatus: 'menu' | 'playing' | 'answering' | 'won' | 'moving';
  moveCount: number;
  problemStartTime: number | null;
  feedback: { message: string; isCorrect: boolean; equation?: string } | null;
}
