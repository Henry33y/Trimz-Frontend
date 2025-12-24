import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext.jsx';
import { BASE_URL } from '../config';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { dispatch } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get('token');
    const to = params.get('to') || '/users/profile/me';

    const finish = (targetPath = '/users/profile/me') => {
      navigate(targetPath, { replace: true });
    };

    (async () => {
      try {
        if (!token) {
          finish('/login');
          return;
        }

        localStorage.setItem('token', token);
        let userId;
        try {
          const decoded = jwtDecode(token);
          userId = decoded?.id;
        } catch {
          // If decode fails, continue without it
        }

        let userData = null;
        if (userId) {
          const res = await fetch(`${BASE_URL}/users/${userId}`);
          const json = await res.json();
          if (res.ok) {
            userData = json.data;
          }
        }

        const role = userData?.role || localStorage.getItem('role') || 'customer';
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('role', role);
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user: userData, token, role } });
        }

        finish(to);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Auth callback error:', e);
        finish('/login');
      }
    })();
  }, [search, navigate, dispatch]);

  return null; // Can render a spinner if desired
};

export default AuthCallback;
