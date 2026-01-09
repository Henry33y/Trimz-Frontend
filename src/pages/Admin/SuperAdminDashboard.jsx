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
    Terminal, Clock, AlertTriangle, Briefcase
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
    const [dataLoading, setDataLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal/CRUD State
    const [editingUser, setEditingUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
            if (!res.ok) throw new Error(`Stats fetch failed: ${res.status}`);
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

    useEffect(() => {
        fetchSystemStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'admins') fetchAdmins();
        if (activeTab === 'providers') fetchProviders();
        if (activeTab === 'users') fetchCustomers();
        if (activeTab === 'revenue') fetchFinancials();
        if (activeTab === 'sentinel') fetchAuditLogs();
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

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create administration account');
            }

            toast.success('Admin forge successful!');
            setNewAdmin({ name: '', email: '', password: '' });
            fetchAdmins(); // Refresh admin list
            fetchSystemStats();
        } catch (error) {
            toast.error(error.message);
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
                toast.success('User updated successfully');
                setIsEditModalOpen(false);
                // Refresh relevant list
                if (activeTab === 'admins') fetchAdmins();
                if (activeTab === 'providers') fetchProviders();
                if (activeTab === 'users') fetchCustomers();
                fetchSystemStats();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Error updating user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('CRITICAL: Are you sure you want to PERMANENTLY delete this account? This cannot be undone.')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) {
                toast.success('Account deleted successfully');
                if (activeTab === 'admins') fetchAdmins();
                if (activeTab === 'providers') fetchProviders();
                if (activeTab === 'users') fetchCustomers();
                fetchSystemStats();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Error deleting account');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login');
        toast.success('Session closed');
    };

    // --- UI HELPERS ---

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

    const UserTable = ({ data, title }) => (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{title}</h2>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-white focus:border-blue-500/50 outline-none transition-all"
                    />
                </div>
            </div>

            {dataLoading ? (
                <div className="flex flex-col items-center py-20">
                    <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing Records...</span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="pb-6 pl-4 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Profile</th>
                                <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Role</th>
                                <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="pb-6 pr-4 text-right text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.map((item) => (
                                <tr key={item._id} className="group hover:bg-white/[0.02] transition-all">
                                    <td className="py-6 pl-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center font-black text-slate-400 border border-white/5">
                                                {item.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white leading-none mb-1.5">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.email}</p>
                                            </div>
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
                                                className="p-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(item._id)}
                                                className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.length === 0 && (
                        <div className="text-center py-20 text-slate-500 italic">No records found matching your criteria</div>
                    )}
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium tracking-wide italic">ACCESSING PLATFORM KERNEL...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0f1a] text-slate-300 font-sans selection:bg-blue-500/30">
            <div className="flex flex-col lg:flex-row min-h-screen">

                {/* --- SIDEBAR --- */}
                <aside className="w-full lg:w-72 bg-[#090d16] border-b lg:border-r border-white/5 p-8 lg:sticky lg:top-0 lg:h-screen flex flex-col">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Shield className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-white font-black tracking-tight text-xl leading-tight italic">TRIMZ</h2>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">MASTER_NODE</p>
                        </div>
                    </div>

                    <nav className="space-y-1.5 flex-1">
                        {[
                            { id: 'overview', label: 'Common Room', icon: LayoutDashboard },
                            { id: 'admins', label: 'Supervisors', icon: ShieldCheck },
                            { id: 'providers', label: 'Service Units', icon: Scissors },
                            { id: 'users', label: 'End Users', icon: Users },
                            { id: 'revenue', label: 'Financial Command', icon: CreditCard },
                            { id: 'sentinel', label: 'Platform Sentinel', icon: Activity },
                            { id: 'settings', label: 'Core Config', icon: Settings },
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
                            Terminate Session
                        </button>
                    </div>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-7xl">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div>
                                    <h1 className="text-6xl font-black text-white tracking-tighter italic italic">SYSTEM_ROOT</h1>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 ml-1">Live Environment Overview</p>
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
                                        <div className="flex justify-between items-center mb-8">
                                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter italic">Recent Signups</h2>
                                            <button onClick={() => setActiveTab('users')} className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400">View All</button>
                                        </div>
                                        <div className="space-y-4">
                                            {stats.recentSignups?.map((u, i) => (
                                                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold uppercase">{u.name?.charAt(0) || 'U'}</div>
                                                        <div>
                                                            <h4 className="font-bold text-white text-sm">{u.name}</h4>
                                                            <p className="text-xs text-slate-500">{u.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[9px] font-black uppercase px-2 py-1 rounded bg-blue-500/10 text-blue-400">{u.role}</span>
                                                        <p className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-widest">{new Date(u.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group border border-white/10">
                                        <Shield className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-1000" size={200} />
                                        <h3 className="text-2xl font-black mb-4 italic italic">Forge Admin</h3>
                                        <p className="text-blue-100/70 text-sm font-medium leading-relaxed mb-10">Create high-level administrative nodes to assist in platform management.</p>
                                        <button
                                            onClick={() => setActiveTab('admins')}
                                            className="w-full py-5 bg-white text-blue-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 transition-all"
                                        >
                                            Initiate Forge
                                        </button>
                                    </div>

                                    <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8">
                                        <h3 className="text-[11px] font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-blue-500">
                                            <Activity size={16} />
                                            Platform Health
                                        </h3>
                                        <div className="space-y-5">
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                <div>
                                                    <p className="text-xs font-bold text-white uppercase">Encrypted Core</p>
                                                    <p className="text-[10px] text-slate-500 mt-1 uppercase">Identity Verified</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                <div>
                                                    <p className="text-xs font-bold text-white uppercase">Relays Active</p>
                                                    <p className="text-[10px] text-slate-500 mt-1 uppercase">Latency: Minimal</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FINANCIAL COMMAND TAB */}
                    {activeTab === 'revenue' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h1 className="text-6xl font-black text-white tracking-tighter italic italic uppercase">FINANCIAL_HQ</h1>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 ml-1">Capital Flux & Transaction Integrity</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <StatCard title="Platform Gross Volume" value={financials.grossVolume} icon={TrendingUp} color="emerald" prefix="GH₵ " delay={100} />
                                <StatCard title="Projected Monthly Revenue" value={financials.projectedEarnings} icon={BarChart3} color="blue" prefix="GH₵ " delay={200} />
                            </div>

                            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden p-8">
                                <h2 className="text-2xl font-black text-white italic mb-10 uppercase tracking-tighter italic">Ledger History</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="pb-6 pl-4 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Transaction ID</th>
                                                <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Customer</th>
                                                <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Provider</th>
                                                <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Method</th>
                                                <th className="pb-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Value</th>
                                                <th className="pb-6 pr-4 text-right text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {financials.transactions.map((tx) => (
                                                <tr key={tx._id} className="group hover:bg-white/[0.01] transition-all">
                                                    <td className="py-6 pl-4">
                                                        <span className="font-bold text-slate-400 text-xs tabular-nums">{tx.paymentReference?.slice(-10) || 'TRZ-0000'}</span>
                                                    </td>
                                                    <td className="py-6 text-sm font-bold text-white">{tx.customer?.name}</td>
                                                    <td className="py-6 text-sm font-bold text-slate-400">{tx.provider?.name}</td>
                                                    <td className="py-6">
                                                        <span className="text-[10px] font-black uppercase text-blue-500">{tx.paymentMethod || 'CARD'}</span>
                                                    </td>
                                                    <td className="py-6 font-black text-white tabular-nums text-sm">GH₵ {tx.totalPrice}</td>
                                                    <td className="py-6 pr-4 text-right">
                                                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">PAID</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {financials.transactions.length === 0 && (
                                        <div className="text-center py-20 text-slate-600 font-bold uppercase tracking-widest text-xs">No transaction records found</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PLATFORM SENTINEL TAB (AUDIT LOGS) */}
                    {activeTab === 'sentinel' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h1 className="text-6xl font-black text-white tracking-tighter italic italic uppercase">PLATFORM_SENTINEL</h1>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 ml-1">Immutable Activity Logs & Audit Trails</p>
                            </div>

                            <div className="bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 font-mono">
                                <div className="flex items-center gap-3 mb-10 text-blue-500">
                                    <Terminal size={20} />
                                    <span className="text-xs font-black uppercase tracking-[0.3em]">Live Feed / System.stdout</span>
                                </div>

                                <div className="space-y-6">
                                    {auditLogs.map((log) => (
                                        <div key={log._id} className="flex gap-6 items-start group">
                                            <div className="mt-1.5 flex flex-col items-center">
                                                <div className="w-2.5 h-2.5 rounded-full border border-white/20 group-hover:bg-blue-500 transition-all"></div>
                                                <div className="w-px h-12 bg-white/5 mt-1.5"></div>
                                            </div>
                                            <div className="flex-1 pb-6">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <span className="text-[10px] text-slate-600 tabular-nums">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{log.action.replace('_', ' ')}</span>
                                                    <span className="text-[10px] text-slate-500 uppercase font-bold">BY: {log.user?.name} ({log.user?.role})</span>
                                                </div>
                                                <p className="text-sm text-slate-300 leading-relaxed font-bold">
                                                    {log.details}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {auditLogs.length === 0 && (
                                        <div className="text-center py-20 text-slate-700 font-black uppercase tracking-widest text-[10px]">No system activity recorded</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TABLE VIEWS */}
                    {activeTab === 'admins' && (
                        <div className="space-y-12">
                            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 mb-10">
                                <h2 className="text-2xl font-black text-white italic mb-8 uppercase tracking-tighter italic">Admin Forge</h2>
                                <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <input type="text" value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} required className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none" placeholder="Enter name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">System Email</label>
                                        <input type="email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} required className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none" placeholder="Enter email" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Credentials</label>
                                        <input type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} required minLength={6} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none" placeholder="Set password" />
                                    </div>
                                    <button type="submit" disabled={addingAdmin} className="md:col-span-3 w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all mt-4 flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(37,99,235,0.2)]">
                                        {addingAdmin ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                                        Generate Administrator Node
                                    </button>
                                </form>
                            </div>
                            <UserTable data={admins} title="Active Supervisors" />
                        </div>
                    )}

                    {activeTab === 'providers' && <UserTable data={providers} title="Platform Service Units" />}
                    {activeTab === 'users' && <UserTable data={customers} title="Registered End Users" />}

                    {activeTab === 'settings' && (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-lg mx-auto">
                            <Settings className="text-blue-500 w-16 h-16 mb-8 animate-[spin_10s_linear_infinite]" />
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter italic">CORE_CONFIG_LOCKED</h2>
                            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] leading-relaxed mt-4">Platform kernel variables under secure encryption. Access restricted to System Architect.</p>
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
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter italic">Edit Account</h2>
                            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2">{editingUser._id}</p>
                        </div>

                        <form onSubmit={handleUpdateUser} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Identity Name</label>
                                <input type="text" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Contact Email</label>
                                <input type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Access Role</label>
                                    <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none appearance-none cursor-pointer">
                                        <option value="user">Customer</option>
                                        <option value="provider">Provider</option>
                                        <option value="admin">Supervisor</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Status</label>
                                    <select value={editingUser.status || (editingUser.verified ? 'active' : 'pending')} onChange={e => setEditingUser({ ...editingUser, status: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-blue-500 outline-none appearance-none cursor-pointer">
                                        <option value="active">Active</option>
                                        <option value="approved">Approved</option>
                                        <option value="pending">Pending</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)] mt-6">
                                Apply Encryption & Save
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
