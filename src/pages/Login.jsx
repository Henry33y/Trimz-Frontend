/* eslint-disable no-unused-vars */
// ============================================
// LOGIN PAGE - Modern Design Matching Signup
// ============================================
// Professional login form with OAuth, forgot password,
// and complete authentication logic
// ============================================

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import HashLoader from 'react-spinners/BeatLoader';
import { FcGoogle } from 'react-icons/fc';
import { BASE_URL } from '../config';
import logo from '../assets/images/trimz.png';

// ============================================
// ASSETS
// ============================================
const loginVisual = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1000';

// ============================================
// CUSTOM GOOGLE ICON COMPONENT
// ============================================
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

// ============================================
// MAIN LOGIN COMPONENT
// ============================================
const Login = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  // ============================================
  // INPUT HANDLERS
  // ============================================
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ============================================
  // LOGIN FORM SUBMISSION HANDLER
  // ============================================
  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Login failed');
      }

      const userRole = result.data.role;

      // Dispatch login success to context
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: result.data,
          token: result.token,
          role: userRole,
        },
      });

      console.log("User Role:", result.data.role);

      // Dynamic navigation based on role
      if (userRole === 'user') {
        navigate('/users/profile/me', { replace: true });
      } else if (userRole === 'barber') {
        navigate('/barber/profile/me', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }

      toast.success(result.message || 'Login successful!');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      
      if (err.message.includes('fetch') || err.name === 'TypeError') {
        toast.error('Unable to connect to server. Please make sure the backend is running.');
      } else {
        toast.error(err.message || 'Login failed. Please try again.');
      }
      
      console.error('Login error:', err);
    }
  };

  // ============================================
  // FORGOT PASSWORD HANDLER
  // ============================================
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      toast.success('Password reset link sent to your email. Please check your inbox.');
      setShowForgotPassword(false);
      setLoading(false);
    } catch (err) {
      toast.error(err.message || 'Failed to send reset link');
      setLoading(false);
    }
  };

  // ============================================
  // OAUTH HANDLER
  // ============================================
  const handleOauth = async () => {
    try {
      window.location.href = `${BASE_URL}auth/google`;
    } catch (err) {
      toast.error(err.message || 'OAuth failed');
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-900 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white rounded-3xl sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row-reverse">
        
        {/* ============================================ */}
        {/* RIGHT SIDE - Visual/Branding */}
        {/* ============================================ */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img 
            src={loginVisual} 
            alt="Professional Grooming" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          
          {/* Branding Content */}
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-5xl font-black mb-4 tracking-tight">
              <span className="text-primaryColor">Trimz</span>
            </h2>
            <p className="text-xl text-slate-200 leading-relaxed font-medium mb-8">
              &quot;Looking good isn&apos;t self-importance; it&apos;s self-respect.&quot;
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold text-primaryColor">2k+</p>
                <p className="text-sm text-slate-300">Stylists</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primaryColor">50k+</p>
                <p className="text-sm text-slate-300">Bookings</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primaryColor">4.9★</p>
                <p className="text-sm text-slate-300">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* LEFT SIDE - Login Form */}
        {/* ============================================ */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 xl:p-16 flex items-center bg-white dark:bg-slate-800">
          <div className="max-w-md mx-auto">
            {/* Logo Section */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <Link to="/home" className="group transition-transform duration-300 hover:scale-105">
                <img 
                  src={logo} 
                  alt="Trimz Logo" 
                  className="h-24 sm:h-28 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Form Header */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-gray-100 tracking-tight mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-500 dark:text-gray-300 font-medium text-sm sm:text-base">
                Sign in to continue to your account
              </p>
            </div>

            {/* ============================================ */}
            {/* LOGIN FORM */}
            {/* ============================================ */}
            <form onSubmit={submitHandler} className="space-y-5">
              
              {/* ============================================ */}
              {/* EMAIL INPUT */}
              {/* ============================================ */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primaryColor transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-700 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 outline-none transition-all font-medium text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-400"
                  required
                />
              </div>

              {/* ============================================ */}
              {/* PASSWORD INPUT */}
              {/* ============================================ */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primaryColor transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-700 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 outline-none transition-all font-medium text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-400"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primaryColor transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* ============================================ */}
              {/* FORGOT PASSWORD LINK */}
              {/* ============================================ */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(!showForgotPassword)}
                  className="text-primaryColor text-sm font-semibold hover:underline underline-offset-4 transition-all flex items-center gap-1 ml-auto"
                >
                  <KeyRound size={16} />
                  Forgot Password?
                </button>
              </div>

              {/* ============================================ */}
              {/* FORGOT PASSWORD SECTION */}
              {/* ============================================ */}
              {showForgotPassword && (
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl space-y-3">
                  <p className="text-sm text-slate-700 font-medium">
                    Enter your email to receive a password reset link
                  </p>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-70"
                  >
                    {loading ? <HashLoader size={20} color="#ffffff" /> : 'Send Reset Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* ============================================ */}
              {/* SUBMIT BUTTONS */}
              {/* ============================================ */}
              <div className="pt-2 space-y-4">
                {/* Primary Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 sm:py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-primaryColor hover:-translate-y-1 hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <HashLoader size={24} color="#ffffff" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                {/* Google OAuth Button */}
                <button 
                  type="button"
                  onClick={handleOauth}
                  className="w-full py-3.5 sm:py-4 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-100 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-300 transition-all shadow-sm hover:shadow-md"
                >
                  <FcGoogle className="text-2xl" />
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* ============================================ */}
              {/* SIGNUP LINK */}
              {/* ============================================ */}
              <p className="text-center text-slate-500 dark:text-gray-300 font-medium text-sm mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                New to Trimz?{' '}
                <Link to="/register" className="text-primaryColor font-bold hover:underline underline-offset-4 transition-all">
                  Create Account
                </Link>
              </p>
            </form>

            {/* ============================================ */}
            {/* MOBILE BRANDING */}
            {/* ============================================ */}
            <div className="lg:hidden mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-2xl font-black text-primaryColor mb-2">Trimz</p>
              <p className="text-sm text-slate-500">Your trusted grooming partner</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;