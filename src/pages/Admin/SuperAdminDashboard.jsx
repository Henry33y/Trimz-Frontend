import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Loader2, Users, Scissors, Calendar,
    BarChart3, Activity, ShieldCheck,
    LayoutDashboard, Settings, LogOut,
    Search, Bell, ArrowUpRight, TrendingUp
} from 'lucide-react';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';

const SuperAdminDashboard = () => {
    const { user, token, role } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProviders: 0,
        totalAppointments: 0,
        activeSessions: 0
    });
    const [loading, setLoading] = useState(true);

    // Redirect if not superadmin
    useEffect(() => {
        if (!user || role !== 'superadmin') {
            toast.error('Developer Access Only');
            navigate('/login');
        }
    }, [user, role, navigate]);

    useEffect(() => {
        // Placeholder for fetching global system stats
        const fetchSystemStats = async () => {
            try {
                // In a real scenario, we'd have a /superadmin/stats endpoint
                // For now, let's simulate a premium developer feel
                setTimeout(() => {
                    setStats({
                        totalUsers: 1250,
                        totalProviders: 85,
                        totalAppointments: 3420,
                        activeSessions: 12
                    });
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error fetching system stats:', error);
                setLoading(false);
            }
        };

        fetchSystemStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login');
        toast.success('Developer session closed');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Initializing SuperAdmin Engine...</p>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, trend, color }) => (
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl hover:border-blue-500/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                        <TrendingUp size={14} />
                        {trend}
                    </div>
                )}
            </div>
            <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{title}</h3>
            <p className="text-3xl font-bold text-white mt-1">{value.toLocaleString()}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0b1120] text-slate-100 font-sans selection:bg-blue-500/30">
            {/* Sidebar (Optional/Inline for now) */}
            <div className="flex">
                {/* Main Content */}
                <main className="flex-1 p-6 md:p-10">
                    {/* Top Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-emerald-500 text-xs font-bold uppercase tracking-[0.2em]">System Online</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                SuperAdmin Portal
                            </h1>
                            <p className="text-slate-500 font-medium mt-1">
                                Developer: {user?.email} • High-Level Overview
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-800/40 p-2 rounded-2xl border border-slate-700/50">
                            <button className="p-2.5 text-slate-400 hover:text-white transition-colors relative">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 h-2 w-2 bg-blue-500 rounded-full"></span>
                            </button>
                            <div className="h-8 w-px bg-slate-700"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-red-400 hover:text-red-500 font-bold rounded-xl transition-all"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Exit Session</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard
                            title="Total Ecosystem Users"
                            value={stats.totalUsers}
                            icon={Users}
                            trend="+12%"
                            color="blue"
                        />
                        <StatCard
                            title="Active Professionals"
                            value={stats.totalProviders}
                            icon={Scissors}
                            trend="+4%"
                            color="purple"
                        />
                        <StatCard
                            title="Lifetime Journeys"
                            value={stats.totalAppointments}
                            icon={Calendar}
                            trend="+24%"
                            color="amber"
                        />
                        <StatCard
                            title="Current High-Load"
                            value={stats.activeSessions}
                            icon={Activity}
                            color="emerald"
                        />
                    </div>

                    {/* Management Sections */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Rapid Actions */}
                        <div className="xl:col-span-2 space-y-6">
                            <div className="bg-slate-800/30 border border-slate-700 rounded-3xl p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold flex items-center gap-3">
                                        <ShieldCheck className="text-blue-500" />
                                        System Management
                                    </h2>
                                    <button className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                                        View System Logs <ArrowUpRight size={14} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { title: 'User Database', desc: 'Manage all profiles and permissions', icon: Users },
                                        { title: 'Provider Audit', desc: 'Global review of barber status', icon: Scissors },
                                        { title: 'Revenue Engine', desc: 'Financial tracking and payouts', icon: BarChart3 },
                                        { title: 'Infrastructure', desc: 'Cloudinary & Database health', icon: Activity },
                                    ].map((action, i) => (
                                        <button key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-800/50 transition-all text-left group">
                                            <div className="p-3 rounded-xl bg-slate-800 text-slate-400 group-hover:text-blue-400 transition-colors">
                                                <action.icon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-200">{action.title}</h4>
                                                <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Side Panel: Developer Quick Links */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl p-8 h-full">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-400">
                                    <LogOut className="rotate-180" size={18} />
                                    Business Portals
                                </h3>
                                <div className="space-y-4">
                                    <button
                                        onClick={() => navigate('/admin/providers')}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LayoutDashboard size={18} className="text-slate-400" />
                                            <span className="font-bold text-sm">Owner Dashboard</span>
                                        </div>
                                        <ArrowUpRight size={16} className="text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </button>
                                    <p className="text-xs text-slate-500 px-2">
                                        Access the business owners portal to manage provider applications and site adjustments.
                                    </p>
                                </div>

                                <div className="mt-10 pt-10 border-t border-white/5">
                                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Core Systems</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['Production', 'V1.0.2', 'Node-25', 'MongoDB'].map(tag => (
                                            <span key={tag} className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-[10px] font-bold text-slate-400 uppercase">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
