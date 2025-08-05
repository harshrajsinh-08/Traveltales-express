const express = require('express');
const router = express.Router();

// Pages
router.get('/', (req, res) => res.render('index'));
router.get('/blogs', (req, res) => res.render('blogs'));
router.get('/contact', (req, res) => res.render('contact'));
router.get('/explore', (req, res) => res.render('explore'));
router.get('/login', (req, res) => res.render('login'));
router.get('/profile', (req, res) => res.render('profile'));
router.get('/privacy', (req, res) => res.render('privacy'));

// Example: Handling login POST request
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Add your login validation logic here
  res.send(`Welcome ${username}!`);
});

module.exports = router;