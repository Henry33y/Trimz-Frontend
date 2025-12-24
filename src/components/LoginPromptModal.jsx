import { createPortal } from 'react-dom';
import { X, Lock, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPromptModal = ({ isOpen, onClose, action = "book this service" }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLogin = () => {
        onClose();
        navigate('/login');
    };

    const handleSignup = () => {
        onClose();
        navigate('/register');
    };

    const modalContent = (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Login Required</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-900 dark:text-blue-300">
                            Please <span className="font-semibold">login</span> or <span className="font-semibold">create an account</span> to {action}.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleLogin}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30"
                        >
                            <LogIn size={20} />
                            Login to Continue
                        </button>

                        <button
                            onClick={handleSignup}
                            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white py-3.5 px-4 rounded-xl font-bold transition-all"
                        >
                            <UserPlus size={20} />
                            Create Account
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-2 text-sm font-medium transition-colors"
                        >
                            Continue Browsing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default LoginPromptModal;
