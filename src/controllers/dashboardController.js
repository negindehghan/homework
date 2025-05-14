const DataService = require('../services/dataService');
const billService = new DataService('bills.json');
const paymentService = new DataService('payments.json');

const getDashboardSummary = async (req, res) => {
    try {
        const bills = await billService.getAll();
        const payments = await paymentService.getAll();
        
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
};

module.exports = {
    getDashboardSummary
}; 