import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [billId, setBillId] = useState('');
  const [billData, setBillData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const checkBill = async () => {
    setError('');
    setBillData(null);
    setLoading(true);

    if (!billId.trim()) {
      setError('Please enter a Bill ID');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/bill/${billId}`);
      setBillData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Bill not found');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkBill();
    }
  };

  return (
    <div className="container">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }

        .card {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
          font-size: 16px;
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
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .bill-result {
          display: none;
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
          border: 2px solid #e0e6ed;
        }

        .bill-result.show {
          display: block;
        }

        .bill-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e6ed;
        }

        .bill-item:last-child {
          border-bottom: none;
        }

        .error {
          color: #e53e3e;
          text-align: center;
          margin-top: 15px;
          display: none;
          padding: 15px;
          background: #fff5f5;
          border-radius: 8px;
          border-left: 4px solid #e53e3e;
        }

        .error.show {
          display: block;
        }

        .bill-info {
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e0e6ed;
        }

        .bill-info strong {
          color: #2d3748;
        }

        .bill-total {
          text-align: right;
          font-size: 20px;
          font-weight: 700;
          color: #667eea;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 2px solid #e0e6ed;
        }

        .status-badge {
          display: inline-block;
          padding: 5px 15px;
          background: #c6f6d5;
          color: #22543d;
          border-radius: 20px;
          font-weight: 600;
          font-size: 12px;
        }

        .loading {
          text-align: center;
          color: #667eea;
          font-weight: 600;
        }
      `}</style>

      <div className="card">
        <h1>🛒 Smart Cart</h1>
        <p className="subtitle">Check Your Bills & Make Payments</p>

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
            {loading ? '⏳ Checking...' : '🔍 Check Bill'}
          </button>

          {error && <div className={`error ${error ? 'show' : ''}`}>❌ {error}</div>}

          {billData && (
            <div className={`bill-result show`}>
              <h3 style={{ color: '#667eea', marginBottom: '15px' }}>
                ✅ Bill Details
              </h3>
              <div className="bill-info">
                <div>
                  <strong>Bill ID:</strong> {billData.billId}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <strong>Date:</strong>{' '}
                  {new Date(billData.timestamp).toLocaleString()}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <strong>Status:</strong>{' '}
                  <span className="status-badge">✓ Paid</span>
                </div>
              </div>

              <div
                style={{
                  background: '#f7f9fc',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}
              >
                <strong>Items:</strong>
                {billData.items.map((item, idx) => (
                  <div key={idx} className="bill-item">
                    <span>
                      {item.name} ×{item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="bill-total">
                Total: ₹{billData.total}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
