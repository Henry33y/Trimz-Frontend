/* eslint-disable react/prop-types */
import { useState } from "react";
import { toast } from "react-toastify";
// import { formateDate } from "../../utils/formateDate"; // UNCOMMENT IN PRODUCTION
// import { BASE_URL } from "../../config"; // UNCOMMENT IN PRODUCTION
// import { initAppointmentPayment, redirectToPaystack } from "../../utils/paystack"; // UNCOMMENT IN PRODUCTION
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Trash2, 
  Edit2, 
  X, 
  CheckCircle, 
  MoreVertical,
  Mail,
  Scissors,
  User
} from "lucide-react";

// ==========================================
// PREVIEW HELPERS (Remove/Comment out in production and use real imports)
// ==========================================
const BASE_URL = "http://localhost:5000/api/v1/";
const formateDate = (date) => {
  try {
    return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch (e) {
    return date;
  }
};
const initAppointmentPayment = async () => ({ authorization_url: '#' });
const redirectToPaystack = () => {};
// ==========================================

const Appointments = ({ appointments = [], refreshAppointments }) => {
  // Safe guard: Ensure appointments is strictly an array
  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  // Local state to track which appointment is being edited
  const [editingAppointment, setEditingAppointment] = useState(null);
  // Local state for the form data in the edit modal
  const [editFormData, setEditFormData] = useState({});
  // Local state for dropdown in mobile view
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Handler to open the modal and populate the form with the appointment’s data
  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setEditFormData({
      date: appointment.date, 
      startTime: appointment.startTime, 
      status: appointment.status,
      paymentStatus: appointment.paymentStatus,
    });
    setActiveDropdown(null);
  };

  // Handler for input changes inside the modal
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler to send the PATCH request to update the appointment
  const handleUpdateAppointment = async () => {
    try {
      const jwt = localStorage.getItem("token");
      const formattedTime =
        editFormData.date.split("T")[0] +
        "T" +
        editFormData.startTime +
        ":00.000Z";
      
      const updatedData = {
        date: editFormData.date,
        startTime: new Date(formattedTime),
      };

      const res = await fetch(
        `${BASE_URL}appointments/${editingAppointment._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      toast.success("Appointment updated successfully");
      setEditingAppointment(null);
      if (refreshAppointments) refreshAppointments();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handler to send a DELETE request for an appointment
  const handleDelete = async (appointmentId) => {
    if(!window.confirm("Are you sure you want to delete this appointment?")) return;
    
    try {
      const jwt = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}appointments/${appointmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      toast.success("Appointment deleted successfully");
      if (refreshAppointments) refreshAppointments();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Close the modal without updating
  const closeModal = () => {
    setEditingAppointment(null);
  };

  const handlePayNow = async (appointmentId) => {
    try {
      const jwt = localStorage.getItem("token");
      const { authorization_url } = await initAppointmentPayment({ appointmentId, token: jwt });
      redirectToPaystack(authorization_url);
    } catch (err) {
      toast.error(err.message || "Unable to start payment");
    }
  };

  // Helper to get status badge styles
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Appointments</h2>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
          {safeAppointments.length} Total
        </span>
      </div>

      {/* ==================== */}
      {/* DESKTOP TABLE VIEW   */}
      {/* ==================== */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {safeAppointments.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Provider Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.provider?.profilePicture?.url || "/placeholder.jpg"}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        alt={item.provider?.name || "Provider"}
                        onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
                      />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {item.provider?.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.provider?.email || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <Calendar size={14} className="text-gray-400" />
                        {formateDate(item.date)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={14} className="text-gray-400" />
                        {new Date(item.startTime).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </td>

                  {/* Services */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <Scissors size={14} className="text-gray-400 mt-0.5" />
                      <div className="text-sm text-gray-600 max-w-[150px] truncate">
                        {Array.isArray(item.providerServices)
                          ? item.providerServices.map((i) => i.name).join(", ")
                          : "N/A"}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-2">
                      {item.paymentStatus === "paid" ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100">
                          <CheckCircle size={12} /> Paid
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePayNow(item._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <CreditCard size={12} /> Pay Now
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Appointment"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Appointment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== */}
      {/* MOBILE CARD VIEW     */}
      {/* ==================== */}
      <div className="md:hidden space-y-4">
        {safeAppointments.map((item) => (
          <div key={item._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 relative">
            
            {/* Mobile Header: Provider & Actions */}
            <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={item.provider?.profilePicture?.url || "/placeholder.jpg"}
                  className="w-12 h-12 rounded-full object-cover border border-gray-100"
                  alt=""
                  onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
                />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {item.provider?.name || "Provider"}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Mail size={10} />
                    {item.provider?.email || "No email"}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setActiveDropdown(activeDropdown === item._id ? null : item._id)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"
              >
                <MoreVertical size={20} />
              </button>
              
              {/* Mobile Dropdown Menu */}
              {activeDropdown === item._id && (
                <div className="absolute right-4 top-14 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Body: Details */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase">Date</p>
                <div className="flex items-center gap-2 font-medium text-gray-700">
                  <Calendar size={14} /> {formateDate(item.date)}
                </div>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs font-bold text-gray-400 uppercase">Time</p>
                <div className="flex items-center justify-end gap-2 font-medium text-gray-700">
                  <Clock size={14} /> 
                  {new Date(item.startTime).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="col-span-2 bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-2">
                <Scissors size={14} className="text-gray-400" />
                <span className="text-gray-600 text-xs font-medium">
                  {Array.isArray(item.providerServices)
                    ? item.providerServices.map((i) => i.name).join(", ")
                    : "No services listed"}
                </span>
              </div>
            </div>

            {/* Mobile Footer: Status & Payment */}
            <div className="flex items-center justify-between pt-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase ${getStatusStyle(item.status)}`}>
                {item.status}
              </span>

              {item.paymentStatus === "paid" ? (
                <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                  <CheckCircle size={14} /> Paid
                </span>
              ) : (
                <button
                  onClick={() => handlePayNow(item._id)}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-transform"
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {safeAppointments.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No appointments found</h3>
          <p className="text-gray-500 text-sm">Your booked appointments will appear here.</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Edit2 size={18} className="text-blue-600" />
                Reschedule Appointment
              </h2>
              <button 
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">New Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="date"
                    value={
                      editFormData.date
                        ? new Date(editFormData.date).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={handleEditChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">New Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="time"
                    name="startTime"
                    value={
                      editFormData.startTime
                        ? editFormData.startTime.includes("T")
                          ? new Date(editFormData.startTime).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : editFormData.startTime
                        : ""
                    }
                    onChange={handleEditChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAppointment}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;