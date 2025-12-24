import { useContext, useEffect, useState } from "react";
import Loader from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import { BASE_URL } from "../../config";
import Tabs from "./Tabs";
import BarberAbout from './../../pages/Barbers/BarberAbout';
import Profile from "./Profile";
import Appointments from "./Appointments";
import Service from "./Service";
import GalleryUpload from "./GalleryUpload";
import starIcon from '../../assets/images/Star.png';
import { AuthContext } from "../../context/AuthContext";
import useGetProfile from "../../hooks/useFetchData";
import { AlertTriangle, Calendar, CheckCircle2, Grid, Settings, Scissors, Image as ImageIcon } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { data, loading, error } = useGetProfile(`users/${user._id}`);
  const [tab, setTab] = useState("overview");
  const [appointments, setAppointments] = useState([]);

  // Fetch provider appointments
  const getAppointmentsData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setAppointments([]);

      const response = await fetch(`${BASE_URL}/appointments/provider`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("Fetched appointments:", result);

      // Handle backend message safely
      if (!result.success) {
        setAppointments([]); // no appointments
        console.warn(result.message); // log message instead of throwing Error
        return;
      }

      setAppointments(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments([]);
    }
  };

  // Initial fetch
  useEffect(() => {
    getAppointmentsData();
  }, []);

  // Refetch after payment callback
  useEffect(() => {
    if (localStorage.getItem("appointments_refetch") === "1") {
      getAppointmentsData();
      localStorage.removeItem("appointments_refetch");
    }
  }, []);

  // Render loading or error
  if (loading) return <Loader />;
  if (error) return <Error errMessage={error.message} />;

  return (
    <section className="bg-slate-50 dark:bg-slate-900 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-[1170px] px-5 mx-auto">

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-8">

          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sticky top-24">
              <Tabs tab={tab} setTab={setTab} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">

            {/* Approval Notice */}
            {data?.isApproved === "pending" && (
              <div className="flex items-start gap-4 p-4 mb-6 text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-xl shadow-sm">
                <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600" />
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Approval Pending</h4>
                  <p className="text-sm font-medium opacity-90">
                    To get approval, please complete your profile. We&apos;ll review and approve within 2 days.
                  </p>
                </div>
              </div>
            )}

            {/* Content Container */}
            <div className={`${tab !== 'settings' ? 'bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8' : ''}`}>

              {/* ======================= */}
              {/* OVERVIEW TAB */}
              {/* ======================= */}
              {tab === "overview" && data && (
                <div>
                  {/* Header Profile Card */}
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 pb-8 border-b border-slate-100 dark:border-slate-700">
                    {/* Profile Image */}
                    <figure className="w-32 h-32 md:w-40 md:h-40 shrink-0 relative">
                      <img
                        src={data?.profilePicture?.url || "/placeholder.jpg"}
                        alt="Profile Picture"
                        className="w-full h-full object-cover rounded-2xl shadow-md border-4 border-white"
                      />
                      {/* Optional: Add a verification badge if approved */}
                      {data?.isApproved === "approved" && (
                        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-sm" title="Verified">
                          <CheckCircle2 size={16} strokeWidth={3} />
                        </div>
                      )}
                    </figure>

                    {/* Profile Details */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider mb-3">
                        {data?.specialization || "No specialization"}
                      </div>

                      <h3 className="text-3xl font-black text-slate-900 dark:text-gray-100 mb-2">
                        {data?.name || "Loading..."}
                      </h3>

                      <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                        <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-100">
                          <img src={starIcon} alt="star" className="w-4 h-4" />
                          <span className="text-slate-900 font-bold text-sm">{data.averageRating}</span>
                        </div>
                        <span className="text-slate-500 dark:text-gray-400 text-sm font-medium">
                          ({data.totalRating} reviews)
                        </span>
                      </div>

                      <p className="text-slate-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto md:mx-0 font-medium">
                        {data?.bio || "No bio available"}
                      </p>
                    </div>
                  </div>

                  <BarberAbout
                    name={data?.name}
                    about={data?.about}
                    achievements={data?.achievements}
                    experience={data?.experience}
                  />
                </div>
              )}

              {/* ======================= */}
              {/* APPOINTMENTS TAB */}
              {/* ======================= */}
              {tab === "appointments" && (
                <div>
                  {appointments.length > 0 ? (
                    <Appointments appointments={appointments} refreshAppointments={getAppointmentsData} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                        <Calendar className="text-slate-400 w-8 h-8" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 mb-2">No Appointments Yet</h2>
                      <p className="text-slate-500 max-w-sm">
                        You have not made any appointments. Once clients book, they will appear here.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ======================= */}
              {/* SETTINGS TAB */}
              {/* ======================= */}
              {/* Wrapper to handle Profile's internal styling */}
              {tab === "settings" && (
                <div className="-m-4 sm:-m-6 lg:-m-8">
                  <Profile barberData={data} />
                </div>
              )}

              {/* ======================= */}
              {/* SERVICES TAB */}
              {/* ======================= */}
              {tab === "services" && <Service barberData={data} />}

              {/* ======================= */}
              {/* GALLERY UPLOAD TAB */}
              {/* ======================= */}
              {tab === "galleryupload" && (
                <GalleryUpload providerId={JSON.parse(localStorage.getItem("user"))?._id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;