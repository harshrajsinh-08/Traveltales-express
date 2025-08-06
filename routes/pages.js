import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirect to login if not authenticated
  }
  next();
}

// Helper function to load stories.json
function loadStories() {
  try {
    const storiesPath = path.join(process.cwd(), 'public', 'stories.json'); 
    if (fs.existsSync(storiesPath)) {
      const data = fs.readFileSync(storiesPath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    console.error('Error loading stories:', err);
    return [];
  }
}

/* ------------------------
   PUBLIC ROUTES
------------------------ */
router.get('/login', (req, res) => res.render('login', { error: null, success: null }));
router.get('/signup', (req, res) => res.render('signup', { error: null, success: null }));
router.get('/privacy', (req, res) => res.render('privacy'));
router.get('/contact', (req, res) => res.render('contact'));

/* ------------------------
   PROTECTED ROUTES
------------------------ */
router.get('/', requireLogin, (req, res) => {
  const stories = loadStories(); // ✅ Load stories for home page
  res.render('index', { user: req.session.user, stories });
});

router.get('/home', (req, res) => res.redirect('/')); // alias to home

router.get('/blogs', requireLogin, (req, res) => {
  res.render('blogs', { user: req.session.user });
});

router.get('/explore', requireLogin, (req, res) => {
  res.render('explore', { user: req.session.user });
});

router.get('/profile', requireLogin, (req, res) => {
  res.render('profile', { user: req.session.user });
});

export default router;