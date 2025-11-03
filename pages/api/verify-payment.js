import axios from 'axios';

const RENDER_SERVER = 'https://render-trolley.onrender.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    sessionId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  try {
    const response = await axios.post(
      `${RENDER_SERVER}/api/verify-payment`,
      {
        sessionId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Payment verification failed'
    });
  }
}
