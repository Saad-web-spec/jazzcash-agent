require('dotenv').config();
const express = require('express');
const { startScheduler } = require('./services/scheduler');
const transactionRoutes = require('./routes/transactions');
const summaryRoutes = require('./routes/summary');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    service: 'JazzCash Spending Agent',
    time: new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })
  });
});

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/summary', summaryRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 JazzCash Agent running on port ${PORT}`);
  console.log(`⏰ Timezone: ${process.env.TZ || 'Asia/Karachi'}`);
  
  // Start the daily CRON scheduler
  startScheduler();
  console.log('📅 Daily summary scheduler started (7:00 AM PKT)');
});
