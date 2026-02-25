const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send a WhatsApp message via Twilio
 */
async function sendWhatsAppMessage(body) {
    try {
        const message = await client.messages.create({
            body: body,
            from: process.env.TWILIO_WHATSAPP_FROM,  // whatsapp:+14155238886
            to: process.env.WHATSAPP_TO               // whatsapp:+923706096116
        });

        console.log(`📲 WhatsApp sent! SID: ${message.sid}`);
        return message;
    } catch (error) {
        console.error('❌ Twilio error:', error.message);
        throw error;
    }
}

module.exports = { sendWhatsAppMessage };
