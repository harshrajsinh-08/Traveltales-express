import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

// --------------------
// Local Signup
// --------------------
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', { error: 'User already exists', success: null });
    }

    // Create and save new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Show success on the same page
    return res.render('signup', { success: 'Account created successfully! Please login.', error: null });

  } catch (err) {
    console.error('Signup Error:', err);
    return res.render('signup', { error: 'Server error, please try again.', success: null });
  }
});

// --------------------
// Local Login
// --------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('login', { error: 'Invalid email or password', success: null });
    }

    // Save user session
    req.session.user = { id: user._id, name: user.name };

    // Redirect to homepage after login
    return res.redirect('/');

  } catch (err) {
    console.error('Login Error:', err);
    return res.render('login', { error: 'Server error during login', success: null });
  }
});

// --------------------
// Google OAuth (Optional)
// --------------------
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

// --------------------
// Logout
// --------------------
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

export default router;