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
import useFetchData from "../../hooks/useFetchData";

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

  const { data: configData } = useFetchData('admin/public/config');
  const dynamicCategories = configData?.service_categories || [];

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
        const specializationMatch = provider.specialization?.title?.toLowerCase().includes(lowerQuery) ||
          provider.specialization?.toLowerCase?.().includes(lowerQuery);
        const locationMatch = provider.location?.toLowerCase().includes(lowerQuery);
        const serviceMatch = matchesService(provider, [lowerQuery]);

        return nameMatch || specializationMatch || locationMatch || serviceMatch;
      });
    }

    // 2. Filter by Category
    if (activeFilter !== "all") {
      if (activeFilter === "top-rated") {
        result = result.filter(p => (p.averageRating || 0) >= 4.5);
      } else if (activeFilter === "available") {
        result = result.filter(p => p.available === true);
      } else if (activeFilter === "nearby") {
        // Nearby logic could be added here if geo-location is available
      } else {
        // Check if filter matches specialization OR any service category
        const filterLower = activeFilter.toLowerCase();
        result = result.filter(p => {
          const specTitle = p.specialization?.title || (typeof p.specialization === 'string' ? p.specialization : '');
          const specMatch = specTitle.toLowerCase().includes(filterLower);

          const serviceMatch = p.services?.some(s =>
            s.category?.toLowerCase() === filterLower ||
            s.name?.toLowerCase().includes(filterLower)
          );

          return specMatch || serviceMatch;
        });
      }
    }

    setFilteredProviders(result);
  }, [query, providers, activeFilter]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const filterCategories = [
    { id: "all", label: "All", icon: <TrendingUp className="w-4 h-4" /> },
    ...dynamicCategories.map(cat => ({
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      icon: cat.toLowerCase() === 'spa' ? <Heart className="w-4 h-4" /> : <Scissors className="w-4 h-4" />
    })),
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
                placeholder="Search services or halls (e.g., Sarbah)..."
                value={query}
                onChange={handleSearch}
              />
            </div>

            {/* Campus Quick Select */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campus Zones</span>
                <button
                  onClick={() => setQuery("")}
                  className="text-[10px] font-black text-blue-600 uppercase hover:underline"
                >
                  Clear
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {["Sarbah", "Akuafo", "Legon", "Commonwealth", "Volta", "Bani", "Evandy"].map((hall) => (
                  <button
                    key={hall}
                    onClick={() => setQuery(hall)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all whitespace-nowrap ${query.toLowerCase() === hall.toLowerCase()
                      ? "bg-blue-600 border-blue-600 text-white shadow-md"
                      : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-slate-500 hover:border-slate-300"
                      }`}
                  >
                    {hall}
                  </button>
                ))}
              </div>
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
                /* Optimized Grid: Compact on mobile, denser on desktop */
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
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
  // Find the lowest service price
  const lowestPrice = user.services?.length > 0
    ? Math.min(...user.services.map(s => s.price).filter(p => !isNaN(p)))
    : null;

  return (
    <Link to={`/barbers/${user._id}`} className="group block h-full">
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-full flex flex-col">
        {/* Visual Container */}
        <div className="relative aspect-[16/10] bg-gray-100 dark:bg-slate-700 overflow-hidden">
          <img
            src={user.profilePicture?.url || "/placeholder.jpg"}
            alt={user.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {user.averageRating >= 4.8 && (
              <div className="bg-slate-900/90 dark:bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-lg flex items-center gap-1.5 border border-white/20">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-black text-white dark:text-slate-900 uppercase tracking-tighter">Elite</span>
              </div>
            )}
            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-md flex items-center gap-1.5">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-[11px] font-black text-slate-900 dark:text-white">{Number(user.averageRating).toFixed(1)}</span>
              <span className="text-[9px] font-bold text-slate-400">({user.totalRating || 0})</span>
            </div>
          </div>

          {/* Price Badge */}
          {lowestPrice && (
            <div className="absolute bottom-3 right-3 bg-blue-600 px-3 py-1.5 rounded-xl shadow-lg shadow-blue-600/30 border border-blue-400/30">
              <p className="text-[9px] font-black text-blue-100 uppercase tracking-widest leading-none mb-0.5">From</p>
              <p className="text-sm font-black text-white leading-none">GH₵{lowestPrice}</p>
            </div>
          )}
        </div>

        {/* Content Section - Compact Padding */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          {/* Header Info */}
          <div className="mb-3">
            <h3 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 transition-colors truncate">
              {user.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md">
                {user.specialization?.title || (typeof user.specialization === 'string' ? user.specialization : 'Professional')}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
            <span className="text-[10px] font-bold truncate">{user.location || "On Campus"}</span>
          </div>

          {/* Top Services List */}
          <div className="space-y-1.5 mb-4">
            <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Services</p>
            {user.services?.slice(0, 2).map((s, idx) => (
              <div key={idx} className="flex justify-between items-center group/service">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 group-hover/service:text-slate-900 dark:group-hover/service:text-white truncate pr-2">
                  {typeof s === 'string' ? s : s.name}
                </span>
                <span className="text-[10px] font-black text-slate-900 dark:text-white">GH₵{s.price || 0}</span>
              </div>
            ))}
            {!user.services?.length && (
              <p className="text-[10px] italic text-slate-400">View profile</p>
            )}
          </div>

          {/* CTA Button */}
          <div className="mt-auto">
            <button className="w-full py-2.5 sm:py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-xs uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all active:scale-95">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Barbers;