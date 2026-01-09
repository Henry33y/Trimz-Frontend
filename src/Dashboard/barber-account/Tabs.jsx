/* eslint-disable react/prop-types */
import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';
import {
    LayoutGrid,
    Calendar,
    User,
    Scissors,
    Image as ImageIcon,
    Menu,
    LogOut,
    Trash2,
    ChevronRight,
    CreditCard
} from 'lucide-react';
import DeleteAccountModal from '../../components/DeleteAccountModal';

const Tabs = ({ tab, setTab }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const { dispatch, token } = useContext(AuthContext);
    const navigate = useNavigate();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update menu position when opened
    useEffect(() => {
        if (isMenuOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + 12,
                left: rect.left,
                width: rect.width
            });
        }
    }, [isMenuOpen]);

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/login');
    };

    const handleTabClick = (tabName) => {
        setTab(tabName);
        setIsMenuOpen(false);
    };

    const handleDeleteAccount = async () => {
        try {
            const res = await fetch(`${BASE_URL}/users/account`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error('Failed to delete account');

            toast.success('Account deleted successfully');
            setIsDeleteModalOpen(false);

            // Logout and redirect
            setTimeout(() => {
                dispatch({ type: 'LOGOUT' });
                navigate('/login', { replace: true });
            }, 1000);
        } catch (err) {
            console.error('Error deleting account:', err);
            toast.error('Failed to delete account');
        }
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutGrid },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'settings', label: 'Profile Settings', icon: User },
        { id: 'services', label: 'Services', icon: Scissors },
        { id: 'galleryupload', label: 'Gallery', icon: ImageIcon },
        { id: 'payouts', label: 'Payouts', icon: CreditCard },
    ];

    return (
        <div className="relative z-[9999]" ref={menuRef}>
            {/* Mobile Menu Button */}
            <div className='lg:hidden bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-2' ref={buttonRef}>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 text-slate-700 dark:text-gray-300 font-bold transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl group"
                >
                    <span className="flex items-center gap-3">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                            <Menu className='w-5 h-5 text-slate-600 dark:text-gray-400' />
                        </div>
                        <span className="text-sm font-bold">Dashboard Menu</span>
                    </span>
                    <span className="text-xs font-semibold bg-slate-900 dark:bg-slate-700 text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm shadow-slate-900/20">
                        {menuItems.find(item => item.id === tab)?.label || 'Select'}
                    </span>
                </button>
            </div>

            {/* Mobile Menu Dropdown - Rendered with Portal */}
            {isMenuOpen && createPortal(
                <div
                    ref={menuRef}
                    className='lg:hidden fixed bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transform origin-top animate-in fade-in slide-in-from-top-2 duration-200 z-[99999]'
                    style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                        width: `${menuPosition.width}px`
                    }}
                >
                    <div className="p-2 space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={`
                                    w-full px-4 py-3.5 rounded-xl text-left transition-all duration-200
                                    flex items-center justify-between text-sm font-bold group
                                    ${tab === item.id
                                        ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-md shadow-slate-900/20'
                                        : 'text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-gray-100'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} className={tab === item.id ? 'text-white' : 'text-slate-400 dark:text-gray-500 group-hover:text-slate-600 dark:group-hover:text-gray-300'} />
                                    {item.label}
                                </div>
                                {tab === item.id && <ChevronRight size={16} />}
                            </button>
                        ))}
                    </div>

                    <div className="p-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 space-y-1">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 rounded-xl text-left transition-all duration-200 flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-gray-100 hover:shadow-sm"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="w-full px-4 py-3 rounded-xl text-left transition-all duration-200 flex items-center gap-3 text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <Trash2 size={18} />
                            Delete Account
                        </button>
                    </div>
                </div>,
                document.body
            )}

            {/* Desktop Menu */}
            <div className='hidden lg:block'>
                <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-24'>
                    <div className="p-3 space-y-1.5">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setTab(item.id)}
                                className={`
                                    w-full px-4 py-3.5 rounded-xl text-left transition-all duration-200
                                    flex items-center justify-between text-sm font-bold group
                                    ${tab === item.id
                                        ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-md shadow-slate-900/20 translate-x-1'
                                        : 'text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-gray-100 hover:translate-x-1'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} className={`transition-colors ${tab === item.id ? 'text-white' : 'text-slate-400 dark:text-gray-500 group-hover:text-slate-900 dark:group-hover:text-gray-100'}`} />
                                    {item.label}
                                </div>
                                {tab === item.id && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-3 mt-2 border-t border-slate-100 dark:border-slate-700 space-y-1">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 rounded-xl text-left transition-all duration-200
                            flex items-center gap-3 text-sm font-bold text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-gray-100 group"
                        >
                            <LogOut size={18} className="text-slate-400 dark:text-gray-500 group-hover:text-slate-900 dark:group-hover:text-gray-100 transition-colors" />
                            Logout
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="w-full px-4 py-3 rounded-xl text-left transition-all duration-200
                            flex items-center gap-3 text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 group"
                        >
                            <Trash2 size={18} className="text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                userType="provider account"
            />
        </div>
    );
};

export default Tabs;