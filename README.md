# Mental Math Practice App

A responsive, offline-capable web application for practicing mental arithmetic with customizable quizzes. Built with React, Material-UI, and designed to work seamlessly on both desktop and mobile devices.

## Features

### 🎯 Core Functionality
- **Customizable Practice Settings**: Choose from addition, subtraction, multiplication, and division
- **Multiple Difficulty Levels**: Easy (1-digit), Medium (2-3 digits), Hard (3-4 digits with decimals)
- **Flexible Question Count**: 5 to 50 questions per quiz
- **Timer Options**: Per-question timer (5-60 seconds) or untimed practice mode
- **Auto-Advance**: Option to automatically move to next question after correct answers

### 🎮 Quiz Experience
- **Large, Clear Display**: Easy-to-read questions optimized for all screen sizes
- **Immediate Feedback**: Color-coded responses with correct/incorrect indicators
- **Progress Tracking**: Visual progress bar and question counter
- **Keyboard Support**: Submit answers with Enter key
- **Touch Optimized**: Large buttons and inputs for mobile devices

### 📊 Comprehensive Results
- **Performance Summary**: Accuracy percentage, average response time
- **Detailed Breakdown**: Question-by-question results with timing
- **Quiz Settings Review**: Summary of configuration used
- **Retry Options**: Retry same quiz or start new configuration

### 🔧 Technical Features
- **Offline Capability**: Works without internet connection
- **PWA Support**: Installable on mobile devices
- **Local Storage**: Saves preferences and settings
- **Responsive Design**: Adapts to any screen size or orientation
- **Accessibility**: Keyboard navigation and screen reader support

## Technology Stack

- **Frontend Framework**: React 18 with Vite
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **PWA**: Service Worker + Web App Manifest

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd practicemath
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Usage

### Setting Up a Quiz
1. **Select Operations**: Choose one or more math operations (+, -, ×, ÷)
2. **Choose Difficulty**: Pick from Easy, Medium, or Hard levels
3. **Set Question Count**: Use the slider to select 5-50 questions
4. **Configure Timer**: Enable/disable timer and set duration (5-60 seconds)
5. **Auto-Advance**: Toggle automatic progression after correct answers
6. **Start Quiz**: Click "Start Quiz" to begin

### During the Quiz
- **Answer Questions**: Type your answer and press Enter or click Submit
- **Monitor Progress**: Watch the progress bar and question counter
- **Timer Awareness**: Keep track of remaining time (if enabled)
- **Get Feedback**: See immediate feedback for each answer

### Reviewing Results
- **Performance Overview**: Check accuracy, speed, and total score
- **Detailed Analysis**: Expand question details to see individual results
- **Retry Options**: Retry the same quiz or start fresh with new settings

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context for state management
│   └── QuizContext.jsx
├── pages/              # Main application pages
│   ├── QuizSetupPage.jsx
│   ├── QuizPage.jsx
│   └── SummaryPage.jsx
├── utils/              # Utility functions
│   └── questionGenerator.js
├── App.jsx             # Main application component
└── main.jsx           # Application entry point
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Mobile Support

The app is fully responsive and works great on:
- iOS Safari
- Android Chrome
- Mobile browsers with PWA support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the beautiful component library
- React team for the amazing framework
- Vite for the fast build tool
