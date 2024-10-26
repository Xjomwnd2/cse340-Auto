/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const dotenv = require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const session = require('express-session'); 
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

const app = express();
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoutes = require('./routes/inventoryRoutes');
const { authMiddleware, authorizeAdminOrEmployee } = require('./middleware/authMiddleware'); // Import both middleware functions
const db = require('./database'); // Assuming db connects upon import

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.set("layout", "./layouts/layout");

/* ***********************
 * Use statements
 *************************/
app.use(expressLayouts);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session management
app.use(session({
  secret: 'your_secret_key', // Replace with your actual secret
  resave: false,
  saveUninitialized: true,
}));

/* ***********************
 * Routes and Middleware
 *************************/

// Static Routes
app.use(staticRoutes);

// Example Protected Route
app.use('/protected-route', authMiddleware, (req, res) => {
  res.send('This is a protected route');
});

// Index route
app.get("/", baseController.buildHome);

// Inventory routes
app.use('/inventory', inventoryRoutes);

/* **********************************
 * Admin/Employee Protected Routes
 ********************************** */
app.post('/add-classification', authorizeAdminOrEmployee, (req, res) => {
  // Logic to add classification
});

app.put('/edit-classification/:id', authorizeAdminOrEmployee, (req, res) => {
  // Logic to edit classification
});

app.delete('/delete-classification/:id', authorizeAdminOrEmployee, (req, res) => {
  // Logic to delete classification
});

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
