/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import ServiceCard from '../components/Services/ServiceCard';
import { services } from '../assets/data/services';
import { Search, Scissors, Star, ArrowRight, Sparkles, User, Palette } from 'lucide-react';
import BottomCTA from '../components/CTA/BottomCTA';
import { Link } from 'react-router-dom';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories include "women" to handle female-specific services
  const categories = [
    { id: 'all', label: 'All Services', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'haircut', label: 'Haircuts', icon: <Scissors className="w-4 h-4" /> },
    { id: 'shaving', label: 'Shaving', icon: <Star className="w-4 h-4" /> },
    { id: 'women', label: 'Women', icon: <User className="w-4 h-4" /> },
    { id: 'styling', label: 'Styling', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'coloring', label: 'Coloring', icon: <Palette className="w-4 h-4" /> },
  ];

  const filteredServices = services.filter(service => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      service.name.toLowerCase().includes(searchLower) ||
      service.desc.toLowerCase().includes(searchLower);

    const matchesCategory = selectedCategory === 'all' || 
      service.category?.toLowerCase() === selectedCategory ||
      // Logic for "Women" category matching keywords in description or category
      (selectedCategory === 'women' && (
        service.category?.toLowerCase() === 'women' || 
        service.name.toLowerCase().includes('lady') || 
        service.name.toLowerCase().includes('women')
      ));

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="min-h-screen bg-gray-50">
      {/* ============================================ */}
      {/* HERO & HEADER SECTION */}
      {/* ============================================ */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primaryColor/10 rounded-2xl mb-6">
              <Scissors className="w-8 h-8 text-primaryColor" />
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-headingColor mb-6 tracking-tight">
              Our Premium Services
            </h1>
            <p className="text-lg text-textColor leading-relaxed max-w-2xl mx-auto">
              Experience the art of grooming with our professional Stylists. 
              From classic cuts to modern styling and female hair care, we deliver excellence.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SEARCH & FILTER BAR - Sticky for UX */}
      {/* ============================================ */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between max-w-6xl mx-auto">
            
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for haircut, coloring, styling..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-primaryColor focus:border-transparent 
                         transition-all outline-none text-gray-700"
              />
            </div>

            {/* Category Filter - Scrollable on mobile */}
            <div className="w-full lg:w-auto overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-1 lg:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap
                      ${selectedCategory === cat.id
                        ? 'bg-primaryColor text-white shadow-lg shadow-primaryColor/20'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primaryColor hover:text-primaryColor'
                      }`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SERVICES GRID */}
      {/* ============================================ */}
      <div className="container mx-auto px-4 py-12">
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((item, index) => (
              <div key={index} className="group transition-all duration-300">
                <ServiceCard 
                  item={item}
                  index={index}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-headingColor mb-2">No services found</h3>
            <p className="text-textColor max-w-xs mx-auto mb-6">
              We couldn&apos;t find anything matching your current filters. Try resetting your search.
            </p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('all');}}
              className="text-primaryColor font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* ENHANCED CTA SECTION */}
      {/* ============================================ */}
      <div className="container mx-auto px-4 mb-12">
        <div className="relative overflow-hidden bg-gradient-to-r from-primaryColor to-irisBlueColor rounded-[2rem] p-8 lg:p-16 text-center text-white shadow-2xl">
          {/* Abstract background shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to transform your look?</h2>
            <p className="text-white/80 text-lg mb-10">
              Join thousands of satisfied clients or list your professional grooming business on our platform today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to='/register'
                className="bg-white text-primaryColor px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group"
              >
                List Your Business
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to='/barbers'
                className="bg-black/20 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black/30 transition-all"
              >
                Find Stylists
              </Link>
            </div>
          </div>
        </div>
      </div>

      <BottomCTA />

      {/* Custom styles for hidden scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Services;