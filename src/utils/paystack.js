import { BASE_URL } from '../config';

export async function initAppointmentPayment({ appointmentId, token }) {
  const res = await fetch(`${BASE_URL}payments/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ appointmentId })
  });
  const data = await res.json();
  if (!res.ok || !data?.success) throw new Error(data?.message || 'Failed to init payment');
  return data; // { authorization_url, reference }
}

export function redirectToPaystack(authUrl) {
  window.location.href = authUrl;
}
