
import twilio from 'twilio';

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Helper to format price nicely in IDR
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
};

const sendOrderWhatsapp = async (orderDetails) => {
  console.log("🚀 sendOrderWhatsapp started");

  try {
    // Ensure products are formatted properly (each product on a new line)
    const productsList = Array.isArray(orderDetails.products) ? orderDetails.products : [];

    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER, // Twilio Sandbox WhatsApp number
      to: process.env.ADMIN_WHATSAPP_NUMBER,   // Your personal WhatsApp number
      body: `🛒 *New Order Received!*

👤 *Customer*: ${orderDetails.customerName}
📧 *Email*: ${orderDetails.customerEmail}
🏡 *Address*: ${orderDetails.address}

🧾 *Products*:
${orderDetails.products}

🧮 *Total Quantity*: ${orderDetails.quantity}
💵 *Total Amount*: ${formatCurrency(orderDetails.totalPrice)}
      `
    });

    console.log("✅ WhatsApp message sent successfully: ", message.sid);
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error);
  }
};

export default sendOrderWhatsapp;
