import { useState, useEffect, useRef } from 'react';
import { MathProblem, InputMode } from './types';
import './MathProblemDisplay.css';

interface MathProblemDisplayProps {
  problem: MathProblem;
  onAnswer: (answer: number) => void;
  inputMode: InputMode;
}

export function MathProblemDisplay({ problem, onAnswer, inputMode }: MathProblemDisplayProps) {
  const [typedAnswer, setTypedAnswer] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when keyboard mode
    if (inputMode === 'keyboard' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputMode]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && typedAnswer) {
      const numAnswer = parseInt(typedAnswer, 10);
      if (!isNaN(numAnswer)) {
        onAnswer(numAnswer);
        setTypedAnswer('');
      }
    }
  };

  const handleSubmit = () => {
    if (typedAnswer) {
      const numAnswer = parseInt(typedAnswer, 10);
      if (!isNaN(numAnswer)) {
        onAnswer(numAnswer);
        setTypedAnswer('');
      }
    }
  };

  if (inputMode === 'keyboard') {
    return (
      <div className="math-problem">
        <h2 className="problem-question">{problem.question} = ?</h2>
        <div className="keyboard-input">
          <input
            ref={inputRef}
            type="number"
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type answer..."
            className="answer-input"
          />
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!typedAnswer}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="math-problem">
      <h2 className="problem-question">{problem.question} = ?</h2>
      <div className="answer-options">
        {problem.options.map((option, index) => (
          <button
            key={index}
            className="answer-button"
            onClick={() => onAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
