/* eslint-disable no-unused-vars */
import React from 'react';
import { Users, Award, Star, Store, TrendingUp, CheckCircle2 } from 'lucide-react';
import About from '../components/About/About';
// import trimzImg from '../assets/images/trimz.png';
import trimzImg from '../assets/images/about1.jpg';

const Aboutus = () => {
  const missionItems = [
    "Empower beauty professionals with modern tools",
    "Connect clients with trusted service providers",
    "Simplify the booking experience",
    "Drive business growth through technology"
  ];

  const benefits = [
    {
      icon: <Store className="w-10 h-10" />,
      title: "For Business",
      features: ["Client management", "Online scheduling", "Marketing tools", "Payment processing"]
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "For Clients",
      features: ["24/7 online booking", "Verified reviews", "Instant confirmations", "Mobile app access"]
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Platform Benefits",
      features: ["Smart marketing", "Business insights", "Secure payments", "Customer support"]
    }
  ];

  const awards = [
    {
      year: "2023",
      award: "Best Beauty Tech Platform",
      org: "Beauty Innovation Awards",
      icon: <Star className="w-6 h-6" />
    },
    {
      year: "2022",
      award: "Excellence in Customer Service",
      org: "Digital Service Awards",
      icon: <Award className="w-6 h-6" />
    },
    {
      year: "2022",
      award: "Top Booking Platform",
      org: "Beauty Business Review",
      icon: <Star className="w-6 h-6" />
    },
    {
      year: "2021",
      award: "Innovation in Beauty Tech",
      org: "Tech Excellence Awards",
      icon: <Award className="w-6 h-6" />
    }
  ];

  return (
    <section className="min-h-screen bg-white">
      {/* Integrated About Component */}
      <div className="bg-white">
        <About />
      </div>

      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <div className="bg-yellow-50/50 py-16 lg:py-24 relative overflow-hidden">
        {/* Decorative Blur Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-irisBlueColor/5 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-headingColor mb-6 tracking-tight leading-tight">
            Connecting Clients with <br className="hidden lg:block" />
            <span className="text-primaryColor">Top Barbers & Stylists</span>
          </h1>
          <p className="text-lg lg:text-xl text-textColor max-w-2xl mx-auto leading-relaxed">
            The leading marketplace for beauty and wellness services. We bridge the gap 
            between world-class talent and clients seeking perfection.
          </p>
        </div>
      </div>

      {/* ============================================ */}
      {/* MISSION SECTION */}
      {/* ============================================ */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl lg:text-4xl font-bold text-headingColor mb-6">Our Mission</h2>
              <p className="text-lg text-textColor mb-8 leading-relaxed">
                To revolutionize how people book and manage their beauty and wellness appointments, 
                while helping local professionals grow their business through cutting-edge technology.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {missionItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-transparent hover:border-primaryColor/20 transition-all">
                    <CheckCircle2 className="w-6 h-6 text-primaryColor shrink-0" />
                    <p className="text-headingColor font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-primaryColor/10 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-500" />
                <img 
                  src={trimzImg} 
                  alt="Platform showcase" 
                  className="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-[4/3] transform group-hover:scale-[1.01] transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* BENEFITS SECTION */}
      {/* ============================================ */}
      <div className="bg-gray-50 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-headingColor mb-4">Why Choose Our Platform</h2>
            <div className="h-1.5 w-24 bg-primaryColor mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-irisBlueColor/10 text-irisBlueColor mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold text-headingColor mb-4">{benefit.title}</h3>
                <ul className="space-y-4">
                  {benefit.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-textColor">
                      <div className="w-1.5 h-1.5 bg-irisBlueColor rounded-full" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* AWARDS SECTION */}
      {/* ============================================ */}
      <div className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-headingColor mb-4">Awards & Recognition</h2>
            <p className="text-textColor">Trusted and recognized by industry leaders worldwide.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <div key={index} className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:border-primaryColor transition-all text-center">
                <div className="text-primaryColor mb-6 flex justify-center transform group-hover:scale-110 transition-transform">
                  <div className="p-4 bg-primaryColor/10 rounded-2xl">
                    {award.icon}
                  </div>
                </div>
                <div className="text-sm text-primaryColor font-bold uppercase tracking-wider mb-2">{award.year}</div>
                <h3 className="text-lg font-bold text-headingColor mb-2">{award.award}</h3>
                <p className="text-sm text-textColor">{award.org}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutus;