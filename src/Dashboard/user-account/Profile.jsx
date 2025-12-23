/* eslint-disable react/prop-types */
// import avatar from '../assets/images/doctor-img01.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';
import { Loader2, User, Mail, Phone, Lock, Camera, Save } from 'lucide-react';

const Profile = ({user}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    newPassword: '', 
    profilePicture: null,
    gender: '',
    phone: '',
    bio: '',  
  });
  console.log('user', user);
  // Hook for programmatic navigation
  const navigate = useNavigate()

  useEffect(() => {
  if (!user) return;

  setFormData({
    name: user.name || '',
    email: user.email || '',
    gender: user.gender || '',
    phone: user.phone || '',
    bio: user.bio || '',
    newPassword: '',
  });
}, [user]);


  // Generic input handler for form fields
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Separate handler for confirm password
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  
  // Handler for file input changes (profile photo upload)
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      console.log('File', file);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
  
    // Password validation and reset logic
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
      if (formData.newPassword !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }
  
    setLoading(true); // Start loading state
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('bio', formData.bio);
  
      if (formData.newPassword) {
        formDataToSend.append('password', formData.newPassword);
      }
  
      if (selectedFile) {
        formDataToSend.append('profilePicture', selectedFile);
      }
      const token = localStorage.getItem('token');

      const res = await fetch(`${BASE_URL}users/${user._id}`, {
        method: 'PATCH',
        headers: {
              // "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: formDataToSend,

      });
      // console.log('Result',res);

      // console.log(token, 'TOKEN')
      console.log('Name', formData.name)
      console.log('File', formData.selectedFile)
      console.log('FormData', formDataToSend)
  
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message);
      }
      
      localStorage.setItem('user', JSON.stringify(data.data));
      localStorage.setItem('role', data.data.role);
      localStorage.setItem('token', token);

      
      setLoading(false);
      toast.success('Profile updated successfully!');

      // Optional: Clear password fields after successful update
      setFormData((prev) => ({
        ...prev,
        newPassword: '',
      }));
      setConfirmPassword('');

      // Optional: navigate only if specified
      navigate('/users/profile/me');
      window.location.reload();
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };
   

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            Profile Settings
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage your account information and preferences.</p>
        </div>

        <form onSubmit={submitHandler} className="p-6 md:p-8 space-y-8">
          
          {/* Profile Photo Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-slate-100 shadow-md overflow-hidden bg-slate-50">
                <img 
                  src={previewUrl || user?.profilePicture?.url || "/default-avatar.png"}
                  alt="profile"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                />
              </div>
              <label 
                htmlFor="customFile" 
                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-sm border-2 border-white"
                title="Change Photo"
              >
                <Camera size={16} />
                <input 
                  type="file"
                  name="profilePicture"
                  id="customFile"
                  onChange={handleFileInputChange}
                  accept=".jpg, .jpeg, .png"
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-slate-900">{formData.name || 'User Name'}</h3>
              <p className="text-slate-500 text-sm">{formData.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Gender</label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 font-medium appearance-none"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-5">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Bio</label>
                <textarea
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  maxLength={300}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium h-32 resize-none"
                />
                <p className="text-xs text-right text-slate-400 mt-1 font-medium">
                  {formData.bio ? `${formData.bio.length}/300` : '0/300'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Lock size={16} className="text-slate-400" /> Change Password
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={formData.newPassword || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Profile;