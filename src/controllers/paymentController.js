const DataService = require('../services/dataService');
const paymentService = new DataService('payments.json');

const getAllPayments = async (req, res) => {
    try {
        const payments = await paymentService.getAll();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Error getting payments' });
    }
};

const createPayment = async (req, res) => {
    try {
        const payment = await paymentService.create({
            ...req.body,
            status: 'Completed'
        });
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Error creating payment' });
    }
};

const updatePayment = async (req, res) => {
    try {
        const updatedPayment = await paymentService.update(req.params.id, req.body);
        if (!updatedPayment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json(updatedPayment);
    } catch (error) {
        res.status(500).json({ error: 'Error updating payment' });
    }
};

const deletePayment = async (req, res) => {
    try {
        await paymentService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting payment' });
    }
};

module.exports = {
    getAllPayments,
    createPayment,
    updatePayment,
    deletePayment
}; 