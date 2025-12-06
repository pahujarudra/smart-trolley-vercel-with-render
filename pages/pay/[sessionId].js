import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function PaymentPage() {
  const router = useRouter();
  const { sessionId } = router.query;
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/session/${sessionId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'paid') {
          router.push(`/success?billId=${data.billId}`);
        } else {
          setSession(data);
        }
      } else {
        setError('Session not found');
      }
    } catch (err) {
      setError('Unable to load payment details');
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, amount: session.total })
      });
      
      const data = await response.json();
      
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: 'INR',
        name: 'Smart Cart',
        description: 'Cart Payment',
        order_id: data.order_id,
        handler: function(razorpayResponse) {
          verifyPayment(razorpayResponse);
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: { color: '#4F46E5' },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled');
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert('Payment failed. Please try again.');
    }
  };

  const verifyPayment = async (razorpayResponse) => {
    try {
      const result = await fetch(`${BACKEND_URL}/api/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature
        })
      });
      
      const data = await result.json();
      
      if (data.success) {
        router.push(`/success?billId=${data.billId}`);
      } else {
        alert('Payment verification failed');
      }
    } catch (error) {
      alert('Verification error. Please contact support.');
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading...</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <style jsx>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #F9FAFB;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loader {
            text-align: center;
          }
          .spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #E5E7EB;
            border-top-color: #4F46E5;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 16px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .text {
            font-size: 16px;
            color: #6B7280;
          }
        `}</style>
        <div className="loader">
          <div className="spinner"></div>
          <div className="text">Loading your cart...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Error</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <style jsx>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #F9FAFB;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .error-container {
            text-align: center;
            max-width: 400px;
          }
          .icon { font-size: 64px; margin-bottom: 16px; }
          .title {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 8px;
          }
          .message {
            font-size: 16px;
            color: #6B7280;
          }
        `}</style>
        <div className="error-container">
          <div className="icon">❌</div>
          <div className="title">Oops!</div>
          <div className="message">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Complete Payment - Smart Cart</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4F46E5" />
      </Head>

      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          font-size: 20px;
          font-weight: 700;
          color: #4F46E5;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .secure-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #059669;
          font-weight: 500;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 24px 20px 40px;
        }

        .card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
          margin-bottom: 16px;
        }

        .card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #E5E7EB;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .card-body {
          padding: 24px;
        }

        .items-list {
          margin-bottom: 24px;
        }

        .item {
          display: flex;
          justify-content: space-between;
          align-items: start;
          padding: 16px 0;
          border-bottom: 1px solid #F3F4F6;
        }

        .item:first-child {
          padding-top: 0;
        }

        .item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .item-details {
          font-size: 14px;
          color: #6B7280;
        }

        .item-price {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-left: 16px;
        }

        .summary-card {
          background: #F9FAFB;
          border-radius: 12px;
          padding: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
        }

        .summary-label {
          font-size: 15px;
          color: #6B7280;
        }

        .summary-value {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
        }

        .total-row {
          border-top: 2px solid #E5E7EB;
          padding-top: 16px;
          margin-top: 8px;
        }

        .total-label {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .total-value {
          font-size: 24px;
          font-weight: 700;
          color: #4F46E5;
        }

        .pay-button {
          width: 100%;
          padding: 16px;
          background: #4F46E5;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
        }

        .pay-button:hover {
          background: #4338CA;
        }

        .pay-button:active {
          transform: scale(0.98);
        }

        .security-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
          font-size: 13px;
          color: #6B7280;
        }

        .powered-by {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: #9CA3AF;
        }

        @media (max-width: 640px) {
          .container { padding: 20px 16px 32px; }
          .card-body { padding: 20px; }
        }
      `}</style>

      <div className="navbar">
        <div className="nav-content">
          <div className="logo">
            <span>🛒</span>
            <span>Smart Cart</span>
          </div>
          <div className="secure-badge">
            <span>🔒</span>
            <span>Secure</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Order Summary</div>
          </div>
          <div className="card-body">
            <div className="items-list">
              {session?.items.map((item, idx) => (
                <div key={idx} className="item">
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-details">
                      ₹{item.price} × {item.quantity}
                    </div>
                  </div>
                  <div className="item-price">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-card">
              <div className="summary-row">
                <div className="summary-label">Subtotal</div>
                <div className="summary-value">₹{session?.total}</div>
              </div>
              <div className="summary-row">
                <div className="summary-label">Tax & Fees</div>
                <div className="summary-value">₹0</div>
              </div>
              <div className="summary-row total-row">
                <div className="total-label">Total</div>
                <div className="total-value">₹{session?.total}</div>
              </div>
            </div>

            <button className="pay-button" onClick={initiatePayment}>
              <span>💳</span>
              <span>Pay ₹{session?.total}</span>
            </button>

            <div className="security-info">
              <span>🔒</span>
              <span>Secured by Razorpay</span>
            </div>
          </div>
        </div>

        <div className="powered-by">
          Powered by Smart Cart System
        </div>
      </div>
    </>
  );
}