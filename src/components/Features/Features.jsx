/* eslint-disable no-unused-vars */
import React from 'react';
import { Link, HashRouter as Router } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Search, Scissors, CalendarCheck, Star, Clock } from 'lucide-react';

/**
 * Mock ServiceList component to resolve import error
 * In a real multi-file project, this would stay in its own file.
 */
const ServiceList = () => {
  const services = [
    { name: "Classic Haircut", desc: "Precision cutting tailored to your head shape and style.", price: "" },
    { name: "Beard Sculpting", desc: "Professional trimming and lining to enhance your facial features.", price: "" },
    { name: "Premium Styling", desc: "Expert styling for special events or a refreshed daily look.", price: "" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-headingColor">{service.name}</h3>
            <span className="text-primaryColor font-bold">{service.price}</span>
          </div>
          <p className="text-textColor text-sm leading-relaxed">{service.desc}</p>
        </div>
      ))}
    </div>
  );
};

/**
 * Features Component - A core section of the Landing Page
 * Combines the Services Grid with a detailed Benefits overview.
 * * NOTE: Local image imports were replaced with placeholder URLs to fix resolution errors.
 */
const App = () => {
  // Placeholder images for resolution safety
  const featureImg = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800";
  const avatarIcon = "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=200";
  // For icons that were previously local PNGs, we use Lucide components for better reliability
  
  const benefits = [
    {
      id: 1,
      text: "Book your appointment directly with just a few clicks."
    },
    {
      id: 2,
      text: "Explore and connect with professional barbers available on campus."
    },
    {
      id: 3,
      text: "Browse our barbers and stylists, view their availability, and choose a time that fits your schedule."
    }
  ];

  return (
    <Router>
      <div className="app-container">
        {/* ============================================ */}
        {/* SERVICES OVERVIEW SECTION */}
        {/* ============================================ */}
        <section id="services" className="py-[60px] lg:py-[100px] bg-gray-50/50" data-aos="zoom-in">
          <div className="container mx-auto px-4">
            {/* Section Heading */}
            <div className="max-w-[570px] mx-auto mb-[50px] text-center">
              <h2 className="text-[32px] lg:text-[40px] font-[800] text-headingColor mb-4 tracking-tight">
                Styling and Barbering Services
              </h2>
              <div className="w-20 h-1.5 bg-primaryColor mx-auto rounded-full mb-6" />
              <p className="text-[16px] leading-7 text-textColor font-[400]">
                Trimz provides on-campus haircuts, trims, beard grooming, and styling.
                Enjoy quick, quality service from vetted professionals.
              </p>
            </div>

            {/* Render the Service Grid Component */}
            <div className="max-w-7xl mx-auto">
              <ServiceList />
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* KEY BENEFITS & INTERACTIVE VISUAL SECTION */}
        {/* ============================================ */}
        <section className="py-[60px] lg:py-[100px] bg-white overflow-hidden" data-aos="zoom-in">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between flex-col lg:flex-row gap-12 lg:gap-[100px]">
              
              {/* Benefits Content Column */}
              <div className="w-full lg:w-1/2 xl:w-[670px]">
                <h2 className="text-[32px] leading-tight lg:text-[44px] lg:leading-[54px] font-[800] text-headingColor mb-6 tracking-tight">
                  Best Grooming Services <br className="hidden sm:block" /> 
                  <span className="text-primaryColor">Anytime, Anywhere</span>
                </h2>
                
                <p className="text-[16px] leading-7 text-textColor font-[400] mb-8 lg:max-w-[90%]">
                  We bring the professional salon experience to your doorstep. Our platform 
                  ensures you never have to worry about long wait times or finding the right 
                  talent on campus again.
                </p>

                {/* Enhanced Benefits List with Icons */}
                <ul className="space-y-5 mb-10">
                  {benefits.map((benefit) => (
                    <li key={benefit.id} className="flex items-start gap-4 group">
                      <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-primaryColor/10 flex items-center justify-center text-primaryColor transition-all group-hover:bg-primaryColor group-hover:text-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-[16px] font-semibold leading-7 text-textColor group-hover:text-headingColor transition-colors">
                        {benefit.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link to="/aboutus">
                  <button className="flex items-center gap-2 bg-primaryColor text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primaryColor/20 hover:bg-primaryColor/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <span>Learn More About Trimz</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>

              {/* Visual Showcase Column */}
              <div className="relative z-10 w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
                <div className="relative w-full max-w-[500px] lg:max-w-none lg:w-[85%]">
                  {/* Background Shadow Glow */}
                  <div className="absolute -inset-4 bg-primaryColor/5 rounded-[2.5rem] blur-3xl -z-10" />
                  
                  <img 
                    src={featureImg} 
                    className="w-full rounded-[2.5rem] shadow-2xl transform transition-transform hover:scale-[1.01] duration-500" 
                    alt="Grooming excellence visual" 
                  />

                  {/* Floating UI Card Overlay - Shows current booking mockup */}
                  <div className="absolute -bottom-10 -left-2 sm:bottom-10 sm:-left-10 lg:bottom-[80px] lg:-left-12 z-20 w-[200px] sm:w-[250px] lg:w-[280px] bg-white p-5 lg:p-7 rounded-[2rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] border border-white/50 animate-float">
                    
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <div className="bg-primaryColor/10 px-2.5 py-1.5 rounded-xl border border-primaryColor/20">
                          <p className="text-[10px] lg:text-[12px] text-primaryColor font-[900] uppercase tracking-tighter">Tues, 24</p>
                        </div>
                        <p className="text-[10px] lg:text-[12px] text-textColor font-bold">10:00 AM</p>
                      </div>
                      
                      <div className="w-8 h-8 lg:w-[44px] lg:h-[44px] flex items-center justify-center bg-irisBlueColor text-white rounded-2xl shadow-lg shadow-irisBlueColor/30">
                        {/* Using Lucide icon instead of missing videoIcon png */}
                        <Search className="w-4 h-4 lg:w-5 lg:h-5" />
                      </div>
                    </div>

                    {/* Trust Badge */}
                    <div className="inline-block bg-[#CCF0F3] py-1.5 px-4 text-[10px] lg:text-[12px] text-irisBlueColor font-[900] rounded-full mb-6 shadow-sm">
                      Verified Professional
                    </div>

                    {/* Profile Info */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={avatarIcon} 
                          alt="Stylist profile" 
                          className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border-2 border-white shadow-md object-cover" 
                        />
                        <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                      </div>
                      <div>
                        <h4 className="text-[14px] lg:text-[17px] font-[800] text-headingColor tracking-tight">
                          Saddiq Ahmed
                        </h4>
                        <p className="text-[11px] lg:text-[13px] text-textColor/70 font-semibold uppercase tracking-widest">Master Barber</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Animation Effect */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes float-ui {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-15px); }
            }
            .animate-float {
              animation: float-ui 4s ease-in-out infinite;
            }
          `}} />
        </section>
      </div>
    </Router>
  );
};

// Renaming the primary export to App to match system requirements for React Immersives
export default App;