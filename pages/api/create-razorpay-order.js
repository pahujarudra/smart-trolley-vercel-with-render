import axios from 'axios';

const RENDER_SERVER = 'https://render-trolley.onrender.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId, amount } = req.body;

  try {
    const response = await axios.post(
      `${RENDER_SERVER}/api/create-razorpay-order`,
      { sessionId, amount }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to create order'
    });
  }
}
