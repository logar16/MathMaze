import { CellType, Position } from './types';
import './MazeDisplay.css';

interface MazeDisplayProps {
  maze: CellType[][];
  playerPos: Position;
  exitPos: Position;
}

export function MazeDisplay({ maze, playerPos, exitPos }: MazeDisplayProps) {
  return (
    <div className="maze">
      {maze.map((row, y) => (
        <div key={y} className="maze-row">
          {row.map((cell, x) => {
            const isPlayer = playerPos.x === x && playerPos.y === y;
            const isExit = exitPos.x === x && exitPos.y === y;

            let className = 'maze-cell';
            if (cell === 'wall') className += ' wall';
            else if (isExit) className += ' exit';
            else className += ' empty';
            if (isPlayer) className += ' player';

            return (
              <div key={x} className={className}>
                {isPlayer && '💀'}
                {isExit && !isPlayer && '🏁'}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
