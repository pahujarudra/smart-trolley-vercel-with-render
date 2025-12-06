import { useState } from 'react';
import Head from 'next/head';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
      setError('Error: ' + err.message);
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
        <title>Smart Cart</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4F46E5" />
      </Head>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: #F9FAFB;
          min-height: 100vh;
        }

        .navbar {
          background: white;
          padding: 16px 20px;
          border-bottom: 1px solid #E5E7EB;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .nav-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          color: #4F46E5;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: #4F46E5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 24px 20px;
        }

        .hero {
          text-align: center;
          padding: 40px 0;
        }

        .hero h1 {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .hero p {
          font-size: 16px;
          color: #6B7280;
          line-height: 1.5;
        }

        .card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 16px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }

        .input-group {
          margin-bottom: 16px;
        }

        .input-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #D1D5DB;
          border-radius: 10px;
          font-size: 16px;
          color: #111827;
          background: white;
          transition: all 0.2s;
        }

        input:focus {
          outline: none;
          border-color: #4F46E5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        input::placeholder {
          color: #9CA3AF;
        }

        .btn {
          width: 100%;
          padding: 14px 24px;
          background: #4F46E5;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn:hover {
          background: #4338CA;
        }

        .btn:active {
          transform: scale(0.98);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-msg {
          background: #FEF2F2;
          color: #991B1B;
          padding: 12px 16px;
          border-radius: 10px;
          margin-top: 16px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bill-card {
          margin-top: 24px;
          padding: 0;
          overflow: hidden;
        }

        .bill-header {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: white;
          padding: 20px 24px;
        }

        .bill-id {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .bill-date {
          font-size: 14px;
          opacity: 0.9;
        }

        .bill-body {
          padding: 24px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #D1FAE5;
          color: #065F46;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .items-list {
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          overflow: hidden;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #E5E7EB;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .item-name {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
        }

        .item-qty {
          font-size: 13px;
          color: #6B7280;
        }

        .item-price {
          font-size: 15px;
          font-weight: 600;
          color: #4F46E5;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #F9FAFB;
          margin-top: 16px;
          border-radius: 12px;
        }

        .total-label {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
        }

        .total-amount {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .hero h1 { font-size: 28px; }
          .container { padding: 20px 16px; }
          .card { padding: 20px; }
        }
      `}</style>

      <div className="navbar">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-icon">🛒</div>
            <span>Smart Cart</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="hero">
          <h1>Welcome Back</h1>
          <p>View your purchase history and receipts</p>
        </div>

        <div className="card">
          <div className="card-title">Check Your Bill</div>
          <div className="input-group">
            <label className="input-label">Bill ID</label>
            <input
              type="text"
              placeholder="e.g., A100"
              value={billId}
              onChange={(e) => setBillId(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button className="btn" onClick={checkBill} disabled={loading}>
            {loading ? <div className="spinner" /> : '🔍'}
            {loading ? 'Searching...' : 'Search Bill'}
          </button>

          {error && (
            <div className="error-msg">
              ⚠️ {error}
            </div>
          )}
        </div>

        {bill && (
          <div className="card bill-card">
            <div className="bill-header">
              <div className="bill-id">Bill #{bill.billId}</div>
              <div className="bill-date">
                {new Date(bill.timestamp).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div className="bill-body">
              <div className="status-badge">
                ✓ Payment Confirmed
              </div>
              <div className="items-list">
                {bill.items.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-qty">Quantity: {item.quantity}</div>
                    </div>
                    <div className="item-price">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
              <div className="total-row">
                <div className="total-label">Total Paid</div>
                <div className="total-amount">₹{bill.total}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}