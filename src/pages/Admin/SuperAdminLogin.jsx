import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Terminal, Cpu, ShieldAlert, Loader2,
    ArrowRight, Code, Activity, Command
} from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext.jsx';
import { BASE_URL } from '../../config';

const SuperAdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Access Denied');

            const userRole = result.data.role;

            if (userRole !== 'superadmin') {
                toast.error('Restricted Access: Developer Credentials Required.');
                setLoading(false);
                return;
            }

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: result.data,
                    token: result.token,
                    role: userRole,
                },
            });

            toast.info('Developer Environment Initialized');
            navigate('/superadmin/dashboard', { replace: true });
        } catch (err) {
            toast.error(err.message || 'Access Denied');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col items-center justify-center p-6 font-mono selection:bg-blue-500/30">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-indigo-600 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Header Decoration */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full backdrop-blur-md shadow-2xl">
                        <Activity className="text-blue-500 animate-pulse" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">System Core V1.0</span>
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
                    <div className="p-8 sm:p-12">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-6 group hover:border-blue-500/50 transition-colors">
                                <Terminal className="text-blue-500 w-10 h-10 group-hover:scale-110 transition-transform" />
                            </div>
                            <h1 className="text-2xl font-black text-white tracking-widest flex items-center justify-center gap-3">
                                <Command size={20} className="text-blue-500" />
                                SUPERADMIN
                            </h1>
                            <p className="text-slate-500 mt-2 text-xs font-bold uppercase tracking-widest">Developer Access Node</p>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Identity-Token (Email)</label>
                                    <Code size={12} className="text-slate-600" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 bg-slate-950/50 border border-slate-800 rounded-xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-medium text-white placeholder:text-slate-700"
                                    placeholder="dev@trimz.internal"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">AccessKey (Password)</label>
                                    <ShieldAlert size={12} className="text-slate-600" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 bg-slate-950/50 border border-slate-800 rounded-xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-medium text-white placeholder:text-slate-700"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group relative overflow-hidden py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,99,235,0.3)] shadow-blue-600/20 active:translate-y-0.5"
                            >
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        <span>INITIALIZE_SESSION</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between px-4">
                    <Link to="/home" className="text-[10px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors flex items-center gap-2">
                        <ArrowRight size={12} className="rotate-180" />
                        Return to Hub
                    </Link>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                        <Cpu size={12} />
                        Encrypted Connection
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminLogin;
