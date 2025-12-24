import { Info, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GuestInfoBanner = ({ message = "Login to book services and leave reviews" }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center">
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                    {message}
                </p>
            </div>
            <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex-shrink-0"
            >
                <LogIn size={16} />
                Login
            </button>
        </div>
    );
};

export default GuestInfoBanner;
