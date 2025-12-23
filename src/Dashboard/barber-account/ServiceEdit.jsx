/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
// import { BASE_URL } from "../../config"; // UNCOMMENT IN PRODUCTION
import { X, Upload, Image as ImageIcon, Save, Loader2 } from "lucide-react";

// MOCK CONSTANT FOR PREVIEW (Remove this when using in your project)
const BASE_URL = "http://localhost:5000/api/v1/";

const ServiceEdit = ({ isOpen, service, onClose, onUpdate }) => {
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // use centralized scroll lock helper to allow multiple locks
      import('../../utils/scrollLock').then(({ lockScroll }) => lockScroll()).catch(() => {});
      // Cleanup function to re-enable scrolling via helper
      return () => {
        import('../../utils/scrollLock').then(({ unlockScroll }) => unlockScroll()).catch(() => {});
      };
    }
  }, [isOpen]);

  // Update local state when service prop changes
  useEffect(() => {
    if (service) {
      setEditingService({ ...service });
    }
  }, [service]);

  // If modal isn't open or no service, return null
  if (!isOpen || !editingService) return null;

  const handleEditServiceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingService((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditImageUpload = (file) => {
    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG or PNG image.");
      return;
    }

    const previewURL = URL.createObjectURL(file);

    setEditingService((prev) => ({
      ...prev,
      image: file,
      imagePreview: previewURL,
    }));
  };

  const handleUpdate = async () => {
    // Validate input fields
    if (!editingService.name || !editingService.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create a FormData object for handling file uploads
    const formData = new FormData();

    // Append all service details to FormData
    Object.keys(editingService).forEach((key) => {
      if (key !== 'image' && key !== 'imagePreview') {
        formData.append(key, editingService[key]);
      }
    });

    // Handle image upload if a new image is selected
    if (editingService.image instanceof File) {
      formData.append('providerServiceImage', editingService.image);
    }

    try {
      setIsSubmitting(true);
      // Show loading toast
      const loadingToastId = toast.loading("Updating service...", { autoClose: false });

      const jwt = localStorage.getItem("token");
      // Make API call to update service
      const response = await fetch(`${BASE_URL}provider-services/${editingService._id}`, {
        method: 'PATCH',
        body: formData, // Use FormData for file uploads
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update service');
      }

      // Parse the updated service data
      const updatedService = await response.json();

      // Close the loading toast
      toast.dismiss(loadingToastId);
      toast.success("Service updated successfully");

      // Call the onUpdate prop to update the local state
      onUpdate(editingService._id, updatedService);

      // Close the modal
      onClose();
    } catch (error) {
      // Handle any errors during the update process
      toast.dismiss(); // Ensure loading toast is dismissed
      toast.error(`Update failed: ${error.message}`);
      console.error("Service update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Service</h2>
            <p className="text-sm text-gray-500 mt-0.5">Update your service details and pricing</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid md:grid-cols-12 gap-8">
            
            {/* Image Section */}
            <div className="md:col-span-5 space-y-3">
              <label className="block text-sm font-bold text-gray-700">Service Image</label>
              <div className="relative aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-blue-500 hover:bg-blue-50/30 transition-all group">
                {(editingService.imagePreview || editingService.image?.url) ? (
                  <img
                    src={editingService.imagePreview || editingService.image.url}
                    alt="Service Preview"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-10 h-10 mb-2" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-white text-center">
                    <Upload className="w-8 h-8 mx-auto mb-1" />
                    <span className="text-xs font-medium">Change Photo</span>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  name="providerServiceImage"
                  onChange={(e) => handleEditImageUpload(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500 text-center">
                Supported: JPG, PNG (Max 5MB)
              </p>
            </div>

            {/* Fields Section */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Service Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingService.name || ''}
                  onChange={handleEditServiceChange}
                  placeholder="Service Name"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Price (Cedis)</label>
                  <input
                    type="number"
                    name="price"
                    value={editingService.price || ''}
                    onChange={handleEditServiceChange}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={editingService.duration || ''}
                    onChange={handleEditServiceChange}
                    placeholder="e.g. 30 mins"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={editingService.description || ''}
                  onChange={handleEditServiceChange}
                  placeholder="Describe your service..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all h-28 resize-none text-sm"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleEditServiceChange({ target: { name: 'availability', type: 'checkbox', checked: !editingService.availability } })}>
                <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${editingService.availability ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform duration-300 ${editingService.availability ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <label className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                  Available for booking
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-white hover:border-gray-300 transition-all text-sm"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all transform active:scale-95 text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceEdit;