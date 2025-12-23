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

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { data, loading, error } = useGetProfile(`${BASE_URL}users/${user._id}`);
  const [tab, setTab] = useState("overview");
  const [appointments, setAppointments] = useState([]);

  // Fetch provider appointments
  const getAppointmentsData = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return setAppointments([]);

    const response = await fetch(`${BASE_URL}appointments/provider`, {
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
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        <div className="grid lg:grid-cols-3 gap-[30px] lg:gap-[50px]">
          <Tabs tab={tab} setTab={setTab} />

          <div className="lg:col-span-2">
            {/* Approval notice */}
            {data?.isApproved === "pending" && (
              <div className="flex p-4 mb-4 text-red-800 bg-red-400 rounded-lg">
                <span role="img" aria-label="alert" className="mr-2">
                  ⚠️
                </span>
                <div className="text-sm font-medium">
                  To get approval, please complete your profile. We&apos;ll review and approve within 2 days.
                </div>
              </div>
            )}

            {/* Overview Tab */}
            {tab === "overview" && (
              <div>
                <div className="flex items-center gap-4 mb-10">
                  <figure className="w-[200px] h-[200px]">
                    <img
                      src={data?.profilePicture?.url || "/placeholder.jpg"}
                      alt="Profile Picture"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </figure>

                  <div>
                    <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-4 lg:py-2 lg:px-6 rounded text-[12px] leading-4 lg:text-[16px] lg:leading-6 font-semibold">
                      {data.specialization}
                    </span>

                    <h3 className="text-[22px] leading-9 font-bold text-headingColor mt-3">
                      {data.name}
                    </h3>

                    <div className="flex items-center gap-[6px]">
                      <span className="flex items-center gap-[6px] text-headingColor text-[14px] leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                        <img src={starIcon} alt="star" />
                        {data.averageRating}
                      </span>
                      <span className="text-textColor text-[14px] leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                        ({data.totalRating})
                      </span>
                    </div>

                    <p className="text__para font-[15px] lg:max-w-[390px] leading-6">{data?.bio}</p>
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

            {/* Appointments Tab */}
            {tab === "appointments" && (
              appointments.length > 0 ? (
                <Appointments appointments={appointments} refreshAppointments={getAppointmentsData} />
              ) : (
                <h2 className="mt-5 text-center text-primaryColor text-lg font-semibold">
                  You have not made any appointments
                </h2>
              )
            )}

            {/* Settings Tab */}
            {tab === "settings" && <Profile barberData={data} />}

            {/* Services Tab */}
            {tab === "services" && <Service barberData={data} />}

            {/* Gallery Upload Tab */}
            {tab === "galleryupload" && (
              <GalleryUpload providerId={JSON.parse(localStorage.getItem("user"))._id} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
