// Question generator utility
export const OPERATIONS = {
  ADDITION: '+',
  SUBTRACTION: '-',
  MULTIPLICATION: '×',
  DIVISION: '÷',
};

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

// Generate random number based on difficulty
const generateNumber = (difficulty) => {
  switch (difficulty) {
    case DIFFICULTY_LEVELS.EASY:
      return Math.floor(Math.random() * 9) + 1; // 1-9
    case DIFFICULTY_LEVELS.MEDIUM:
      return Math.floor(Math.random() * 900) + 10; // 10-999
    case DIFFICULTY_LEVELS.HARD:
      return Math.floor(Math.random() * 9000) + 100; // 100-9999
    default:
      return Math.floor(Math.random() * 900) + 10;
  }
};

// Generate decimal number for hard difficulty
const generateDecimalNumber = () => {
  const whole = Math.floor(Math.random() * 100) + 1;
  const decimal = Math.floor(Math.random() * 100);
  return parseFloat(`${whole}.${decimal.toString().padStart(2, '0')}`);
};

// Generate question based on operation and difficulty
const generateQuestion = (operation, difficulty) => {
  let num1, num2, correctAnswer, questionText;

  switch (operation) {
    case OPERATIONS.ADDITION:
      if (difficulty === DIFFICULTY_LEVELS.HARD && Math.random() < 0.3) {
        num1 = generateDecimalNumber();
        num2 = generateDecimalNumber();
      } else {
        num1 = generateNumber(difficulty);
        num2 = generateNumber(difficulty);
      }
      correctAnswer = num1 + num2;
      questionText = `${num1} + ${num2}`;
      break;

    case OPERATIONS.SUBTRACTION:
      if (difficulty === DIFFICULTY_LEVELS.HARD && Math.random() < 0.3) {
        num1 = generateDecimalNumber();
        num2 = generateDecimalNumber();
      } else {
        num1 = generateNumber(difficulty);
        num2 = generateNumber(difficulty);
      }
      // Ensure positive result for easier mental math
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }
      correctAnswer = num1 - num2;
      questionText = `${num1} - ${num2}`;
      break;

    case OPERATIONS.MULTIPLICATION:
      if (difficulty === DIFFICULTY_LEVELS.EASY) {
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
      } else if (difficulty === DIFFICULTY_LEVELS.MEDIUM) {
        num1 = Math.floor(Math.random() * 90) + 10;
        num2 = Math.floor(Math.random() * 9) + 1;
      } else {
        num1 = Math.floor(Math.random() * 90) + 10;
        num2 = Math.floor(Math.random() * 90) + 10;
      }
      correctAnswer = num1 * num2;
      questionText = `${num1} × ${num2}`;
      break;

    case OPERATIONS.DIVISION:
      if (difficulty === DIFFICULTY_LEVELS.EASY) {
        num2 = Math.floor(Math.random() * 9) + 1;
        num1 = num2 * (Math.floor(Math.random() * 9) + 1);
      } else if (difficulty === DIFFICULTY_LEVELS.MEDIUM) {
        num2 = Math.floor(Math.random() * 9) + 1;
        num1 = num2 * (Math.floor(Math.random() * 90) + 10);
      } else {
        num2 = Math.floor(Math.random() * 90) + 10;
        num1 = num2 * (Math.floor(Math.random() * 90) + 10);
      }
      correctAnswer = num1 / num2;
      questionText = `${num1} ÷ ${num2}`;
      break;

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return {
    questionText,
    correctAnswer: parseFloat(correctAnswer.toFixed(2)),
    operation,
    difficulty,
  };
};

// Generate a set of questions
export const generateQuestions = (operations, difficulty, count) => {
  if (!operations || operations.length === 0) {
    throw new Error('At least one operation must be selected');
  }

  const questions = [];
  for (let i = 0; i < count; i++) {
    const randomOperation = operations[Math.floor(Math.random() * operations.length)];
    const question = generateQuestion(randomOperation, difficulty);
    questions.push(question);
  }

  return questions;
};

// Validate answer input
export const validateAnswer = (input) => {
  if (!input || input.trim() === '') {
    return { isValid: false, error: 'Please enter an answer' };
  }

  const trimmed = input.trim();
  const normalized = trimmed.replace(/^\./, '0.'); // Convert .5 to 0.5

  const number = parseFloat(normalized);
  if (isNaN(number)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }

  return { isValid: true, value: number };
};

// Check if answer is correct
export const checkAnswer = (userAnswer, correctAnswer) => {
  const tolerance = 0.01; // Allow small floating point differences
  return Math.abs(userAnswer - correctAnswer) < tolerance;
}; 