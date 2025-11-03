import { useState } from 'react';
import Head from 'next/head';

const BACKEND_URL = 'https://render-trolley.onrender.com';

export default function Home() {
  const [billId, setBillId] = useState('');
  const [bill, setBill] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const checkBill = async () => {
    if (!billId.trim()) {
      setError('Please enter a Bill ID');
      return;
    }

    setLoading(true);
    setError('');
    setBill(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/bill/${billId.trim()}`);
      
      if (response.ok) {
        const data = await response.json();
        setBill(data);
      } else {
        setError('Bill not found');
      }
    } catch (err) {
      setError('Error checking bill: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') checkBill();
  };

  return (
    <>
      <Head>
        <title>Smart Cart System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          padding: 40px;
        }
        h1 {
          text-align: center;
          color: #2d3748;
          margin-bottom: 10px;
          font-size: 32px;
        }
        .subtitle {
          text-align: center;
          color: #718096;
          margin-bottom: 40px;
        }
        .section {
          background: #f7f9fc;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 20px;
        }
        .section h2 {
          color: #2d3748;
          margin-bottom: 20px;
          font-size: 20px;
        }
        input {
          width: 100%;
          padding: 15px;
          border: 2px solid #e0e6ed;
          border-radius: 8px;
          font-size: 16px;
          margin-bottom: 15px;
          transition: border-color 0.3s;
        }
        input:focus {
          outline: none;
          border-color: #667eea;
        }
        button {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s;
          opacity: ${loading ? 0.6 : 1};
        }
        button:hover { transform: translateY(-2px); }
        button:active { transform: translateY(0); }
        button:disabled { cursor: not-allowed; }
        .error {
          color: #e53e3e;
          text-align: center;
          margin-top: 15px;
          padding: 10px;
          background: #fed7d7;
          border-radius: 8px;
        }
        .bill-result {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }
        .bill-header {
          color: #667eea;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 15px;
        }
        .bill-info {
          margin-bottom: 15px;
          line-height: 1.8;
        }
        .bill-items {
          background: #f7f9fc;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }
        .bill-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e6ed;
        }
        .bill-item:last-child { border-bottom: none; }
        .bill-total {
          text-align: right;
          font-size: 20px;
          font-weight: 700;
          color: #667eea;
          padding-top: 10px;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #c6f6d5;
          color: #22543d;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
        }
      `}</style>

      <div className="container">
        <h1>🛒 Smart Cart</h1>
        <p className="subtitle">Scan, Shop, Pay - Seamlessly</p>
        
        <div className="section">
          <h2>📋 Check Previous Bills</h2>
          <input
            type="text"
            placeholder="Enter Bill ID (e.g., A100)"
            value={billId}
            onChange={(e) => setBillId(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={checkBill} disabled={loading}>
            {loading ? 'Checking...' : 'Check Bill'}
          </button>
          
          {error && <div className="error">{error}</div>}
          
          {bill && (
            <div className="bill-result">
              <div className="bill-header">Bill Details</div>
              <div className="bill-info">
                <strong>Bill ID:</strong> {bill.billId}<br/>
                <strong>Date:</strong> {new Date(bill.timestamp).toLocaleString()}<br/>
                <strong>Status:</strong> <span className="status-badge">✓ Paid</span>
              </div>
              <div className="bill-items">
                <strong style={{marginBottom: '10px', display: 'block'}}>Items:</strong>
                {bill.items.map((item, idx) => (
                  <div key={idx} className="bill-item">
                    <span>{item.name} ×{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="bill-total">Total: ₹{bill.total}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}