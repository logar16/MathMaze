import { Leaf, Zap, Flame, Crown } from "lucide-react";
import { Difficulty } from "./types";
import "./DifficultySelector.css";

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
}

const DIFFICULTY_META = {
  easy: {
    icon: Leaf,
    label: "Easy",
    grade: "1st Grade",
    desc: "Addition & subtraction up to 20",
  },
  medium: {
    icon: Zap,
    label: "Medium",
    grade: "2nd Grade",
    desc: "Larger numbers & simple multiplication",
  },
  hard: {
    icon: Flame,
    label: "Hard",
    grade: "3rd Grade",
    desc: "All operations including division",
  },
  master: {
    icon: Crown,
    label: "Master",
    grade: "Expert",
    desc: "Large numbers with heavy division focus",
  },
} as const;

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  return (
    <div className="difficulty-selector">
      <div className="menu-logo">
        <span className="menu-logo-maze">MATH</span>
        <span className="menu-logo-math">MAZE</span>
      </div>
      <p className="subtitle">Solve problems to navigate the maze</p>

      <div className="difficulty-buttons">
        {(
          Object.entries(DIFFICULTY_META) as [
            Difficulty,
            (typeof DIFFICULTY_META)[keyof typeof DIFFICULTY_META],
          ][]
        ).map(([key, meta]) => {
          const Icon = meta.icon;
          return (
            <button
              key={key}
              className={`difficulty-btn ${key}`}
              onClick={() => onSelect(key)}
            >
              <div className="btn-icon">
                <Icon size={22} strokeWidth={2} />
              </div>
              <div className="btn-title">{meta.label}</div>
              <div className="btn-subtitle">{meta.grade}</div>
              <div className="btn-description">{meta.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
