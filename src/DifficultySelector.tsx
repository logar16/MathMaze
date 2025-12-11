import { Difficulty } from './types';
import './DifficultySelector.css';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
}

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  return (
    <div className="difficulty-selector">
      <h1>Math Maze</h1>
      {/* <p className="subtitle">Solve problems to navigate the maze!</p> */}

      <div className="difficulty-buttons">
        <button
          className="difficulty-btn easy"
          onClick={() => onSelect('easy')}
        >
          <div className="btn-title">Easy</div>
          <div className="btn-subtitle">1st Grade</div>
          <div className="btn-description">Addition & subtraction up to 20</div>
        </button>

        <button
          className="difficulty-btn medium"
          onClick={() => onSelect('medium')}
        >
          <div className="btn-title">Medium</div>
          <div className="btn-subtitle">2nd Grade</div>
          <div className="btn-description">Larger numbers & simple multiplication</div>
        </button>

        <button
          className="difficulty-btn hard"
          onClick={() => onSelect('hard')}
        >
          <div className="btn-title">Hard</div>
          <div className="btn-subtitle">3rd Grade</div>
          <div className="btn-description">All operations including division</div>
        </button>
      </div>
    </div>
  );
}
