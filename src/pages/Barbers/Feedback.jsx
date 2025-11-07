/* eslint-disable react/prop-types */
import { formateDate } from '../../utils/formateDate';
import { AiFillStar } from 'react-icons/ai';
import { useState } from 'react';
import FeedbackForm from './FeedbackForm';
import Loader from '../../components/Loading/Loading.jsx'
import { useParams } from 'react-router-dom';

import defaultAvatar from '../../assets/images/avatar-icon.png'

const Feedback = ({reviews, loading, onReviewAdded}) => {
    const user = JSON.parse(localStorage.getItem('user'))
    console.log("User", user);
    const paramId = useParams().id
    console.log(paramId);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  return (
      <div>
          <div className="mb-[50px]">
              <h4 className="text-[20px] leading-[30px] font-bold text-headingColor my-4">
                  All reviews ({reviews?.length || 0})
              </h4>

            {loading && <Loader />}

                            {!loading && Array.isArray(reviews) &&
                             reviews.map((review, index) => 
                (<div key={index} className="flex justify-between gap-4 mb-[30px]">
                <div className="flex space-x-4">
                    <figure className="w-10 h-10 rounded-full">
                                                <img
                                                    className="w-full rounded-full h-full object-cover object-top"
                                                    src={review?.customer?.profilePicture?.url || defaultAvatar}
                                                    alt={review?.customer?.name || 'User'}
                                                    onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                                                />
                    </figure>

                    <div className='w-5/6'>
                        <h5 className='text-[16px] leading-6 text-primaryColor font-bold'>
                            {review?.customer?.name}
                        </h5>
                        <p className='text-[14px] leading-6 text-textColor'>
                            {`${formateDate(review?.createdAt)}`}
                        </p>
                        <p className='text__para mt-3 font-medium text-[15px]'>
                            {review.comment}
                        </p>
                    </div>
                </div>

                  {/* ==== Rating Stars ===== */}
                <div className='flex gap-1'>
                    {[...Array(Number(review?.rating) || 0).keys()].map((_, i) => (
                        <AiFillStar key={i} color='#0067FF' />
                    ))}
                </div>
            </div>
            )
              )} 
          </div>

            {/* === Give Feedback btn ==== */}
          {!showFeedbackForm && (user._id !== paramId) &&
              <div className='text-center'>
                  <button className='btn' onClick={() => setShowFeedbackForm(true)}>
                      Give Feedback
                  </button>
              </div>}
          
                    {showFeedbackForm && (
                        <FeedbackForm
                            onSuccess={(newReview) => {
                                // Hide the form and bubble the new review to parent
                                setShowFeedbackForm(false);
                                if (typeof onReviewAdded === 'function') {
                                    onReviewAdded(newReview);
                                }
                            }}
                            onCancel={() => setShowFeedbackForm(false)}
                        />
                    )}
    </div>
  )
}

export default Feedback;