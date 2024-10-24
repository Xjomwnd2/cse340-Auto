// controllers/inventoryController.js

// Import necessary modules (e.g., models for database interactions)
const invModel = require('../models/inventoryModel'); // Adjust path as needed

// Show the management view
exports.showManagementView = (req, res) => {
    const flashMessage = req.flash('success') || null; // Get flash message from session
    res.render('inventory/management', { flashMessage });
};

// Show the form to add a new classification
exports.showAddClassificationForm = (req, res) => {
    res.render('inventory/addClassification');
};

// Handle submission of the new classification
exports.addClassification = async (req, res) => {
    try {
        const { classificationName } = req.body; // Get the classification name from the request body
        if (!classificationName) {
            req.flash('error', 'Classification name is required');
            return res.redirect('/inventory/addClassification');
        }

        // Save the classification to the database (use your model logic)
        await invModel.createClassification(classificationName);

        req.flash('success', 'Classification added successfully');
        res.redirect('/inventory/management');
    } catch (error) {
        console.error('Error adding classification:', error);
        req.flash('error', 'Error adding classification');
        res.redirect('/inventory/addClassification');
    }
};

// Show the form to add a new inventory item
exports.showAddInventoryForm = async (req, res) => {
    try {
        const classifications = await invModel.getClassifications(); // Fetch classifications for the form
        res.render('inventory/addInventory', { classifications });
    } catch (error) {
        console.error('Error fetching classifications:', error);
        req.flash('error', 'Error loading form');
        res.redirect('/inventory/management');
    }
};

// Handle submission of a new inventory item
exports.addInventoryItem = async (req, res) => {
    try {
        const { itemName, itemDescription, classificationId, quantity } = req.body;

        // Validate input data
        if (!itemName || !classificationId || !quantity) {
            req.flash('error', 'All fields are required');
            return res.redirect('/inventory/addInventory');
        }

        // Save the inventory item to the database (use your model logic)
        await invModel.createInventoryItem({ itemName, itemDescription, classificationId, quantity });

        req.flash('success', 'Inventory item added successfully');
        res.redirect('/inventory/management');
    } catch (error) {
        console.error('Error adding inventory item:', error);
        req.flash('error', 'Error adding inventory item');
        res.redirect('/inventory/addInventory');
    }
};

// Additional methods for viewing, editing, or deleting items can be added here...
