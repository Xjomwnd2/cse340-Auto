const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { authMiddleware, roleCheckMiddleware } = require('../middleware/authMiddleware');

// Route to view account management page
router.get('/account/manage', authMiddleware, accountController.getAccountManagement);

// Route to display the account update form
router.get('/account/update/:id', authMiddleware, accountController.getUpdateView);

// Route to handle account information update (first name, last name, email)
router.post('/account/updateInfo', authMiddleware, accountController.updateAccountInfo);

// Route to handle password change
router.post('/account/updatePassword', authMiddleware, accountController.updatePassword);

// Export the router
module.exports = router;
