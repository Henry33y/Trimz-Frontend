/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Search, Scissors, CalendarCheck } from 'lucide-react';

/**
 * ServiceList Component
 * Inlined to resolve build errors and provide a complete standalone file.
 */
const ServiceList = () => {
  const services = [
    { name: "Classic Haircut", desc: "Precision cutting tailored to your head shape and style.", price: "$25" },
    { name: "Beard Sculpting", desc: "Professional trimming and lining to enhance your facial features.", price: "$15" },
    { name: "Premium Styling", desc: "Expert styling for special events or a refreshed daily look.", price: "$30" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
            <span className="text-blue-600 font-bold">{service.price}</span>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{service.desc}</p>
        </div>
      ))}
    </div>
  );
};

/**
 * Features Component
 * This is the main UI component. 
 * Note: We use external placeholder URLs for images to avoid build errors.
 */
const Features = () => {
  const featureImg = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800";
  const avatarIcon = "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=200";
  
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
    <div className="app-container">
      {/* ============================================ */}
      {/* SERVICES OVERVIEW SECTION */}
      {/* ============================================ */}
      <section id="services" className="py-[60px] lg:py-[100px] bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-[570px] mx-auto mb-[50px] text-center">
            <h2 className="text-[32px] lg:text-[40px] font-[800] text-slate-900 mb-4 tracking-tight">
              Styling and Barbering Services
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-6" />
            <p className="text-[16px] leading-7 text-slate-600 font-[400]">
              Trimz provides on-campus haircuts, trims, beard grooming, and styling.
              Enjoy quick, quality service from vetted professionals.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <ServiceList />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* KEY BENEFITS & INTERACTIVE VISUAL SECTION */}
      {/* ============================================ */}
      <section className="py-[60px] lg:py-[100px] bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-col lg:flex-row gap-12 lg:gap-[100px]">
            
            {/* Benefits Content Column */}
            <div className="w-full lg:w-1/2 xl:w-[670px]">
              <h2 className="text-[32px] leading-tight lg:text-[44px] lg:leading-[54px] font-[800] text-slate-900 mb-6 tracking-tight">
                Best Grooming Services <br className="hidden sm:block" /> 
                <span className="text-blue-600">Anytime, Anywhere</span>
              </h2>
              
              <p className="text-[16px] leading-7 text-slate-600 font-[400] mb-8 lg:max-w-[90%]">
                We bring the professional salon experience to your doorstep. Our platform 
                ensures you never have to worry about long wait times or finding the right 
                talent on campus again.
              </p>

              <ul className="space-y-5 mb-10">
                {benefits.map((benefit) => (
                  <li key={benefit.id} className="flex items-start gap-4 group">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[16px] font-semibold leading-7 text-slate-700 group-hover:text-slate-900 transition-colors">
                      {benefit.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/aboutus">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all duration-300 group">
                  <span>Learn More About Trimz</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Visual Showcase Column */}
            <div className="relative z-10 w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
              <div className="relative w-full max-w-[500px] lg:max-w-none lg:w-[85%]">
                <div className="absolute -inset-4 bg-blue-50 rounded-[2.5rem] blur-3xl -z-10" />
                
                <img 
                  src={featureImg} 
                  className="w-full rounded-[2.5rem] shadow-2xl transform transition-transform hover:scale-[1.01] duration-500" 
                  alt="Grooming visual" 
                />

                <div className="absolute -bottom-10 -left-2 sm:bottom-10 sm:-left-10 lg:bottom-[80px] lg:-left-12 z-20 w-[200px] sm:w-[250px] lg:w-[280px] bg-white p-5 lg:p-7 rounded-[2rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] border border-white/50 animate-float">
                  
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-100">
                        <p className="text-[10px] lg:text-[12px] text-blue-600 font-[900] uppercase tracking-tighter">Tues, 24</p>
                      </div>
                      <p className="text-[10px] lg:text-[12px] text-slate-700 font-bold">10:00 AM</p>
                    </div>
                    
                    <div className="w-8 h-8 lg:w-[44px] lg:h-[44px] flex items-center justify-center bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-200">
                      <Search className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                  </div>

                  <div className="inline-block bg-blue-50 py-1.5 px-4 text-[10px] lg:text-[12px] text-blue-700 font-[900] rounded-full mb-6 shadow-sm border border-blue-100">
                    Verified Professional
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={avatarIcon} 
                        alt="Stylist" 
                        className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border-2 border-white shadow-md object-cover" 
                      />
                      <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                    </div>
                    <div>
                      <h4 className="text-[14px] lg:text-[17px] font-[800] text-slate-900 tracking-tight">
                        Saddiq Ahmed
                      </h4>
                      <p className="text-[11px] lg:text-[13px] text-slate-500 font-semibold uppercase tracking-widest">Master Barber</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
  );
};

/**
 * Main App Component
 * We conditionally wrap in a Router only for the Canvas preview.
 * If you are importing this into your project's Routers.jsx, 
 * you should import { Features } instead of the default export 
 * or remove the <Router> wrapper here.
 */
// Export the `Features` component directly. Do NOT wrap it in a Router here
// because the application root already provides a Router (see `main.jsx`).
export { Features };
export default Features;