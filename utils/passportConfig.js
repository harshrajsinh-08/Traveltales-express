import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// --- Serialize User ---
passport.serializeUser((user, done) => {
  done(null, user.id); // store user id in session
});

// --- Deserialize User ---
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/* ------------------------
   GOOGLE STRATEGY
------------------------ */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract email from profile
        const email = profile.emails[0].value;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (!user) {
          // Create a new user for first-time Google login
          user = await User.create({
            name: profile.displayName,
            email,
            password: '', // OAuth users don't have local passwords
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;