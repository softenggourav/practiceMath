import React, { createContext, useContext, useReducer, useEffect } from 'react';

const QuizContext = createContext();

const initialState = {
  // Quiz configuration
  quizConfig: {
    operations: [],
    difficulty: 'medium',
    questionCount: 10,
    timerEnabled: false,
    timerSeconds: 30,
    autoAdvance: false,
  },
  // Current quiz state
  currentQuiz: {
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    startTime: null,
    isActive: false,
  },
  // Quiz results
  results: {
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    averageTime: 0,
    questionResults: [],
  },
};

const quizReducer = (state, action) => {
  switch (action.type) {
    case 'SET_QUIZ_CONFIG':
      return {
        ...state,
        quizConfig: { ...state.quizConfig, ...action.payload },
      };
    case 'START_QUIZ':
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          questions: action.payload.questions,
          currentQuestionIndex: 0,
          answers: [],
          startTime: Date.now(),
          isActive: true,
        },
      };
    case 'SUBMIT_ANSWER':
      const { answer, isCorrect, timeSpent } = action.payload;
      const newAnswers = [...state.currentQuiz.answers];
      newAnswers[state.currentQuiz.currentQuestionIndex] = {
        answer,
        isCorrect,
        timeSpent,
      };
      
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          answers: newAnswers,
        },
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          currentQuestionIndex: state.currentQuiz.currentQuestionIndex + 1,
        },
      };
    case 'FINISH_QUIZ':
      const totalQuestions = state.currentQuiz.questions.length;
      const correctAnswers = state.currentQuiz.answers.filter(a => a.isCorrect).length;
      const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      const totalTime = state.currentQuiz.answers.reduce((sum, a) => sum + a.timeSpent, 0);
      const averageTime = totalQuestions > 0 ? totalTime / totalQuestions : 0;
      
      return {
        ...state,
        currentQuiz: {
          ...state.currentQuiz,
          isActive: false,
        },
        results: {
          totalQuestions,
          correctAnswers,
          accuracy,
          averageTime,
          questionResults: state.currentQuiz.questions.map((q, i) => ({
            question: q,
            userAnswer: state.currentQuiz.answers[i]?.answer || null,
            correctAnswer: q.correctAnswer,
            isCorrect: state.currentQuiz.answers[i]?.isCorrect || false,
            timeSpent: state.currentQuiz.answers[i]?.timeSpent || 0,
          })),
        },
      };
    case 'RESET_QUIZ':
      return {
        ...state,
        currentQuiz: initialState.currentQuiz,
        results: initialState.results,
      };
    default:
      return state;
  }
};

export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('mentalMathConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        dispatch({ type: 'SET_QUIZ_CONFIG', payload: config });
      } catch (error) {
        console.error('Failed to load saved config:', error);
      }
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('mentalMathConfig', JSON.stringify(state.quizConfig));
  }, [state.quizConfig]);

  const value = {
    state,
    dispatch,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}; 