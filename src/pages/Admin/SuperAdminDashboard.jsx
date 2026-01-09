import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Loader2, Users, Scissors, Calendar,
    BarChart3, Activity, ShieldCheck,
    LayoutDashboard, Settings, LogOut,
    ArrowUpRight, Shield, UserPlus, Database,
    CheckCircle2, AlertCircle, RefreshCcw, Command,
    History, CreditCard, Layout
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
        pendingApprovals: 0,
        totalAdmins: 0,
        recentSignups: []
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Add Admin State
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const [addingAdmin, setAddingAdmin] = useState(false);

    // Redirect if not superadmin
    useEffect(() => {
        if (!user || role !== 'superadmin') {
            toast.error('Unauthorized access. SuperAdmin privileges required.');
            navigate('/login');
        }
    }, [user, role, navigate]);

    const fetchSystemStats = async () => {
        try {
            setRefreshing(true);
            const res = await fetch(`${BASE_URL}/admin/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch platform statistics: ${res.status} ${res.statusText}`);
            }

            const result = await res.json();
            setStats(result.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching system stats:', error);
            toast.error('Could not load real-time statistics');
            setLoading(false);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSystemStats();
    }, []);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setAddingAdmin(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/create-admin`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAdmin)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create administrative account');
            }

            toast.success('New administrator account created successfully!');
            setNewAdmin({ name: '', email: '', password: '' });
            setActiveTab('overview');
            fetchSystemStats(); // Refresh stats to show new admin count
        } catch (error) {
            console.error('Error creating admin:', error);
            toast.error(error.message || 'Error occurred while creating admin account');
        } finally {
            setAddingAdmin(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login');
        toast.success('Session closed successfully');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium tracking-wide">Loading platform data...</p>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color, delay }) => (
        <div
            className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] hover:border-blue-500/30 transition-all group relative overflow-hidden"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</h3>
            <p className="text-4xl font-black text-white mt-2 tabular-nums">
                {value.toLocaleString()}
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0b0f1a] text-slate-300 font-sans selection:bg-blue-500/30">
            <div className="flex flex-col lg:flex-row min-h-screen">

                {/* Side Navigation */}
                <aside className="w-full lg:w-72 bg-[#090d16] border-b lg:border-r border-white/5 p-8 lg:sticky lg:top-0 lg:h-screen flex flex-col">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Shield className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-white font-black tracking-tight text-xl leading-tight">Trimz</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-blue-500">SuperAdmin</p>
                        </div>
                    </div>

                    <nav className="space-y-2 flex-1">
                        {[
                            { id: 'overview', label: 'Platform Overview', icon: LayoutDashboard },
                            { id: 'admins', label: 'Manage Admins', icon: UserPlus },
                            { id: 'users', label: 'User Directory', icon: Users },
                            { id: 'revenue', label: 'Financials', icon: CreditCard },
                            { id: 'settings', label: 'Site Settings', icon: Settings },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all group ${activeTab === item.id
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                    }`}
                            >
                                <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'group-hover:text-blue-400'} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto pt-8 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold text-sm transition-all group"
                        >
                            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-7xl">

                    {activeTab === 'overview' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div>
                                    <h1 className="text-5xl font-black text-white tracking-tighter">Good morning, Boss</h1>
                                    <p className="text-slate-500 font-medium mt-2">Welcome to the Trimz master dashboard. Here is what is happening across the platform.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={fetchSystemStats}
                                        disabled={refreshing}
                                        className="p-4 bg-slate-900 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all disabled:opacity-50"
                                    >
                                        <RefreshCcw size={20} className={refreshing ? 'animate-spin' : ''} />
                                    </button>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard title="Total Customers" value={stats.totalUsers} icon={Users} color="blue" delay={100} />
                                <StatCard title="Total Providers" value={stats.totalProviders} icon={Scissors} color="indigo" delay={200} />
                                <StatCard title="Total Bookings" value={stats.totalAppointments} icon={Calendar} color="purple" delay={300} />
                                <StatCard title="Active Admins" value={stats.totalAdmins} icon={Shield} color="emerald" delay={400} />
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                {/* Recent Activity */}
                                <div className="xl:col-span-2">
                                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10">
                                        <h2 className="text-2xl font-black text-white mb-8">Recent Signups</h2>

                                        <div className="space-y-4">
                                            {stats.recentSignups?.length > 0 ? (
                                                stats.recentSignups.map((user, i) => (
                                                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold uppercase">
                                                                {user.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-white text-sm">{user.name}</h4>
                                                                <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${user.role === 'provider' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                                {user.role}
                                                            </span>
                                                            <p className="text-[10px] text-slate-500 mt-2">
                                                                {new Date(user.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-slate-500 text-center py-8">No recent signups found</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                                        <Shield className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700" size={160} />
                                        <h3 className="text-xl font-black mb-4 italic">Security Management</h3>
                                        <p className="text-blue-100 text-sm leading-relaxed mb-8">
                                            Manage your platform team. You have {stats.pendingApprovals} pending provider applications waiting for review.
                                        </p>
                                        <button
                                            onClick={() => navigate('/admin/providers')}
                                            className="w-full py-4 bg-white/20 backdrop-blur-md rounded-2xl font-bold text-sm hover:bg-white/30 transition-all flex items-center justify-center gap-3"
                                        >
                                            <Activity size={18} />
                                            Go to Provider Reviews
                                        </button>
                                    </div>

                                    <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8">
                                        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <History size={16} className="text-blue-500" />
                                            Platform Status
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 antialiased"></div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">Database Connected</p>
                                                    <p className="text-[10px] text-slate-500 mt-1">Status: Healthy</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500"></div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">Email Server Active</p>
                                                    <p className="text-[10px] text-slate-500 mt-1">Status: Verified</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'admins' && (
                        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-12">
                                <h1 className="text-5xl font-black text-white tracking-tighter mb-4 italic">Manage Admins</h1>
                                <p className="text-slate-500 text-lg font-medium">Create new administrative accounts to help you manage the business operations.</p>
                            </div>

                            <form onSubmit={handleAddAdmin} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 ml-1">Admin Full Name</label>
                                        <input
                                            type="text"
                                            value={newAdmin.name}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                            required
                                            className="w-full px-6 py-5 bg-slate-950/50 border border-slate-800 rounded-2xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-white placeholder:text-slate-700"
                                            placeholder="Enter name"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 ml-1">Business Email</label>
                                        <input
                                            type="email"
                                            value={newAdmin.email}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                            required
                                            className="w-full px-6 py-5 bg-slate-950/50 border border-slate-800 rounded-2xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-white placeholder:text-slate-700"
                                            placeholder="admin@trimz.com"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 ml-1">Temporary Password</label>
                                        <input
                                            type="password"
                                            value={newAdmin.password}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                            required
                                            minLength={6}
                                            className="w-full px-6 py-5 bg-slate-950/50 border border-slate-800 rounded-2xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-white placeholder:text-slate-700"
                                            placeholder="Min 6 characters"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={addingAdmin}
                                    className="w-full group relative overflow-hidden py-6 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.2)]"
                                >
                                    {addingAdmin ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={22} className="group-hover:scale-110 transition-transform" />
                                            Create Administrative User
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {(activeTab === 'users' || activeTab === 'revenue' || activeTab === 'settings') && (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-lg mx-auto">
                            <div className="w-24 h-24 bg-slate-900 border border-white/5 rounded-[2rem] flex items-center justify-center mb-8">
                                <History className="text-slate-700 w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-black text-white italic mb-4 uppercase tracking-tighter italic">Coming Soon</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                We are currently developing this module to provide you with detailed insights into users and financials.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
