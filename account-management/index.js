const express = require('express');
const cookieParser = require('cookie-parser');
const accountRoutes = require('./routes/accountRoutes');
const db = require('./models/database'); // Hypothetical database module
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

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
// Middleware for checking if user is authenticated
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login?error=Please log in first');
    
    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.redirect('/login?error=Invalid session');
        
        req.user = decoded; // Attach user info to request
        res.locals.user = decoded; // Attach to locals for access in views
        next();
    });
};

// Middleware for checking user role for restricted routes
const roleCheckMiddleware = (req, res, next) => {
    if (req.user.role !== 'Employee' && req.user.role !== 'Admin') {
        return res.redirect('/login?error=Insufficient privileges');
    }
    next();
};

module.exports = { authMiddleware, roleCheckMiddleware };


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
