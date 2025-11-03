import axios from 'axios';

const RENDER_SERVER = 'https://render-trolley.onrender.com';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  try {
    // This endpoint would need to be added to Render server to get session details
    const response = await axios.get(
      `${RENDER_SERVER}/api/session/${sessionId}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Session not found'
    });
  }
}
