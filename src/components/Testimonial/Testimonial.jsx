/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
// ============================================
// TESTIMONIALS COMPONENT - Modern Design
// ============================================
// Beautiful testimonial slider with cards that work
// perfectly on mobile and desktop devices
// ============================================

import { Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { HiStar } from "react-icons/hi";
import { Quote } from 'lucide-react';

// ============================================
// TESTIMONIALS DATA - Mockup Reviews
// ============================================
const testimonials = [
  {
    id: 1,
    name: "Michael Chen",
    title: "Best Haircut on Campus",
    review: "I've been using Trimz for 6 months now. The barbers are skilled, the booking is super easy, and I never have to wait long. Definitely recommend to anyone looking for quality grooming!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Professional & Convenient",
    review: "As someone with a busy schedule, Trimz is a lifesaver! I can book appointments between classes and the stylists always deliver exactly what I ask for. Love the convenience!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=45",
  },
  {
    id: 3,
    name: "David Mensah",
    title: "Exceeded My Expectations",
    review: "I was skeptical at first, but Trimz proved me wrong. The barbers are professional, the prices are fair, and the service is top-notch. My go-to for all my grooming needs now.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    title: "Consistently Great Service",
    review: "What I love most about Trimz is the consistency. Every stylist I've worked with has been amazing. The app makes it so easy to find someone available when I need them!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 5,
    name: "James Anderson",
    title: "Game Changer for Students",
    review: "Trimz changed the game for campus grooming. No more expensive off-campus trips or long waits. Quick, affordable, and professional service right where I need it. Highly recommended!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=68",
  },
  {
    id: 6,
    name: "Aisha Osei",
    title: "Always Leave Looking Fresh",
    review: "The stylists on Trimz really know their craft. I've tried different ones and they all deliver quality work. The booking system is straightforward and the service is always reliable.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=27",
  },
  {
    id: 7,
    name: "Chris Thompson",
    title: "Worth Every Penny",
    review: "I appreciate the transparency and professionalism. You can see ratings, book easily, and the barbers always show up on time. Quality service at student-friendly prices!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=14",
  },
  {
    id: 8,
    name: "Nadia Hassan",
    title: "My Weekly Treat",
    review: "Getting my hair done used to be such a hassle. With Trimz, it's become something I actually look forward to. The stylists are talented and friendly, and I always leave satisfied!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

// ============================================
// STAR RATING COMPONENT
// ============================================
const StarRating = ({ rating }) => {
  return (
    <div className='flex items-center gap-1'>
      {[...Array(5)].map((_, index) => (
        <HiStar
          key={index}
          className={`w-5 h-5 ${
            index < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

// ============================================
// TESTIMONIAL CARD COMPONENT
// ============================================
const TestimonialCard = ({ testimonial }) => {
  return (
    <div className='group relative h-full'>
      {/* Card Container */}
      <div className='bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl 
                    transition-all duration-300 h-full flex flex-col
                    border border-gray-100 hover:border-primaryColor/20'>
        
        {/* Quote Icon */}
        <div className='absolute top-6 right-6 opacity-10 group-hover:opacity-20 
                      transition-opacity duration-300'>
          <Quote className='w-16 h-16 sm:w-20 sm:h-20 text-primaryColor' />
        </div>

        {/* Header Section */}
        <div className='flex items-start gap-4 mb-6 relative z-10'>
          {/* Avatar */}
          <div className='flex-shrink-0'>
            <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden 
                          ring-4 ring-primaryColor/10 group-hover:ring-primaryColor/30 
                          transition-all duration-300'>
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name}
                className='w-full h-full object-cover'
              />
            </div>
          </div>

          {/* Name and Rating */}
          <div className='flex-1 min-w-0'>
            <h4 className='text-lg sm:text-xl font-bold text-headingColor mb-2 
                         group-hover:text-primaryColor transition-colors duration-300
                         truncate'>
              {testimonial.name}
            </h4>
            <StarRating rating={testimonial.rating} />
          </div>
        </div>

        {/* Title */}
        <h5 className='text-base sm:text-lg font-semibold text-slate-900 mb-3 
                     relative z-10'>
          &quot;{testimonial.title}&quot;
        </h5>

        {/* Review Text */}
        <p className='text-sm sm:text-base leading-relaxed text-gray-600 
                    flex-grow relative z-10'>
          {testimonial.review}
        </p>

        {/* Bottom Accent Line */}
        <div className='mt-6 pt-6 border-t border-gray-100'>
          <div className='h-1 w-12 bg-gradient-to-r from-primaryColor to-primaryColor/50 
                        rounded-full group-hover:w-20 transition-all duration-300' />
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN TESTIMONIAL COMPONENT
// ============================================
const Testimonial = () => {
  return (
    <div className='mt-8 lg:mt-12 relative'>
      {/* Background Decoration */}
      <div className='absolute -top-10 -left-10 w-40 h-40 bg-primaryColor/5 
                    rounded-full blur-3xl -z-10' />
      <div className='absolute -bottom-10 -right-10 w-40 h-40 bg-primaryColor/5 
                    rounded-full blur-3xl -z-10' />

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className='testimonial-swiper pb-16'
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id} className='h-auto'>
            <TestimonialCard testimonial={testimonial} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Styles */}
      <style jsx>{`
        .testimonial-swiper :global(.swiper-pagination-bullet) {
          width: 10px;
          height: 10px;
          background: #cbd5e1;
          opacity: 1;
          transition: all 0.3s ease;
        }
        
        .testimonial-swiper :global(.swiper-pagination-bullet-active) {
          background: var(--primaryColor, #3b82f6);
          width: 24px;
          border-radius: 5px;
        }

        .testimonial-swiper :global(.swiper-pagination) {
          bottom: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default Testimonial;