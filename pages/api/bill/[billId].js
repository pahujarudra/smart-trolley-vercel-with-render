import axios from 'axios';

const RENDER_SERVER = 'https://render-trolley.onrender.com';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { billId } = req.query;

  try {
    const response = await axios.get(`${RENDER_SERVER}/api/bill/${billId}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Bill not found'
    });
  }
}
