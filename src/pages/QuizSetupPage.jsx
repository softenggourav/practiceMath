import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Switch,
  Divider,
} from '@mui/material';
import { useQuiz } from '../contexts/QuizContext';
import { generateQuestions, OPERATIONS, DIFFICULTY_LEVELS } from '../utils/questionGenerator';

const QuizSetupPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useQuiz();
  const [error, setError] = useState('');

  const [config, setConfig] = useState({
    operations: state.quizConfig.operations,
    difficulty: state.quizConfig.difficulty,
    questionCount: state.quizConfig.questionCount,
    timerEnabled: state.quizConfig.timerEnabled,
    timerSeconds: state.quizConfig.timerSeconds,
    autoAdvance: state.quizConfig.autoAdvance,
  });

  const handleOperationChange = (operation) => {
    const newOperations = config.operations.includes(operation)
      ? config.operations.filter(op => op !== operation)
      : [...config.operations, operation];
    
    setConfig({ ...config, operations: newOperations });
  };

  const handleSliderChange = (field) => (event, newValue) => {
    setConfig({ ...config, [field]: newValue });
  };

  const handleSwitchChange = (field) => (event) => {
    setConfig({ ...config, [field]: event.target.checked });
  };

  const handleStartQuiz = () => {
    if (config.operations.length === 0) {
      setError('Please select at least one operation');
      return;
    }

    setError('');
    
    // Save config to context
    dispatch({ type: 'SET_QUIZ_CONFIG', payload: config });

    // Generate questions
    try {
      const questions = generateQuestions(
        config.operations,
        config.difficulty,
        config.questionCount
      );

      // Start quiz
      dispatch({ type: 'START_QUIZ', payload: { questions } });
      navigate('/quiz');
    } catch (error) {
      setError('Failed to generate questions. Please try again.');
    }
  };

  const difficultyDescriptions = {
    [DIFFICULTY_LEVELS.EASY]: '1-digit numbers',
    [DIFFICULTY_LEVELS.MEDIUM]: '2-3 digit numbers',
    [DIFFICULTY_LEVELS.HARD]: '3-4 digit numbers, decimals',
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          Mental Math Practice
        </Typography>
        
        <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
          Configure your practice session
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Operations Selection */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Math Operations
                </Typography>
                <FormControl component="fieldset">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={config.operations.includes(OPERATIONS.ADDITION)}
                          onChange={() => handleOperationChange(OPERATIONS.ADDITION)}
                        />
                      }
                      label="Addition (+)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={config.operations.includes(OPERATIONS.SUBTRACTION)}
                          onChange={() => handleOperationChange(OPERATIONS.SUBTRACTION)}
                        />
                      }
                      label="Subtraction (-)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={config.operations.includes(OPERATIONS.MULTIPLICATION)}
                          onChange={() => handleOperationChange(OPERATIONS.MULTIPLICATION)}
                        />
                      }
                      label="Multiplication (×)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={config.operations.includes(OPERATIONS.DIVISION)}
                          onChange={() => handleOperationChange(OPERATIONS.DIVISION)}
                        />
                      }
                      label="Division (÷)"
                    />
                  </FormGroup>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {/* Difficulty and Question Count */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Difficulty Level
                </Typography>
                <FormControl component="fieldset" fullWidth>
                  <FormGroup>
                    {Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => (
                      <FormControlLabel
                        key={value}
                        control={
                          <Checkbox
                            checked={config.difficulty === value}
                            onChange={() => setConfig({ ...config, difficulty: value })}
                          />
                        }
                        label={`${key.charAt(0) + key.slice(1).toLowerCase()} - ${difficultyDescriptions[value]}`}
                      />
                    ))}
                  </FormGroup>
                </FormControl>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Number of Questions: {config.questionCount}
                </Typography>
                <Slider
                  value={config.questionCount}
                  onChange={handleSliderChange('questionCount')}
                  min={5}
                  max={50}
                  step={5}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Timer Settings */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Timer Settings
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.timerEnabled}
                      onChange={handleSwitchChange('timerEnabled')}
                    />
                  }
                  label="Enable timer per question"
                />

                {config.timerEnabled && (
                  <Box sx={{ mt: 2, ml: 4 }}>
                    <Typography gutterBottom>
                      Time per question: {config.timerSeconds} seconds
                    </Typography>
                    <Slider
                      value={config.timerSeconds}
                      onChange={handleSliderChange('timerSeconds')}
                      min={5}
                      max={60}
                      step={5}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ maxWidth: 300 }}
                    />
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <FormControlLabel
                  control={
                    <Switch
                      checked={config.autoAdvance}
                      onChange={handleSwitchChange('autoAdvance')}
                    />
                  }
                  label="Auto-advance after correct answers"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartQuiz}
            disabled={config.operations.length === 0}
            sx={{ minWidth: 200, minHeight: 56 }}
          >
            Start Quiz
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default QuizSetupPage; 