const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // Parse form data

// Default route → Login page
app.get('/', (req, res) => {
  res.render('index');
});

// Show login page (GET /login)
app.get('/login', (req, res) => {
  res.render('login');
});

// Show Signup page
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Handle signup POST (fake)
app.post('/signup', (req, res) => {
  res.redirect('/login');
});

// Handle login POST (fake)
app.post('/login', (req, res) => {
  res.redirect('/home');
});

// Home page
app.get('/home', (req, res) => {
  res.render('index');
});
app.get('/explore', (req, res) => {
  res.render('explore'); // renders views/explore.ejs
});

// Profile page
app.get('/profile', (req, res) => {
  res.render('profile'); // renders views/profile.ejs
});



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));