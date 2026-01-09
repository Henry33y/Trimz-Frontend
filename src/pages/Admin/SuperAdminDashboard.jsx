import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Loader2, Users, Scissors, Calendar,
    BarChart3, Activity, ShieldCheck,
    LayoutDashboard, Settings, LogOut,
    ArrowUpRight, Shield, UserPlus, Database,
    CheckCircle2, AlertCircle, RefreshCcw, Command,
    History, CreditCard, Layout, Trash2, Edit3, X,
    MoreVertical, UserCheck, UserX, Search,
    TrendingUp, ArrowDownRight, ArrowUpRight as ArrowUpRightIcon,
    Terminal, Clock, AlertTriangle, Briefcase, User,
    Zap, Globe, Percent, Sliders, CheckCircle, Package, Plus, MapPin
} from 'lucide-react';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';

const SuperAdminDashboard = () => {
    const { user, token, role } = useAuth();
    const navigate = useNavigate();

    // Core Platform State
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

    // Data Management State
    const [admins, setAdmins] = useState([]);
    const [providers, setProviders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [financials, setFinancials] = useState({ grossVolume: 0, projectedEarnings: 0, transactions: [] });
    const [auditLogs, setAuditLogs] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [config, setConfig] = useState({ commission_rate: 15, maintenance_mode: false, service_categories: [] });

    const [dataLoading, setDataLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sentinelSearch, setSentinelSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');

    // Modal/CRUD State
    const [editingUser, setEditingUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [newLocation, setNewLocation] = useState('');

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

    // --- FETCHERS ---

    const fetchSystemStats = async () => {
        try {
            setRefreshing(true);
            const res = await fetch(`${BASE_URL}/admin/platform-stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) setStats(result.data);
            setLoading(false);
        } catch (error) {
            toast.error('Could not load real-time statistics');
            setLoading(false);
        } finally {
            setRefreshing(false);
        }
    };

    const fetchAdmins = async () => {
        setDataLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/admins`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) setAdmins(result.data);
        } catch (error) {
            toast.error('Failed to load admins');
        } finally {
            setDataLoading(false);
        }
    };

    const fetchProviders = async () => {
        setDataLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/providers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) setProviders(result.data);
        } catch (error) {
            toast.error('Failed to load providers');
        } finally {
            setDataLoading(false);
        }
    };

    const fetchCustomers = async () => {
        setDataLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) setCustomers(result.data);
        } catch (error) {
            toast.error('Failed to load customers');
        } finally {
            setDataLoading(false);
        }
    };

    const fetchFinancials = async () => {
        setDataLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/financials`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) setFinancials(result.data);
        } catch (error) {
            toast.error('Failed to load financial records');
        } finally {
            setDataLoading(false);
        }
    };

    const fetchAuditLogs = async () => {
        setDataLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/audit-logs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) setAuditLogs(result.data);
        } catch (error) {
            toast.error('Failed to load platform logs');
        } finally {
            setDataLoading(false);
        }
    };

    const fetchAppointments = async () => {
        setDataLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/appointments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) setAppointments(result.data);
        } catch (error) {
            toast.error('Failed to load global appointments');
        } finally {
            setDataLoading(false);
        }
    };

    const fetchConfig = async () => {
        setDataLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/config`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) setConfig(result.data);
        } catch (error) {
            toast.error('Failed to load platform settings');
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        fetchSystemStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'admins') fetchAdmins();
        if (activeTab === 'providers') fetchProviders();
        if (activeTab === 'users') fetchCustomers();
        if (activeTab === 'revenue') fetchFinancials();
        if (activeTab === 'sentinel') fetchAuditLogs();
        if (activeTab === 'appointments') fetchAppointments();
        if (activeTab === 'settings') fetchConfig();
    }, [activeTab]);

    // Live Sentinel Polling
    useEffect(() => {
        let interval;
        if (activeTab === 'sentinel') {
            interval = setInterval(() => {
                fetchAuditLogs();
            }, 5000); // Pulse every 5 seconds
        }
        return () => clearInterval(interval);
    }, [activeTab]);

    // --- CRUD ACTIONS ---

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
            if (!res.ok) throw new Error('Forge failed');
            toast.success('Admin forge successful!');
            setNewAdmin({ name: '', email: '', password: '' });
            fetchAdmins();
            fetchSystemStats();
        } catch (error) {
            toast.error('Failed to forge admin');
        } finally {
            setAddingAdmin(false);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/admin/users/${editingUser._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editingUser)
            });
            const result = await res.json();
            if (result.success) {
                toast.success('System updated');
                setIsEditModalOpen(false);
                if (activeTab === 'admins') fetchAdmins();
                if (activeTab === 'providers') fetchProviders();
                if (activeTab === 'users') fetchCustomers();
                fetchSystemStats();
            }
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('CRITICAL: Delete this account permanently?')) return;
        try {
            const res = await fetch(`${BASE_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Account purged');
                if (activeTab === 'admins') fetchAdmins();
                if (activeTab === 'providers') fetchProviders();
                if (activeTab === 'users') fetchCustomers();
                fetchSystemStats();
            }
        } catch (error) {
            toast.error('Purge failed');
        }
    };

    const handleForceStatus = async (appointmentId, status) => {
        if (!window.confirm(`Force change appointment status to ${status.toUpperCase()}?`)) return;
        try {
            const res = await fetch(`${BASE_URL}/admin/appointments/${appointmentId}/status`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                toast.success(`Log: Status forced to ${status}`);
                fetchAppointments();
            }
        } catch (error) {
            toast.error('Override failed');
        }
    };

    const updateConfig = async (newSettings) => {
        try {
            const res = await fetch(`${BASE_URL}/admin/config`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ settings: newSettings })
            });
            if (res.ok) {
                toast.success('Global variables updated');
                fetchConfig();
            }
        } catch (error) {
            toast.error('System config update failed');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        toast.success('Session terminated');
    };

    // --- UI HELPERS ---

    const getLogIcon = (action) => {
        if (action.includes('cancel')) return <X className="text-rose-500" size={18} />;
        if (action.includes('delete')) return <Trash2 className="text-rose-500" size={18} />;
        if (action.includes('approve')) return <UserCheck className="text-emerald-500" size={18} />;
        if (action.includes('reject')) return <UserX className="text-amber-500" size={18} />;
        if (action.includes('create')) return <UserPlus className="text-indigo-500" size={18} />;
        if (action.includes('force')) return <Zap className="text-amber-500" size={18} />;
        if (action.includes('update')) return <Edit3 className="text-blue-500" size={18} />;
        return <RefreshCcw className="text-blue-500" size={18} />;
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(date).toLocaleDateString();
    };

    const filteredAuditLogs = auditLogs.filter(log => {
        const search = sentinelSearch.toLowerCase();
        return (
            log.user?.name?.toLowerCase().includes(search) ||
            log.user?.role?.toLowerCase().includes(search) ||
            log.details?.toLowerCase().includes(search) ||
            log.action?.toLowerCase().includes(search) ||
            log.targetModel?.toLowerCase().includes(search)
        );
    });

    const StatCard = ({ title, value, icon: Icon, color, delay, prefix = '' }) => (
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
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
            </p>
        </div>
    );

    const UserTable = ({ data, title }) => {
        const filteredData = data.filter(item => {
            const search = userSearch.toLowerCase();
            return (
                item.name?.toLowerCase().includes(search) ||
                item.email?.toLowerCase().includes(search) ||
                item.phone?.toLowerCase().includes(search) ||
                item.role?.toLowerCase().includes(search)
            );
        });

        return (
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{title}</h2>
                        <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black">{data.length} TOTAL</span>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            placeholder="Search name, email or phone..."
                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-white focus:border-blue-500/50 outline-none transition-all"
                        />
                    </div>
                </div>

                {dataLoading ? (
                    <div className="flex flex-col items-center py-20">
                        <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
                        <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Accessing Records...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="pb-6 pl-4 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Profile</th>
                                    <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Contact & Info</th>
                                    <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Role</th>
                                    <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                    <th className="pb-6 pr-4 text-right text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Users size={48} className="text-slate-700" />
                                                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No users found in this sector</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={item._id} className="group hover:bg-white/[0.02] transition-all">
                                            <td className="py-6 pl-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center font-black text-slate-400 border border-white/5 group-hover:scale-105 transition-transform">
                                                        {item.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white leading-none mb-1.5">{item.name}</p>
                                                        <p className="text-[10px] text-slate-500 font-medium">{item.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-slate-400">{item.phone || 'No phone'}</p>
                                                    <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest flex items-center gap-1">
                                                        <Clock size={10} /> Joined {new Date(item.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${item.role === 'admin' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                                                    item.role === 'provider' ? 'border-purple-500/20 text-purple-500 bg-purple-500/5' :
                                                        'border-blue-500/20 text-blue-500 bg-blue-500/5'
                                                    }`}>
                                                    {item.role}
                                                </span>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'approved' || item.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                                                    <span className="text-[10px] font-bold text-slate-400 capitalize">{item.status || 'Active'}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 pr-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => { setEditingUser(item); setIsEditModalOpen(true); }}
                                                        className="p-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all outline-none"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(item._id)}
                                                        className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all outline-none"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-slate-400 font-black tracking-widest text-[10px] uppercase italic">VERIFYING_ROOT_ACCESS...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0f1a] text-slate-300 font-sans selection:bg-blue-500/30">
            <div className="flex flex-col lg:flex-row min-h-screen">

                {/* --- SIDEBAR --- */}
                <aside className="w-full lg:w-72 bg-[#090d16] border-b lg:border-r border-white/5 p-8 lg:sticky lg:top-0 lg:h-screen flex flex-col">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group">
                            <Shield className="text-white group-hover:scale-110 transition-transform" size={20} />
                        </div>
                        <div>
                            <h2 className="text-white font-black tracking-tight text-xl leading-tight italic uppercase">TRIMZ</h2>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">MASTER_NODE</p>
                        </div>
                    </div>

                    <nav className="space-y-1 flex-1">
                        {[
                            { id: 'overview', label: 'Command Hub', icon: LayoutDashboard },
                            { id: 'appointments', label: 'God-View', icon: Calendar },
                            { id: 'revenue', label: 'Capital Logic', icon: CreditCard },
                            { id: 'sentinel', label: 'Sentinel Log', icon: Activity },
                            { id: 'admins', label: 'Supervisors', icon: ShieldCheck },
                            { id: 'providers', label: 'Service Units', icon: Scissors },
                            { id: 'users', label: 'End Users', icon: Users },
                            { id: 'settings', label: 'Core Config', icon: Sliders },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all group ${activeTab === item.id
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                    }`}
                            >
                                <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'group-hover:text-blue-400'} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto pt-8 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-5 py-4 text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-500/10 rounded-2xl transition-all group"
                        >
                            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-7xl">

                    {/* OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div>
                                    <h1 className="text-7xl font-black text-white tracking-tighter italic uppercase">Master_Control</h1>
                                    <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mt-2 ml-1">Live Platform Telemetry</p>
                                </div>
                                <button
                                    onClick={fetchSystemStats}
                                    disabled={refreshing}
                                    className="p-5 bg-slate-900 border border-white/5 rounded-[1.5rem] text-slate-400 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-50 group"
                                >
                                    <RefreshCcw size={20} className={refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard title="Total Customers" value={stats.totalUsers} icon={Users} color="blue" delay={100} />
                                <StatCard title="Total Providers" value={stats.totalProviders} icon={Scissors} color="purple" delay={200} />
                                <StatCard title="Total Bookings" value={stats.totalAppointments} icon={Calendar} color="indigo" delay={300} />
                                <StatCard title="Active Admins" value={stats.totalAdmins} icon={Shield} color="emerald" delay={400} />
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <div className="xl:col-span-2">
                                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10">
                                        <h2 className="text-2xl font-black text-white italic mb-8 uppercase tracking-tighter">Recent Personnel</h2>
                                        <div className="space-y-4">
                                            {stats.recentSignups?.map((u, i) => (
                                                <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-400 font-bold border border-white/5">{u.name?.charAt(0) || 'U'}</div>
                                                        <div>
                                                            <h4 className="font-bold text-white text-sm">{u.name}</h4>
                                                            <p className="text-xs text-slate-500">{u.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[9px] font-black uppercase px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{u.role}</span>
                                                        <p className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-widest">{new Date(u.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group border border-white/10">
                                    <Shield className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-1000" size={200} />
                                    <h3 className="text-2xl font-black mb-4 italic uppercase">Forge Admin</h3>
                                    <p className="text-blue-100/70 text-sm font-medium leading-relaxed mb-10">Expand the administrative hierarchy by generating new supervisor nodes.</p>
                                    <button
                                        onClick={() => setActiveTab('admins')}
                                        className="w-full py-5 bg-white text-blue-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl"
                                    >
                                        Execute Forge
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GOD-VIEW APPOINTMENT MANAGER */}
                    {activeTab === 'appointments' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h1 className="text-7xl font-black text-white tracking-tighter italic uppercase">God_View</h1>
                                <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mt-2 ml-1">Omniscient Booking Surveillance</p>
                            </div>

                            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden p-8">
                                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Live Bookings</h2>
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="relative flex-1 md:w-64">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                            <input type="text" placeholder="Search customer/unit..." className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-white outline-none focus:border-blue-500" />
                                        </div>
                                        <select className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-black uppercase text-slate-400 outline-none cursor-pointer">
                                            <option value="all">Every State</option>
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="pb-6 pl-4 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Schedule</th>
                                                <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Customer</th>
                                                <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Service Unit</th>
                                                <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Logic State</th>
                                                <th className="pb-6 pr-4 text-right text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Override</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {appointments.map((apt) => (
                                                <tr key={apt._id} className="group hover:bg-white/[0.02] transition-all">
                                                    <td className="py-6 pl-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500"><Clock size={16} /></div>
                                                            <div>
                                                                <p className="font-black text-white text-xs">{new Date(apt.date).toLocaleDateString('en-GB')}</p>
                                                                <p className="text-[10px] text-slate-500 font-bold uppercase">{apt.startTime} - {apt.endTime}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-6">
                                                        <p className="text-sm font-bold text-white leading-tight">{apt.customer?.name}</p>
                                                        <p className="text-[10px] text-slate-500">{apt.customer?.email}</p>
                                                    </td>
                                                    <td className="py-6">
                                                        <p className="text-sm font-bold text-slate-300 leading-tight">{apt.provider?.name}</p>
                                                        <p className="text-[10px] text-slate-500">{apt.service?.name}</p>
                                                    </td>
                                                    <td className="py-6">
                                                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${apt.status === 'completed' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                                                            apt.status === 'cancelled' ? 'border-rose-500/20 text-rose-500 bg-rose-500/5' :
                                                                'border-amber-500/20 text-amber-500 bg-amber-500/5'
                                                            }`}>
                                                            {apt.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 pr-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {apt.status !== 'completed' && (
                                                                <button onClick={() => handleForceStatus(apt._id, 'completed')} className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"><CheckCircle size={14} /></button>
                                                            )}
                                                            {apt.status !== 'cancelled' && (
                                                                <button onClick={() => handleForceStatus(apt._id, 'cancelled')} className="p-2.5 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><X size={14} /></button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CORE CONFIG (GLOBAL SETTINGS) */}
                    {activeTab === 'settings' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h1 className="text-7xl font-black text-white tracking-tighter italic uppercase">Core_Config</h1>
                                <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mt-2 ml-1">Platform Global Toggles & Logic Constants</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Maintenance & Commission */}
                                <div className="space-y-8">
                                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem]">
                                        <div className="flex justify-between items-center mb-10">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500"><Zap size={24} /></div>
                                                <div>
                                                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Maintenance Mode</h3>
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Platform-wide Shutdown</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => updateConfig({ maintenance_mode: !config.maintenance_mode })}
                                                className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${config.maintenance_mode ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/20' : 'bg-slate-950 text-slate-500 border border-white/5 hover:text-white'}`}
                                            >
                                                {config.maintenance_mode ? 'DEACTIVATE LOCKDOWN' : 'ACTIVATE LOCKDOWN'}
                                            </button>
                                        </div>

                                        <div className="flex flex-col gap-8 pt-10 border-t border-white/5">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400"><User size={24} /></div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Customer Fee</h3>
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Platform Service Fee (Added to Price)</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="number"
                                                        value={config.customer_fee_percent}
                                                        onChange={(e) => setConfig({ ...config, customer_fee_percent: parseInt(e.target.value) })}
                                                        className="w-20 bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-black text-center outline-none focus:border-blue-500"
                                                    />
                                                    <button onClick={() => updateConfig({ customer_fee_percent: config.customer_fee_percent })} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all"><CheckCircle size={20} /></button>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400"><Briefcase size={24} /></div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Provider Fee</h3>
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Lead Generation Fee (Deducted from Barber)</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="number"
                                                        value={config.provider_fee_percent}
                                                        onChange={(e) => setConfig({ ...config, provider_fee_percent: parseInt(e.target.value) })}
                                                        className="w-20 bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-black text-center outline-none focus:border-blue-500"
                                                    />
                                                    <button onClick={() => updateConfig({ provider_fee_percent: config.provider_fee_percent })} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all"><CheckCircle size={20} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] p-8 flex items-center gap-6">
                                        <AlertCircle className="text-blue-500 flex-shrink-0" size={32} />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">
                                            <span className="text-blue-400 font-black">Architect Warning:</span> Global variables propagate instantly. Changes here alter the business logic of the entire Trimz ecosystem for all users.
                                        </p>
                                    </div>
                                </div>

                                {/* Service Categories Manager */}
                                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem]">
                                    <div className="flex items-center gap-5 mb-10">
                                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400"><Package size={24} /></div>
                                        <div>
                                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Service Directory</h3>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Global Unit Classifications</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {config.service_categories?.map((cat, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-5 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                                                <span className="text-xs font-black text-white uppercase tracking-widest">{cat}</span>
                                                <button
                                                    onClick={() => {
                                                        const freshCats = config.service_categories.filter(c => c !== cat);
                                                        updateConfig({ service_categories: freshCats });
                                                    }}
                                                    className="p-2 text-rose-500/50 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            placeholder="e.g., Manicure"
                                            className="flex-1 bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-blue-500"
                                        />
                                        <button
                                            onClick={() => {
                                                if (!newCategory) return;
                                                updateConfig({ service_categories: [...(config.service_categories || []), newCategory.toLowerCase()] });
                                                setNewCategory('');
                                            }}
                                            className="px-8 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
                                        >
                                            ADD CATEGORY
                                        </button>
                                    </div>
                                </div>

                                {/* Location Manager */}
                                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem]">
                                    <div className="flex items-center gap-5 mb-10">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><MapPin size={24} /></div>
                                        <div>
                                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Location Directory</h3>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Operational City Hubs</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {config.available_locations?.map((loc, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-5 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                                                <span className="text-xs font-black text-white uppercase tracking-widest">{loc}</span>
                                                <button
                                                    onClick={() => {
                                                        const freshLocs = config.available_locations.filter(l => l !== loc);
                                                        updateConfig({ available_locations: freshLocs });
                                                    }}
                                                    className="p-2 text-rose-500/50 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={newLocation}
                                            onChange={(e) => setNewLocation(e.target.value)}
                                            placeholder="e.g., Accra"
                                            className="flex-1 bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-blue-500"
                                        />
                                        <button
                                            onClick={() => {
                                                if (!newLocation) return;
                                                updateConfig({ available_locations: [...(config.available_locations || []), newLocation] });
                                                setNewLocation('');
                                            }}
                                            className="px-8 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20"
                                        >
                                            ADD LOCATION
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sentinel Log */}
                    {activeTab === 'sentinel' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                                <div>
                                    <h1 className="text-7xl font-black text-white tracking-tighter italic uppercase">Sentinel_Feed</h1>
                                    <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mt-2 ml-1">Historical Audit Trail & Platform Integrity</p>
                                </div>
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        value={sentinelSearch}
                                        onChange={(e) => setSentinelSearch(e.target.value)}
                                        placeholder="Filter by user, action or node..."
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-blue-500/50 transition-all shadow-2xl"
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden p-8 relative">
                                {/* Live Status Indicator */}
                                <div className="absolute top-8 right-8 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live Uplink</span>
                                </div>

                                <div className="space-y-4">
                                    {filteredAuditLogs.length === 0 ? (
                                        <div className="text-center py-20 bg-white/[0.01] rounded-[2rem] border border-dashed border-white/5">
                                            <Terminal className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No matching activity found...</p>
                                        </div>
                                    ) : (
                                        filteredAuditLogs.map((log) => (
                                            <div key={log._id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all group relative overflow-hidden">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5 shadow-inner">
                                                        {getLogIcon(log.action)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/10">
                                                                {log.action.replace(/_/g, ' ')}
                                                            </span>
                                                            <span className="text-[10px] text-slate-600 font-bold flex items-center gap-1">
                                                                <Clock size={10} /> {getTimeAgo(log.timestamp)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-baseline gap-1.5 flex-wrap">
                                                            <span className="text-xs font-black text-blue-500 opacity-80 uppercase tracking-tighter">({log.user?.role || 'system'})</span>
                                                            <span className="text-sm font-black text-white">{log.user?.name || 'SYSTEM'}:</span>
                                                            <p className="text-sm font-bold text-slate-300 leading-tight italic">{log.details}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="hidden lg:flex items-center gap-4 bg-slate-950/40 px-5 py-3.5 rounded-2xl border border-white/5 min-w-[180px]">
                                                    <div className="text-right w-full">
                                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Node Access</p>
                                                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">{log.targetModel || 'System Protocol'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Capital Logic (Financial HQ) */}
                    {activeTab === 'revenue' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h1 className="text-7xl font-black text-white tracking-tighter italic uppercase">Capital_Flow</h1>
                                <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mt-2 ml-1">Platform Liquidity & Transaction Integrity</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <StatCard title="Gross Platform Volume" value={financials.grossVolume} icon={TrendingUp} color="emerald" prefix="GH₵ " delay={100} />
                                <StatCard title="Estimated Monthly Yield" value={financials.projectedEarnings} icon={BarChart3} color="blue" prefix="GH₵ " delay={200} />
                            </div>

                            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden p-8">
                                <h2 className="text-2xl font-black text-white italic mb-10 uppercase tracking-tighter">Global Ledger</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="pb-6 pl-4 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Hash ID</th>
                                                <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Counterparty</th>
                                                <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Service Unit</th>
                                                <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Channel</th>
                                                <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Amount</th>
                                                <th className="pb-6 pr-4 text-right text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {financials.transactions.map((tx) => (
                                                <tr key={tx._id} className="group hover:bg-white/[0.01] transition-all">
                                                    <td className="py-6 pl-4 font-bold text-slate-500 text-xs tabular-nums">{tx.paymentReference?.slice(-12) || '---'}</td>
                                                    <td className="py-6 text-sm font-bold text-white">{tx.customer?.name}</td>
                                                    <td className="py-6 text-sm font-bold text-slate-400">{tx.provider?.name}</td>
                                                    <td className="py-6">
                                                        <span className="text-[9px] font-black uppercase text-blue-500 px-2 py-1 bg-blue-500/5 rounded border border-blue-500/10">{tx.paymentMethod || 'SECURE'}</span>
                                                    </td>
                                                    <td className="py-6 font-black text-white tabular-nums text-sm">GH₵ {tx.totalPrice}</td>
                                                    <td className="py-6 pr-4 text-right">
                                                        <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">VERIFIED</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Supervisors, Service Units, End Users Table Views */}
                    {['admins', 'providers', 'users'].includes(activeTab) && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {activeTab === 'admins' && (
                                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 mb-10">
                                    <h2 className="text-2xl font-black text-white italic mb-8 uppercase tracking-tighter">Admin Forge</h2>
                                    <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] ml-1">Identity Name</label>
                                            <input type="text" value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} required className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none" placeholder="Alpha Node" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] ml-1">System Email</label>
                                            <input type="email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} required className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none" placeholder="alpha@trimz.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] ml-1">Key Hash</label>
                                            <input type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} required minLength={6} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none" placeholder="Min 6 Bytes" />
                                        </div>
                                        <button type="submit" disabled={addingAdmin} className="md:col-span-3 w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-500 transition-all mt-4 flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(37,99,235,0.2)]">
                                            {addingAdmin ? <Loader2 className="animate-spin" size={20} /> : <Zap size={18} />}
                                            Commit Admin Generation
                                        </button>
                                    </form>
                                </div>
                            )}
                            <UserTable
                                data={activeTab === 'admins' ? admins : activeTab === 'providers' ? providers : customers}
                                title={activeTab === 'admins' ? 'Supervisor Hierarchy' : activeTab === 'providers' ? 'Active Service Units' : 'Platform Customer Base'}
                            />
                        </div>
                    )}

                </main>
            </div>

            {/* --- EDIT MODAL --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl" onClick={() => setIsEditModalOpen(false)}></div>
                    <div className="relative bg-[#0d111c] border border-white/10 w-full max-w-xl rounded-[3rem] p-10 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute right-10 top-10 text-slate-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>

                        <div className="mb-10">
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Edit Entity</h2>
                            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2">UUID: {editingUser._id}</p>
                        </div>

                        <form onSubmit={handleUpdateUser} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Public Name</label>
                                <input type="text" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">System Email</label>
                                <input type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Access Role</label>
                                    <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none appearance-none cursor-pointer">
                                        <option value="customer">Customer</option>
                                        <option value="provider">Provider</option>
                                        <option value="admin">Supervisor</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Logic Status</label>
                                    <select value={editingUser.status || (editingUser.verified ? 'active' : 'pending')} onChange={e => setEditingUser({ ...editingUser, status: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none appearance-none cursor-pointer">
                                        <option value="active">Active</option>
                                        <option value="approved">Approved</option>
                                        <option value="pending">Pending</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-500 transition-all shadow-xl mt-6">
                                Commit State Update
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
