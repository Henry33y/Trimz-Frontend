import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Loader2, Users, Scissors, Calendar,
    BarChart3, Activity, ShieldCheck,
    LayoutDashboard, Settings, LogOut,
    Search, Bell, ArrowUpRight, TrendingUp,
    Shield, UserPlus, Database, Server,
    CheckCircle2, AlertCircle, RefreshCcw, Command
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
    const [activeTab, setActiveTab] = useState('overview');

    // Add Admin State
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const [addingAdmin, setAddingAdmin] = useState(false);

    // Redirect if not superadmin
    useEffect(() => {
        if (!user || role !== 'superadmin') {
            toast.error('Developer Access Only');
            navigate('/login');
        }
    }, [user, role, navigate]);

    useEffect(() => {
        const fetchSystemStats = async () => {
            try {
                // Simulation for now, but configured for real API expansion
                setTimeout(() => {
                    setStats({
                        totalUsers: 1420,
                        totalProviders: 96,
                        totalAppointments: 5840,
                        activeSessions: 18
                    });
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error('Error fetching system stats:', error);
                setLoading(false);
            }
        };

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
                throw new Error(errorData.message || 'Failed to create admin');
            }

            toast.success('New Administrator created successfully!');
            setNewAdmin({ name: '', email: '', password: '' });
            setActiveTab('overview');
        } catch (error) {
            console.error('Error creating admin:', error);
            toast.error(error.message || 'Failed to create admin');
        } finally {
            setAddingAdmin(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login');
        toast.success('Developer session closed');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
                <div className="text-center">
                    <div className="relative mb-6">
                        <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto" />
                        <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 w-6 h-6" />
                    </div>
                    <p className="text-slate-400 font-mono text-sm tracking-widest animate-pulse">BOOTING_CORE_SYSTEM...</p>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, trend, color, delay }) => (
        <div
            className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] hover:border-blue-500/30 transition-all group relative overflow-hidden"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Icon size={120} />
            </div>
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black">
                        {trend}
                    </div>
                )}
            </div>
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
            <p className="text-4xl font-black text-white mt-2 tabular-nums">
                {value.toLocaleString()}
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0b0f1a] text-slate-300 font-sans selection:bg-blue-500/30">
            <div className="flex flex-col lg:flex-row min-h-screen">

                {/* Fixed Side Navigation */}
                <aside className="w-full lg:w-72 bg-[#090d16] border-b lg:border-r border-white/5 p-8 lg:sticky lg:top-0 lg:h-screen flex flex-col">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Command className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-white font-black tracking-tighter text-lg leading-tight">CORE_ADM</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Root Node</p>
                        </div>
                    </div>

                    <nav className="space-y-2 flex-1">
                        {[
                            { id: 'overview', label: 'Monitor Hub', icon: Activity },
                            { id: 'admins', label: 'Admin Forge', icon: Shield },
                            { id: 'users', label: 'Entity Logs', icon: Users },
                            { id: 'infra', label: 'Static Infrastructure', icon: Server },
                            { id: 'settings', label: 'Kernel Conf', icon: Settings },
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
                            Terminate Session
                        </button>
                    </div>
                </aside>

                {/* Scrolled Content Area */}
                <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-7xl">

                    {/* Dynamic Viewport */}
                    {activeTab === 'overview' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Dashboard Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Telemetry Active</span>
                                    </div>
                                    <h1 className="text-5xl font-black text-white tracking-tighter">System Telemetry</h1>
                                    <p className="text-slate-500 font-medium mt-2">Authenticated as {user?.email} • Node: Internal-EU-01</p>
                                </div>
                                <div className="flex items-center gap-4 p-2 bg-slate-900/50 border border-white/5 rounded-2xl">
                                    <button className="p-3 text-slate-500 hover:text-white transition-colors"><RefreshCcw size={20} /></button>
                                    <div className="h-8 w-px bg-white/5"></div>
                                    <div className="px-5 py-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Avg Latency</p>
                                        <p className="text-white font-black text-lg">24ms</p>
                                    </div>
                                </div>
                            </div>

                            {/* Main Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard title="Global Users" value={stats.totalUsers} icon={Users} trend="+18.4%" color="blue" delay={100} />
                                <StatCard title="Active Fleet" value={stats.totalProviders} icon={Scissors} trend="+4.2%" color="indigo" delay={200} />
                                <StatCard title="System Flow" value={stats.totalAppointments} icon={Calendar} trend="+1240" color="purple" delay={300} />
                                <StatCard title="Real-time IO" value={stats.activeSessions} icon={Activity} color="emerald" delay={400} />
                            </div>

                            {/* Section: Critical Infrastructure */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <div className="xl:col-span-2">
                                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10">
                                        <div className="flex items-center justify-between mb-10">
                                            <h2 className="text-2xl font-black text-white flex items-center gap-4">
                                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                                                    <Database size={24} />
                                                </div>
                                                Global Entity Registry
                                            </h2>
                                            <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                                                View All <ArrowUpRight size={14} />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { name: 'Identity Engine', status: 'Optimal', load: '14%', icon: ShieldCheck },
                                                { name: 'Financial Gateway', status: 'Optimal', load: '32%', icon: BarChart3 },
                                                { name: 'Media/Cloud Assets', status: 'Optimal', load: '68%', icon: Server },
                                                { name: 'Socket IO Mesh', status: 'Under Load', load: '89%', icon: Activity, warn: true },
                                            ].map((svc, i) => (
                                                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                                    <div className="flex items-center gap-5">
                                                        <div className={`p-3 rounded-xl ${svc.warn ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                            <svc.icon size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-white text-sm">{svc.name}</h4>
                                                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-0.5">Static Microservice</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${svc.warn ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                            {svc.status}
                                                        </span>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full transition-all duration-1000 ${svc.warn ? 'bg-amber-500' : 'bg-blue-500'}`}
                                                                    style={{ width: svc.load }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400 w-8">{svc.load}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar Column inside Overview */}
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                            <Shield size={160} />
                                        </div>
                                        <h3 className="text-xl font-black mb-4">Security Protocol</h3>
                                        <p className="text-blue-100 text-sm leading-relaxed mb-8">
                                            Only SuperAdmins have permission to forge new access tokens and create administrators.
                                        </p>
                                        <button
                                            onClick={() => setActiveTab('admins')}
                                            className="w-full py-4 bg-white/20 backdrop-blur-md rounded-2xl font-bold text-sm hover:bg-white/30 transition-all flex items-center justify-center gap-3"
                                        >
                                            <UserPlus size={18} />
                                            Open Admin Forge
                                        </button>
                                    </div>

                                    <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8">
                                        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <Activity size={16} className="text-blue-500" />
                                            Incident Reports
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500"></div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">Daily Backup Complete</p>
                                                    <p className="text-[10px] text-slate-500 mt-1">04:00 AM UTC</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-blue-500"></div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">Patch V1.0.8 Deployed</p>
                                                    <p className="text-[10px] text-slate-500 mt-1">Yesterday, 11:20 PM</p>
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
                                <h1 className="text-5xl font-black text-white tracking-tighter mb-4 italic">Admin_Forge</h1>
                                <p className="text-slate-500 text-lg font-medium">Provision new high-level access tokens for system administrators.</p>
                            </div>

                            <form onSubmit={handleAddAdmin} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 ml-1">Full Legal Name</label>
                                        <input
                                            type="text"
                                            value={newAdmin.name}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                            required
                                            className="w-full px-6 py-5 bg-slate-950/50 border border-slate-800 rounded-2xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-white placeholder:text-slate-700"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 ml-1">Security Email</label>
                                        <input
                                            type="email"
                                            value={newAdmin.email}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                            required
                                            className="w-full px-6 py-5 bg-slate-950/50 border border-slate-800 rounded-2xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-white placeholder:text-slate-700"
                                            placeholder="admin@trimz.internal"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 ml-1">Access Credentials</label>
                                        <input
                                            type="password"
                                            value={newAdmin.password}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                            required
                                            minLength={6}
                                            className="w-full px-6 py-5 bg-slate-950/50 border border-slate-800 rounded-2xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-white placeholder:text-slate-700"
                                            placeholder="Min 8 Characters"
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
                                            FORGING_IDENTITY...
                                        </>
                                    ) : (
                                        <>
                                            <Shield size={22} className="group-hover:scale-110 transition-transform" />
                                            GENERATE_ADMIN_TOKEN
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 flex items-center gap-4 p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                                <AlertCircle className="text-amber-500 flex-shrink-0" size={24} />
                                <p className="text-xs text-amber-500/80 font-medium">
                                    Creating an admin provides them with permission to approve/reject barbers and manage system-level business flow. Only create admins you trust.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {(activeTab === 'users' || activeTab === 'infra' || activeTab === 'settings') && (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-lg mx-auto italic">
                            <div className="w-24 h-24 bg-slate-900 border border-white/5 rounded-[2rem] flex items-center justify-center mb-8">
                                <Settings className="text-slate-700 w-10 h-10 animate-spin-slow" />
                            </div>
                            <h2 className="text-2xl font-black text-white italic mb-4 uppercase tracking-tighter">Segment_Encrypted</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                You are requesting access to a protected core segment. Technical logs and kernel configuration are currently restricted to terminal-only access.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
