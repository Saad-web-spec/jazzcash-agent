const express = require('express');
const router = express.Router();
const { runDailySummary } = require('../services/scheduler');

// POST /api/summary/trigger
// Manually trigger the daily summary (for testing)
router.post('/trigger', async (req, res) => {
    try {
        console.log('🔄 Manual summary trigger...');
        await runDailySummary();
        res.json({ success: true, message: 'Daily summary sent!' });
    } catch (error) {
        console.error('❌ Summary trigger error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
