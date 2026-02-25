const cron = require('node-cron');
const { getTodayTransactions } = require('./supabase');
const { generateDailySummary } = require('./gemini');
const { sendWhatsAppMessage } = require('./whatsapp');

/**
 * Run the daily summary: query transactions → generate summary → send WhatsApp
 */
async function runDailySummary() {
    console.log('📊 Running daily summary...');

    // 1. Get last 24h transactions from Supabase
    const transactions = await getTodayTransactions();
    console.log(`Found ${transactions.length} transactions in last 24h`);

    // 2. Generate summary with Gemini
    const summary = await generateDailySummary(transactions);
    console.log('Summary generated:', summary.substring(0, 100) + '...');

    // 3. Send via WhatsApp
    await sendWhatsAppMessage(summary);
    console.log('✅ Daily summary sent to WhatsApp!');

    return summary;
}

/**
 * Start the CRON scheduler for 7:00 AM PKT daily
 */
function startScheduler() {
    // Run at 7:00 AM every day (server timezone is set to Asia/Karachi)
    cron.schedule('0 7 * * *', async () => {
        console.log(`\n⏰ CRON triggered at ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}`);
        try {
            await runDailySummary();
        } catch (error) {
            console.error('❌ CRON summary error:', error.message);
        }
    }, {
        timezone: 'Asia/Karachi'
    });

    console.log('⏰ CRON scheduled: Daily summary at 7:00 AM PKT');
}

module.exports = { startScheduler, runDailySummary };
