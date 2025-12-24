/* eslint-disable react/no-unknown-property */
// ============================================
// BARBERS PAGE - Fresha-Inspired Design
// ============================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Filter, Star, Clock, TrendingUp, Scissors, User, Heart } from 'lucide-react';
// import BarberCard from "../../components/Barbers/BarberCard"; // Replaced with local ProviderCard for specific UI styling
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

    // 1. Filter by Search Query
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
        const femaleKeywords = ["female", "women", "ladies", "styling", "nails", "makeup"];
        result = result.filter(p => 
          femaleKeywords.some(k => p.specialization?.toLowerCase().includes(k)) ||
          matchesService(p, femaleKeywords)
        );
      } else if (activeFilter === "male") {
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

  const filterCategories = [
    { id: "all", label: "All", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "male", label: "Men", icon: <Scissors className="w-4 h-4" /> },
    { id: "female", label: "Women", icon: <User className="w-4 h-4" /> },
    { id: "top-rated", label: "Top Rated", icon: <Star className="w-4 h-4" /> },
    { id: "available", label: "Available", icon: <Clock className="w-4 h-4" /> },
    { id: "nearby", label: "Nearby", icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-sans">
      
      {/* ==================== HEADER ==================== */}
      <section className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Search Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-slate-900 transition-colors" />
              </div>
              <input
                type="search"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-100 dark:bg-slate-700 border-none rounded-xl text-slate-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-500 transition-all font-medium"
                placeholder="Search for services or venues..."
                value={query}
                onChange={handleSearch}
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {filterCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border
                    ${activeFilter === category.id
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                      : 'bg-white text-slate-600 border-gray-200 hover:border-gray-300 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700'
                    }`}
                >
                  {category.icon}
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CONTENT ==================== */}
      <section className="py-6 bg-gray-50/50 dark:bg-slate-900 min-h-[80vh]">
        <div className="container mx-auto px-4 max-w-[1400px]">
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {query ? `Results for "${query}"` : 'Recommended for you'}
            </h2>
            <span className="text-xs font-medium text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded-full border border-gray-100 dark:border-slate-700">
              {filteredProviders.length} results
            </span>
          </div>

          {loading && <Loader />}
          
          {error && (
            <div className="max-w-lg mx-auto mt-10">
               <Error errMessage={error.message} />
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredProviders.length > 0 ? (
                /* Adjusted Grid: Smaller Cards, More Columns */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredProviders.map((provider) => (
                    <ProviderCard key={provider._id} user={provider} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                   <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No professionals found</h3>
                   <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                   <button 
                     onClick={() => { setQuery(""); setActiveFilter("all"); }}
                     className="mt-6 text-sm font-bold text-blue-600 hover:underline"
                   >
                     Clear all filters
                   </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <div className="container mx-auto px-4">
           <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-10">Trusted by thousands</h2>
           <Testimonial />
        </div>
      </section>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

// ====================================================================
// INTERNAL COMPONENT: ProviderCard
// COMPACT Version for Denser Grid
// ====================================================================
const ProviderCard = ({ user }) => {
  return (
    <Link to={`/barbers/${user._id}`} className="group block h-full">
      <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-gray-100 dark:border-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col">
        {/* Rectangular Image - 4:3 Aspect Ratio */}
        <div className="relative aspect-[4/3] bg-gray-100 dark:bg-slate-700 overflow-hidden">
          <img 
            src={user.profilePicture?.url || "/placeholder.jpg"} 
            alt={user.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
          />
          
          {/* Top Rating Badge - Simplified for small card */}
          {user.averageRating >= 4.5 && (
            <div className="absolute top-2 left-2 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 text-slate-900 dark:text-white fill-slate-900 dark:fill-white" />
              <span className="text-[10px] font-bold text-slate-900 dark:text-white">Top</span>
            </div>
          )}

          {/* Favorite Button Overlay - Smaller */}
          <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white text-slate-500 hover:text-red-500 transition-colors">
            <Heart className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content - Compact Padding */}
        <div className="p-3 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1 gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors truncate">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.specialization || 'Professional'}</p>
            </div>
            
            {/* Rating Box - Compact */}
            <div className="flex items-center gap-1 shrink-0 bg-green-50 dark:bg-green-900/20 px-1 py-0.5 rounded">
              <span className="text-xs font-bold text-green-700 dark:text-green-400">{Number(user.averageRating).toFixed(1) || "5.0"}</span>
              <Star className="w-2.5 h-2.5 text-green-700 dark:text-green-400 fill-current" />
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-3">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{user.location || "Location not set"}</span>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-50 dark:border-slate-700">
             {/* Service Pills - Very Compact */}
             <div className="flex flex-wrap gap-1.5 mb-2 h-6 overflow-hidden">
               {user.services?.slice(0,2).map((s, idx) => (
                 <span key={idx} className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md border border-gray-100 dark:border-slate-600">
                   {typeof s === 'string' ? s : s.name}
                 </span>
               ))}
             </div>
             
             <button className="w-full py-1.5 rounded-md border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white font-bold text-xs hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors">
               Book Now
             </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Barbers;