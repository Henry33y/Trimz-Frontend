/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  FileText,
  Award,
  Clock,
  Upload,
  Calendar,
  Save,
  Trash2,
  Plus,
  MapPin,
  Search
} from 'lucide-react';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';

import useFetchData from '../../hooks/useFetchData';

// ==========================================
// SUB-COMPONENT: TimeSlotSection
// ==========================================
const TimeSlotSection = ({ formData, setFormData }) => {
  const [newSlot, setNewSlot] = useState({
    day: 'Sunday',
    startingTime: '',
    endingTime: ''
  });

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setNewSlot(prev => ({ ...prev, [name]: value }));
  };

  const addTimeSlot = (e) => {
    e.preventDefault();
    if (!newSlot.startingTime || !newSlot.endingTime) {
      toast.error("Please select both start and end times");
      return;
    }

    setFormData(prev => ({
      ...prev,
      timeSlots: [...(prev.timeSlots || []), newSlot]
    }));

    // Reset time inputs but keep day for convenience
    setNewSlot(prev => ({ ...prev, startingTime: '', endingTime: '' }));
  };

  const removeTimeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Day</label>
          <select
            name="day"
            value={newSlot.day}
            onChange={handleTimeChange}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100"
          >
            <option value="Sunday">Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Start Time</label>
          <input
            type="time"
            name="startingTime"
            value={newSlot.startingTime}
            onChange={handleTimeChange}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">End Time</label>
          <div className="flex gap-2">
            <input
              type="time"
              name="endingTime"
              value={newSlot.endingTime}
              onChange={handleTimeChange}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={addTimeSlot}
              className="bg-slate-900 dark:bg-slate-700 text-white p-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
              title="Add Slot"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {formData.timeSlots?.length > 0 ? (
          formData.timeSlots.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-dark-md transition-all group">
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">{item.day}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.startingTime} - {item.endingTime}</p>
              </div>
              <button
                onClick={() => removeTimeSlot(index)}
                className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No time slots added yet.
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT: Profile
// ==========================================
const Profile = ({ barberData }) => {
  const [previewURL, setPreviewURL] = useState('');
  const { data: configData } = useFetchData('admin/public/config');
  const specializations = configData?.service_categories || ["Shaving", "Braiding", "Hairstyling"];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bio: '',
    gender: '',
    specialization: '',
    location: '',
    experience: [],
    achievements: [],
    timeSlots: [],
    about: '',
    profilePicture: null,
  });

  // Populate the form data when barberData changes
  useEffect(() => {
    if (barberData) {
      setFormData({
        ...formData,
        name: barberData.name || '',
        email: barberData.email || '',
        phone: barberData.phone || '',
        bio: barberData.bio || '',
        gender: barberData.gender || '',
        specialization: barberData.specialization?.title || barberData.specialization || '',
        location: barberData.location || '',
        experience: barberData.experience || [],
        achievements: barberData.achievements || [],
        timeSlots: barberData.workingHours || [],
        about: barberData.about || '',
        profilePicture: barberData.profilePicture || null,
      });

      // Set preview URL
      if (barberData.profilePicture?.url) {
        const url = barberData.profilePicture.url.startsWith('http')
          ? barberData.profilePicture.url
          : `${BASE_URL}/${barberData.profilePicture.url}`;
        setPreviewURL(url);
      } else if (typeof barberData.profilePicture === 'string') {
        const url = barberData.profilePicture.startsWith('http')
          ? barberData.profilePicture
          : `${BASE_URL}/uploads/profilePictures/${barberData.profilePicture}`;
        setPreviewURL(url);
      } else {
        setPreviewURL('/placeholder.jpg'); // default fallback
      }
    }
  }, [barberData]);

  useEffect(() => {
    return () => {
      if (typeof previewURL === 'string' && previewURL.startsWith('blob:')) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload a JPEG or PNG image.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB.');
        return;
      }
      const objectURL = URL.createObjectURL(file);
      setPreviewURL(objectURL);
      setFormData({ ...formData, profilePicture: file });
    }
  };

  // Reusable function to handle changes for array-type fields
  const handleReusableInputChangeFunc = (key, index, event) => {
    const { name, value } = event.target;
    setFormData(prev => {
      const updatedItems = [...prev[key]];
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      return { ...prev, [key]: updatedItems };
    });
  };

  // Function to add new achievement items
  const addAchievements = (e) => {
    e.preventDefault();
    addItem('achievements', {
      date: '',
      description: '',
      title: 'Best Stylist',
    });
  };

  // Reusable function for adding an item to an array field
  const addItem = (key, newItem) => {
    setFormData(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newItem],
    }));
    toast.info('Item added');
  };

  // Reusable function for removing an item from an array field
  const removeItem = (key, index) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key]?.filter((_, i) => i !== index) || [],
    }));
    toast.info('Item removed');
  };

  // Function to add new experience item
  const addExperience = (e) => {
    e.preventDefault();
    addItem('experience', {
      startingDate: '',
      startingTime: '',
      endingDate: '',
      endingTime: '',
      workplace: 'Ecutz Barbering Shop',
      role: '',
      description: '',
    });
  };

  // Handlers for achievements and experience changes
  const handleAchievementsChange = (event, index) => {
    handleReusableInputChangeFunc('achievements', index, event);
  };

  const handleExperienceChange = (event, index) => {
    handleReusableInputChangeFunc('experience', index, event);
  };

  // Submit the updated profile data
  const updateProfileHandler = async (e) => {
    e.preventDefault();

    // Safety check for ID
    if (!barberData || !barberData._id) {
      toast.error("Cannot update: User ID not found");
      return;
    }

    try {
      const updateData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== "profilePicture") {
          // Special handling for specialization object structure expected by backend
          if (key === "specialization") {
            updateData.append(key, JSON.stringify({ title: formData[key] }));
          } else if (typeof formData[key] === "object") {
            updateData.append(key, JSON.stringify(formData[key]));
          } else {
            updateData.append(key, formData[key]);
          }
        }
      });
      if (formData.profilePicture instanceof File) {
        updateData.append('profilePicture', formData.profilePicture);
      }

      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/users/${barberData._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: updateData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }

      // Update local storage
      localStorage.setItem('user', JSON.stringify(result.data));
      // localStorage.setItem('role', result.data.role); // Role usually doesn't change on profile update, but safe to keep

      toast.success(result.message);

      // Optional: Delay reload to show toast, or remove reload if state updates automatically
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Profile Settings</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your public profile and account details</p>
        </div>
        <button
          type="button"
          onClick={updateProfileHandler}
          className="flex items-center gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <form onSubmit={updateProfileHandler} className="space-y-8">

        {/* ======================= */}
        {/* SECTION 1: BASIC INFO */}
        {/* ======================= */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
            <User className="text-blue-600 dark:text-blue-400" size={20} />
            Basic Information
          </h3>

          {/* Profile Picture Upload */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
                {previewURL ? (
                  <img src={previewURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <User size={40} />
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0">
                <label
                  htmlFor="customFile"
                  className="w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md border-2 border-white dark:border-slate-700"
                >
                  <Upload size={14} />
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
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Profile Photo</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Allowed JPG, JPEG or PNG. Max size of 5MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Gender</label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 outline-none transition-all appearance-none text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Specialization</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 outline-none transition-all appearance-none text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select Specialization</option>
                  {specializations.map((spec, i) => (
                    <option key={i} value={spec} className="capitalize">{spec}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  Your Operational Zone
                </label>
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">UG Campus & Accra</span>
              </div>

              {/* Quick Select Badges */}
              <div className="flex flex-wrap gap-2">
                {["UG - Sarbah", "UG - Akuafo", "UG - Legon", "UG - Volta", "East Legon"].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setFormData({ ...formData, location: loc })}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${formData.location?.includes(loc)
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 scale-105"
                      : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-blue-400"
                      }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>

              <div className="relative group">
                <input
                  type="text"
                  list="campus-locations"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Type your hall, hostel, or neighborhood..."
                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-sm font-bold text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                />
                <datalist id="campus-locations">
                  {(configData?.available_locations || []).map((loc, i) => (
                    <option key={i} value={loc} />
                  ))}
                </datalist>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Search size={18} />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium italic px-1">
                Pinning your location helps students near you find your services faster.
              </p>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Short Bio</label>
              <input
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="A brief introduction..."
                maxLength={100}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <p className="text-xs text-right text-gray-400 dark:text-gray-500">{formData.bio.length}/100</p>
            </div>
          </div>
        </div>

        {/* ======================= */}
        {/* SECTION 2: ABOUT */}
        {/* ======================= */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
            <FileText className="text-blue-600 dark:text-blue-400" size={20} />
            About Me
          </h3>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Biography</label>
            <textarea
              name="about"
              rows={6}
              value={formData.about}
              placeholder="Tell clients about your journey, style, and what makes your service unique..."
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 outline-none transition-all resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            ></textarea>
          </div>
        </div>

        {/* ======================= */}
        {/* SECTION 3: ACHIEVEMENTS */}
        {/* ======================= */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Award className="text-blue-600 dark:text-blue-400" size={20} />
              Achievements
            </h3>
            <button
              type="button"
              onClick={addAchievements}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              <Plus size={16} /> Add New
            </button>
          </div>

          <div className="space-y-6">
            {formData.achievements.length === 0 && (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-700 rounded-xl border border-dashed border-gray-200 dark:border-slate-600">
                No achievements added yet.
              </div>
            )}

            {formData.achievements?.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-slate-700 p-5 rounded-xl border border-gray-200 dark:border-slate-600 relative group transition-all hover:shadow-md dark:hover:shadow-dark-md">
                <button
                  type="button"
                  onClick={() => removeItem('achievements', index)}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-slate-800 text-red-500 dark:text-red-400 rounded-full shadow-md border border-gray-200 dark:border-slate-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={item.title}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100"
                      onChange={(e) => handleAchievementsChange(e, index)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={item.date ? new Date(item.date).toISOString().split('T')[0] : ''}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100"
                      onChange={(e) => handleAchievementsChange(e, index)}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Description</label>
                    <input
                      type="text"
                      name="description"
                      value={item.description}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100"
                      onChange={(e) => handleAchievementsChange(e, index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================= */}
        {/* SECTION 4: EXPERIENCE */}
        {/* ======================= */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Clock className="text-blue-600 dark:text-blue-400" size={20} />
              Experience
            </h3>
            <button
              type="button"
              onClick={addExperience}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              <Plus size={16} /> Add New
            </button>
          </div>

          <div className="space-y-6">
            {formData.experience.length === 0 && (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-700 rounded-xl border border-dashed border-gray-200 dark:border-slate-600">
                No experience added yet.
              </div>
            )}

            {formData.experience?.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-slate-700 p-5 rounded-xl border border-gray-200 dark:border-slate-600 relative group transition-all hover:shadow-md dark:hover:shadow-dark-md">
                <button
                  type="button"
                  onClick={() => removeItem('experience', index)}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-slate-800 text-red-500 dark:text-red-400 rounded-full shadow-md border border-gray-200 dark:border-slate-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Workplace</label>
                    <input
                      type="text"
                      name="workplace"
                      value={item.workplace}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={item.role}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Start Date</label>
                    <input
                      type="date"
                      name="startingDate"
                      value={item.startingDate ? new Date(item.startingDate).toISOString().split('T')[0] : ''}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">End Date</label>
                    <input
                      type="date"
                      name="endingDate"
                      value={item.endingDate ? new Date(item.endingDate).toISOString().split('T')[0] : ''}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Description</label>
                    <input
                      type="text"
                      name="description"
                      value={item.description}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================= */}
        {/* SECTION 5: TIME SLOTS */}
        {/* ======================= */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
            <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
            Availability & Slots
          </h3>
          <TimeSlotSection formData={formData} setFormData={setFormData} />
        </div>

        {/* ======================= */}
        {/* FOOTER ACTIONS */}
        {/* ======================= */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            onClick={updateProfileHandler}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-4 px-10 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            Update Profile Information
          </button>
        </div>

      </form>
    </div>
  );
};

export default Profile;