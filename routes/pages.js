import express from 'express';
const router = express.Router();

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login'); // If not logged in, go to login
  }
  next();
}

// --- Public Pages ---
router.get('/login', (req, res) => res.render('login', { error: null, success: null }));
router.get('/signup', (req, res) => res.render('signup', { error: null, success: null }));
router.get('/privacy', (req, res) => res.render('privacy'));
router.get('/contact', (req, res) => res.render('contact'));

// --- Protected Pages ---
router.get('/', requireLogin, (req, res) => {
  res.render('index', { user: req.session.user });
});

router.get('/home', (req, res) => res.redirect('/')); // alias to home

router.get('/blogs', requireLogin, (req, res) => res.render('blogs', { user: req.session.user }));
router.get('/explore', requireLogin, (req, res) => res.render('explore', { user: req.session.user }));
router.get('/profile', requireLogin, (req, res) => res.render('profile', { user: req.session.user }));

export default router;