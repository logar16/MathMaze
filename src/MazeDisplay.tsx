import React from "react";
import { CellType, Position } from "./types";
import { MazeColors } from "./settings";
import "./MazeDisplay.css";

interface MazeDisplayProps {
  maze: CellType[][];
  playerPos: Position;
  exitPos: Position;
  playerCharacter: string;
  mazeColors: MazeColors;
}

export function MazeDisplay({
  maze,
  playerPos,
  exitPos,
  playerCharacter,
  mazeColors,
}: MazeDisplayProps) {
  const cssVars = {
    "--maze-wall": mazeColors.wall,
    "--maze-empty": mazeColors.empty,
    "--maze-exit": mazeColors.exit,
  } as React.CSSProperties;

  return (
    <div className="maze" style={cssVars}>
      {maze.map((row, y) => (
        <div key={y} className="maze-row">
          {row.map((cell, x) => {
            const isPlayer = playerPos.x === x && playerPos.y === y;
            const isExit = exitPos.x === x && exitPos.y === y;

            let className = "maze-cell";
            if (cell === "wall") {
              className += " wall";
            } else if (isExit) {
              className += " exit";
            } else {
              className += " empty";
            }
            if (isPlayer) className += " player";

            return (
              <div key={x} className={className}>
                {isPlayer && playerCharacter}
                {isExit && !isPlayer && "🏁"}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
