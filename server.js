/* ******************************************
 * Require Statements
 *******************************************/
const express = require("express");
const dotenv = require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const session = require('express-session'); 
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const inventoryRoutes = require('./routes/inventory');
const homeRoutes = require('./routes/homeRoutes');
const pool = require('./config/database');


const app = express();
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
// Fix: Import authMiddleware once and use it for both purposes
const { authMiddleware, authorizeAdminOrEmployee } = require('./middleware/authMiddleware');
const db = require('./database');

// Example query
pool.query('SELECT * FROM your_table', (error, results) => {
  if (error) {
    console.error('Database query error:', error);
  } else {
    console.log('Query results:', results.rows);
  }
});


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.set("layout", "./layouts/layout");

/* ***********************
 * Use statements
 *************************/
app.use(express.json()); // Use this instead of bodyParser.json()
app.use(express.urlencoded({ extended: true })); // Use this instead of bodyParser.urlencoded
app.use(expressLayouts);
app.use(cookieParser());
app.use('/inventory', inventoryRoutes);
app.use('/', homeRoutes);



// Configure session management with more secure settings
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // Better to use environment variable
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

/* ***********************
 * Routes and Middleware
 *************************/

// Static Routes
app.use(staticRoutes);

// Index route
app.get("/", baseController.buildHome);

// Inventory routes
app.use('/inventory', inventoryRoutes);

/* **********************************
 * Error Handling Middleware
 ********************************** */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || 'localhost';

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});