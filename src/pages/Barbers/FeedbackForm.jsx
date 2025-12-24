/* eslint-disable react/prop-types */
import { useState } from "react";
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Star, MessageSquare, Loader2 } from "lucide-react";
// import { BASE_URL } from "../../config"; // UNCOMMENT IN PRODUCTION

// MOCK CONSTANT FOR PREVIEW (Remove in production)
const BASE_URL = "http://localhost:5000/api/v1/";

const FeedbackForm = ({ onSuccess, onCancel }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);

    const { id } = useParams();

    const handleSubmitReview = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!rating || !reviewText) {
                setLoading(false);
                return toast.error('Please provide both a rating and a review message.');
            }

            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/reviews/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ rating, reviewText })
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            setLoading(false);
            toast.success(result.message);

            const hydratedReview = {
                ...result.data,
                customer: JSON.parse(localStorage.getItem('user')) || result.data.customer || null,
            };

            if (typeof onSuccess === 'function') {
                onSuccess(hydratedReview);
            }

            setRating(0);
            setHover(0);
            setReviewText('');

        } catch (err) {
            setLoading(false);
            toast.error(err.message);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="text-blue-600" size={20} />
                    Write a Review
                </h3>
                <p className="text-slate-500 text-sm mt-1">Share your experience to help others make better choices.</p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* Rating Section */}
                <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Overall Rating</h4>
                    <div className="flex gap-2">
                        {[...Array(5).keys()].map((_, i) => {
                            const index = i + 1;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    className="focus:outline-none transition-transform active:scale-95 hover:scale-110"
                                    onClick={() => setRating(index)}
                                    onMouseEnter={() => setHover(index)}
                                    onMouseLeave={() => setHover(rating)}
                                    onDoubleClick={() => {
                                        setHover(0);
                                        setRating(0);
                                    }}
                                >
                                    <Star 
                                        size={32} 
                                        className={`transition-colors duration-200 ${
                                            index <= (hover || rating)
                                                ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                                                : 'fill-slate-100 text-slate-300'
                                        }`}
                                    />
                                </button>
                            );
                        })}
                    </div>
                    {rating > 0 && (
                        <p className="text-sm text-yellow-600 font-medium mt-2 animate-in fade-in">
                            {rating === 5 ? "Excellent!" : rating === 4 ? "Good" : rating === 3 ? "Average" : rating === 2 ? "Poor" : "Terrible"}
                        </p>
                    )}
                </div>

                {/* Review Text Section */}
                <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Your Feedback</h4>
                    <div className="relative">
                        <textarea
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-slate-700 placeholder:text-slate-400 min-h-[120px]"
                            rows="5"
                            placeholder="Tell us what you liked or what could be improved..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors text-sm"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : 'Submit Review'}
                    </button>
                </div>
            </form>
        </div>
    );
};

FeedbackForm.propTypes = {
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
};

export default FeedbackForm;