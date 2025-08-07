import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Timer,
  TrendingUp,
  Refresh,
  Home,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useQuiz } from '../contexts/QuizContext';
import { OPERATIONS } from '../utils/questionGenerator';

const SummaryPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useQuiz();
  const [showDetails, setShowDetails] = useState(false);

  const { results, currentQuiz, quizConfig } = state;

  // Redirect if no results
  if (results.totalQuestions === 0) {
    navigate('/');
    return null;
  }

  const handleRetryQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
    navigate('/quiz');
  };

  const handleNewQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
    navigate('/');
  };

  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds.toFixed(1)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return 'success';
    if (accuracy >= 60) return 'warning';
    return 'error';
  };

  const getAccuracyMessage = (accuracy) => {
    if (accuracy >= 90) return 'Excellent!';
    if (accuracy >= 80) return 'Great job!';
    if (accuracy >= 60) return 'Good work!';
    if (accuracy >= 40) return 'Keep practicing!';
    return 'More practice needed!';
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          Quiz Complete!
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" gutterBottom>
                  {results.totalQuestions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Questions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" gutterBottom>
                  {results.correctAnswers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct Answers
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h4" 
                  color={`${getAccuracyColor(results.accuracy)}.main`} 
                  gutterBottom
                >
                  {results.accuracy.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accuracy
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main" gutterBottom>
                  {formatTime(results.averageTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg. Time
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Performance Message */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h5" color={`${getAccuracyColor(results.accuracy)}.main`} gutterBottom>
            {getAccuracyMessage(results.accuracy)}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You answered {results.correctAnswers} out of {results.totalQuestions} questions correctly.
          </Typography>
        </Box>

        {/* Quiz Settings Summary */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quiz Settings
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label={`${quizConfig.difficulty.charAt(0).toUpperCase() + quizConfig.difficulty.slice(1)}`} 
                color="primary" 
                variant="outlined" 
              />
              {quizConfig.operations.map(op => (
                <Chip 
                  key={op} 
                  label={op} 
                  color="secondary" 
                  variant="outlined" 
                />
              ))}
              {quizConfig.timerEnabled && (
                <Chip 
                  label={`${quizConfig.timerSeconds}s timer`} 
                  color="info" 
                  variant="outlined" 
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                mb: 2 
              }}
              onClick={() => setShowDetails(!showDetails)}
            >
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Question Details
              </Typography>
              {showDetails ? <ExpandLess /> : <ExpandMore />}
            </Box>
            
            <Collapse in={showDetails}>
              <List>
                {results.questionResults.map((result, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      {result.isCorrect ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Cancel color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={result.question.questionText}
                      secondary={
                        <Box>
                          <Typography variant="body2" component="span">
                            Your answer: {result.userAnswer || 'No answer'} | 
                            Correct: {result.correctAnswer} | 
                            Time: {formatTime(result.timeSpent)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Refresh />}
            onClick={handleRetryQuiz}
            sx={{ minWidth: 150, minHeight: 56 }}
          >
            Retry Quiz
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<Home />}
            onClick={handleNewQuiz}
            sx={{ minWidth: 150, minHeight: 56 }}
          >
            New Quiz
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SummaryPage; 