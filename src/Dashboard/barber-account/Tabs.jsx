/* eslint-disable react/prop-types */
import { useContext, useState, useEffect, useRef, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext'; // UNCOMMENT FOR PRODUCTION
import { 
  LayoutGrid, 
  Calendar, 
  User, 
  Scissors, 
  Image as ImageIcon, 
  Menu, 
  LogOut, 
  Trash2,
  ChevronRight
} from 'lucide-react';

// TEMPORARY MOCK FOR PREVIEW (Remove this and uncomment the import above in your project)
const AuthContext = createContext({ dispatch: () => {} });

const Tabs = ({ tab, setTab }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/login');
    };

    const handleTabClick = (tabName) => {
        setTab(tabName);
        setIsMenuOpen(false);
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutGrid },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'settings', label: 'Profile Settings', icon: User },
        { id: 'services', label: 'Services', icon: Scissors },
        { id: 'galleryupload', label: 'Gallery', icon: ImageIcon },
    ];

    return (
        <div className="relative z-50" ref={menuRef}>
            {/* Mobile Menu Button */}
            <div className='lg:hidden bg-white rounded-2xl shadow-sm border border-slate-200 p-2'>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 text-slate-700 font-bold transition-colors hover:bg-slate-50 rounded-xl group"
                >
                    <span className="flex items-center gap-3">
                        <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                            <Menu className='w-5 h-5 text-slate-600' />
                        </div>
                        <span className="text-sm font-bold">Dashboard Menu</span>
                    </span>
                    <span className="text-xs font-semibold bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm shadow-slate-900/20">
                        {menuItems.find(item => item.id === tab)?.label || 'Select'}
                    </span>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className='lg:hidden absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transform origin-top animate-in fade-in slide-in-from-top-2 duration-200'>
                    <div className="p-2 space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={`
                                    w-full px-4 py-3.5 rounded-xl text-left transition-all duration-200
                                    flex items-center justify-between text-sm font-bold group
                                    ${tab === item.id 
                                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} className={tab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                                    {item.label}
                                </div>
                                {tab === item.id && <ChevronRight size={16} />}
                            </button>
                        ))}
                    </div>
                    
                    <div className="p-2 border-t border-slate-100 bg-slate-50/50 space-y-1">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 rounded-xl text-left transition-all duration-200 flex items-center gap-3 text-sm font-bold text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                        <button 
                            className="w-full px-4 py-3 rounded-xl text-left transition-all duration-200 flex items-center gap-3 text-sm font-bold text-red-500 hover:bg-red-50"
                        >
                            <Trash2 size={18} />
                            Delete Account
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop Menu */}
            <div className='hidden lg:block'>
                <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24'>
                    <div className="p-3 space-y-1.5">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setTab(item.id)}
                                className={`
                                    w-full px-4 py-3.5 rounded-xl text-left transition-all duration-200
                                    flex items-center justify-between text-sm font-bold group
                                    ${tab === item.id 
                                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 translate-x-1' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} className={`transition-colors ${tab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
                                    {item.label}
                                </div>
                                {tab === item.id && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-3 mt-2 border-t border-slate-100 space-y-1">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 rounded-xl text-left transition-all duration-200
                            flex items-center gap-3 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900 group"
                        >
                            <LogOut size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                            Logout
                        </button>
                        <button 
                            className="w-full px-4 py-3 rounded-xl text-left transition-all duration-200
                            flex items-center gap-3 text-sm font-bold text-red-500 hover:bg-red-50 group"
                        >
                            <Trash2 size={18} className="text-red-400 group-hover:text-red-600 transition-colors" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tabs;