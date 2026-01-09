import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Terminal, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import HashLoader from 'react-spinners/BeatLoader';
import { BASE_URL } from '../config';
import logo from '../assets/images/trimz.png';

const SuperAdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { token, role, dispatch } = useContext(AuthContext);

    // Redirect if already logged in as superadmin
    useEffect(() => {
        if (token && role === 'superadmin') {
            navigate('/superadmin/dashboard');
        }
    }, [token, role, navigate]);

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

            if (!res.ok) throw new Error(result.message || 'Login failed');

            if (result.data.role !== 'superadmin') {
                throw new Error('Access denied. This portal is for SuperAdmins only.');
            }

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: result.data,
                    token: result.token,
                    role: result.data.role,
                },
            });

            toast.success('Developer Authentication Verified');
            navigate('/superadmin/dashboard');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-[440px] w-full relative">
                {/* Branding */}
                <div className="text-center mb-10">
                    <img src={logo} alt="Trimz" className="h-20 mx-auto mb-6 brightness-0 invert opacity-90" />
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <Terminal size={12} />
                        Developer Nexus
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">SuperAdmin Access</h1>
                    <p className="text-slate-500 mt-2 font-medium">Internal system authentication</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[32px] p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Identity</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="developer@trimz.org"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Authentication Key</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[60px] bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <HashLoader size={20} color="#ffffff" /> : (
                                <>
                                    <span>Establish Connection</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security Notice */}
                    <div className="mt-8 pt-8 border-t border-slate-800 flex gap-3">
                        <AlertCircle className="text-slate-600 shrink-0" size={16} />
                        <p className="text-[11px] text-slate-500 leading-relaxed uppercase tracking-wider font-bold">
                            Warning: Unauthorized access to this terminal is strictly prohibited. All connection attempts are logged.
                        </p>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="flex justify-between items-center mt-8 px-2 text-[12px] font-bold text-slate-600">
                    <Link to="/home" className="hover:text-blue-400 transition-colors">Return to Site</Link>
                    <span className="opacity-20">•</span>
                    <button className="hover:text-blue-400 transition-colors">Request Support</button>
                    <span className="opacity-20">•</span>
                    <Link to="/admin/providers" className="hover:text-blue-400 transition-colors uppercase tracking-widest text-[10px]">Owner Login</Link>
                </div>
            </div>
        </section>
    );
};

export default SuperAdminLogin;
