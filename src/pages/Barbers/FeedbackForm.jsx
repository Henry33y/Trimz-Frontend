import { useState } from "react";
import { AiFillStar } from "react-icons/ai"
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/BeatLoader";
const FeedbackForm = () => {

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [loading,setLoading] = useState(false);

    const {id} = useParams ();

    const handleSubmitReview = async e => {
        e.preventDefault()
        setLoading(true);
        try {
            if (!rating || !reviewText) {
                setLoading(false);
                return toast.error('Rating and Review Fields are required');
                
    
           
        }
        const token = localStorage.getItem('token');
         // API request for a single provider reviews by id 
         const res = await fetch(`${BASE_URL}reviews/${id}`, {
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
        
        } catch (err) {
            setLoading(false);
            toast.error(err.message); // Show error message
        }
    };
    return (
        <form action="">
            <div>
                <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
                    How would you rate the Overall experience?*
                </h3>

                {/* ========= For stars Ratings ========= */}
                <div>
                    {[...Array(5).keys()].map((_,i) => {
                        let index = i + 1
                      
                        return (
                            <button
                                key={index}
                                type="button"
                                className={`${index <= ((rating && hover) || hover) 
                                    ? 'text-yellowColor'
                                    : 'text-gray-400'
                                } bg-transparent border-none outline-none text-[22px] cursor-pointer`}
                                onClick={() => {
                                    setRating(index)
                                    console.log("Index: ",index);
                                }}
                                onMouseEnter={() => setHover(index)}
                                onMouseLeave={() => setHover(rating)}
                                onDoubleClick={() => {
                                    setHover(0);
                                    setRating(0);
                                }}
                                >
                                <span>
                                    <AiFillStar />
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>


            {/* ======== Type Feedback ========= */}
            <div className="mt-[30px]">
                <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
                    Share your feedback or suggestions*
                </h3>
                <textarea className="border border-solid border-[#0066ff34] focus:outline outline-primaryColor
                w-full px-4 py-3 rounded-md"
                    rows="5"
                    placeholder="Write your message"
                    onChange={(e)=>setReviewText(e.target.value)}
                ></textarea>
            </div>
            <button type="submit" onClick={handleSubmitReview} className="btn">
                {loading ? <HashLoader size={25} color="#fff"/> : 'Submit Feedback'}
            </button>
        </form>
    );
};

export default FeedbackForm;