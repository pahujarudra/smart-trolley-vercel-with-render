import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const { billId } = router.query;

  return (
    <div className="container">
      <div className="card">
        <div className="success-icon">✅</div>
        <h1>Payment Successful!</h1>
        <p className="subtitle">
          Your payment has been processed successfully
        </p>
        <div className="bill-id">
          <div className="bill-label">Your Bill ID</div>
          <div className="bill-number">{billId}</div>
        </div>
        <button onClick={() => router.push('/')}>← Back to Home</button>
      </div>

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
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 500px;
          width: 100%;
          padding: 60px 40px;
          text-align: center;
        }

        .success-icon {
          font-size: 80px;
          margin-bottom: 20px;
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        h1 {
          color: #2d3748;
          margin-bottom: 10px;
          font-size: 32px;
        }

        .subtitle {
          color: #718096;
          margin-bottom: 30px;
        }

        .bill-id {
          background: #f7f9fc;
          padding: 20px;
          border-radius: 12px;
          margin: 30px 0;
          font-size: 18px;
        }

        .bill-label {
          color: #718096;
          margin-bottom: 10px;
        }

        .bill-number {
          font-size: 36px;
          font-weight: 700;
          color: #11998e;
        }

        button {
          display: inline-block;
          padding: 15px 40px;
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s;
          font-size: 16px;
        }

        button:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
