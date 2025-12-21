/* eslint-disable no-unused-vars */
// ============================================
// SIGNUP PAGE - Modern Design with Complete Logic
// ============================================
// Professional signup form with validation, file upload,
// and OAuth integration
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Camera, 
  ChevronDown, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/BeatLoader';
import { FcGoogle } from 'react-icons/fc';
import { BASE_URL } from '../config';

// ============================================
// ASSETS
// ============================================
const signupVisual = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000';

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
// MAIN SIGNUP COMPONENT
// ============================================
const Signup = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    profilePicture: null,
    gender: 'male',
    role: 'customer',
  });

  const navigate = useNavigate();

  // ============================================
  // INPUT HANDLERS
  // ============================================
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Generate preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);

      // Store file in state
      setSelectedFile(file);
    }
  };

  // ============================================
  // FORM SUBMISSION HANDLER
  // ============================================
  const submitHandler = async (event) => {
    event.preventDefault();
    
    // Password validation checks
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // Password match validation
    if (formData.password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${BASE_URL}users`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(formData),
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }

      setLoading(false);
      toast.success(message);
      navigate('/login');
    
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  // ============================================
  // OAUTH HANDLER
  // ============================================
  const handleOauth = async () => {
    try {
      window.location.href = `${BASE_URL}auth/google`;
    } catch(err) {
      toast.error(err.message);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white rounded-3xl sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* ============================================ */}
        {/* LEFT SIDE - Visual/Branding */}
        {/* ============================================ */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img 
            src={signupVisual} 
            alt="Barber Shop" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          
          {/* Branding Content */}
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-5xl font-black mb-4 tracking-tight">
              <span className="text-primaryColor">Trimz</span>
            </h2>
            <p className="text-xl text-slate-200 leading-relaxed font-medium mb-8">
              &quot;Style is a way to say who you are without having to speak.&quot;
            </p>
            
            {/* Social Proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-11 h-11 rounded-full border-2 border-slate-900 bg-slate-700 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-300 tracking-wide">
                Joined by 2k+ stylists
              </p>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* RIGHT SIDE - Signup Form */}
        {/* ============================================ */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 xl:p-16">
          <div className="max-w-md mx-auto">
            {/* Form Header */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                Create Account
              </h2>
              <p className="text-slate-500 font-medium text-sm sm:text-base">
                Join the community of expert groomers
              </p>
            </div>

            {/* ============================================ */}
            {/* SIGNUP FORM */}
            {/* ============================================ */}
            <form onSubmit={submitHandler} className="space-y-4 sm:space-y-5">
              
              {/* ============================================ */}
              {/* PROFILE PHOTO UPLOAD */}
              {/* ============================================ */}
              <div className="flex items-center gap-4 sm:gap-5 mb-6">
                <div className="relative group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-primaryColor">
                    {previewURL ? (
                      <img src={previewURL} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="text-slate-400 group-hover:text-primaryColor transition-colors" size={28} />
                    )}
                  </div>
                  <input 
                    type="file" 
                    name="profilePicture"
                    id="profilePicture"
                    onChange={handleFileInputChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept=".jpg, .jpeg, .png"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Profile Picture</h4>
                  <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                </div>
              </div>

              {/* ============================================ */}
              {/* FULL NAME INPUT */}
              {/* ============================================ */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primaryColor transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>

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
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>

              {/* ============================================ */}
              {/* PHONE NUMBER INPUT */}
              {/* ============================================ */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primaryColor transition-colors">
                  <Smartphone size={20} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (10 digits)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  required
                />
                <p className="text-xs text-slate-500 mt-1.5 ml-1">Enter a valid 10-digit phone number</p>
              </div>

              {/* ============================================ */}
              {/* PASSWORD FIELDS */}
              {/* ============================================ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
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
                    className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
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

                {/* Confirm Password */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primaryColor transition-colors">
                    <ShieldCheck size={20} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primaryColor transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 -mt-1 ml-1">Password must be at least 6 characters</p>

              {/* ============================================ */}
              {/* ROLE & GENDER SELECTION */}
              {/* ============================================ */}
              <div className="grid grid-cols-2 gap-4">
                {/* Role Selection */}
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full appearance-none px-4 py-3.5 sm:py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 outline-none transition-all font-bold text-slate-700 text-sm cursor-pointer"
                  >
                    <option value="customer">Customer</option>
                    <option value="provider">Provider</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>

                {/* Gender Selection */}
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full appearance-none px-4 py-3.5 sm:py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 outline-none transition-all font-bold text-slate-700 text-sm cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              {/* ============================================ */}
              {/* SUBMIT BUTTONS */}
              {/* ============================================ */}
              <div className="pt-4 space-y-4">
                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 sm:py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-primaryColor hover:-translate-y-1 hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <HashLoader size={24} color="#ffffff" />
                  ) : (
                    <>
                      <span>Create Account</span>
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
                  className="w-full py-3.5 sm:py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md"
                >
                  <FcGoogle className="text-2xl" />
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* ============================================ */}
              {/* LOGIN LINK */}
              {/* ============================================ */}
              <p className="text-center text-slate-500 font-medium text-sm mt-6 pt-4 border-t border-slate-100">
                Already have an account?{' '}
                <Link to="/login" className="text-primaryColor font-bold hover:underline underline-offset-4 transition-all">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;