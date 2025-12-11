import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { GameState, Difficulty, Position } from './types'
import { generateMaze, getMazeConfigForLevel } from './mazeGenerator'
import { generateMathProblem } from './mathProblems'
import { DifficultySelector } from './DifficultySelector'
import { MazeDisplay } from './MazeDisplay'
import { MathProblemDisplay } from './MathProblemDisplay'

function App() {
  const [gameState, setGameState] = useState<GameState>({
    difficulty: null,
    inputMode: 'multiple-choice',
    level: 1,
    score: 0,
    maze: [],
    playerPos: { x: 0, y: 0 },
    exitPos: { x: 0, y: 0 },
    currentProblem: null,
    previousPos: null,
    gameStatus: 'menu',
    moveCount: 0,
    problemStartTime: null,
    feedback: null,
  });

  // Initialize new level
  const initializeLevel = useCallback((difficulty: Difficulty, level: number) => {
    const config = getMazeConfigForLevel(level);
    const { maze, start, exit } = generateMaze(config);

    setGameState(prev => ({
      ...prev,
      difficulty,
      level,
      maze,
      playerPos: start,
      exitPos: exit,
      currentProblem: null,
      previousPos: null,
      gameStatus: 'playing',
      moveCount: 0,
    }));
  }, []);

  // Start game with selected difficulty
  const handleDifficultySelect = (difficulty: Difficulty) => {
    initializeLevel(difficulty, 1);
  };

  // Check if move is valid
  const canMoveTo = (pos: Position): boolean => {
    const { maze } = gameState;
    if (pos.y < 0 || pos.y >= maze.length) return false;
    if (pos.x < 0 || pos.x >= maze[0].length) return false;
    return maze[pos.y][pos.x] !== 'wall';
  };

  // Handle player movement attempt
  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState.gameStatus !== 'playing') return;

    const newPos: Position = { ...gameState.playerPos };

    switch (direction) {
      case 'up': newPos.y -= 1; break;
      case 'down': newPos.y += 1; break;
      case 'left': newPos.x -= 1; break;
      case 'right': newPos.x += 1; break;
    }

    if (canMoveTo(newPos)) {
      // Generate math problem - store the intended destination
      const problem = generateMathProblem(gameState.difficulty!);
      setGameState(prev => ({
        ...prev,
        currentProblem: problem,
        previousPos: newPos, // Store where we want to move to
        gameStatus: 'answering',
        problemStartTime: Date.now(),
      }));
    }
  };

  // Handle answer to math problem
  const handleAnswer = (answer: number) => {
    if (!gameState.currentProblem || !gameState.previousPos) return;

    const isCorrect = answer === gameState.currentProblem.answer;
    const timeTaken = Date.now() - (gameState.problemStartTime || Date.now());

    // Different speed bonus thresholds based on input mode
    const speedBonus = gameState.inputMode === 'keyboard'
      ? (timeTaken < 5000 ? 10 : timeTaken < 10000 ? 5 : 0)
      : (timeTaken < 3000 ? 10 : timeTaken < 5000 ? 5 : 0);

    const correctAnswer = gameState.currentProblem.answer;
    const question = gameState.currentProblem.question;
    const equation = `${question} = ${correctAnswer}`;

    if (isCorrect) {
      // Move to the intended destination (stored in previousPos)
      const newPos: Position = gameState.previousPos;

      // Check if reached exit
      if (newPos.x === gameState.exitPos.x && newPos.y === gameState.exitPos.y) {
        setGameState(prev => ({
          ...prev,
          playerPos: newPos,
          score: prev.score + 100 + speedBonus,
          gameStatus: 'won',
          currentProblem: null,
          moveCount: prev.moveCount + 1,
          feedback: { message: speedBonus > 0 ? `Speed Bonus! +${10 + speedBonus}` : 'Correct!', isCorrect: true, equation },
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          playerPos: newPos,
          score: prev.score + 10 + speedBonus,
          currentProblem: null,
          gameStatus: 'playing',
          moveCount: prev.moveCount + 1,
          feedback: { message: speedBonus > 0 ? `Speed Bonus! +${10 + speedBonus}` : 'Correct!', isCorrect: true, equation },
        }));
      }
    } else {
      // Wrong answer - show feedback with correct answer
      setGameState(prev => ({
        ...prev,
        currentProblem: null,
        gameStatus: 'playing',
        score: Math.max(0, prev.score - 5),
        feedback: { message: 'Wrong Answer', isCorrect: false, equation },
      }));
    }

    // Auto-dismiss feedback after 2 seconds
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        feedback: null,
      }));
    }, 2000);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleMove('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleMove('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleMove('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameStatus, gameState.playerPos, gameState.maze]);

  // Next level
  const handleNextLevel = () => {
    if (gameState.difficulty) {
      initializeLevel(gameState.difficulty, gameState.level + 1);
    }
  };

  // Reset game
  const handleReset = () => {
    setGameState(prev => ({
      ...prev,
      difficulty: null,
      level: 1,
      score: 0,
      gameStatus: 'menu',
    }));
  };

  // Toggle input mode
  const toggleInputMode = () => {
    setGameState(prev => ({
      ...prev,
      inputMode: prev.inputMode === 'multiple-choice' ? 'keyboard' : 'multiple-choice',
    }));
  };

  return (
    <div className="App">
      {gameState.gameStatus === 'menu' && (
        <DifficultySelector onSelect={handleDifficultySelect} />
      )}

      {gameState.gameStatus !== 'menu' && (
        <div className="game-container">
          <div className="game-header">
            <div className="stat">Level: {gameState.level}</div>
            <div className="stat">Score: {gameState.score}</div>
            <div className="stat">Moves: {gameState.moveCount}</div>
            <button className="mode-toggle-btn" onClick={toggleInputMode}>
              {gameState.inputMode === 'multiple-choice' ? '🎯 Multiple Choice' : '⌨️ Keyboard'}
            </button>
            <button className="reset-btn" onClick={handleReset}>Main Menu</button>
          </div>

          <MazeDisplay
            maze={gameState.maze}
            playerPos={gameState.playerPos}
            exitPos={gameState.exitPos}
          />

          {gameState.feedback && (
            <div className={`feedback-toast ${gameState.feedback.isCorrect ? 'correct' : 'wrong'}`}>
              <div className="feedback-message">{gameState.feedback.message}</div>
              {gameState.feedback.equation && (
                <div className="feedback-equation">{gameState.feedback.equation}</div>
              )}
            </div>
          )}

          {gameState.gameStatus === 'playing' && (
            <div className="instructions">
              Use arrow keys or WASD to move character
            </div>
          )}

          {gameState.gameStatus === 'answering' && gameState.currentProblem && (
            <MathProblemDisplay
              problem={gameState.currentProblem}
              onAnswer={handleAnswer}
              inputMode={gameState.inputMode}
            />
          )}

          {gameState.gameStatus === 'won' && (
            <div className="win-message">
              <h2>🎉 Level Complete! 🎉</h2>
              <p>Moves: {gameState.moveCount}</p>
              <button className="next-level-btn" onClick={handleNextLevel}>
                Next Level
              </button>
              <button className="reset-btn" onClick={handleReset}>
                Main Menu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
