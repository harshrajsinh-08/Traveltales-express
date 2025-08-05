import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';

import authRoutes from './routes/auth.js';
import pageRoutes from './routes/pages.js';
import './utils/passportConfig.js'; // ✅ OAuth config

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// --- Setup __dirname in ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- MongoDB connection ---
mongoose
  .connect(process.env.MONGO_URI, { dbName: 'traveltales' })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// --- Static & Body Parsers ---
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- Express Session (Only) ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,        // ⚠️ Must be false for localhost without HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// --- Passport Init for OAuth ---
app.use(passport.initialize());
app.use(passport.session());

// --- View Engine ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- Make session user available in all EJS templates ---
app.use((req, res, next) => {
  res.locals.user = req.session.user || req.user || null; // OAuth or local user
  next();
});

// --- Routes ---
app.use('/', pageRoutes);
app.use('/auth', authRoutes);

// --- Start Server ---
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));