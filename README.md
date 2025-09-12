# TravelTales - Discover India 🇮🇳

A modern travel platform for exploring and sharing travel experiences across India. Built with Node.js, Express, MongoDB, and EJS templating.

## Features

- **User Authentication**: Local signup/login and Google OAuth integration
- **Travel Stories**: Browse and read featured travel stories
- **Travel Blogs**: Discover travel blogs and tips
- **Trip Planning**: Interactive trip planner with maps and attractions
- **User Profiles**: Personalized user profiles with travel stats
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (Local & Google OAuth)
- **Templating**: EJS
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js with OpenStreetMap
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Google OAuth credentials (for social login)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd traveltales
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
traveltales/
├── models/           # MongoDB schemas
│   ├── User.js
│   ├── Blog.js
│   └── Trip.js
├── routes/           # Express routes
│   ├── auth.js       # Authentication routes
│   └── pages.js      # Page routes
├── views/            # EJS templates
│   ├── partials/     # Reusable components
│   ├── index.ejs     # Homepage
│   ├── login.ejs     # Login page
│   └── ...
├── public/           # Static assets
│   ├── *.js          # Client-side JavaScript
│   ├── *.json        # Sample data files
│   └── styles.css    # Custom CSS
├── utils/            # Utility functions
│   └── passportConfig.js
├── server.js         # Main server file
├── package.json
└── vercel.json       # Vercel deployment config
```

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/logout` - User logout

### Pages
- `GET /` - Homepage (protected)
- `GET /login` - Login page
- `GET /signup` - Signup page
- `GET /blogs` - Blogs listing
- `GET /blog/:id` - Individual blog
- `GET /explore` - Featured stories
- `GET /story/:id` - Individual story
- `GET /profile` - User profile
- `GET /contact` - Contact page
- `GET /privacy` - Privacy policy

## Features in Detail

### Authentication System
- Local authentication with bcrypt password hashing
- Google OAuth 2.0 integration
- Session management with cookie-session
- Protected routes middleware

### Data Management
- MongoDB with Mongoose ODM
- User profiles with travel statistics
- Blog and story content management
- Trip planning data with attractions

### Frontend Features
- Responsive design with Tailwind CSS
- Interactive maps with Leaflet.js
- Search functionality for destinations
- Dynamic content loading with JavaScript
- Mobile-friendly navigation

## Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Environment Variables**
   Set up environment variables in Vercel dashboard:
   - `MONGO_URI`
   - `SESSION_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NODE_ENV=production`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `SESSION_SECRET` | Secret key for sessions | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security Features

- Password hashing with bcrypt
- Session security with secure cookies
- Input validation and sanitization
- Protected routes with authentication middleware
- Environment variable protection

## Performance Optimizations

- Efficient database queries with Mongoose
- Static asset serving with Express
- Client-side caching for API responses
- Optimized images and assets
- Minified CSS and JavaScript

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email contact@traveltales.com or create an issue in the repository.

## Acknowledgments

- [Unsplash](https://unsplash.com) for travel images
- [Bootstrap Icons](https://icons.getbootstrap.com) for icons
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Leaflet](https://leafletjs.com) for maps
- [OpenStreetMap](https://openstreetmap.org) for map data