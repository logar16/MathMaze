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

  // Carve 2-3 distinct winding paths from start to exit with different starting directions
  const numMainPaths = 2 + Math.floor(Math.random() * 2); // 2 or 3 paths

  // Force each path to start in a different direction
  const startingDirections = ['right', 'down', 'right-down'];

  for (let pathIndex = 0; pathIndex < numMainPaths; pathIndex++) {
    const initialDirection = startingDirections[pathIndex % startingDirections.length];
    carvePath(maze, start, exit, width, height, pathIndex === 0, initialDirection);
  }

  maze[exit.y][exit.x] = 'exit';

  return { maze, start, exit };
}

// Carve a winding path from start toward exit
function carvePath(
  maze: CellType[][],
  start: Position,
  exit: Position,
  width: number,
  height: number,
  isMainPath: boolean,
  initialDirection: string
): void {
  let current = { ...start };
  maze[current.y][current.x] = 'empty';

  const visited = new Set<string>();
  const maxSteps = width * height; // Prevent infinite loops
  let steps = 0;

  // Force initial direction for first 3-4 steps to create distinct paths
  const forcedSteps = 3 + Math.floor(Math.random() * 2);
  for (let i = 0; i < forcedSteps && steps < maxSteps; i++) {
    steps++;
    const key = `${current.x},${current.y}`;
    visited.add(key);
    maze[current.y][current.x] = 'empty';

    let moved = false;

    if (initialDirection === 'right' && current.x < width - 1) {
      current.x++;
      moved = true;
    } else if (initialDirection === 'down' && current.y < height - 1) {
      current.y++;
      moved = true;
    } else if (initialDirection === 'right-down') {
      // Alternate between right and down
      if (i % 2 === 0 && current.x < width - 1) {
        current.x++;
        moved = true;
      } else if (current.y < height - 1) {
        current.y++;
        moved = true;
      } else if (current.x < width - 1) {
        current.x++;
        moved = true;
      }
    }

    if (!moved) break; // Hit a boundary, stop forcing direction
    maze[current.y][current.x] = 'empty';
  }

  while ((current.x !== exit.x || current.y !== exit.y) && steps < maxSteps) {
    steps++;
    const key = `${current.x},${current.y}`;
    visited.add(key);
    maze[current.y][current.x] = 'empty';

    // Calculate direction bias toward exit
    const toExitX = exit.x - current.x;
    const toExitY = exit.y - current.y;

    // Build weighted direction choices
    const directions: { pos: Position; weight: number }[] = [];

    // Forward directions (toward exit) - higher weight
    if (toExitX > 0 && current.x < width - 1) {
      directions.push({ pos: { x: current.x + 1, y: current.y }, weight: isMainPath ? 5 : 3 });
    }
    if (toExitX < 0 && current.x > 0) {
      directions.push({ pos: { x: current.x - 1, y: current.y }, weight: isMainPath ? 5 : 3 });
    }
    if (toExitY > 0 && current.y < height - 1) {
      directions.push({ pos: { x: current.x, y: current.y + 1 }, weight: isMainPath ? 5 : 3 });
    }
    if (toExitY < 0 && current.y > 0) {
      directions.push({ pos: { x: current.x, y: current.y - 1 }, weight: isMainPath ? 5 : 3 });
    }

    // Perpendicular directions for zigzag - medium weight
    if (Math.abs(toExitX) > Math.abs(toExitY)) {
      // Moving horizontally, allow vertical zigzags
      if (current.y > 0) directions.push({ pos: { x: current.x, y: current.y - 1 }, weight: 2 });
      if (current.y < height - 1) directions.push({ pos: { x: current.x, y: current.y + 1 }, weight: 2 });
    } else {
      // Moving vertically, allow horizontal zigzags
      if (current.x > 0) directions.push({ pos: { x: current.x - 1, y: current.y }, weight: 2 });
      if (current.x < width - 1) directions.push({ pos: { x: current.x + 1, y: current.y }, weight: 2 });
    }

    // Occasional backward movement for more complex paths - low weight
    if (Math.random() < 0.2) {
      if (toExitX > 0 && current.x > 0) {
        directions.push({ pos: { x: current.x - 1, y: current.y }, weight: 1 });
      }
      if (toExitX < 0 && current.x < width - 1) {
        directions.push({ pos: { x: current.x + 1, y: current.y }, weight: 1 });
      }
      if (toExitY > 0 && current.y > 0) {
        directions.push({ pos: { x: current.x, y: current.y - 1 }, weight: 1 });
      }
      if (toExitY < 0 && current.y < height - 1) {
        directions.push({ pos: { x: current.x, y: current.y + 1 }, weight: 1 });
      }
    }

    // Filter out visited positions to keep paths more distinct
    const validDirections = directions.filter(d => {
      const dKey = `${d.pos.x},${d.pos.y}`;
      // First path can visit anywhere, subsequent paths avoid previous paths more
      return !visited.has(dKey) || (isMainPath && Math.random() < 0.2);
    });

    if (validDirections.length === 0) {
      // Dead end - try any unvisited direction
      const anyDirections = directions.filter(d => !visited.has(`${d.pos.x},${d.pos.y}`));
      if (anyDirections.length === 0) break; // Truly stuck
      current = anyDirections[Math.floor(Math.random() * anyDirections.length)].pos;
    } else {
      // Weighted random selection
      const totalWeight = validDirections.reduce((sum, d) => sum + d.weight, 0);
      let random = Math.random() * totalWeight;

      for (const dir of validDirections) {
        random -= dir.weight;
        if (random <= 0) {
          current = dir.pos;
          break;
        }
      }
    }
  }

  // Make sure we reached the exit
  maze[exit.y][exit.x] = 'empty';
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
