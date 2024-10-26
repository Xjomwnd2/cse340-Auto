/* ******************************************
 * Server Configuration Dependencies
 ****************************************** */
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const pool = require('./database/');
require('dotenv').config();

/* ******************************************
 * Routes & Middleware Imports 
 ****************************************** */
const baseController = require('./controllers/baseController');
const accountRoutes = require('./routes/accountRoute');
const inventoryRoute = require('./routes/inventoryRoute');
const staticRoute = require('./routes/static');
const errorMiddleware = require('./middleware/errorMiddleware');
const { handleErrors } = require('./middleware/errorMiddleware');
const utilities = require('./utilities/');

/* ******************************************
 * Express App Configuration
 ****************************************** */
const app = express();
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

/* ******************************************
 * View Engine & Templates Configuration
 ****************************************** */
app.set('view engine', 'ejs');
app.set('layout', './layouts/layout');
app.use(expressLayouts);

/* ******************************************
 * Middleware Configuration
 ****************************************** */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: 'strict'
  },
}))

/* ******************************************
 * Static Files Configuration
 ****************************************** */
app.use(staticRoute);
app.use('/public', express.static('public'));

/* ******************************************
 * Route Setup
 ****************************************** */
// Base & Navigation Routes
app.get('/', utilities.handleErrors(baseController.buildHome));
app.use('/account', accountRoutes);
app.use('/inventory', inventoryRoute);

/* ******************************************
 * Error Handling
 ****************************************** */
// Handle 404 errors
app.use((req, res) => {
  res.status(404).render('errors/404', {
    title: '404 - Page Not Found',
    message: 'Sorry, the page you requested cannot be found.'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).render('errors/500', {
    title: '500 - Server Error',
    message: err.message || 'Internal Server Error'
  });
});

/* ******************************************
 * Server Startup
 ****************************************** */
app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`)
}).on('error', err => {
  console.error('Server startup error:', err)
  process.exit(1)
});

// Export for testing purposes
module.exports = app;