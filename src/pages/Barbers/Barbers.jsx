/* eslint-disable react/no-unknown-property */
// ============================================
// BARBERS PAGE - Fresha-Inspired Design
// ============================================
// Modern, clean interface for browsing and finding barbers
// Features: Advanced search, filters, and responsive grid layout
// ============================================

import { useState, useEffect } from "react";
import { Search, MapPin, Filter, Star, Clock, TrendingUp, Scissors, User } from 'lucide-react';
import BarberCard from "../../components/Barbers/BarberCard";
import Testimonial from "../../components/Testimonial/Testimonial";
import { BASE_URL } from "./../../config";
import Loader from "../../components/Loading/Loading.jsx";
import Error from "../../components/Error/Error";

const Barbers = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [query, setQuery] = useState("");
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // ============================================
  // DATA FETCHING
  // ============================================
  useEffect(() => {
    const fetchProviders = async () => {
      const url = `${BASE_URL}/users/providers`;
      try {
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        const data = result.data && Array.isArray(result.data) ? result.data : result;
        setProviders(data);
        setFilteredProviders(data);
      } catch (err) {
        setError({ message: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // ============================================
  // FILTER & SEARCH LOGIC
  // ============================================
  useEffect(() => {
    let result = [...providers];

    // Helper to check if a service matches keywords
    const matchesService = (provider, keywords) => {
      if (!provider.services || !Array.isArray(provider.services)) return false;
      return provider.services.some(service => {
        const serviceName = (typeof service === 'string' ? service : service.name || "").toLowerCase();
        return keywords.some(keyword => serviceName.includes(keyword));
      });
    };

    // 1. Filter by Search Query (Name, Specialization, or Services)
    if (query.trim() !== "") {
      const lowerQuery = query.toLowerCase();
      result = result.filter((provider) => {
        const nameMatch = provider.name?.toLowerCase().includes(lowerQuery);
        const specializationMatch = provider.specialization?.toLowerCase().includes(lowerQuery);
        const serviceMatch = matchesService(provider, [lowerQuery]);
        
        return nameMatch || specializationMatch || serviceMatch;
      });
    }

    // 2. Filter by Category
    if (activeFilter !== "all") {
      if (activeFilter === "top-rated") {
        result = result.filter(p => (p.averageRating || 0) >= 4.5);
      } else if (activeFilter === "female") {
        // Filters for Female services (Styling, Women, Ladies, etc)
        const femaleKeywords = ["female", "women", "ladies", "styling", "nails", "makeup"];
        result = result.filter(p => 
          femaleKeywords.some(k => p.specialization?.toLowerCase().includes(k)) ||
          matchesService(p, femaleKeywords)
        );
      } else if (activeFilter === "male") {
        // Filters for traditional Barbering/Men's services
        const maleKeywords = ["barber", "men", "shave", "beard", "grooming"];
        result = result.filter(p => 
          maleKeywords.some(k => p.specialization?.toLowerCase().includes(k)) ||
          matchesService(p, maleKeywords)
        );
      } else if (activeFilter === "available") {
        result = result.filter(p => p.isAvailable === true);
      }
    }

    setFilteredProviders(result);
  }, [query, providers, activeFilter]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  // ============================================
  // FILTER CATEGORIES
  // ============================================
  const filterCategories = [
    { id: "all", label: "All Stylists", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "male", label: "Men's Grooming", icon: <Scissors className="w-4 h-4" /> },
    { id: "female", label: "Women's Styling", icon: <User className="w-4 h-4" /> },
    { id: "top-rated", label: "Top Rated", icon: <Star className="w-4 h-4" /> },
    { id: "available", label: "Available Now", icon: <Clock className="w-4 h-4" /> },
    { id: "nearby", label: "Nearby", icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* ============================================ */}
      {/* HEADER SECTION - Search & Navigation */}
      {/* ============================================ */}
      <section className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          {/* Page Title - Mobile */}
          <div className="mb-4 sm:hidden">
            <h1 className="text-2xl font-bold text-headingColor dark:text-gray-100">Find Stylists</h1>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-700 rounded-full border-2 border-transparent
                          text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400
                          focus:outline-none focus:bg-white dark:focus:bg-slate-700 focus:border-primaryColor
                          transition-all duration-200"
                placeholder="Search by name, service, or location..."
                value={query}
                onChange={handleSearch}
              />
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full
                          bg-primaryColor text-white hover:bg-primaryColor/90 
                          transition-colors duration-200 sm:hidden"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FILTER SECTION - Category Filters */}
      {/* ============================================ */}
      <section className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 sticky top-[72px] sm:top-[88px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                          whitespace-nowrap transition-all duration-200 flex-shrink-0
                          ${activeFilter === category.id
                            ? 'bg-primaryColor text-white shadow-md'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                          }`}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* RESULTS HEADER */}
      {/* ============================================ */}
      <section className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-headingColor dark:text-gray-100">
                {query ? `Search results for "${query}"` : 'Available Stylists'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                {filteredProviders.length} {filteredProviders.length === 1 ? 'stylist' : 'stylists'} found
              </p>
            </div>
            
            {/* Sort/Filter Button - Desktop */}
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 dark:text-gray-300
                               rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BARBERS GRID - Main Content */}
      {/* ============================================ */}
      <section className="py-6 sm:py-8">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="max-w-md mx-auto mt-8">
              <Error errMessage={error.message} />
            </div>
          )}

          {/* Barbers Grid */}
          {!loading && !error && (
            <>
              {filteredProviders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                              gap-4 sm:gap-6">
                  {filteredProviders.map((provider) => (
                    <BarberCard key={provider._id} user={provider} />
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-slate-700 rounded-full 
                                flex items-center justify-center">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-headingColor dark:text-gray-100 mb-2">
                    No stylists found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300 mb-6">
                    Try adjusting your search or filters
                  </p>
                  <button 
                    onClick={() => {
                      setQuery("");
                      setActiveFilter("all");
                    }}
                    className="px-6 py-2.5 bg-primaryColor text-white rounded-full
                              hover:bg-primaryColor/90 transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ============================================ */}
      {/* QUICK STATS - Info Cards */}
      {/* ============================================ */}
      {!loading && !error && filteredProviders.length > 0 && (
        <section className="py-12 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center p-6 bg-gradient-to-br from-primaryColor/5 to-primaryColor/10 
                            rounded-2xl">
                <div className="w-12 h-12 mx-auto mb-4 bg-primaryColor/20 rounded-full 
                              flex items-center justify-center">
                  <Star className="w-6 h-6 text-primaryColor" />
                </div>
                <h3 className="text-3xl font-bold text-headingColor dark:text-gray-100 mb-1">4.9</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Average Rating</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 
                            rounded-2xl">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-200 rounded-full 
                              flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-headingColor dark:text-gray-100 mb-1">15min</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Average Wait Time</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 
                            rounded-2xl">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-200 rounded-full 
                              flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-headingColor dark:text-gray-100 mb-1">10k+</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Happy Customers</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* TESTIMONIALS SECTION */}
      {/* ============================================ */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-headingColor dark:text-gray-100 mb-4">
              What our clients say
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
              Join thousands of satisfied customers who trust Trimz for their grooming needs
            </p>
          </div>
          <Testimonial />
        </div>
      </section>

      {/* FLOATING ACTION BUTTON - Mobile Only */}
      <button 
        className="fixed bottom-6 right-6 w-14 h-14 bg-primaryColor text-white 
                  rounded-full shadow-2xl flex items-center justify-center
                  hover:bg-primaryColor/90 transition-all duration-200
                  sm:hidden z-50 active:scale-95"
        aria-label="Filter options"
      >
        <Filter className="w-6 h-6" />
      </button>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Barbers;