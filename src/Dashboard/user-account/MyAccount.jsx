import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import MyAppointments from './MyAppointments';
import Profile from './Profile';

import { BASE_URL } from '../../config';

import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';
import { jwtDecode } from 'jwt-decode';
import {
  LogOut,
  Trash2,
  Calendar,
  Settings,
  User,
  Mail,
  Phone,
  Info
} from 'lucide-react';
import DeleteAccountModal from '../../components/DeleteAccountModal';
import { toast } from 'react-toastify';

const MyAccount = () => {
  const { dispatch } = useContext(AuthContext);
  const [tab, setTab] = useState('bookings'); // Default active tab
  // eslint-disable-next-line no-unused-vars
  const { user, role, token } = useContext(AuthContext)
  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null); // State for error
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    // Prefer search params, but fall back to hash params for hash-based redirects
    let urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.get('method')) {
      // If the backend redirected using a hash (/#/path?token=...&method=...), parse that
      const hash = window.location.hash || '';
      if (hash.startsWith('#/')) {
        const [, rawQuery] = hash.slice(2).split('?');
        if (rawQuery) {
          urlParams = new URLSearchParams(rawQuery);
        }
      }
    }

    if (urlParams.get('method') === 'googleoauth') {
      const initializeAuth = async () => {
        const jwtToken = urlParams.get('token');

        if (jwtToken) {
          try {
            const decodedToken = jwtDecode(jwtToken);
            const { id } = decodedToken;
            console.log('Decoded token:', decodedToken);

            const response = await fetch(`${BASE_URL}/users/${id}`);
            const userData = await response.json();
            console.log(userData);

            if (response.ok) {
              const { role } = userData.data;

              dispatch({
                type: 'LOGIN',
                payload: {
                  token: jwtToken,
                  user: userData,
                  role,
                },
              });

              setUserData(userData.data);
              console.log(userData);
              localStorage.setItem('token', jwtToken);
              localStorage.setItem('user', JSON.stringify(userData.data));
              localStorage.setItem('role', role);

              window.history.replaceState({}, document.title, window.location.pathname);
              window.location.reload()
            } else {
              setError('Failed to fetch user role.');
              console.error('Failed to fetch user role:', userData.message);
            }
          } catch (error) {
            setError('Error initializing authentication.');
            console.error('Error initializing auth:', error);
          }
        }
      };

      initializeAuth();
    } else {
      const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

      if (storedUser) {
        setUserData((prev) => (prev ? prev : storedUser)); // Avoid resetting if already set
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (userData && userData._id) {
      const fetchUserProfile = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${BASE_URL}/users/${userData._id}`);
          const profileData = await response.json();

          if (response.ok) {
            setUserData((prev) => (prev?._id === profileData.data._id ? prev : profileData.data)); // Avoid redundant updates
          } else {
            setError('Failed to load profile.');
          }
        } catch (error) {
          setError('Error fetching profile: ' + error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [userData]);

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    // With HashRouter, use navigate to avoid full-page reload and 404s
    navigate('/login', { replace: true });
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/account`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete account');

      toast.success('Account deleted successfully');
      setIsDeleteModalOpen(false);

      // Logout and redirect
      setTimeout(() => {
        dispatch({ type: 'LOGOUT' });
        navigate('/login', { replace: true });
      }, 1000);
    } catch (err) {
      console.error('Error deleting account:', err);
      toast.error('Failed to delete account');
    }
  };

  return (
    <section className="bg-slate-50 dark:bg-slate-900 min-h-screen py-10 font-sans transition-colors duration-300">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">

        {loading && !error && <Loading />}

        {error && !loading && <Error errMessage={error} />}

        {!loading && !error && (
          <div className="grid lg:grid-cols-12 gap-8">

            {/* ==================== */}
            {/* SIDEBAR SECTION      */}
            {/* ==================== */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8 sticky top-24">

                {/* Profile Image */}
                <div className="flex flex-col items-center text-center">
                  <figure className="w-32 h-32 rounded-full p-1 border-2 border-dashed border-blue-200 dark:border-blue-800 mb-4 bg-slate-50 dark:bg-slate-700 overflow-hidden">
                    {userData && userData.profilePicture ? (
                      <img
                        src={userData.profilePicture.url}
                        alt="The user's image"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-400 dark:text-gray-500">
                        <User size={48} />
                      </div>
                    )}
                  </figure>

                  <div className="mt-2 space-y-1">
                    {userData && userData.name && (
                      <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100">{userData.name}</h3>
                    )}
                    {userData && userData.email && (
                      <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-gray-400 text-sm font-medium">
                        <Mail size={14} />
                        <span>{userData.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Details Info */}
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4">
                  <div className="text-center">
                    <h4 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3">Info</h4>
                    <div className="space-y-3">
                      {userData && userData.phone && (
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-slate-700 p-3 rounded-xl">
                          <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm text-blue-500 dark:text-blue-400">
                            <Phone size={16} />
                          </div>
                          <span className="font-medium">{userData.phone}</span>
                        </div>
                      )}

                      {userData && userData.bio && (
                        <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-slate-700 p-3 rounded-xl text-left">
                          <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm text-blue-500 dark:text-blue-400 shrink-0">
                            <Info size={16} />
                          </div>
                          <p className="italic leading-relaxed text-slate-500 dark:text-gray-400 text-xs">
                            {userData.bio}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 py-3.5 rounded-xl font-bold transition-colors"
                  >
                    <Trash2 size={18} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* ==================== */}
            {/* MAIN CONTENT SECTION */}
            {/* ==================== */}
            <div className="lg:col-span-8 xl:col-span-9">

              {/* Tab Navigation */}
              <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex overflow-x-auto">
                <button
                  onClick={() => { console.log('My Bookings button clicked'); setTab('bookings'); }}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                    ${tab === 'bookings'
                      ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                      : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 hover:bg-slate-50 dark:hover:bg-slate-700'}
                  `}
                >
                  <Calendar size={18} />
                  My Appointments
                </button>

                <button
                  onClick={() => setTab('settings')}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                    ${tab === 'settings'
                      ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                      : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 hover:bg-slate-50 dark:hover:bg-slate-700'}
                  `}
                >
                  <Settings size={18} />
                  Profile Settings
                </button>
              </div>

              {/* Tab Content Rendering */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                {tab === 'bookings' && <MyAppointments />}
                {tab === 'settings' && <Profile user={userData} />}
              </div>

            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
          userType="customer account"
        />
      </div>
    </section>
  );
};

export default MyAccount;