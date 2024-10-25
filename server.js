/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const expressLayouts = require("express-ejs-layouts");
const baseController = require("./controllers/baseController");
const inventoryRoutes = require('./routes/inventoryRoutes');
const authorizeAdminOrEmployee = require('./middleware/authMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const session = require('express-session'); 
const cookieParser = require("cookie-parser");
const router = express.Router();
const bodyParser = require('body-parser');


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
// Use the middleware for protected routes
app.use('/protected-route', authMiddleware, (req, res) => {
  res.send('This is a protected route');
});

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", baseController.buildHome);
// Inventory routes

/* **********************************
* Use Middleware in Your Routes
********************************** */
// Routes that require admin or employee access
router.post('/add-classification', authorizeAdminOrEmployee, (req, res) => {
  // Logic to add classification
});

router.put('/edit-classification/:id', authorizeAdminOrEmployee, (req, res) => {
  // Logic to edit classification
});

router.delete('/delete-classification/:id', authorizeAdminOrEmployee, (req, res) => {
  // Logic to delete classification
});
/* *************************************
* Middleware setup
*********************************** */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key', // Replace with your secret
  resave: false,
  saveUninitialized: true,
}));

// Set up view engine if using one (like EJS, Pug, etc.)
// app.set('view engine', 'ejs'); // Example for EJS

// Other routes can go here
// Use the inventory routes
app.use('/inventory', inventoryRoutes);
// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500; // Ensure there's a default port
const host = process.env.HOST || 'localhost'; // Fallback host if not defined

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
