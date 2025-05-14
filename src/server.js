const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const billsRouter = require('./routes/bills');
const paymentsRouter = require('./routes/payments');
const dashboardRouter = require('./routes/dashboard');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bills', billsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/dashboard', dashboardRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 