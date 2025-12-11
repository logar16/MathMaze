import { Difficulty, MathProblem } from './types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateWrongAnswers(correct: number, count: number): number[] {
  const wrong: Set<number> = new Set();

  while (wrong.size < count) {
    const offset = getRandomInt(-10, 10);
    const wrongAnswer = correct + offset;
    if (wrongAnswer !== correct && wrongAnswer >= 0) {
      wrong.add(wrongAnswer);
    }
  }

  return Array.from(wrong);
}

export function generateMathProblem(difficulty: Difficulty): MathProblem {
  let num1: number, num2: number, answer: number, question: string;

  switch (difficulty) {
    case 'easy': // 1st grade: addition/subtraction up to 20
      if (Math.random() > 0.5) {
        num1 = getRandomInt(1, 10);
        num2 = getRandomInt(1, 10);
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
      } else {
        num1 = getRandomInt(5, 20);
        num2 = getRandomInt(1, num1);
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
      }
      break;

    case 'medium': // 2nd grade: addition/subtraction up to 50, simple multiplication
      const operation = Math.random();
      if (operation < 0.4) {
        num1 = getRandomInt(10, 30);
        num2 = getRandomInt(1, 20);
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
      } else if (operation < 0.8) {
        num1 = getRandomInt(15, 50);
        num2 = getRandomInt(1, num1);
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
      } else {
        num1 = getRandomInt(2, 5);
        num2 = getRandomInt(2, 5);
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
      }
      break;

    case 'hard': // 3rd grade: larger numbers, multiplication/division
      const hardOp = Math.random();
      if (hardOp < 0.3) {
        num1 = getRandomInt(20, 100);
        num2 = getRandomInt(10, 50);
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
      } else if (hardOp < 0.6) {
        num1 = getRandomInt(50, 100);
        num2 = getRandomInt(10, num1);
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
      } else if (hardOp < 0.9) {
        num1 = getRandomInt(2, 12);
        num2 = getRandomInt(2, 12);
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
      } else {
        num2 = getRandomInt(2, 10);
        answer = getRandomInt(2, 12);
        num1 = num2 * answer;
        question = `${num1} ÷ ${num2}`;
      }
      break;
  }

  // Generate 3 wrong answers
  const wrongAnswers = generateWrongAnswers(answer, 3);
  const options = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);

  return {
    question,
    answer,
    options,
  };
}
