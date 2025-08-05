require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected!'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));

app.post('/signup', (req, res) => {
  // TODO: Save user to MongoDB
  res.redirect('/login');
});

app.post('/login', (req, res) => {
  // TODO: Validate user
  res.redirect('/home');
});

app.get('/home', (req, res) => res.render('index'));
app.get('/explore', (req, res) => res.render('explore'));
app.get('/profile', (req, res) => res.render('profile'));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));