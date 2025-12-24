/* eslint-disable react/prop-types */
import { Clock, CalendarDays } from 'lucide-react';

const SidePanel = ({ timeSlots }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 h-fit sticky top-8 transition-all duration-300">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100">
          Opening Hours
        </h3>
        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></span>
          Open
        </span>
      </div>

      {/* Time Slots List */}
      <div className="space-y-4">
        {timeSlots && timeSlots.length > 0 ? (
          timeSlots.map((slot, index) => (
            <div
              key={index}
              className="flex justify-between items-center group p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors -mx-2"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                  <CalendarDays size={18} />
                </div>
                <span className="font-bold text-slate-700 dark:text-gray-300 capitalize text-sm">
                  {slot.day}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-gray-100 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-600 group-hover:border-blue-100 dark:group-hover:border-blue-800 transition-colors">
                <Clock size={14} className="text-slate-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                {slot.startingTime} - {slot.endingTime}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-dashed border-slate-200 dark:border-slate-600">
            <Clock className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm font-medium">No slots available</p>
          </div>
        )}
      </div>

      {/* Footer / Call to Action (Commented out as per original) */}
      {/* <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex justify-between items-center mb-4">
           <span className="text-slate-500 text-sm font-medium">Service Fee</span>
           <span className="text-slate-900 font-bold text-lg">2 Cedis</span>
        </div>
        <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
          Book Appointment
        </button> 
      </div>
      */}
    </div>
  );
};

export default SidePanel;