const express = require('express');
const router = express.Router();
const { parseTransaction } = require('../services/gemini');
const { saveTransaction } = require('../services/supabase');

// Helper to process transaction
async function processTransaction(req, res, sms, sender, received_at) {
    try {
        if (!sms) {
            return res.status(400).json({ error: 'Missing "sms" field' });
        }

        console.log(`📩 Received SMS from ${sender || 'unknown'}: ${sms.substring(0, 80)}...`);

        // Parse with Gemini AI
        const parsed = await parseTransaction(sms);
        console.log('🤖 Gemini parsed:', JSON.stringify(parsed));

        // Save to Supabase
        const saved = await saveTransaction({
            raw_sms: sms,
            type: parsed.type || 'other',
            amount: parsed.amount || 0,
            counterparty: parsed.counterparty || null,
            reference: parsed.reference || null,
            balance: parsed.balance || null,
            transaction_time: received_at || new Date().toISOString()
        });

        console.log('✅ Transaction saved to Supabase');

        res.json({
            success: true,
            transaction: parsed,
            id: saved?.id || null
        });

    } catch (error) {
        console.error('❌ Error processing transaction:', error.message);
        res.status(500).json({ error: error.message });
    }
}

// POST /api/transactions
// Receives raw JazzCash SMS from MacroDroid (HTTP POST action)
router.post('/', async (req, res) => {
    const { sms, sender, received_at } = req.body;
    await processTransaction(req, res, sms, sender, received_at);
});

// GET /api/transactions
// Receives raw JazzCash SMS from MacroDroid (Open Website action)
router.get('/', async (req, res) => {
    const { sms, sender, received_at } = req.query;
    await processTransaction(req, res, sms, sender, received_at);
});

module.exports = router;
