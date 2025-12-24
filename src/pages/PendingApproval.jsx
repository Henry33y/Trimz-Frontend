import { useAuth } from "../context/AuthContext";
import { AlertCircle, Clock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PendingApproval = () => {
    const { user, dispatch } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        navigate("/login");
    };

    if (!user || user.status !== "pending") {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header with Icon */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Clock className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-black mb-2">Account Pending Approval</h1>
                    <p className="text-amber-50">Your provider account is under review</p>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mb-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-amber-900 mb-2">What's happening?</h3>
                                <p className="text-amber-800 leading-relaxed">
                                    Thank you for registering as a provider on Trimz! Your account is currently awaiting approval from our team.
                                    This is a standard security measure to ensure the quality of services on our platform.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="bg-slate-50 rounded-xl p-6 mb-6">
                        <h3 className="font-bold text-slate-900 mb-4">Your Account Details</h3>
                        <div className="space-y-3 text-slate-700">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Name:</span>
                                <span className="font-semibold">{user.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Email:</span>
                                <span className="font-semibold">{user.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Role:</span>
                                <span className="font-semibold capitalize">{user.role}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Status:</span>
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
                                    <Clock size={14} />
                                    Pending
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* What To Expect */}
                    <div className="mb-6">
                        <h3 className="font-bold text-slate-900 mb-4">What happens next?</h3>
                        <ul className="space-y-3 text-slate-700">
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                <span>Our team reviews your registration details</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                <span>You'll receive an email notification once approved</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                <span>After approval, you can upload services and appear to customers</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="text-blue-900 font-semibold mb-1">Need help?</p>
                                <p className="text-blue-700">
                                    If you have questions, contact us at{" "}
                                    <a href="mailto:support@trimz.com" className="underline font-bold">
                                        support@trimz.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleLogout}
                            className="flex-1 py-3 px-6 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                        >
                            Logout
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 py-3 px-6 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Refresh Status
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingApproval;
