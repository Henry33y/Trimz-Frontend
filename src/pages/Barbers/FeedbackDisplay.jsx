/* eslint-disable react/prop-types */
import { Star, User, Calendar } from 'lucide-react';
import { formateDate } from '../../utils/formateDate';
import FeedbackForm from './Feedback';

const FeedbackDisplay = ({ reviews = [], totalRating, loading, error, onReviewAdded }) => {

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="space-y-8">
            {/* Overall Rating Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Overall Rating</h3>
                        <p className="text-sm text-slate-600">Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-blue-600">{averageRating}</div>
                        <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={16}
                                    className={`${star <= Math.round(averageRating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'fill-slate-200 text-slate-200'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Form */}
            <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Leave Your Feedback</h3>
                <FeedbackForm onSuccess={onReviewAdded} />
            </div>

            {/* Reviews List */}
            <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Customer Reviews ({reviews.length})
                </h3>

                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading reviews...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                        <p className="font-semibold">Error loading reviews</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {!loading && !error && reviews.length === 0 && (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                        <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-slate-700 mb-2">No reviews yet</h4>
                        <p className="text-slate-500">Be the first to share your experience!</p>
                    </div>
                )}

                {!loading && !error && reviews.length > 0 && (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review._id}
                                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
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
                                            <h4 className="font-bold text-slate-900">
                                                {review.customer?.name || 'Anonymous'}
                                            </h4>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
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
                                                        : 'fill-slate-200 text-slate-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Review Text */}
                                <p className="text-slate-700 leading-relaxed">{review.reviewText}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackDisplay;
