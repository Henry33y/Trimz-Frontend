/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Calendar, Clock, MapPin, Scissors, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';

const Appointments = ({ appointments, refreshAppointments }) => {
    const [cancellingId, setCancellingId] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const handleCancelClick = (appointment) => {
        setSelectedAppointment(appointment);
        setShowCancelModal(true);
    };

    const handleCancelConfirm = async () => {
        if (!selectedAppointment) return;

        setCancellingId(selectedAppointment._id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/appointments/${selectedAppointment._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: 'cancelled' }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to cancel appointment');
            }

            toast.success('Appointment cancelled successfully');
            setShowCancelModal(false);
            setSelectedAppointment(null);

            // Refresh appointments list
            if (refreshAppointments) {
                refreshAppointments();
            }
        } catch (err) {
            console.error('Cancel error:', err);
            toast.error(err.message || 'Failed to cancel appointment');
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            case 'confirmed':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'completed':
                return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            case 'cancelled':
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
            default:
                return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
        }
    };

    const canCancel = (appointment) => {
        const status = appointment.status?.toLowerCase();
        return status === 'pending' || status === 'confirmed';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        try {
            const date = new Date(timeString);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return timeString;
        }
    };

    return (
        <>
            <div className="space-y-4">
                {appointments.map((appointment) => (
                    <div
                        key={appointment._id}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-all"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Left Section: Provider Info */}
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shrink-0">
                                    {appointment.provider?.name?.charAt(0) || 'P'}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-1">
                                        {appointment.provider?.name || 'Provider'}
                                    </h4>

                                    {/* Services */}
                                    {appointment.providerServices && appointment.providerServices.length > 0 && (
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <Scissors className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-600 dark:text-gray-300">
                                                {appointment.providerServices.map(s => s.name || s).join(', ')}
                                            </span>
                                        </div>
                                    )}

                                    {/* Date & Time */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500 dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(appointment.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatTime(appointment.startTime)}</span>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    {appointment.provider?.location && (
                                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 dark:text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                            <span>{appointment.provider.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Section: Status & Actions */}
                            <div className="flex flex-col items-end gap-3">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(appointment.status)}`}>
                                    {appointment.status}
                                </span>

                                {/* Price */}
                                {appointment.totalPrice && (
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 dark:text-gray-400">Total</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-gray-100">
                                            GH₵{appointment.totalPrice}
                                        </p>
                                    </div>
                                )}

                                {/* Cancel Button */}
                                {canCancel(appointment) && (
                                    <button
                                        onClick={() => handleCancelClick(appointment)}
                                        disabled={cancellingId === appointment._id}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <X size={16} />
                                        {cancellingId === appointment._id ? 'Cancelling...' : 'Cancel Booking'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 text-center mb-3">
                            Cancel Appointment?
                        </h3>

                        <p className="text-slate-600 dark:text-gray-300 text-center mb-6">
                            Are you sure you want to cancel your appointment with{' '}
                            <span className="font-bold text-slate-900 dark:text-gray-100">
                                {selectedAppointment.provider?.name}
                            </span>{' '}
                            on{' '}
                            <span className="font-bold text-slate-900 dark:text-gray-100">
                                {formatDate(selectedAppointment.date)}
                            </span>
                            ?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setSelectedAppointment(null);
                                }}
                                disabled={cancellingId}
                                className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-gray-100 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                            >
                                Keep Appointment
                            </button>
                            <button
                                onClick={handleCancelConfirm}
                                disabled={cancellingId}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {cancellingId ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    <>
                                        <X size={18} />
                                        Yes, Cancel
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Appointments;
