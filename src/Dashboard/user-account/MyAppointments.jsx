import { useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import { Calendar, CalendarX, Loader2, AlertTriangle } from "lucide-react";
import Appointments from "./Appointments";

// ==========================================
// HELPER COMPONENTS
// ==========================================
const Loader = () => <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;
const Error = ({ errMessage }) => <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2"><AlertTriangle size={20} /> {errMessage}</div>;
// ==========================================

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    // Simulate fetch for preview (Remove this block in production)
    // if (true) {
    //     setTimeout(() => {
    //         // Toggle this to test empty state: []
    //         setAppointments([
    //             { _id: 1, barber: "David Wilson", date: "2023-11-15", status: "scheduled" },
    //             { _id: 2, barber: "Sarah Connor", date: "2023-11-20", status: "completed" }
    //         ]); 
    //         setLoading(false);
    //     }, 1000);
    //     return;
    // }

    // ORIGINAL LOGIC (Uncomment this block in production)

    const url = `${BASE_URL}/appointments/user`;

    if (!url || url.includes("undefined")) {
      setLoading(false);
      setError({ message: "Invalid URL provided." });
      return;
    }

    try {
      const storedToken = localStorage.getItem('token');
      const tokenToSend = storedToken && typeof storedToken === 'string' && storedToken.split('.').length === 3 ? storedToken : null;

      const response = await fetch(url, {
        method: "GET",
        headers: tokenToSend ? { Authorization: `Bearer ${tokenToSend}` } : {},
      });

      const result = await response.json();
      console.log("Fetched result:", result);

      if (!response.ok) {
        const errorMessage = result?.message || `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const fetchedAppointments = result.data && Array.isArray(result.data)
        ? result.data
        : Array.isArray(result)
          ? result
          : [];
      console.log("Appointments:", fetchedAppointments);
      setAppointments(fetchedAppointments);
    } catch (err) {
      setError({ message: err.message, stack: err.stack });
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const flag = localStorage.getItem('appointments_refetch');
    if (flag === '1') {
      fetchAppointments();
      localStorage.removeItem('appointments_refetch');
    }
  }, []);

  const isNoAppointments =
    !loading &&
    (!appointments || (Array.isArray(appointments) && appointments.length === 0));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 min-h-[60vh]">

      {/* Header */}
      {!loading && !error && (
        <div className="mb-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100 flex items-center gap-3">
              <div className="p-2 bg-slate-900 dark:bg-slate-700 rounded-lg text-white">
                <Calendar size={20} />
              </div>
              My Bookings
            </h2>
            <p className="text-slate-500 dark:text-gray-400 text-sm mt-1 ml-12">Manage and view your upcoming sessions</p>
          </div>
          <div className="hidden sm:block text-sm font-medium text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-slate-700 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-600">
            {appointments.length} Appointments
          </div>
        </div>
      )}

      {/* States */}
      {loading && !error && <Loader />}

      {error && !loading && <Error errMessage={error.message} />}

      {!loading && !error && appointments.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-600">
          <Appointments appointments={appointments} refreshAppointments={fetchAppointments} />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && isNoAppointments && (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <CalendarX className="text-slate-400 dark:text-gray-500 w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-2">
            No Appointments Yet
          </h2>
          <p className="text-slate-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
            You haven't booked any services yet. Find a professional and schedule your first appointment today.
          </p>
          {/* Optional Call to Action */}
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
            Find a Professional
          </button>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;