import Loader from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import { BASE_URL } from "../../config";
import { useEffect, useState } from "react";
import Appointments from "./Appointment";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    const url = `${BASE_URL}appointments/user`;

    // Check if URL is valid
    if (!url || url.includes("undefined")) {
      setLoading(false);
      setError({ message: "Invalid URL provided." });
      return;
    }

    try {
        const storedToken = localStorage.getItem('token');
        // Basic guard: ensure we don't send invalid or missing token strings like 'null' or 'undefined'
        const tokenToSend = storedToken && typeof storedToken === 'string' && storedToken.split('.').length === 3 ? storedToken : null;

        const response = await fetch(url, {
          method: "GET",
          headers: tokenToSend ? { Authorization: `Bearer ${tokenToSend}` } : {},
        });

      // Parse the response once
      const result = await response.json();
      console.log("Fetched result:", result);

      if (!response.ok) {
        const errorMessage = result?.message || `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Normalize the data:
      // If result.data exists and is an array, use it;
      // otherwise, if result itself is an array, use that;
      // else, default to an empty array.
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

  // If coming back from payment callback, ensure a fresh fetch then clear the flag
  useEffect(() => {
    const flag = localStorage.getItem('appointments_refetch');
    if (flag === '1') {
      fetchAppointments();
      localStorage.removeItem('appointments_refetch');
    }
  }, []);

  // Determine if there are no appointments
  const isNoAppointments =
    !loading &&
    (!appointments || (Array.isArray(appointments) && appointments.length === 0));

  return (
    <div>
      {loading && !error && <Loader />}

      {error && !loading && <Error errMessage={error.message} />}

      {!loading && !error && appointments.length > 0 && (
        <div className="">
          <Appointments appointments={appointments} refreshAppointments={fetchAppointments} />
        </div>
      )}

      {!loading && !error && isNoAppointments && (
        <h2 className="mt-5 text-center leading-7 text-[20px] font-semibold text-primaryColor">
          You have not made any appointments
        </h2>
      )}
    </div>
  );
};

export default MyAppointments;