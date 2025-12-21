/* eslint-disable react/jsx-no-undef */
// ============================================
// HOME PAGE COMPONENT - Trimz Grooming Services
// ============================================
// Main landing page featuring hero section, services overview,
// features, testimonials, and FAQ section
// ============================================

import { useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import { User, Scissors, Calendar, ArrowRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// ============================================
// ASSET IMPORTS
// ============================================
import heroImg01 from '../assets/images/4.jpg';
import heroImg02 from '../assets/images/2.jpg';
import heroImg03 from '../assets/images/3.jpg';
import faqImg from '../assets/images/faq-img1.png';

// ============================================
// COMPONENT IMPORTS
// ============================================
import About from '../components/About/About';
import Features from '../components/Features/Features.jsx';
import FaqList from '../components/faq/FaqList';
import Testimonial from '../components/Testimonial/Testimonial';
import CounterSection from '../components/Counter/CounterSection';
import ScrollToTop from './ScrollToTop';

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <>
      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className='hero__section pt-[60px] lg:pt-[100px] bg-gradient-to-b from-white to-gray-50' id="hero">
        <div className="container mx-auto px-4">
          <div className='flex flex-col lg:flex-row gap-12 lg:gap-[90px] items-center justify-between'>
            
            {/* Hero Content */}
            <div className='flex-1 text-center lg:text-left'>
              <div className='lg:max-w-[620px]'>
                <span className="inline-block px-4 py-2 rounded-full bg-primaryColor/10 text-primaryColor font-bold text-sm mb-6 uppercase tracking-wider">
                  Premium Campus Grooming
                </span>
                <h1 className='text-[38px] leading-[48px] text-headingColor font-[800] 
                  md:text-[52px] md:leading-[62px] lg:text-[64px] lg:leading-[74px] 
                  mb-6 tracking-tight'>
                  Looking for Expert <br className="hidden md:block" />
                  <span className="text-primaryColor">Grooming Services</span> Near You?
                </h1>

                <p className='text-[18px] leading-8 text-textColor mb-10 max-w-[540px] mx-auto lg:mx-0'>
                  Trimz offers expert grooming for everyone. Our professional barbers and stylists 
                  deliver precision haircuts, beard grooming, and modern styles right to your campus.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <ScrollLink to="services" smooth={true} duration={500} offset={-80}>
                  <button className="w-full sm:w-auto px-8 py-4 bg-primaryColor text-white font-bold rounded-2xl shadow-lg shadow-primaryColor/20 hover:bg-primaryColor/90 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group">
                    View Services
                    <BsArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </ScrollLink>
                <RouterLink to="/barbers">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white text-headingColor border border-gray-200 font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300">
                    Find a Barber
                  </button>
                </RouterLink>
              </div>
            </div>

            {/* Hero Gallery */}
            <div className='flex-1 flex flex-wrap gap-4 lg:gap-6 justify-center lg:justify-end'>
              <div data-aos="fade-up" data-aos-delay="100">
                <img 
                  className='w-[160px] h-[240px] sm:w-[220px] sm:h-[340px] md:w-[260px] 
                    md:h-[400px] rounded-[2rem] object-cover shadow-2xl ring-4 ring-white' 
                  src={heroImg01} 
                  alt="Professional styling" 
                />
              </div>

              <div className='mt-8 sm:mt-12 space-y-4 lg:space-y-6' data-aos="fade-up" data-aos-delay="300">
                <img 
                  src={heroImg02} 
                  alt="Shop" 
                  className='w-[140px] h-[120px] sm:w-[200px] sm:h-[180px] rounded-3xl object-cover shadow-xl' 
                />
                <img 
                  src={heroImg03} 
                  alt="Tools" 
                  className='w-[140px] h-[120px] sm:w-[200px] sm:h-[180px] rounded-3xl object-cover shadow-xl'
                />
              </div>
            </div>
          </div>

          <CounterSection />
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS SECTION */}
      {/* ============================================ */}
      <section className='py-[60px] lg:py-[100px] bg-white'>
        <div className="container mx-auto px-4">
          <div className='max-w-[600px] mx-auto mb-[60px] text-center'>
            <h2 className='text-[32px] lg:text-[40px] font-[800] text-headingColor mb-4 tracking-tight'>
              Your Style, Simplified
            </h2>
            <div className="w-20 h-1.5 bg-primaryColor mx-auto rounded-full mb-6" />
            <p className='text-[16px] leading-7 text-textColor'>
              Booking your next look shouldn&apos;t be a hassle. We&apos;ve built the perfect platform to connect you with top-tier talent in just three easy steps.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Step 1 */}
            <div className='relative p-8 bg-gray-50 rounded-[2rem] hover:bg-white hover:shadow-2xl transition-all duration-300 group border border-transparent hover:border-gray-100'>
              <div className='w-16 h-16 bg-primaryColor/10 rounded-2xl flex items-center justify-center text-primaryColor font-bold text-2xl mb-8 group-hover:bg-primaryColor group-hover:text-white transition-colors'>
                <User className="w-8 h-8" />
              </div>
              <h3 className='text-2xl font-bold text-headingColor mb-4'>Find a Stylist</h3>
              <p className='text-textColor leading-relaxed mb-6'>
                Discover skilled professionals on campus. Browse detailed profiles, view portfolio photos, and read verified ratings.
              </p>
              <RouterLink to='/barbers' className='flex items-center gap-2 text-primaryColor font-bold group/btn'>
                Explore Talent <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </RouterLink>
            </div>

            {/* Step 2 */}
            <div className='relative p-8 bg-gray-50 rounded-[2rem] hover:bg-white hover:shadow-2xl transition-all duration-300 group border border-transparent hover:border-gray-100'>
              <div className='w-16 h-16 bg-irisBlueColor/10 rounded-2xl flex items-center justify-center text-irisBlueColor font-bold text-2xl mb-8 group-hover:bg-irisBlueColor group-hover:text-white transition-colors'>
                <Scissors className="w-8 h-8" />
              </div>
              <h3 className='text-2xl font-bold text-headingColor mb-4'>Pick a Service</h3>
              <p className='text-textColor leading-relaxed mb-6'>
                From fades to beard sculpting, choose exactly what you need. View pricing upfront—no surprises, just great results.
              </p>
              <RouterLink to='/services' className='flex items-center gap-2 text-irisBlueColor font-bold group/btn'>
                Browse Services <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </RouterLink>
            </div>

            {/* Step 3 */}
            <div className='relative p-8 bg-gray-50 rounded-[2rem] hover:bg-white hover:shadow-2xl transition-all duration-300 group border border-transparent hover:border-gray-100'>
              <div className='w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-600 font-bold text-2xl mb-8 group-hover:bg-yellow-600 group-hover:text-white transition-colors'>
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className='text-2xl font-bold text-headingColor mb-4'>Book & Go</h3>
              <p className='text-textColor leading-relaxed mb-6'>
                Pick a time that fits your schedule. Confirm your booking instantly and get notified before your session starts.
              </p>
              <RouterLink to='/register' className='flex items-center gap-2 text-yellow-600 font-bold group/btn'>
                Get Started <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* INTEGRATED ABOUT & FEATURES COMPONENTS */}
      {/* ============================================ */}
      <About />
      
      {/* Features handles both Services List and Feature (Benefits) blocks */}
      <Features />

      {/* ============================================ */}
      {/* FAQ SECTION */}
      {/* ============================================ */}
      <section className='py-[60px] lg:py-[100px] bg-white overflow-hidden'>
        <div className="container mx-auto px-4">
          <div className='flex flex-col md:flex-row justify-between gap-12 lg:gap-20 items-center'>
            <div className='w-full md:w-[45%] hidden md:block'>
              <div className="relative group">
                <div className="absolute -inset-4 bg-primaryColor/5 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <img 
                  src={faqImg} 
                  alt="FAQ" 
                  className='relative rounded-[2rem] shadow-2xl w-full'
                />
              </div>
            </div>

            <div className='w-full md:w-[50%]'>
              <h2 className='text-[32px] lg:text-[40px] font-[800] text-headingColor mb-8 leading-tight tracking-tight'>
                Everything you need to <br className="hidden lg:block" /> 
                know <span className="text-primaryColor">about Trimz</span>
              </h2>
              <FaqList />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS SECTION */}
      {/* ============================================ */}
      <section className='py-[60px] lg:py-[100px] bg-gray-50'>
        <div className="container mx-auto px-4">
          <div className='max-w-[500px] mx-auto mb-[60px] text-center'>
            <h2 className='text-[32px] lg:text-[40px] font-[800] text-headingColor mb-4 tracking-tight'>What our clients say</h2>
            <div className="w-20 h-1.5 bg-primaryColor mx-auto rounded-full mb-6" />
            <p className='text-[16px] leading-7 text-textColor'>
              Don&apos;t just take our word for it. Join thousands of satisfied customers who trust Trimz for their everyday grooming.
            </p>
          </div>
          
          <Testimonial />
        </div>
      </section>

      <ScrollToTop />
    </>
  );
};

export default Home;