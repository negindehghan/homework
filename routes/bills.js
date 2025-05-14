const express = require('express');
const router = express.Router();
const dataAccess = require('../dao/dataAccess');

// Get all bills
router.get('/', async (req, res) => {
    try {
        const bills = await dataAccess.getAll('bills.json');
        res.json(bills);
    } catch (error) {
        res.status(500).json({ error: 'Error getting bills' });
    }
});

// Get bills by date range
router.get('/date-range', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const bills = await dataAccess.getAll('bills.json');
        const filteredBills = bills.filter(bill => {
            const dueDate = new Date(bill.dueDate);
            return dueDate >= new Date(startDate) && dueDate <= new Date(endDate);
        });
        res.json(filteredBills);
    } catch (error) {
        console.error('Error getting bills by date range:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get bills by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const bills = await dataAccess.getAll('bills.json');
        const filteredBills = bills.filter(bill => bill.category === category);
        res.json(filteredBills);
    } catch (error) {
        console.error('Error getting bills by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single bill
router.get('/:id', async (req, res) => {
    try {
        const bill = await dataAccess.getById('bills.json', req.params.id);
        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.json(bill);
    } catch (error) {
        console.error('Error getting bill:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new bill
router.post('/', async (req, res) => {
    try {
        const bill = await dataAccess.create('bills.json', {
            ...req.body,
            status: 'Pending'
        });
        res.status(201).json(bill);
    } catch (error) {
        res.status(500).json({ error: 'Error creating bill' });
    }
});

// Update a bill
router.put('/:id', async (req, res) => {
    try {
        const updatedBill = await dataAccess.update('bills.json', req.params.id, req.body);
        res.json(updatedBill);
    } catch (error) {
        res.status(500).json({ error: 'Error updating bill' });
    }
});

// Delete a bill
router.delete('/:id', async (req, res) => {
    try {
        await dataAccess.delete('bills.json', req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting bill' });
    }
});

module.exports = router; 