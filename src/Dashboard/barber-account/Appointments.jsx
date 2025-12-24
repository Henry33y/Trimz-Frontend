/* eslint-disable react/prop-types */
// import { formateDate } from "../../utils/formateDate"; // UNCOMMENT IN PRODUCTION
// import { BASE_URL } from "../../config"; // UNCOMMENT IN PRODUCTION
import { useState } from "react";
import { toast } from "react-toastify";
import { 
  Calendar, 
  Clock, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Phone,
  Mail,
  User,
  Scissors
} from "lucide-react";

// MOCK CONSTANTS FOR PREVIEW (Remove these when using in your project)
const BASE_URL = "http://localhost:5000/api/v1/";
const formateDate = (date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const Appointments = ({ appointments, refreshAppointments }) => {
  // State to track which appointment's dropdown is open
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  // Function to update appointment status or paymentStatus
  const updateAppointmentStatus = async (appointmentId, updateFields) => {
    try {
      const jwt = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(updateFields),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      toast.success("Appointment updated successfully");
      if (refreshAppointments) refreshAppointments();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handler for cancel action
  const handleCancel = (appointmentId) => {
    updateAppointmentStatus(appointmentId, { status: "cancelled" });
    setDropdownOpenId(null);
  };

  // Handler for complete action
  const handleComplete = (appointmentId) => {
    updateAppointmentStatus(appointmentId, { status: "completed" });
    setDropdownOpenId(null);
  };

  // Handler for marking payment as paid
  const handleMarkAsPaid = (appointmentId) => {
    updateAppointmentStatus(appointmentId, { paymentStatus: "paid" });
    setDropdownOpenId(null);
  };

  // Toggle dropdown for a specific appointment
  const toggleDropdown = (appointmentId) => {
    setDropdownOpenId((prevId) => (prevId === appointmentId ? null : appointmentId));
  };

  // Helper to get status badge styles
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Appointments</h2>
        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-semibold">
          {appointments?.length || 0} Total
        </span>
      </div>

      {/* ==================== */}
      {/* DESKTOP TABLE VIEW   */}
      {/* ==================== */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Payment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments?.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                  {/* Client Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={item.customer.profilePicture?.url || "/default-profile.png"}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          alt="Client"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{item.customer.name}</div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <Mail size={12} /> {item.customer.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <Phone size={12} /> {item.customer.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Schedule Column */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        <Calendar size={14} className="text-slate-400" />
                        {formateDate(item.date)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock size={14} className="text-slate-400" />
                        {(new Date(item.startTime)).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} ({item.duration} mins)
                      </div>
                    </div>
                  </td>

                  {/* Services Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <Scissors size={14} className="text-slate-400 mt-1 shrink-0" />
                      <div className="text-sm text-slate-600 font-medium">
                        {item.providerServices.map((i) => i.name).join(", ")}
                      </div>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(item.status)} uppercase tracking-wide`}>
                      {item.status}
                    </span>
                  </td>

                  {/* Payment Column */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-bold text-slate-900">${item.totalPrice}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        item.paymentStatus === "paid" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}>
                        {item.paymentStatus === "paid" ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {item.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 text-center relative">
                    <button
                      onClick={() => toggleDropdown(item._id)}
                      className={`p-2 rounded-lg transition-all ${
                        dropdownOpenId === item._id 
                          ? 'bg-slate-200 text-slate-900' 
                          : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                      }`}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpenId === item._id && (
                      <div className="absolute right-0 top-12 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        {item.status !== "cancelled" && item.status !== "completed" && (
                          <button
                            onClick={() => handleComplete(item._id)}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                          >
                            <CheckCircle2 size={16} /> Complete
                          </button>
                        )}
                        
                        {item.paymentStatus !== "paid" && (
                          <button
                            onClick={() => handleMarkAsPaid(item._id)}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                          >
                            <DollarSign size={16} /> Mark as Paid
                          </button>
                        )}

                        {item.status !== "cancelled" && item.status !== "completed" && (
                          <button
                            onClick={() => handleCancel(item._id)}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-50"
                          >
                            <XCircle size={16} /> Cancel
                          </button>
                        )}
                      </div>
                    )}
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
        {appointments?.map((item) => (
          <div key={item._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
             {/* Status Bar */}
             <div className={`absolute top-0 left-0 w-1.5 h-full ${
                item.status === 'completed' ? 'bg-emerald-500' : 
                item.status === 'cancelled' ? 'bg-rose-500' : 'bg-amber-500'
             }`}></div>

            <div className="flex justify-between items-start mb-4 pl-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.customer.profilePicture?.url || "/default-profile.png"}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  alt="Client"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{item.customer.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(item.status)} uppercase tracking-wide`}>
                    {item.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleDropdown(item._id)}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-600"
              >
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Dropdown Mobile */}
            {dropdownOpenId === item._id && (
              <div className="bg-slate-50 rounded-xl p-2 mb-4 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 gap-1">
                   {item.status !== "cancelled" && item.status !== "completed" && (
                    <button onClick={() => handleComplete(item._id)} className="w-full py-2 px-3 text-sm font-bold text-emerald-700 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                      <CheckCircle2 size={16}/> Mark Complete
                    </button>
                   )}
                   {item.paymentStatus !== "paid" && (
                    <button onClick={() => handleMarkAsPaid(item._id)} className="w-full py-2 px-3 text-sm font-bold text-blue-700 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                      <DollarSign size={16}/> Mark Paid
                    </button>
                   )}
                   {item.status !== "cancelled" && item.status !== "completed" && (
                    <button onClick={() => handleCancel(item._id)} className="w-full py-2 px-3 text-sm font-bold text-rose-700 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                      <XCircle size={16}/> Cancel
                    </button>
                   )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pl-3 text-sm">
              <div className="col-span-2 flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
                <Scissors size={16} className="text-slate-400" />
                <span className="font-medium truncate">{item.providerServices.map((i) => i.name).join(", ")}</span>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Date & Time</p>
                <div className="flex items-center gap-2 font-medium text-slate-700">
                  <Calendar size={14} /> {formateDate(item.date)}
                </div>
                <div className="flex items-center gap-2 font-medium text-slate-700">
                   <Clock size={14} /> {(new Date(item.startTime)).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              <div className="space-y-1 text-right">
                <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
                <p className="text-xl font-black text-slate-900">${item.totalPrice}</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                  item.paymentStatus === "paid" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                    : "bg-rose-50 text-rose-700 border-rose-100"
                }`}>
                  {item.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center pl-3">
              <div className="flex gap-4">
                 <a href={`mailto:${item.customer.email}`} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
                    <Mail size={14}/> Email
                 </a>
                 <a href={`tel:${item.customer.phone}`} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
                    <Phone size={14}/> Call
                 </a>
              </div>
              <span className="text-xs font-bold text-slate-400">{item.duration} min session</span>
            </div>
          </div>
        ))}
      </div>

      {(!appointments || appointments.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Calendar className="text-slate-400 w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No appointments found</h3>
          <p className="text-slate-500 text-sm mt-1">When clients book with you, they'll appear here.</p>
        </div>
      )}
    </div>
  );
};

export default Appointments;