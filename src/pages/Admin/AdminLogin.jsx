import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, Loader2, Landmark, HelpCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { BASE_URL } from '../config';
import logo from '../assets/images/trimz.png';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { token, role, dispatch } = useContext(AuthContext);

    useEffect(() => {
        if (token && role === 'admin') {
            navigate('/admin/providers');
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

            if (result.data.role !== 'admin' && result.data.role !== 'superadmin') {
                throw new Error('This portal is strictly for Business Administrators.');
            }

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: result.data,
                    token: result.token,
                    role: result.data.role,
                },
            });

            toast.success('Admin Session Authenticated');
            navigate('/admin/providers');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-6 transition-colors duration-300">
            <div className="max-w-[1100px] w-full flex bg-slate-50 dark:bg-slate-800 rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">

                {/* Visual Side */}
                <div className="hidden lg:block w-1/2 p-12 bg-slate-900 text-white relative">
                    <div className="absolute inset-0 bg-blue-600/5 opacity-40"></div>
                    <div className="relative h-full flex flex-col justify-between">
                        <div>
                            <img src={logo} alt="Trimz" className="h-20 brightness-0 invert" />
                        </div>

                        <div className="space-y-6">
                            <div className="inline-flex p-4 rounded-3xl bg-blue-600/20 text-blue-400">
                                <Landmark size={40} />
                            </div>
                            <h2 className="text-4xl font-black leading-tight">Business <br />Administrator Portal</h2>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                Manage provider approvals, platform oversight, and business growth tools from one centralized hub.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 text-slate-500 text-sm font-bold uppercase tracking-widest">
                            <span>Trust</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                            <span>Scale</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                            <span>Control</span>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center bg-white dark:bg-slate-800">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="lg:hidden mb-8 flex justify-center">
                            <img src={logo} alt="Trimz" className="h-20" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Admin Sign In</h1>
                        <p className="text-slate-500 dark:text-gray-400 font-medium italic">Restricted business access only</p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Work Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="admin@trimz.org"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-12 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white h-[64px] rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <span>Authenticate Session</span>
                                    <Shield size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <Link to="/" className="text-slate-400 hover:text-blue-500 font-bold text-sm transition-colors">Return Home</Link>
                        <div className="flex items-center gap-2 text-slate-400">
                            <HelpCircle size={16} />
                            <span className="text-sm font-medium">Internal Help Desk</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminLogin;
