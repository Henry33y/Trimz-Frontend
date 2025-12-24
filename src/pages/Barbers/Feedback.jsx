/* eslint-disable react/prop-types */
import { useState } from "react";
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Star, Loader2, Send } from "lucide-react";
import { BASE_URL } from "../../config";

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
                return toast.error('Rating and Review Fields are required');
            }

            const token = localStorage.getItem('token');
            // API request for a single provider reviews by id 
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
                throw new Error(result.message); // Handle server error messages
            }

            setLoading(false);
            toast.success(result.message); // Show success message

            // Construct a hydrated review object for immediate UI update
            const hydratedReview = {
                ...result.data,
                customer: JSON.parse(localStorage.getItem('user')) || result.data.customer || null,
            };

            if (typeof onSuccess === 'function') {
                onSuccess(hydratedReview);
            }

            // Reset form state
            setRating(0);
            setHover(0);
            setReviewText('');

        } catch (err) {
            setLoading(false);
            toast.error(err.message); // Show error message
        }
    };

    return (
        <form onSubmit={handleSubmitReview} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-2">
            <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
                    How would you rate your experience?
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide bg-slate-100 px-2 py-1 rounded">Required</span>
                </h3>

                <div className="flex flex-col items-start gap-2">
                    <div className="flex gap-2">
                        {[...Array(5).keys()].map((_, i) => {
                            const index = i + 1;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95 group"
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
                                        className={`transition-all duration-200 ${index <= (hover || rating)
                                                ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                                                : 'fill-slate-50 text-slate-200 group-hover:text-slate-300'
                                            }`}
                                    />
                                </button>
                            );
                        })}
                    </div>
                    {rating > 0 && (
                        <p className="text-sm font-semibold text-yellow-600 animate-in fade-in">
                            {rating === 5 && "Excellent! 😍"}
                            {rating === 4 && "Good! 🙂"}
                            {rating === 3 && "Average 😐"}
                            {rating === 2 && "Poor 😕"}
                            {rating === 1 && "Terrible 😫"}
                        </p>
                    )}
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
                    Share your feedback
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide bg-slate-100 px-2 py-1 rounded">Required</span>
                </h3>
                <div className="relative">
                    <textarea
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-slate-700 placeholder:text-slate-400 min-h-[140px]"
                        rows="5"
                        placeholder="What did you like? What could we improve?"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    ></textarea>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <span>Submit Feedback</span>
                            <Send size={18} />
                        </>
                    )}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

FeedbackForm.propTypes = {
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
};

export default FeedbackForm;