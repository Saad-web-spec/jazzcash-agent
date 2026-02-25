const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

/**
 * Save a parsed transaction to Supabase
 */
async function saveTransaction(data) {
    const { data: result, error } = await supabase
        .from('transactions')
        .insert([{
            raw_sms: data.raw_sms,
            type: data.type,
            amount: data.amount,
            counterparty: data.counterparty,
            reference: data.reference,
            balance: data.balance,
            transaction_time: data.transaction_time
        }])
        .select()
        .single();

    if (error) {
        console.error('Supabase insert error:', error.message);
        throw new Error(`Database error: ${error.message}`);
    }

    return result;
}

/**
 * Get all transactions from the last 24 hours
 */
async function getTodayTransactions() {
    // Get transactions from the last 24 hours
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('created_at', yesterday.toISOString())
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Supabase query error:', error.message);
        throw new Error(`Database query error: ${error.message}`);
    }

    return data || [];
}

module.exports = { saveTransaction, getTodayTransactions };
