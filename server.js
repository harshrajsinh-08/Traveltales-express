import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieSession from 'cookie-session';
import passport from 'passport';

import authRoutes from './routes/auth.js';
import pageRoutes from './routes/pages.js';
import './utils/passportConfig.js'; // ✅ Google OAuth config

dotenv.config();
const app = express();

// --- Setup __dirname in ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- MongoDB connection ---
mongoose
  .connect(process.env.MONGO_URI, { dbName: 'traveltales' })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// --- Middleware ---
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- Cookie Session (works on Vercel) ---
app.use(
  cookieSession({
    name: 'traveltales-session',
    keys: [process.env.SESSION_SECRET || 'supersecretkey'],
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
);

// --- Passport Init ---
app.use(passport.initialize());
app.use(passport.session());

// --- View Engine ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- Make user available in all EJS templates ---
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// --- Routes ---
app.use('/', pageRoutes);
app.use('/auth', authRoutes);

// --- Localhost server only ---
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
}

// --- Export for Vercel ---
export default app;