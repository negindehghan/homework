const express = require('express');
const router = express.Router();
const dataAccess = require('../dao/dataAccess');

// Get all payments
router.get('/', async (req, res) => {
    try {
        const payments = await dataAccess.getAll('payments.json');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Error getting payments' });
    }
});

// Get payments by date range
router.get('/date-range', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const payments = await dataAccess.getAll('payments.json');
        const filteredPayments = payments.filter(payment => {
            const paymentDate = new Date(payment.paymentDate);
            return paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate);
        });
        res.json(filteredPayments);
    } catch (error) {
        console.error('Error getting payments by date range:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get payment statistics
router.get('/statistics', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const payments = await dataAccess.getAll('payments.json');
        
        const filteredPayments = payments.filter(payment => {
            const paymentDate = new Date(payment.paymentDate);
            return paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate);
        });
        
        const completedPayments = filteredPayments.filter(payment => payment.status === 'Completed');
        const totalAmount = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const averageAmount = completedPayments.length > 0 ? totalAmount / completedPayments.length : 0;
        
        res.json({
            totalPayments: filteredPayments.length,
            completedPayments: completedPayments.length,
            totalAmount,
            averageAmount
        });
    } catch (error) {
        console.error('Error getting payment statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single payment
router.get('/:id', async (req, res) => {
    try {
        const payment = await dataAccess.getById('payments.json', req.params.id);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json(payment);
    } catch (error) {
        console.error('Error getting payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new payment
router.post('/', async (req, res) => {
    try {
        const payment = await dataAccess.create('payments.json', {
            ...req.body,
            status: 'Completed'
        });
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Error creating payment' });
    }
});

// Update a payment
router.put('/:id', async (req, res) => {
    try {
        const updatedPayment = await dataAccess.update('payments.json', req.params.id, req.body);
        res.json(updatedPayment);
    } catch (error) {
        res.status(500).json({ error: 'Error updating payment' });
    }
});

// Delete a payment
router.delete('/:id', async (req, res) => {
    try {
        await dataAccess.delete('payments.json', req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting payment' });
    }
});

module.exports = router; 