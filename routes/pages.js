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

// Helper to load JSON files safely
function loadJSON(fileName) {
  try {
    const filePath = path.join(process.cwd(), 'public', fileName);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    console.error(`Error loading ${fileName}:`, err);
    return [];
  }
}

/* ------------------------
   PUBLIC ROUTES
------------------------ */
router.get('/login', (req, res) => {
  let error = null;
  if (req.query.error === 'oauth_failed') {
    error = 'Google authentication failed. Please try again.';
  } else if (req.query.error === 'oauth_callback_failed') {
    error = 'Authentication callback failed. Please try again.';
  }
  res.render('login', { error, success: null });
});
router.get('/signup', (req, res) => res.render('signup', { error: null, success: null }));
router.get('/privacy', (req, res) => res.render('privacy'));
router.get('/contact', (req, res) => res.render('contact'));
router.get('/debug', (req, res) => res.render('debug'));

/* ------------------------
   PROTECTED ROUTES
------------------------ */
router.get('/', requireLogin, (req, res) => {
  const stories = loadJSON('stories.json'); // ✅ Load featured travel stories
  const blogs = loadJSON('blogs.json');     // ✅ Load travel blogs

  res.render('index', { 
    user: req.session.user, 
    stories,
    blogs
  });
});

router.get('/home', (req, res) => res.redirect('/')); // alias to home

router.get('/blogs', requireLogin, (req, res) => {
  const blogs = loadJSON('blogs.json'); // ✅ Load blogs for blogs page
  res.render('blogs', { 
    user: req.session.user, 
    blogs 
  });
});

router.get('/explore', requireLogin, (req, res) => {
  res.render('explore', { user: req.session.user });
});

// Travel planner page
router.get('/planner', requireLogin, (req, res) => {
  res.render('planner', { user: req.session.user });
});

// Wishlist page
router.get('/wishlist', requireLogin, (req, res) => {
  res.render('wishlist', { user: req.session.user });
});

// Travel tips page
router.get('/tips', requireLogin, (req, res) => {
  res.render('tips', { user: req.session.user });
});

// Weather page
router.get('/weather', requireLogin, (req, res) => {
  res.render('weather', { user: req.session.user });
});

router.get('/profile', requireLogin, (req, res) => {
  res.render('profile', { user: req.session.user });
});

// Individual blog and story routes
router.get('/blog/:id', requireLogin, (req, res) => {
  const blogs = loadJSON('blogs.json');
  const blog = blogs.find(b => b.id == req.params.id);
  
  if (!blog) {
    return res.status(404).render('404', { user: req.session.user });
  }
  
  res.render('blog-detail', { user: req.session.user, blog });
});

router.get('/story/:id', requireLogin, (req, res) => {
  const stories = loadJSON('stories.json');
  const story = stories.find(s => s.id == req.params.id);
  
  if (!story) {
    return res.status(404).render('404', { user: req.session.user });
  }
  
  res.render('story-detail', { user: req.session.user, story });
});

export default router;