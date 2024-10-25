const express = require('express');
const cookieParser = require('cookie-parser');
const accountRoutes = require('./routes/accountRoutes');
const db = require('./models/database'); // Hypothetical database module
const token = require('./jwt/token.js');
const middleware = require('./middleware/middleware.js')

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
/* ****************************************
* Middleware
******************************************* */
// View engine setup
app.set('view engine', 'ejs');

// Routes setup
app.use(accountRoutes);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
