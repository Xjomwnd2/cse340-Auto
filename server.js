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


const app = express();
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
// Fix: Import authMiddleware once and use it for both purposes
const { authMiddleware, authorizeAdminOrEmployee } = require('./middleware/authMiddleware');
const db = require('./database');


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
/* ****************************************
*POOL
****************************************** */
/////////////////////////////////////////////
const { Pool } = require('pg');

// 1. Check the PostgreSQL server status
// Ensure the PostgreSQL server is running and accepting connections
// You can use a tool like pgAdmin or the psql command-line client to verify the connection
// 1. Check the PostgreSQL server status
// Ensure the PostgreSQL server is running and accepting connections
// You can use a tool like pgAdmin or the psql command-line client to verify the connection
try {
  const client = await pool.connect();
  const result = await client.query('SELECT 1');
  console.log('PostgreSQL server is running and accepting connections.');
  client.release();
} catch (err) {
  console.error('Error connecting to PostgreSQL server:', err);
  return;
}
// 2. Verify the database connection details
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: process.env.DB_USER || 'cse340',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// Adjust the maximum number of connections, connection timeout, and other relevant settings as needed
try {
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM your_table');
  console.log(result.rows);
  client.release();
} catch (err) {
  console.error('Error executing query:', err);
  return;
}
// 3. Inspect the database pool configuration
// Review the pool configuration to ensure it is set up correctly
// Adjust the maximum number of connections, connection timeout, and other relevant settings as needed
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
    return;
  }
  client.query('SELECT * FROM your_table', (err, result) => {
    release();
    if (err) {
      console.error('Error executing query', err.stack);
      return;
    }
    console.log(result.rows);
  });
});
//////////////////////////////////////////
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