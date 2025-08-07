import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  LinearProgress,
  Alert,
  Fade,
  CircularProgress,
} from '@mui/material';
import { CheckCircle, Cancel, Timer } from '@mui/icons-material';
import { useQuiz } from '../contexts/QuizContext';
import { validateAnswer, checkAnswer } from '../utils/questionGenerator';

const QuizPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useQuiz();
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const questionStartTime = useRef(null);
  const timerRef = useRef(null);

  const { currentQuiz, quizConfig } = state;
  const currentQuestion = currentQuiz.questions[currentQuiz.currentQuestionIndex];
  const progress = (currentQuiz.currentQuestionIndex / currentQuiz.questions.length) * 100;

  // Initialize timer when question changes
  useEffect(() => {
    if (quizConfig.timerEnabled && currentQuestion) {
      setTimeLeft(quizConfig.timerSeconds);
      questionStartTime.current = Date.now();
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuiz.currentQuestionIndex, quizConfig.timerEnabled, quizConfig.timerSeconds]);

  // Reset state for new question
  useEffect(() => {
    setAnswer('');
    setError('');
    setFeedback(null);
    setIsAnswered(false);
    setIsSubmitting(false);
    setTimeLeft(quizConfig.timerEnabled ? quizConfig.timerSeconds : null);
  }, [currentQuiz.currentQuestionIndex, quizConfig.timerEnabled, quizConfig.timerSeconds]);

  const handleTimeout = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const timeSpent = quizConfig.timerSeconds;
    const isCorrect = false;
    
    dispatch({
      type: 'SUBMIT_ANSWER',
      payload: {
        answer: null,
        isCorrect,
        timeSpent,
      },
    });

    setFeedback({
      type: 'timeout',
      message: `Time's up! The correct answer was ${currentQuestion.correctAnswer}`,
    });
    setIsAnswered(true);
    
    // IMMEDIATELY move to next question when time runs out
    handleNext();
  };

  const handleSubmit = () => {
    if (isSubmitting || isAnswered) return;

    const validation = validateAnswer(answer);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setIsSubmitting(true);
    setError('');

    const timeSpent = questionStartTime.current 
      ? (Date.now() - questionStartTime.current) / 1000 
      : 0;

    const isCorrect = checkAnswer(validation.value, currentQuestion.correctAnswer);

    dispatch({
      type: 'SUBMIT_ANSWER',
      payload: {
        answer: validation.value,
        isCorrect,
        timeSpent,
      },
    });

    setFeedback({
      type: isCorrect ? 'correct' : 'incorrect',
      message: isCorrect 
        ? 'Correct!' 
        : `Incorrect. The correct answer was ${currentQuestion.correctAnswer}`,
    });

    setIsAnswered(true);
    setIsSubmitting(false);

    // Auto-advance for correct answers - INSTANT (no delay)
    if (isCorrect && quizConfig.autoAdvance) {
      handleNext();
    }
  };

  const handleNext = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const nextIndex = currentQuiz.currentQuestionIndex + 1;
    
    if (nextIndex >= currentQuiz.questions.length) {
      dispatch({ type: 'FINISH_QUIZ' });
      navigate('/summary');
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !isAnswered) {
      handleSubmit();
    }
  };

  // Redirect if no active quiz
  if (!currentQuiz.isActive || !currentQuestion) {
    navigate('/');
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Question {currentQuiz.currentQuestionIndex + 1} of {currentQuiz.questions.length}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Timer */}
        {quizConfig.timerEnabled && timeLeft !== null && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Timer sx={{ mr: 1, color: timeLeft <= 10 ? 'error.main' : 'primary.main' }} />
            <Typography 
              variant="h6" 
              color={timeLeft <= 10 ? 'error.main' : 'primary.main'}
            >
              {timeLeft}s
            </Typography>
          </Box>
        )}

        {/* Question Display */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" component="div" gutterBottom>
            {currentQuestion.questionText}
          </Typography>
        </Box>

        {/* Answer Input */}
        {!isAnswered && (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <TextField
              autoFocus
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your answer"
              variant="outlined"
              size="large"
              sx={{ 
                width: '100%',
                maxWidth: 300,
                '& .MuiInputBase-root': {
                  fontSize: '1.5rem',
                  height: 60,
                },
              }}
              disabled={isSubmitting}
            />
            
            {error && (
              <Alert severity="error" sx={{ mt: 2, maxWidth: 300, mx: 'auto' }}>
                {error}
              </Alert>
            )}
          </Box>
        )}

        {/* Feedback */}
        {feedback && (
          <Fade in={true}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Alert 
                severity={feedback.type === 'correct' ? 'success' : 'error'}
                icon={feedback.type === 'correct' ? <CheckCircle /> : <Cancel />}
                sx={{ maxWidth: 400, mx: 'auto' }}
              >
                <Typography variant="h6">
                  {feedback.message}
                </Typography>
              </Alert>
            </Box>
          </Fade>
        )}

        {/* Action Buttons */}
        <Box sx={{ textAlign: 'center' }}>
          {!isAnswered ? (
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={isSubmitting || !answer.trim()}
              sx={{ minWidth: 150, minHeight: 56 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Submit Answer'
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={handleNext}
              sx={{ minWidth: 150, minHeight: 56 }}
            >
              {currentQuiz.currentQuestionIndex + 1 >= currentQuiz.questions.length 
                ? 'Finish Quiz' 
                : 'Next Question'
              }
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default QuizPage; 