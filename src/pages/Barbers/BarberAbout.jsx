/* eslint-disable react/prop-types */
// import { formateDate } from '../../utils/formateDate'; // UNCOMMENT IN PRODUCTION
import { Award, Briefcase, User } from 'lucide-react';

// MOCK HELPER FOR PREVIEW (Remove this when using in your project)
const formateDate = (date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const BarberAbout = ({ name, about, achievements, experience }) => {
  return (
    <div className="space-y-12">
      {/* About Section */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <User size={20} />
          </div>
          About <span className="text-blue-600 dark:text-blue-400">{name}</span>
        </h3>
        <p className="text-slate-600 dark:text-gray-300 leading-relaxed text-base font-medium">
          {about || "No bio available."}
        </p>
      </div>

      {/* Achievements Section */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
            <Award size={20} />
          </div>
          Achievements
        </h3>

        {achievements && achievements.length > 0 ? (
          <ul className="space-y-4">
            {achievements.map((item, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600 hover:border-yellow-200 dark:hover:border-yellow-500 transition-colors group"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 dark:text-gray-100 text-base mb-1 group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    {/* Add description if available in item object, otherwise keep title prominent */}
                    {item.description || "Award & Recognition"}
                  </p>
                </div>
                <span className="mt-2 sm:mt-0 px-3 py-1 bg-white text-yellow-700 text-xs font-bold rounded-full shadow-sm border border-slate-100">
                  {formateDate(item.date)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 dark:text-gray-500 italic text-sm">No achievements listed yet.</p>
        )}
      </div>

      {/* Experience Section */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
            <Briefcase size={20} />
          </div>
          Experience
        </h3>

        {experience && experience.length > 0 ? (
          <ul className="grid sm:grid-cols-2 gap-6">
            {experience.map((item, index) => (
              <li
                key={index}
                className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-dark-md transition-all hover:-translate-y-1 relative overflow-hidden group"
              >
                {/* Decorative Accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <span className="inline-block px-2.5 py-1 mb-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                  {formateDate(item.startingDate)} - {formateDate(item.endingDate)}
                </span>

                <h4 className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-1">
                  {item.role}
                </h4>

                <p className="text-sm font-semibold text-slate-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                  at <span className="text-slate-700 dark:text-gray-300">{item.workplace}</span>
                </p>

                <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-3 mt-1">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 dark:text-gray-500 italic text-sm">No experience listed yet.</p>
        )}
      </div>
    </div>
  );
};

export default BarberAbout;