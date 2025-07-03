const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sample quiz data
const quizzes = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of basic JavaScript concepts',
    questions: [
      {
        id: 1,
        question:
          'What is the correct way to declare a variable in JavaScript?',
        options: [
          'var myVar;',
          'variable myVar;',
          'declare myVar;',
          'v myVar;',
        ],
        correct: 0,
      },
      {
        id: 2,
        question:
          'Which method is used to add an element to the end of an array?',
        options: ['append()', 'push()', 'add()', 'insert()'],
        correct: 1,
      },
      {
        id: 3,
        question: 'What does "=== " operator do in JavaScript?',
        options: [
          'Assignment',
          'Equality without type checking',
          'Strict equality with type checking',
          'Not equal',
        ],
        correct: 2,
      },
      {
        id: 4,
        question:
          'Which of the following is NOT a primitive data type in JavaScript?',
        options: ['string', 'number', 'object', 'boolean'],
        correct: 2,
      },
      {
        id: 5,
        question: 'What is the output of: console.log(typeof null)?',
        options: ['null', 'undefined', 'object', 'number'],
        correct: 2,
      },
    ],
  },
  {
    id: 2,
    title: 'Web Development Basics',
    description: 'Test your knowledge of HTML, CSS, and web development',
    questions: [
      {
        id: 1,
        question: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlink and Text Markup Language',
        ],
        correct: 0,
      },
      {
        id: 2,
        question: 'Which CSS property is used to change text color?',
        options: ['text-color', 'font-color', 'color', 'text-style'],
        correct: 2,
      },
      {
        id: 3,
        question: 'What is the correct HTML element for the largest heading?',
        options: ['<heading>', '<h6>', '<h1>', '<head>'],
        correct: 2,
      },
      {
        id: 4,
        question: 'Which HTTP method is used to submit form data?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correct: 1,
      },
      {
        id: 5,
        question: 'What does CSS stand for?',
        options: [
          'Computer Style Sheets',
          'Creative Style Sheets',
          'Cascading Style Sheets',
          'Colorful Style Sheets',
        ],
        correct: 2,
      },
    ],
  },
  {
    id: 3,
    title: 'Node.js & Express',
    description: 'Test your knowledge of Node.js and Express framework',
    questions: [
      {
        id: 1,
        question: 'What is Node.js?',
        options: [
          'A web browser',
          'A JavaScript runtime',
          'A database',
          'A CSS framework',
        ],
        correct: 1,
      },
      {
        id: 2,
        question: 'Which command is used to install Express?',
        options: [
          'npm install express',
          'node install express',
          'npm get express',
          'install express',
        ],
        correct: 0,
      },
      {
        id: 3,
        question: 'What is the default port for HTTP?',
        options: ['3000', '8080', '80', '443'],
        correct: 2,
      },
      {
        id: 4,
        question: 'Which method is used to handle GET requests in Express?',
        options: ['app.get()', 'app.request()', 'app.handle()', 'app.route()'],
        correct: 0,
      },
      {
        id: 5,
        question: 'What does npm stand for?',
        options: [
          'Node Package Manager',
          'New Programming Method',
          'Network Protocol Manager',
          'Node Program Manager',
        ],
        correct: 0,
      },
    ],
  },
];

// Routes
app.get('/', (req, res) => {
  res.render('index', { quizzes });
});

app.get('/quiz/:id', (req, res) => {
  const quizId = parseInt(req.params.id);
  const quiz = quizzes.find((q) => q.id === quizId);

  if (!quiz) {
    return res.status(404).render('404');
  }

  res.render('quiz', { quiz });
});

app.post('/quiz/:id/submit', (req, res) => {
  const quizId = parseInt(req.params.id);
  const quiz = quizzes.find((q) => q.id === quizId);

  if (!quiz) {
    return res.status(404).render('404');
  }

  const answers = req.body.answers || [];
  let score = 0;
  const results = [];

  quiz.questions.forEach((question, index) => {
    const userAnswer = parseInt(answers[index]);
    const isCorrect = userAnswer === question.correct;
    if (isCorrect) score++;

    results.push({
      question: question.question,
      userAnswer: userAnswer,
      correctAnswer: question.correct,
      options: question.options,
      isCorrect,
    });
  });

  const percentage = Math.round((score / quiz.questions.length) * 100);

  res.render('results', {
    quiz,
    score,
    total: quiz.questions.length,
    percentage,
    results,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
