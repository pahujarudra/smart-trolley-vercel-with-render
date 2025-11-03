// This is a proxy to forward requests from Vercel to Render backend
import axios from 'axios';

const RENDER_SERVER = 'https://render-trolley.onrender.com';

export default async function handler(req, res) {
  const { path } = req.query;
  const pathStr = Array.isArray(path) ? path.join('/') : path;

  try {
    let response;
    const url = `${RENDER_SERVER}/api/${pathStr}`;

    if (req.method === 'GET') {
      response = await axios.get(url, {
        params: req.query
      });
    } else if (req.method === 'POST') {
      response = await axios.post(url, req.body, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message
    });
  }
}
