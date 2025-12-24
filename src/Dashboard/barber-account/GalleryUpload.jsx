/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Plus
} from 'lucide-react';

const GalleryUpload = ({ providerId }) => {
  const [images, setImages] = useState([]); // For newly uploaded images (previews)
  const [galleryImages, setGalleryImages] = useState([]); // For images already in the gallery
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  console.log(providerId);

  // Fetch existing gallery images on component mount or when providerId changes
  useEffect(() => {
    if (providerId) {
      fetchGalleryImages();
    }
  }, [providerId]);

  // Fetch gallery images from the user endpoint
  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/users/${providerId}`, {
        method: 'GET',
      });
      if (res.ok) {
        const response = await res.json();
        // Assuming the user object contains a 'gallery' field
        console.log('Gallery:', response.data.gallery);
        setGalleryImages(response.data.gallery || []);
      } else {
        toast.error('Failed to fetch gallery images');
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Error loading gallery images');
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload and preview for new images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

    const validFiles = files.filter((file) => {
      if (!validImageTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Please upload JPEG, PNG, or WEBP images.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const filePreviews = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...prevImages, ...filePreviews]);
      toast.success('Images added successfully!');
    }
  };

  // Remove a preview image from the new uploads list
  const removePreviewImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      URL.revokeObjectURL(updatedImages[index].preview);
      updatedImages.splice(index, 1);
      return updatedImages;
    });
    toast.info('Preview image removed');
  };

  // Delete an image from the existing gallery (by its Cloudinary public_id)
  const deleteGalleryImage = async (publicId) => {
    try {
      console.log('Public ID: ', JSON.stringify({ imageIds: [publicId] }));
      const res = await fetch(`${BASE_URL}/users/gallery/${providerId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageIds: [publicId] }),
      });


      if (res.ok) {
        setGalleryImages((prevImages) =>
          prevImages.filter((image) => image.public_id !== publicId)
        );
        toast.success('Image deleted successfully');
      } else {
        toast.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error deleting image');
    }
  };

  // Submit new uploaded images to the backend
  const submitGallery = async () => {
    if (images.length === 0) {
      toast.error('Please add at least one image before submitting.');
      return;
    }

    const formData = new FormData();
    images.forEach((imageObj, index) => {
      // Use a key that your backend expects; here we simply use "image" for each file
      formData.append(`galleryImages`, imageObj.file);
    });

    try {
      console.log("Provider: ", providerId);
      const res = await fetch(`${BASE_URL}/users/gallery/${providerId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        toast.success('Gallery images uploaded successfully!');
        setImages([]); // Clear new images preview
        fetchGalleryImages(); // Refresh existing gallery images
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      toast.error('An error occurred while submitting images.');
      console.error(error);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Gallery Management</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Showcase your best work to attract more clients</p>
        </div>
        <div className="hidden sm:block text-sm text-gray-400 dark:text-gray-500 font-medium">
          {galleryImages.length} images uploaded
        </div>
      </div>

      {/* Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Plus className="text-blue-600 dark:text-blue-400" size={20} />
          Add New Photos
        </h3>

        <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-8 transition-colors hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 group text-center relative">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:scale-110 transition-all">
              <Upload size={32} />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Click or drag images here</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Supports JPG, PNG, WEBP</p>
            </div>
          </div>
        </div>

        {/* Upload Previews */}
        {images.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((imageObj, index) => (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <img
                    src={imageObj.preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removePreviewImage(index)}
                      className="p-2 bg-white text-red-600 rounded-full shadow-lg hover:bg-red-50 transition-transform hover:scale-110"
                      title="Remove image"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={submitGallery}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-xl font-bold shadow-lg shadow-gray-900/10 transition-all active:scale-95"
              >
                <Upload size={18} />
                Upload {images.length} Image{images.length !== 1 && 's'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Existing Gallery Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-t border-gray-100 pt-8">
          <ImageIcon className="text-blue-600" size={20} />
          Current Gallery
        </h3>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Loader2 className="animate-spin mb-3 text-blue-600" size={32} />
            <p>Loading your masterpiece...</p>
          </div>
        ) : galleryImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border border-gray-100 text-center">
            <div className="p-4 bg-white rounded-full shadow-sm mb-3">
              <ImageIcon className="text-gray-300" size={32} />
            </div>
            <h4 className="text-gray-900 font-semibold">Gallery is empty</h4>
            <p className="text-gray-500 text-sm mt-1 max-w-xs">Upload photos of your work to build trust with potential clients.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <div key={image.public_id} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-gray-50">
                <img
                  src={image.url}
                  alt="Gallery Item"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <button
                    type="button"
                    onClick={() => deleteGalleryImage(image.public_id)}
                    className="self-end p-2 bg-white/90 text-red-600 rounded-lg shadow-sm backdrop-blur-sm hover:bg-white transition-colors"
                    title="Delete from gallery"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryUpload;