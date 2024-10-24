// routes/inventory.js

const express = require('express');
const router = express.Router();

// Mock inventory data
let inventory = [
    { id: 1, name: 'Item 1', quantity: 10 },
    { id: 2, name: 'Item 2', quantity: 5 },
    { id: 3, name: 'Item 3', quantity: 0 },
];

// Get all inventory items
router.get('/', (req, res) => {
    res.json(inventory);
});

// Get an item by ID
router.get('/:id', (req, res) => {
    const item = inventory.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Item not found.');
    res.json(item);
});

// Add a new inventory item
router.post('/', (req, res) => {
    const newItem = {
        id: inventory.length + 1,
        name: req.body.name,
        quantity: req.body.quantity
    };
    inventory.push(newItem);
    res.status(201).json(newItem);
});

// Update an existing inventory item
router.put('/:id', (req, res) => {
    const item = inventory.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Item not found.');

    item.name = req.body.name || item.name;
    item.quantity = req.body.quantity || item.quantity;

    res.json(item);
});

// Delete an inventory item
router.delete('/:id', (req, res) => {
    const itemIndex = inventory.findIndex(i => i.id === parseInt(req.params.id));
    if (itemIndex === -1) return res.status(404).send('Item not found.');

    const deletedItem = inventory.splice(itemIndex, 1);
    res.json(deletedItem);
});

module.exports = router;
