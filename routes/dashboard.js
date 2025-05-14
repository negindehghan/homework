const express = require('express');
const router = express.Router();
const dataAccess = require('../dao/dataAccess');

// Get dashboard summary
router.get('/summary', async (req, res) => {
    try {
        const bills = await dataAccess.getAll('bills.json');
        const payments = await dataAccess.getAll('payments.json');
        
        const totalBills = bills.length;
        const pendingBills = bills.filter(bill => bill.status === 'Pending').length;
        const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
        const paidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const balance = totalAmount - paidAmount;
        
        res.json({
            totalBills,
            pendingBills,
            totalAmount,
            paidAmount,
            balance
        });
    } catch (error) {
        res.status(500).json({ error: 'Error getting dashboard summary' });
    }
});

module.exports = router; 