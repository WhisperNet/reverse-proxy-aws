const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  const goals = [
    {
      id: 1,
      title: 'Learn Node.js',
      description: 'Master backend development with Node.js and Express',
      completed: false,
      priority: 'high',
    },
    {
      id: 2,
      title: 'Build a Portfolio',
      description: 'Create a stunning portfolio website',
      completed: true,
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Exercise Daily',
      description: 'Maintain a healthy lifestyle with daily workouts',
      completed: false,
      priority: 'high',
    },
    {
      id: 4,
      title: 'Read 12 Books',
      description: 'Expand knowledge by reading one book per month',
      completed: false,
      priority: 'low',
    },
  ];

  res.render('index', {
    title: 'Goal Tracker',
    goals: goals,
  });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About - Goal Tracker' });
});

app.get('/add-goal', (req, res) => {
  res.render('add-goal', { title: 'Add Goal - Goal Tracker' });
});

app.post('/add-goal', (req, res) => {
  // In a real app, you'd save this to a database
  console.log('New goal:', req.body);
  res.redirect('/');
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Page Not Found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
