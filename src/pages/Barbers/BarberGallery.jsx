/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { X, ZoomIn, Loader2, Image as ImageIcon } from 'lucide-react';

const BarberGallery = ({ gallery }) => {
  const INITIAL_DISPLAY_COUNT = 8;
  
  const [images, setImages] = useState(gallery || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  useEffect(() => {
    setImages(gallery || []);
    setLoading(false);
  }, [gallery]);

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
    // Simple body scroll lock
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleShowMore = () => {
    setDisplayCount(prev => prev + INITIAL_DISPLAY_COUNT);
  };

  // Function to get random offset classes (kept for visual interest)
  const getRandomOffset = (index) => {
    const offsets = [
      'translate-y-4',
      '-translate-y-4',
      'translate-x-2',
      '-translate-x-2',
      'translate-y-2',
      '-translate-y-2',
      'translate-x-0',
      'translate-y-0'
    ];
    return offsets[index % offsets.length];
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-20 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin mb-2" />
      <p className="text-sm font-medium">Loading gallery...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-12 px-4">
      <p className="text-red-500 bg-red-50 py-3 px-6 rounded-xl inline-block border border-red-100">
        {error}
      </p>
    </div>
  );

  return (
    <div className="w-full bg-slate-50 min-h-[400px] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        {/* <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Our Masterpieces
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Every style tells a story of precision, style, and excellence. Explore our portfolio of transformations.
          </p>
        </div> */}

        {/* Gallery Grid */}
        {images.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No images yet</h3>
            <p className="text-slate-500 mt-1">Check back later to see our latest work.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {images.slice(0, displayCount).map((image, index) => {
                // Determine if image is string URL or object
                const imageUrl = typeof image === 'string' ? image : image.url;
                const caption = typeof image === 'string' ? `Work #${index + 1}` : image.caption;
                const category = typeof image === 'string' ? 'Style' : image.category;

                return (
                  <div
                    key={image._id || index}
                    className={`group relative cursor-zoom-in transition-all duration-500 ease-out z-0 hover:z-10
                      ${getRandomOffset(index)} hover:translate-y-0 hover:translate-x-0 hover:scale-[1.02]`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => openModal(index)}
                  >
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
                      <img
                        src={imageUrl}
                        alt={caption}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      
                      {/* Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                        transition-opacity duration-300 flex flex-col justify-end p-6
                        ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}
                      >
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">
                            {category || 'Showcase'}
                          </p>
                          <h3 className="text-white text-lg font-bold leading-tight">
                            {caption || 'Haircut Style'}
                          </h3>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                          <ZoomIn className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show More Button */}
            {images.length > displayCount && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={handleShowMore}
                  className="px-8 py-3.5 bg-white text-slate-900 font-bold rounded-xl border border-slate-200 
                    shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Load More Photos
                </button>
              </div>
            )}
          </>
        )}

        {/* Lightbox Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeModal}
          >
            <div
              className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 md:-right-12 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Main Image */}
              <div className="relative rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <img
                  src={typeof images[currentIndex] === 'string' ? images[currentIndex] : images[currentIndex].url}
                  alt="Gallery View"
                  className="max-h-[85vh] w-auto object-contain bg-black"
                />
                
                {/* Caption Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 md:p-8">
                  <h3 className="text-white text-xl md:text-2xl font-bold">
                    {typeof images[currentIndex] === 'string' ? `Work #${currentIndex + 1}` : images[currentIndex].caption}
                  </h3>
                  <p className="text-slate-300 text-sm mt-1 font-medium">
                    {typeof images[currentIndex] === 'string' ? 'Gallery Image' : images[currentIndex].category}
                  </p>
                </div>
              </div>

              {/* Navigation Hints (Optional) */}
              <div className="absolute bottom-[-3rem] left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'}`}
                  />
                )).slice(0, Math.min(images.length, 10))} 
                {/* Limit dots to 10 for neatness */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarberGallery;