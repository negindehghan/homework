const DataService = require('../services/dataService');
const billService = new DataService('bills.json');

const getAllBills = async (req, res) => {
    try {
        const bills = await billService.getAll();
        res.json(bills);
    } catch (error) {
        res.status(500).json({ error: 'Error getting bills' });
    }
};

const createBill = async (req, res) => {
    try {
        const bill = await billService.create({
            ...req.body,
            status: 'Pending'
        });
        res.status(201).json(bill);
    } catch (error) {
        res.status(500).json({ error: 'Error creating bill' });
    }
};

const updateBill = async (req, res) => {
    try {
        const updatedBill = await billService.update(req.params.id, req.body);
        if (!updatedBill) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.json(updatedBill);
    } catch (error) {
        res.status(500).json({ error: 'Error updating bill' });
    }
};

const deleteBill = async (req, res) => {
    try {
        await billService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting bill' });
    }
};

module.exports = {
    getAllBills,
    createBill,
    updateBill,
    deleteBill
}; 