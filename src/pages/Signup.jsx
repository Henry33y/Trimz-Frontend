/* eslint-disable no-undef */
import signupImg from '../assets/images/signup.png';
import signupImg1 from '../assets/images/signup1.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BASE_URL } from '../config';
import {toast} from 'react-toastify';
import HashLoader from 'react-spinners/BeatLoader';
import { FcGoogle } from 'react-icons/fc'

const Signup = () => {
  // State for handling file upload preview
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState();
  
  // State for managing loading state during form submission
  const [loading, setLoading] = useState(false);
  
  // State for confirm password field (separate from main form data)
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Main form data state with initial values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '', // Added phone number field
    profilePicture: selectedFile,
    gender: '',
    role: 'customer',
  });

  // Hook for programmatic navigation
  const navigate = useNavigate()

  // Generic input handler for form fields
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  // Separate handler for confirm password
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  
  // Handler for file input changes (profile photo upload)
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Generate a local preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);

      // Update the formData with the selected file
      setSelectedFile(file);
    }
  };

  // Form submission handler
  const submitHandler = async event => {
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

    // Phone number validation (basic)
    const phoneRegex = /^[0-9]{10}$/; // Assumes 10-digit phone number
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      // Create a FormData object to send the data
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phone); // Add phone number
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('role', formData.role);
      
      if (selectedFile) {
        formDataToSend.append('profilePicture', selectedFile);
      }
      const token = localStorage.getItem('token');

      const res = await fetch(`${BASE_URL}users`, {
        method: 'post',
        headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),

      });


      const { message } = await res.json();

      // Handle unsuccessful registration
      if (!res.ok) {
        throw new Error(message);
      }

      // Handle successful registration
      setLoading(false);
      toast.success(message);
      navigate('/login');
    
    } catch (err) {
      // Handle registration errors
      toast.error(err.message);
      setLoading(false);
    }
  };
  const handleOauth = async () => {
    try {
      window.location.href = "http://localhost:5000/api/auth/google";
      
    }catch(err){
      toast.error(err.message)
    }
  }
    
  return (
    <section className='px-5 xl:px-0'>
      <div className='px-5 lg:px-0 min-h-screen flex items-center justify-center'>
      <div className='max-w-[1000px] mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2'>
          
          {/* Left side - Image display (hidden on mobile) */}
          <div className='hidden lg:block rounded-l-lg'>
            <figure className='rounded-l-lg'>
              <img src={signupImg} alt='SignUp Image' className='w-full rounded-l-lg'/>
              <img src={signupImg1} alt='SignUp Image' className='w-full rounded-l-lg'/>
            </figure>
          </div>

          {/* Right side - Signup form */}
        <div className='w-full max-w-[600px] mx-auto bg-white/90 rounded-lg shadow-[0_5px_20px_rgba(0,0,0,0.1)] md:p-10 p-6 backdrop-blur-sm my-8'>    {/* Added Logo Section */}
          <div className='rounded-l-lg lg:pl-16 py-10'>
            <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10'>
              Create an Account with
              <p>
                <span className='text-primaryColor'> 
                  Trimz</span></p>
            </h3>



            {/* Sign up form */}
            <form onSubmit={submitHandler}>
              {/* Name input field */}
              <div className='mb-5'>
                <input
                  type="text"
                  placeholder='Full Name'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                    placeholder:text-textColor rounded-md cursor-pointer'
                  required 
                />
              </div>

              {/* Email input field */}
              <div className='mb-5'>
                <input
                  type="email"
                  placeholder='Enter your email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                    placeholder:text-textColor rounded-md cursor-pointer'
                  required 
                />
              </div>

              {/* Phone number input field */}
              <div className='mb-5'>
                <input
                  type="tel"
                  placeholder='Phone Number (10 digits)'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                    placeholder:text-textColor rounded-md cursor-pointer'
                  pattern="[0-9]{10}"
                  required 
                />
                <p className="text-xs text-textColor mt-1">Please enter a 10-digit phone number</p>
              </div>

              {/* Existing password and confirm password fields */}
              <div className='mb-5'>
                <input
                  type="password"
                  placeholder='Password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                    placeholder:text-textColor rounded-md cursor-pointer'
                  required 
                />
                <p className="text-xs text-textColor mt-1">Password must be at least 6 characters long</p>
              </div>

              <div className='mb-5'>
                <input
                  type="password"
                  placeholder='Confirm Password'
                  name='confirmPassword'
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                    placeholder:text-textColor rounded-md cursor-pointer'
                  required 
                />
              </div>

              {/* Role and Gender selection container */}
              <div className='mb-5 flex items-center justify-between'>
                {/* Role selection dropdown */}
                <label className='text-textColor font-semibold text-[15px] leading-7'>
                  Are you a:
                  <select
                    value={formData.role}
                    onChange={handleInputChange}
                    name="role"
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3
                      focus:outline-none"
                  >
                    <option value="provider">Provider</option>
                    <option value="customer">Customer</option>
                  </select>
                </label>
                
                {/* Gender selection dropdown */}
                <label className='text-textColor font-semibold text-[15px] leading-7'>
                  Gender:
                  <select
                    value={formData.gender}
                    onChange={handleInputChange}
                    name="gender"
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3
                      focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    {/* Uncomment later ---- Only 2 genders for now */}
                    {/* <option value="other">Other</option> */}
                  </select>
                </label>
              </div>

              {/* Photo upload section */}
              <div className='mb-5 flex items-center gap-3'>
                {/* Preview selected photo if available */}
                {selectedFile && (
                  <figure className='w-[60px] h-[60px] rounded-full border-2 border-solid
                    border-primaryColor flex items-center justify-center overflow-hidden bg-[#f5f5f5]'>
                    <img 
                      src={previewURL} 
                      alt="" 
                      className='w-full h-full object-cover'
                    />
                  </figure>
                )}

                {/* Photo upload input */}
                <div className='relative w-[130px] h-[50px]'>
                  <input 
                    type="file"
                    name='profilePicture'
                    id='customFile'
                    onChange={handleFileInputChange}
                    accept='.jpg, .jpeg, .png'
                    className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                  />

                  {/* Custom styled upload button */}
                  <label 
                    htmlFor="customFile" 
                    className='absolute top-0 left-0 w-full h-full flex
                      items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46]
                      text-headingColor font-semibold rounded-lg truncate cursor-pointer'
                  >
                    Upload Photo
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      {/* Primary Sign Up Button */}
      <div className="flex justify-center">
        <button
          disabled={loading}
          type="submit"
          onClick={submitHandler}
          className="w-full relative bg-primaryColor text-white text-lg font-semibold rounded-xl
                   px-6 py-4 shadow-lg hover:shadow-primaryColor/30
                   transform hover:-translate-y-0.5 active:translate-y-0
                   transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed
                   disabled:hover:shadow-none disabled:hover:translate-y-0"
        >
          <div className="flex items-center justify-center min-h-[30px]">
            {loading ? (
              <HashLoader size={30} color="#ffffff" />
            ) : (
              <span>Sign Up</span>
            )}
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-2">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-gray-500 text-sm font-medium">OR</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Google Auth Button */}
      <div>
        <button 
          onClick={handleOauth}
          className="group relative w-full bg-white text-gray-700 font-medium
                   rounded-xl border border-gray-300 shadow-sm
                   hover:shadow-lg hover:border-gray-400
                   transition-all duration-200 overflow-hidden"
        >
          {/* Colored top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r 
                        from-[#4285F4] via-[#34A853] to-[#FBBC05]"></div>
          
          {/* Button content */}
          <div className="flex items-center justify-center gap-3 px-6 py-4">
            <FcGoogle className="text-2xl" />
            <span className="font-roboto">Sign up with Google</span>
          </div>

          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r 
                        from-[#4285F4]/5 via-[#34A853]/5 to-[#FBBC05]/5 
                        opacity-0 group-hover:opacity-100 
                        transition-opacity duration-200" />
        </button>
      </div>
    </div>
  



              {/* Login link for existing users */}
              <p className='mt-5 text-textColor text-center'>
                Already have an account? 
                <Link to='/login' className='text-primaryColor font-medium mt-1'> 
                  Login
                </Link>
              </p>
            </form>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup