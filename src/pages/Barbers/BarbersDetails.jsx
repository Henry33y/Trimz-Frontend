import { useEffect, useState } from 'react';
import starIcon from '../../assets/images/Star.png';
import BarberAbout from './BarberAbout';
import Feedback from './Feedback';
import SidePanel from './SidePanel';
import BarberServices from './BarberServices/BarberServices.jsx';
import BarberGallery from './BarberGallery';

import {BASE_URL} from './../../config';
import useFetchData from './../../hooks/useFetchData'
import Loader from '../../components/Loading/Loading.jsx'
import Error from '../../components/Error/Error';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
const BarbersDetails = () => {
  const [tab, setTab] = useState('about');

  const {id} = useParams();
// console.log('ID:', id);
  const {data:provider, loading, error} = useFetchData(`${BASE_URL}users/${id}`);
 console.log('Provider:', provider);
  const { name,
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
         const response = await fetch(`${BASE_URL}reviews/user/${id}`, { method: 'GET' });
         const result = await response.json();
         console.log("result: ",result);
         if (response.ok) {
           setReviews(result.data || []); // Set reviews (ensure it's an array)
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
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">

      {loading && <Loader />}
      {error && <Error />}

        {!loading && !error &&
          <div className='grid md:grid-cols-3 gap-[50px]'>
          <div className='md:col-span-2'>
            <div className='flex items-center gap-5'>
              <figure className="w-[200px] h-[200px] min-w-[200px]">
                <img src={profilePicture.url} alt="" className='w-full h-full object-cover rounded-full' />
              </figure>

              <div>
                <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-6 lg:py-2 
                  lg:px-6 text-[10px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded'>
                  {specialization}
                </span>
                <h3 className='text-headingColor text-[22px] leading-9 mt-3 font-bold'>
                  {name}
                </h3>

                <div className='flex items-center gap-[6px]'>
                  <span className='flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px]
                    lg:leading-2 font-semibold text-headingColor'>
                    <img src={starIcon} alt="" />{averageRating}
                  </span>

                  <span className='text-[14px] leading-5 lg:text-[16px]
                    lg:leading-7 font-[400] text-textColor'>
                    ({totalRating})
                  </span>
                </div>

                <p className='text-para text-[14px] leading-5 md:text-[15px] lg:max-w-[390px]'>
                 {bio}
                </p>
              </div>
            </div>
            
            <div className='mt-[50px] border-b border-solid border-[#0066ff34]'>
              <button
                onClick={() => setTab('about')}
                className={`${tab === 'about' && 'border-b border-solid border-primaryColor'} py-2 px-3 mr-5 
                  text-[16px] leading-7 text-headingColor font-semibold`}
              >
                About
              </button>

              <button
                onClick={() => setTab('feedback')}
                className={`${tab === 'feedback' && 'border-b border-solid border-primaryColor'} py-2 px-2 mr-5 
                  text-[16px] leading-7 text-headingColor font-semibold`}
              >
                Feedback
              </button>

              <button
                onClick={() => setTab('services')}
                className={`${tab === 'services' && 'border-b border-solid border-primaryColor'} py-2 px-2 mr-5 
                  text-[16px] leading-7 text-headingColor font-semibold`}
              >
                Book Now
              </button>
            </div>

            <div className='mt-[50px]'>
              {
              tab === 'about' && 
              <BarberAbout 
              name={name} 
              about={about} 
              achievements={achievements} 
              experience={experience}/>
              }
              {tab === 'feedback' && (
              <Feedback reviews={reviews} totalRating={totalRating} loading={reviewsLoading} error={reviewsError} />)}

              {/* === Will be added later == Dynamic Services */}
              {tab === 'services' && <BarberServices barberData={provider} />}
            </div>
          </div>

          <div>
            {/* work on it later */}
            <SidePanel timeSlots={workingHours} />
          </div>

          
        </div> }
      </div>

      <div>
      <BarberGallery gallery={gallery}/>
      </div>
    </section>
  );
};

export default BarbersDetails;