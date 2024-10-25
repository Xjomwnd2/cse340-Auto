const bcrypt = require('bcrypt');
const Account = require('../models/accountModel'); // hypothetical Account model

// Display account management view
exports.getAccountManagement = (req, res) => {
    res.render('account/manage', { user: req.user });
};

// Display account update form
exports.getUpdateView = async (req, res) => {
    const user = await Account.findById(req.params.id); // Fetch user data by ID
    res.render('account/update', { user });
};

// Handle account info update
exports.updateAccountInfo = async (req, res) => {
    const { firstName, lastName, email, account_id } = req.body;
    
    // Server-side validation for required fields, and unique email check
    if (!firstName || !lastName || !email) {
        return res.render('account/update', { error: 'All fields are required', user: req.body });
    }
    
    // Update in database
    await Account.update(account_id, { firstName, lastName, email });
    res.redirect('/account/manage?success=Account updated');
};

// Handle password change
exports.updatePassword = async (req, res) => {
    const { newPassword, account_id } = req.body;

    // Hash the password and update in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Account.updatePassword(account_id, hashedPassword);
    
    res.redirect('/account/manage?success=Password updated');
};
