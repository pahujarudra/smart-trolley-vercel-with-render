import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';

const BACKEND_URL = 'https://render-trolley.onrender.com';

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
      setError('Error loading payment details');
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    try {
      // Step 1: Create Razorpay order
      const response = await fetch(`${BACKEND_URL}/api/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, amount: session.total })
      });
      
      const data = await response.json();
      
      // Step 2: Open Razorpay checkout
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
        theme: { color: '#667eea' },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled');
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert('Payment initiation failed: ' + error.message);
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
      alert('Verification error: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '24px'
      }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '24px',
        textAlign: 'center',
        padding: '20px'
      }}>
        {error}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Smart Cart Payment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 500px;
          width: 100%;
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header p { opacity: 0.9; font-size: 16px; }
        .content { padding: 30px; }
        .cart-items {
          background: #f7f9fc;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e0e6ed;
        }
        .item:last-child { border-bottom: none; }
        .item-name { font-weight: 600; color: #2d3748; }
        .item-qty { color: #718096; margin: 0 10px; }
        .item-price { font-weight: 700; color: #667eea; }
        .total {
          display: flex;
          justify-content: space-between;
          padding: 20px;
          background: #f7f9fc;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 20px;
          font-weight: 700;
        }
        .total-label { color: #2d3748; }
        .total-amount { color: #667eea; }
        .pay-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .pay-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        .pay-btn:active { transform: translateY(0); }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>🛒 Smart Cart</h1>
          <p>Review your order</p>
        </div>
        <div className="content">
          <div className="cart-items">
            {session?.items.map((item, idx) => (
              <div key={idx} className="item">
                <span className="item-name">{item.name}</span>
                <div>
                  <span className="item-qty">×{item.quantity}</span>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="total">
            <span className="total-label">Total Amount</span>
            <span className="total-amount">₹{session?.total}</span>
          </div>
          <button className="pay-btn" onClick={initiatePayment}>
            💳 Pay Now
          </button>
        </div>
      </div>
    </>
  );
}