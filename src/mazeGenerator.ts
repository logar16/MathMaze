import { CellType, Position } from './types';

export interface MazeConfig {
  width: number;
  height: number;
}

export function generateMaze(config: MazeConfig): {
  maze: CellType[][];
  start: Position;
  exit: Position;
} {
  const { width, height } = config;

  // Initialize maze with all walls
  const maze: CellType[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill('wall'));

  const start: Position = { x: 0, y: 0 };
  const exit: Position = { x: width - 1, y: height - 1 };

  // Create paths using recursive backtracking with moderate branching
  const visited = new Set<string>();
  
  // Function to carve passages - more selective branching
  function carve(x: number, y: number, depth: number = 0): void {
    const key = `${x},${y}`;
    if (visited.has(key)) return;
    
    visited.add(key);
    maze[y][x] = 'empty';

    // Get all possible directions in random order
    const directions = [
      { x: x + 1, y: y },
      { x: x - 1, y: y },
      { x: x, y: y + 1 },
      { x: x, y: y - 1 },
    ].sort(() => Math.random() - 0.5);

    for (const next of directions) {
      if (next.x >= 0 && next.x < width && next.y >= 0 && next.y < height) {
        const nextKey = `${next.x},${next.y}`;
        if (!visited.has(nextKey)) {
          // More controlled branching - 40% chance, less likely as depth increases
          const branchChance = depth < 3 ? 0.6 : 0.4;
          if (Math.random() < branchChance) {
            carve(next.x, next.y, depth + 1);
          }
        }
      }
    }
  }

  // Start carving from start position
  carve(start.x, start.y);

  // Make sure exit is reachable, carve if needed
  if (maze[exit.y][exit.x] === 'wall') {
    carve(exit.x, exit.y);
  }

  // Create fewer additional paths - reduce from 15% to 5%
  const numExtraPaths = Math.floor((width * height) * 0.05);
  for (let i = 0; i < numExtraPaths; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    if (maze[y][x] === 'empty') {
      carve(x, y);
    }
  }

  // Ensure connectivity by checking and fixing
  if (!isReachable(maze, start, exit)) {
    // Create a direct connection using BFS to find and carve path
    connectStartToExit(maze, start, exit);
  }

  // Don't add more walls - we want a good balance
  // The carved passages already provide good structure

  maze[exit.y][exit.x] = 'exit';

  return { maze, start, exit };
}

// Connect start to exit if they're not connected
function connectStartToExit(maze: CellType[][], start: Position, exit: Position): void {
  const height = maze.length;
  const width = maze[0].length;
  
  // Simple carve toward exit
  let current = { ...start };
  maze[current.y][current.x] = 'empty';
  
  while (current.x !== exit.x || current.y !== exit.y) {
    maze[current.y][current.x] = 'empty';
    
    // Move toward exit
    if (current.x < exit.x && Math.random() > 0.3) {
      current.x++;
    } else if (current.x > exit.x && Math.random() > 0.3) {
      current.x--;
    } else if (current.y < exit.y && Math.random() > 0.3) {
      current.y++;
    } else if (current.y > exit.y && Math.random() > 0.3) {
      current.y--;
    } else {
      // Random walk
      const moves = [];
      if (current.x > 0) moves.push({ x: current.x - 1, y: current.y });
      if (current.x < width - 1) moves.push({ x: current.x + 1, y: current.y });
      if (current.y > 0) moves.push({ x: current.x, y: current.y - 1 });
      if (current.y < height - 1) moves.push({ x: current.x, y: current.y + 1 });
      if (moves.length > 0) {
        current = moves[Math.floor(Math.random() * moves.length)];
      }
    }
  }
  maze[exit.y][exit.x] = 'empty';
}

// Simple BFS to check if exit is reachable from start
function isReachable(maze: CellType[][], start: Position, exit: Position): boolean {
  const height = maze.length;
  const width = maze[0].length;
  const visited = new Set<string>();
  const queue: Position[] = [start];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.x},${current.y}`;

    if (current.x === exit.x && current.y === exit.y) {
      return true;
    }

    if (visited.has(key)) continue;
    visited.add(key);

    // Check all four directions
    const directions = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];

    for (const next of directions) {
      if (next.x >= 0 && next.x < width && next.y >= 0 && next.y < height) {
        if (maze[next.y][next.x] !== 'wall' && !visited.has(`${next.x},${next.y}`)) {
          queue.push(next);
        }
      }
    }
  }

  return false;
}

export function getMazeConfigForLevel(level: number): MazeConfig {
  // Start with 6x6, gradually increase size for more path variety
  const baseSize = 6;
  const sizeIncrease = Math.floor(level / 2);
  const size = Math.min(baseSize + sizeIncrease, 14);

  return {
    width: size,
    height: size,
  };
}
