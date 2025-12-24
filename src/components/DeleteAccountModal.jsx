import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, userType = "account" }) => {
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirmText !== 'DELETE') return;

        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
            setConfirmText('');
        }
    };

    const handleClose = () => {
        setConfirmText('');
        onClose();
    };

    if (!isOpen) return null;

    const isConfirmValid = confirmText === 'DELETE';

    const modalContent = (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={handleClose}>
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Delete Account</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        disabled={isDeleting}
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
                            ⚠️ This action cannot be undone
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-400">
                            Permanently deleting your {userType} will:
                        </p>
                    </div>

                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>Cancel all pending appointments</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>Remove your profile and all associated data</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>Delete all your reviews and ratings</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>Lose access to your account permanently</span>
                        </li>
                    </ul>

                    <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Type <span className="font-bold text-red-600 dark:text-red-400">DELETE</span> to confirm:
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Type DELETE here"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-slate-700 dark:text-white transition-all"
                            disabled={isDeleting}
                            autoComplete="off"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 bg-gray-50 dark:bg-slate-900 rounded-b-2xl">
                    <button
                        onClick={handleClose}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={!isConfirmValid || isDeleting}
                        className={`flex-1 px-4 py-3 font-bold rounded-lg transition-all ${isConfirmValid && !isDeleting
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30'
                                : 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </button>
                </div>
            </div>
        </div>
    );

    // Render modal at document.body level using Portal
    return createPortal(modalContent, document.body);
};

export default DeleteAccountModal;
