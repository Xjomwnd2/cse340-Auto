// inventory-validation.js

// Function to validate inventory data
function validateInventory(data) {
    const errors = [];
  
    // Validate name (it should be a string and not empty)
    if (!data.name || typeof data.name !== 'string') {
      errors.push('Invalid inventory name. It must be a non-empty string.');
    }
  
    // Validate price (it should be a number and greater than zero)
    if (typeof data.price !== 'number' || data.price <= 0) {
      errors.push('Invalid price. It must be a number greater than 0.');
    }
  
    // Validate quantity (it should be a number and not negative)
    if (typeof data.quantity !== 'number' || data.quantity < 0) {
      errors.push('Invalid quantity. It must be a non-negative number.');
    }
  
    // Return errors if any, otherwise validation passed
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
  
  // Export the validateInventory function
  module.exports = {
    validateInventory
  };
  