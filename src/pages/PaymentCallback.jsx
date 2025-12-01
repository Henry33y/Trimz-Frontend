import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../config';
import { toast } from 'react-toastify';

const PaymentCallback = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(search);
    const reference = params.get('reference');
    if (!reference) {
      setStatus('error');
      setMessage('Missing reference');
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${BASE_URL}payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ reference })
        });
        const data = await res.json();
        if (!res.ok || !data?.success) throw new Error(data?.message || 'Verification failed');
        setStatus(data.paid ? 'success' : 'failed');
        setMessage(data.paid ? 'Payment successful' : 'Payment not completed');
        if (data.paid) {
          toast.success('Payment successful');
          // Signal appointments page to refresh if needed
          localStorage.setItem('appointments_refetch', '1');
        } else {
          toast.info('Payment not completed');
        }
        setTimeout(() => navigate('/users/profile/me', { replace: true }), 1500);
      } catch (e) {
        setStatus('error');
        setMessage(e.message);
        toast.error(e.message || 'Verification failed');
      }
    })();
  }, [search, token, navigate]);

  return (
    <section className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-semibold mb-2">Payment Verification</h2>
        <p className="text-gray-600">{status === 'verifying' ? 'Verifying your payment...' : message}</p>
      </div>
    </section>
  );
};

export default PaymentCallback;
