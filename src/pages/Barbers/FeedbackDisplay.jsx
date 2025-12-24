/* eslint-disable react/prop-types */
import { Star, User, Calendar, MessageCircle } from 'lucide-react';
import { formateDate } from '../../utils/formateDate';
import FeedbackForm from './Feedback';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import LoginPromptModal from '../../components/LoginPromptModal';
import GuestInfoBanner from '../../components/GuestInfoBanner';

const FeedbackDisplay = ({ reviews = [], totalRating, loading, error, onReviewAdded }) => {
    const { user } = useContext(AuthContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const handleWriteReviewClick = () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        setShowReviewForm(true);
    };

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="space-y-8">
            {/* Overall Rating Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-1">Overall Rating</h3>
                        <p className="text-sm text-slate-600 dark:text-gray-400">Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-blue-600 dark:text-blue-400">{averageRating}</div>
                        <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={16}
                                    className={`${star <= Math.round(averageRating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'fill-slate-200 dark:fill-slate-700 text-slate-200 dark:text-slate-700'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Form */}
            <div className="mb-8">
                {!user && <GuestInfoBanner message="Login to leave a review" />}

                {user && !showReviewForm && (
                    <button
                        onClick={() => setShowReviewForm(true)}
                        className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        <MessageCircle size={20} />
                        Write a Review
                    </button>
                )}

                {user && showReviewForm && (
                    <>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-4">Leave Your Feedback</h3>
                        <FeedbackForm
                            onSuccess={(review) => {
                                onReviewAdded(review);
                                setShowReviewForm(false);
                            }}
                            onCancel={() => setShowReviewForm(false)}
                        />
                    </>
                )}
            </div>

            {/* Reviews List */}
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-4">
                    Customer Reviews ({reviews.length})
                </h3>

                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                        <p className="mt-4 text-slate-600 dark:text-gray-400">Loading reviews...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
                        <p className="font-semibold">Error loading reviews</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {!loading && !error && reviews.length === 0 && (
                    <div className="bg-slate-50 dark:bg-slate-700 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-2xl p-12 text-center">
                        <Star className="w-16 h-16 text-slate-300 dark:text-gray-600 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-slate-700 dark:text-gray-300 mb-2">No reviews yet</h4>
                        <p className="text-slate-500 dark:text-gray-400">Be the first to share your experience!</p>
                    </div>
                )}

                {!loading && !error && reviews.length > 0 && (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review._id}
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-md transition-shadow"
                            >
                                {/* Review Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                            {review.customer?.profilePicture?.url ? (
                                                <img
                                                    src={review.customer.profilePicture.url}
                                                    alt={review.customer?.name}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <User size={24} />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-gray-100">
                                                {review.customer?.name || 'Anonymous'}
                                            </h4>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                                                <Calendar size={14} />
                                                <span>{formateDate(review.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={18}
                                                className={`${star <= review.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-slate-200 dark:fill-slate-700 text-slate-200 dark:text-slate-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Review Text */}
                                <p className="text-slate-700 dark:text-gray-300 leading-relaxed">{review.reviewText}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Login Prompt Modal */}
            <LoginPromptModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                action="leave a review"
            />
        </div>
    );
};

export default FeedbackDisplay;
