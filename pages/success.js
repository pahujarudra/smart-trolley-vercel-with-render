import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function SuccessPage() {
  const router = useRouter();
  const { billId } = router.query;

  return (
    <>
      <Head>
        <title>Payment Successful - Smart Cart</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#10B981" />
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

        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          max-width: 480px;
          width: 100%;
          text-align: center;
          overflow: hidden;
        }

        .success-header {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          padding: 48px 32px;
          position: relative;
        }

        .checkmark {
          width: 80px;
          height: 80px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          animation: scaleIn 0.5s ease-out;
        }

        .checkmark svg {
          width: 48px;
          height: 48px;
          stroke: white;
          stroke-width: 4;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          animation: drawCheck 0.8s ease-out 0.2s forwards;
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }

        .success-title {
          color: white;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .success-subtitle {
          color: rgba(255,255,255,0.9);
          font-size: 15px;
        }

        .content {
          padding: 32px;
        }

        .bill-card {
          background: #F9FAFB;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .bill-label {
          font-size: 13px;
          color: #6B7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .bill-number {
          font-size: 36px;
          font-weight: 700;
          color: #10B981;
          font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
          letter-spacing: 2px;
        }

        .info-text {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn {
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: inline-block;
        }

        .btn-primary {
          background: #4F46E5;
          color: white;
        }

        .btn-primary:hover {
          background: #4338CA;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #E5E7EB;
        }

        .btn-secondary:hover {
          background: #F9FAFB;
        }

        .footer {
          padding: 20px;
          border-top: 1px solid #E5E7EB;
          font-size: 13px;
          color: #9CA3AF;
        }

        @media (max-width: 640px) {
          .success-header { padding: 40px 24px; }
          .content { padding: 24px; }
          .bill-number { font-size: 32px; }
        }
      `}</style>

      <div className="container">
        <div className="success-header">
          <div className="checkmark">
            <svg viewBox="0 0 52 52">
              <polyline points="14 27 22 35 38 19" />
            </svg>
          </div>
          <h1 className="success-title">Payment Successful!</h1>
          <p className="success-subtitle">Your transaction has been completed</p>
        </div>

        <div className="content">
          <div className="bill-card">
            <div className="bill-label">Receipt Number</div>
            <div className="bill-number">{billId || '---'}</div>
          </div>

          <p className="info-text">
            Your payment has been processed successfully. You can check your receipt anytime using the bill number above.
          </p>

          <div className="actions">
            <Link href="/" className="btn btn-primary">
              View Receipt
            </Link>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                navigator.clipboard.writeText(billId);
                alert('Bill ID copied to clipboard!');
              }}
            >
              Copy Bill ID
            </button>
          </div>
        </div>

        <div className="footer">
          Thank you for shopping with Smart Cart
        </div>
      </div>
    </>
  );
}