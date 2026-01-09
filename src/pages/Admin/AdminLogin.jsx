import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Shield, Mail, Lock, Loader2, ArrowRight,
    LayoutDashboard, Briefcase, ChevronLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext.jsx';
import { BASE_URL } from '../../config';
import logo from '../../assets/images/trimz.png';

const AdminLogin = () => {
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
            if (!res.ok) throw new Error(result.message || 'Login failed');

            const userRole = result.data.role;

            if (userRole !== 'admin' && userRole !== 'superadmin') {
                toast.error('This portal is for Business Administrators only.');
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

            toast.success('Admin Session Started');
            navigate('/admin/providers', { replace: true });
        } catch (err) {
            toast.error(err.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
            <Link to="/home" className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                <ChevronLeft size={20} />
                <span className="font-bold">Back to Site</span>
            </Link>

            <div className="w-full max-w-md">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-primaryColor/10 rounded-3xl mb-6">
                                <Shield className="text-primaryColor w-10 h-10" />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
                            <p className="text-slate-500 mt-2 font-medium">Internal Management Access</p>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primaryColor outline-none transition-all font-medium"
                                        placeholder="admin@trimz.org"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primaryColor outline-none transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-primaryColor transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-900/10"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        <span>Secure Login</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Briefcase size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Business</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <LayoutDashboard size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-8 text-slate-400 text-sm">
                    Protected by Trimz Security Services
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
