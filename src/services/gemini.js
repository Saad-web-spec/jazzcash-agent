const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

/**
 * Parse a raw JazzCash SMS into structured transaction data
 */
async function parseTransaction(rawSMS) {
    const prompt = `You are a JazzCash SMS parser. Extract transaction details from this SMS and return ONLY valid JSON (no markdown, no code blocks).

SMS: "${rawSMS}"

Return this exact JSON format:
{
  "type": "sent" | "received" | "bill_payment" | "topup" | "other",
  "amount": <number>,
  "counterparty": "<name or phone number of the other party>",
  "reference": "<transaction reference number if any>",
  "balance": <remaining balance as number, or null>,
  "description": "<brief one-line description of what happened>"
}

Rules:
- "type" must be one of: sent, received, bill_payment, topup, other
- "amount" must be a number (no currency symbols)
- If balance is mentioned, extract it as a number
- If any field is not found, use null
- Return ONLY the JSON object, nothing else`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        // Clean up response - remove markdown code blocks if present
        const cleaned = text
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Gemini parse error:', error.message);
        // Return a fallback structure
        return {
            type: 'other',
            amount: 0,
            counterparty: null,
            reference: null,
            balance: null,
            description: 'Failed to parse SMS'
        };
    }
}

/**
 * Generate a formatted daily summary for WhatsApp
 */
async function generateDailySummary(transactions) {
    if (!transactions || transactions.length === 0) {
        return '📊 *JazzCash Daily Summary*\n\n✅ No transactions yesterday. Your wallet is resting! 💤';
    }

    const txnList = transactions.map(t =>
        `- Type: ${t.type}, Amount: Rs.${t.amount}, To/From: ${t.counterparty || 'N/A'}, Time: ${t.transaction_time || t.created_at}`
    ).join('\n');

    const prompt = `You are a friendly financial assistant. Generate a WhatsApp-friendly daily spending summary from these JazzCash transactions.

Transactions:
${txnList}

Format the summary like this:
- Start with "📊 *JazzCash Daily Summary*" and today's date
- Show total money SENT and total money RECEIVED separately
- List each transaction with emoji (💸 for sent, 💰 for received, 📱 for bill/topup)
- End with the latest balance if available
- Keep it short, clean, and use WhatsApp formatting (*bold*, _italic_)
- Use Pakistani Rupees (Rs.)
- Maximum 500 characters
- Do NOT use markdown code blocks

Return ONLY the formatted message text.`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error('Gemini summary error:', error.message);

        // Fallback manual summary
        const totalSent = transactions
            .filter(t => t.type === 'sent')
            .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        const totalReceived = transactions
            .filter(t => t.type === 'received')
            .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

        return `📊 *JazzCash Daily Summary*\n\n💸 Sent: Rs.${totalSent}\n💰 Received: Rs.${totalReceived}\n📝 Total Transactions: ${transactions.length}`;
    }
}

module.exports = { parseTransaction, generateDailySummary };
