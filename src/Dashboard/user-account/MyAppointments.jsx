import { useEffect, useState } from "react";
// import Loader from "../../components/Loading/Loading"; // UNCOMMENT IN PRODUCTION
// import Error from "../../components/Error/Error"; // UNCOMMENT IN PRODUCTION
// import { BASE_URL } from "../../config"; // UNCOMMENT IN PRODUCTION
// import Appointments from "./Appointment"; // UNCOMMENT IN PRODUCTION
import { Calendar, CalendarX, Loader2, AlertTriangle } from "lucide-react";

// ==========================================
// MOCKS FOR PREVIEW (Remove/Comment out in production)
// ==========================================
const BASE_URL = "http://localhost:5000/api/v1/";
const Loader = () => <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;
const Error = ({ errMessage }) => <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2"><AlertTriangle size={20}/> {errMessage}</div>;
const Appointments = ({ appointments }) => (
  <div className="space-y-4">
    {appointments.map(app => (
      <div key={app._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-slate-900">Appointment with {app.barber}</h4>
            <p className="text-sm text-slate-500">{new Date(app.date).toDateString()}</p>
          </div>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold uppercase">{app.status}</span>
        </div>
      </div>
    ))}
  </div>
);
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
    
    const url = `${BASE_URL}appointments/user`;

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
        <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-white">
                        <Calendar size={20} />
                    </div>
                    My Bookings
                </h2>
                <p className="text-slate-500 text-sm mt-1 ml-12">Manage and view your upcoming sessions</p>
            </div>
            <div className="hidden sm:block text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                {appointments.length} Appointments
            </div>
        </div>
      )}

      {/* States */}
      {loading && !error && <Loader />}

      {error && !loading && <Error errMessage={error.message} />}

      {!loading && !error && appointments.length > 0 && (
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200">
          <Appointments appointments={appointments} refreshAppointments={fetchAppointments} />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && isNoAppointments && (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CalendarX className="text-slate-400 w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
                No Appointments Yet
            </h2>
            <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
                You haven't booked any services yet. Find a professional and schedule your first appointment today.
            </p>
            {/* Optional Call to Action */}
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                Find a Professional
            </button>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;