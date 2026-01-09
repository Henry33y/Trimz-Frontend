/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import {
  Edit,
  Trash2,
  Plus,
  Save,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Loader2,
  AlertTriangle,
  Upload,
  Layers
} from "lucide-react";
import useFetchData from "../../hooks/useFetchData";

// ==========================================
// SUB-COMPONENT: ServiceEdit
// ==========================================
const ServiceEdit = ({ isOpen, service, onClose, onUpdate, categories }) => {
  const [formData, setFormData] = useState(service || {});
  useEffect(() => { setFormData(service || {}); }, [service]);
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(service._id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden scale-100 animate-in zoom-in-95 border border-gray-100 dark:border-slate-700">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit Service</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><XCircle size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Service Name</label>
            <input
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 outline-none transition-all text-gray-900 dark:text-gray-100"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-gray-900 dark:text-gray-100"
              value={formData.category || ''}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat} className="capitalize">{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Price</label>
              <input
                type="number"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-gray-900 dark:text-gray-100"
                value={formData.price || ''}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Duration (mins)</label>
              <input
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-gray-900 dark:text-gray-100"
                value={formData.duration || ''}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all resize-none text-gray-900 dark:text-gray-100"
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-2 border-t border-gray-100 dark:border-slate-700">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 font-bold shadow-lg transition-all transform active:scale-95">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Service = () => {
  const [selectedFiles, setSelectedFiles] = useState([]); // To handle multiple files
  const [existingServices, setExistingServices] = useState([]); // New state for existing services

  const { data: configData } = useFetchData('admin/public/config');
  const categories = configData?.service_categories || ["barber", "hairdresser", "stylist", "other"];

  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    services: [], // Array to store all services
    price: "",
    duration: "",
    availability: "",
    averageRating: "",
    images: "",
    providersDescription: "",
    category: "",
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  // Fetch existing services when component mounts
  useEffect(() => {
    fetchExistingServices();
  }, []);

  // Fetch existing services for the provider
  const fetchExistingServices = async () => {
    try {
      const jwt = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!jwt || !user?._id) {
        // toast.error("Authentication required");
        return;
      }

      const response = await fetch(`${BASE_URL}/provider-services/provider/${user._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const services = await response.json();
        setExistingServices(services.data);
      } else {
        const errorData = await response.json();
        toast.error(`Error fetching services: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  // Update existing service
  const updateExistingService = async (serviceId, updatedData) => {
    try {
      const jwt = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Append updated service data
      Object.keys(updatedData).forEach(key => {
        formDataToSend.append(key, updatedData[key]);
      });

      const response = await fetch(`${BASE_URL}/provider-services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${jwt}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        toast.success("Service updated successfully!");
        fetchExistingServices(); // Refresh the services list
      } else {
        const errorData = await response.json();
        toast.error(`Error updating service: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  // =========== Delete existing service =============
  const deleteExistingService = async (serviceId) => {
    try {
      const jwt = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/provider-services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        toast.success("Service deleted successfully!");
        fetchExistingServices(); // Refresh the services list
      } else {
        const errorData = await response.json();
        toast.error(`Error deleting service: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  // Removes a service from the services array
  const removeService = (serviceId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      services: prevFormData.services.filter(
        (service) => service.id !== serviceId
      ),
    }));
    toast.info("Service removed.");
  };

  // Handles the creation of a new service with default values
  const handleAddService = () => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const newService = {
      id: Date.now(), // Unique ID
      provider: userInfo?._id,
      service: "",
      name: "",
      description: "",
      duration: "",
      price: "",
      image: null,
      imagePreview: null,
      availability: true, // Default to available
      category: "", // Add category field
    };
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
    toast.success('New service draft added.');
  };

  // Update service details
  const handleServiceChange = (index, event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      const updatedServices = [...prev.services];
      updatedServices[index] = { ...updatedServices[index], [name]: value };
      return { ...prev, services: updatedServices };
    });
  };

  // Handles image upload for a specific service
  const handleImageUpload = (index, file) => {
    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG or PNG image.");
      return;
    }

    // Create a preview URL for the image
    const previewURL = URL.createObjectURL(file);

    setFormData((prevFormData) => {
      const updatedServices = [...prevFormData.services];
      updatedServices[index].image = file;
      updatedServices[index].imagePreview = previewURL; // Set the preview URL
      return { ...prevFormData, services: updatedServices };
    });

    setSelectedFiles((prevFiles) => [...prevFiles, file]); // Add the file to selectedFiles
  };

  // Submits all services to the backend API
  const submitServices = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const providerId = user?._id;

    if (!providerId) {
      toast.error("Provider ID not found. Please log in.");
      return;
    }

    if (formData.services.length === 0) {
      toast.error("Please add at least one service before submitting.");
      return;
    }

    // Validate each service
    for (let i = 0; i < formData.services.length; i++) {
      const service = formData.services[i];

      if (!service.name || service.name.trim() === "") {
        toast.error(`Service #${i + 1}: Please enter a service name`);
        return;
      }

      if (!service.price || parseFloat(service.price) <= 0) {
        toast.error(`Service "${service.name}": Please enter a valid price`);
        return;
      }

      if (!service.duration || parseInt(service.duration) <= 0) {
        toast.error(`Service "${service.name}": Please enter a valid duration in minutes`);
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("services", JSON.stringify(formData.services));
      formDataToSend.append("provider", providerId);

      // Append each selected file
      selectedFiles.forEach((file) => {
        formDataToSend.append("providerServiceImage", file);
      });

      const jwt = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/provider-services`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success("Services submitted successfully!");
        fetchExistingServices(); // Refresh the existing services
        // Reset the form after successful submission
        setFormData(prev => ({ ...prev, services: [] }));
        setSelectedFiles([]);
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("An error occurred while submitting services: " + error.message);
      console.error(error);
    }
  };

  const handleDeleteClick = (serviceId) => {
    setSelectedServiceId(serviceId);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedServiceId) {
      deleteExistingService(selectedServiceId);
      setShowConfirm(false);
      setSelectedServiceId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Modals */}
      <ServiceEdit
        isOpen={editModalOpen}
        service={editingService}
        onClose={() => setEditModalOpen(false)}
        onUpdate={updateExistingService}
        categories={categories}
      />

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100 dark:border-slate-700 scale-100 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-2">
              <AlertTriangle size={24} />
              <h2 className="text-lg font-bold">Confirm Deletion</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Are you sure you want to delete this service? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 dark:bg-red-500 text-white font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors shadow-md shadow-red-600/20"
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-700 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Services Category</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage the services you offer to clients</p>
        </div>
        <button
          type="button"
          onClick={handleAddService}
          className="flex items-center gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-900/10 transition-all active:scale-95"
        >
          <Plus size={18} /> Add New Service
        </button>
      </div>

      {/* Existing Services Grid */}
      {existingServices.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Plus className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Services Yet</h3>
          <p className="text-gray-500 text-sm mt-1">Start by adding your first service above.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {existingServices.map((service) => (
            <div
              key={service._id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              {/* Service Image Area */}
              <div className="h-48 w-full bg-gray-100 dark:bg-slate-700 relative overflow-hidden">
                {service.image ? (
                  <img
                    src={service.image.url}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={48} />
                  </div>
                )}
                {/* Actions Overlay */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => {
                      setEditingService(service);
                      setEditModalOpen(true);
                    }}
                    className="p-2 bg-white/90 text-blue-600 rounded-lg shadow-sm hover:bg-white transition-colors backdrop-blur-sm"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(service._id)}
                    className="p-2 bg-white/90 text-red-600 rounded-lg shadow-sm hover:bg-white transition-colors backdrop-blur-sm"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{service.name}</h4>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${service.availability
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900'
                    : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900'
                    }`}>
                    {service.availability ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {service.availability ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                  {service.description || "No description provided."}
                </p>

                <div className="flex items-center gap-4 text-sm font-medium pt-4 border-t border-gray-50 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <DollarSign size={16} className="text-gray-400 dark:text-gray-500" />
                    <span>{service.price} Cedis</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <Clock size={16} className="text-gray-400 dark:text-gray-500" />
                    <span>{service.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Services Section */}
      {formData.services.length > 0 && (
        <div className="pt-8 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Plus className="text-blue-600 dark:text-blue-400" size={20} />
              New Service Drafts
            </h3>
            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
              {formData.services.length} Unsaved
            </span>
          </div>

          <div className="space-y-6">
            {formData.services.map((service, index) => (
              <div key={service.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden relative group">
                {/* Remove Draft Button */}
                <button
                  type="button"
                  onClick={() => removeService(service.id)}
                  className="absolute top-4 right-4 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors z-10"
                  title="Discard Draft"
                >
                  <Trash2 size={20} />
                </button>

                <div className="p-6 md:p-8 grid md:grid-cols-12 gap-8">
                  {/* Image Upload Area */}
                  <div className="md:col-span-4">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Service Image</label>
                    <div className="relative aspect-video md:aspect-square bg-gray-50 dark:bg-slate-700 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl overflow-hidden hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all group-upload">
                      {service.imagePreview ? (
                        <img
                          src={service.imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                          <Upload size={32} className="mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                          <span className="text-xs font-medium">Click to upload</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="md:col-span-8 space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Service Name</label>
                      <input
                        type="text"
                        name="name"
                        value={service.name}
                        onChange={(e) => handleServiceChange(index, e)}
                        placeholder="e.g. Premium Haircut"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
                        <input
                          type="number"
                          name="duration"
                          value={service.duration}
                          onChange={(e) => handleServiceChange(index, e)}
                          placeholder="e.g. 45"
                          min="1"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Price (Cedis)</label>
                        <input
                          type="number"
                          name="price"
                          value={service.price}
                          onChange={(e) => handleServiceChange(index, e)}
                          placeholder="0.00"
                          min="0.01"
                          step="0.01"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                      <select
                        name="category"
                        value={service.category}
                        onChange={(e) => handleServiceChange(index, e)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat, i) => (
                          <option key={i} value={cat} className="capitalize">{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, e)}
                        placeholder="Briefly describe what this service includes..."
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 outline-none transition-all h-24 resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="availability"
                          id={`toggle-${index}`}
                          checked={service.availability}
                          onChange={(e) => handleServiceChange(index, { target: { name: "availability", value: e.target.checked } })}
                          className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                          style={{
                            right: service.availability ? '0' : 'auto',
                            left: service.availability ? 'auto' : '0',
                            borderColor: service.availability ? '#3b82f6' : '#d1d5db'
                          }}
                        />
                        <label htmlFor={`toggle-${index}`} className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${service.availability ? 'bg-blue-500' : 'bg-gray-300'}`}></label>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Mark as Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={submitServices}
              className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all transform active:scale-95"
            >
              <Save size={20} />
              Submit All Services
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Service;