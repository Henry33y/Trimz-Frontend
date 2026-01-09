import { useEffect, useState } from 'react';
import starIcon from '../../assets/images/Star.png';
import BarberAbout from './BarberAbout';
import FeedbackDisplay from './FeedbackDisplay';
import SidePanel from './SidePanel';
import BarberServices from './BarberServices/BarberServices.jsx';
import ProviderContact from './BarberServices/ProviderContact.jsx';
import BarberGallery from './BarberGallery';

import { BASE_URL } from './../../config';
import useFetchData from './../../hooks/useFetchData';
import Loader from '../../components/Loading/Loading.jsx';
import Error from '../../components/Error/Error';
import { useAuth } from '../../context/AuthContext';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapPin, ShieldCheck, Star, Image as ImageIcon } from 'lucide-react';

const BarbersDetails = () => {
  const [tab, setTab] = useState('about');
  const { user, role } = useAuth();

  const { id } = useParams();
  const { data: provider, loading, error } = useFetchData(`users/${id}`);

  const {
    name,
    achievements,
    experience,
    workingHours,
    bio,
    about,
    averageRating,
    totalRating,
    specialization,
    profilePicture,
    gallery
  } = provider || {};

  // State to store reviews
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  // Fetch reviews on mount or when 'id' changes
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/reviews/user/${id}`, { method: 'GET' });
        const result = await response.json();
        if (response.ok) {
          setReviews(result.data || []);
        } else {
          setReviewsError(result.message || "Error fetching reviews");
          toast.error(result.message || "Error fetching reviews");
        }
      } catch (err) {
        setReviewsError(err.message);
        toast.error(err.message);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  return (
    <section className="bg-slate-50 dark:bg-slate-900 min-h-screen py-10">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">

        {loading && <Loader />}
        {error && <Error />}

        {!loading && !error && (
          <div className="grid lg:grid-cols-3 gap-10">

            {/* LEFT COLUMN: Main Content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Profile Header Card */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-8 items-start">
                {/* Profile Image */}
                <figure className="relative w-full sm:w-48 sm:h-48 shrink-0 group">
                  <img
                    src={
                      profilePicture
                        ? typeof profilePicture === 'string'
                          ? profilePicture.startsWith('http')
                            ? profilePicture
                            : `${BASE_URL}/${profilePicture}`
                          : profilePicture.url
                            ? profilePicture.url.startsWith('http')
                              ? profilePicture.url
                              : `${BASE_URL}/${profilePicture.url}`
                            : '/placeholder.jpg'
                        : '/placeholder.jpg'
                    }
                    alt={name || "Barber profile"}
                    className="w-full h-full object-cover rounded-2xl shadow-md border-4 border-white transition-transform group-hover:scale-105"
                  />
                  <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-2 rounded-xl shadow-lg border-4 border-white">
                    <ShieldCheck size={20} />
                  </div>
                </figure>

                {/* Profile Info */}
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 py-1.5 px-4 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-100 dark:border-blue-800">
                      {typeof specialization === 'object' && specialization?.title
                        ? specialization.title
                        : typeof specialization === 'string'
                          ? specialization
                          : 'Professional'}
                    </span>
                    <span className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 py-1.5 px-3 rounded-full text-xs font-bold border border-yellow-100 dark:border-yellow-800">
                      <img src={starIcon} alt="star" className="w-3.5 h-3.5" />
                      {averageRating} <span className="text-yellow-600/70 dark:text-yellow-500/70 font-medium">({totalRating})</span>
                    </span>
                  </div>

                  <h3 className="text-3xl font-black text-slate-900 dark:text-gray-100 mb-3 tracking-tight">
                    {name}
                  </h3>

                  <p className="text-slate-600 dark:text-gray-300 text-base leading-relaxed mb-6 font-medium">
                    {bio}
                  </p>

                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-bold bg-slate-50 dark:bg-slate-900/50 w-fit px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                    <MapPin size={16} className="text-blue-600 dark:text-blue-400" />
                    {provider?.location || "Location not set"}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-2 flex overflow-x-auto">
                {['about', 'feedback', 'services']
                  .filter(tabName => {
                    // Hide feedback tab for providers
                    if (tabName === 'feedback' && role === 'provider') {
                      return false;
                    }
                    return true;
                  })
                  .map((tabName) => (
                    <button
                      key={tabName}
                      onClick={() => setTab(tabName)}
                      className={`
                      flex-1 py-3 px-6 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap
                      ${tab === tabName
                          ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-md'
                          : 'text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-gray-100'}
                    `}
                    >
                      {tabName === 'services'
                        ? (role === 'provider' ? 'Contact Provider' : 'Book Services')
                        : tabName}
                    </button>
                  ))}
              </div>

              {/* Tab Content Area */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 min-h-[400px]">
                {tab === 'about' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <BarberAbout
                      name={name}
                      about={about}
                      achievements={achievements}
                      experience={experience}
                    />
                  </div>
                )}
                {tab === 'feedback' && role !== 'provider' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <FeedbackDisplay
                      reviews={reviews}
                      totalRating={totalRating}
                      loading={reviewsLoading}
                      error={reviewsError}
                      onReviewAdded={(newReview) => {
                        setReviews((prev) => [newReview, ...(Array.isArray(prev) ? prev : [])]);
                      }}
                    />
                  </div>
                )}
                {tab === 'services' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {role === 'provider' ? (
                      <ProviderContact providerData={provider} />
                    ) : (
                      <BarberServices barberData={provider} />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Side Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                <SidePanel timeSlots={workingHours} />
              </div>
            </div>

          </div>
        )}

        {/* Gallery Section - Fixed Visibility Condition */}
        {!loading && !error && (
          <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-8 px-4 border-l-4 border-blue-600 dark:border-blue-400 flex items-center gap-3">
              <ImageIcon className="text-slate-400 dark:text-gray-500" /> Work Gallery
            </h3>
            {/* Always render BarberGallery to allow it to show its empty state */}
            <BarberGallery gallery={gallery} />
          </div>
        )}
      </div>
    </section>
  );
};

export default BarbersDetails;