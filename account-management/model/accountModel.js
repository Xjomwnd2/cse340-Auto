const db = require('./database'); // Hypothetical database module

// Get account information by account ID
exports.findById = async (id) => {
    const result = await db.query('SELECT * FROM accounts WHERE account_id = ?', [id]);
    return result[0];
};

// Update account info
exports.update = async (id, data) => {
    await db.query('UPDATE accounts SET firstName = ?, lastName = ?, email = ? WHERE account_id = ?', [data.firstName, data.lastName, data.email, id]);
};

// Update password
exports.updatePassword = async (id, newPassword) => {
    await db.query('UPDATE accounts SET password = ? WHERE account_id = ?', [newPassword, id]);
};
