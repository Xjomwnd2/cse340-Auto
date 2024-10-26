const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

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

console.log('authMiddleware:', authMiddleware);
console.log('authorizeAdminOrEmployee:', authorizeAdminOrEmployee);
