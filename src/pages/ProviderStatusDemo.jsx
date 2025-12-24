import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, CheckCircle, Clock, XCircle } from 'lucide-react';

const ProviderStatusDemo = () => {
    const [selectedStatus, setSelectedStatus] = useState('pending');

    const mockProvider = {
        name: "John Doe",
        email: "john@example.com",
        role: "provider",
        status: selectedStatus
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Provider Approval Status Demo</h1>

                {/* Status Selector */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Select Provider Status to Preview:</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setSelectedStatus('pending')}
                            className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${selectedStatus === 'pending'
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Clock className="inline mr-2" size={20} />
                            Pending
                        </button>
                        <button
                            onClick={() => setSelectedStatus('approved')}
                            className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${selectedStatus === 'approved'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <CheckCircle className="inline mr-2" size={20} />
                            Approved
                        </button>
                        <button
                            onClick={() => setSelectedStatus('rejected')}
                            className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${selectedStatus === 'rejected'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <XCircle className="inline mr-2" size={20} />
                            Rejected
                        </button>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-lg font-bold mb-4 text-gray-600">Preview for Status: <span className="text-black capitalize">{selectedStatus}</span></h3>

                    {selectedStatus === 'pending' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white text-center rounded-2xl">
                                <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <Clock className="w-12 h-12" />
                                </div>
                                <h1 className="text-3xl font-black mb-2">Account Pending Approval</h1>
                                <p className="text-amber-50">Your provider account is under review</p>
                            </div>

                            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
                                <h4 className="font-bold text-amber-900 mb-2">What's happening?</h4>
                                <p className="text-amber-800">
                                    Your account is awaiting approval from our team. This is a standard security measure.
                                </p>
                            </div>

                            <div className="text-center">
                                <Link
                                    to="/pending-approval"
                                    className="inline-block bg-amber-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-600 transition-all"
                                >
                                    View Full Pending Page →
                                </Link>
                            </div>
                        </div>
                    )}

                    {selectedStatus === 'approved' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white text-center rounded-2xl">
                                <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <h1 className="text-3xl font-black mb-2">Account Approved!</h1>
                                <p className="text-green-50">You can now access all provider features</p>
                            </div>

                            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                                <h4 className="font-bold text-green-900 mb-2">You can now:</h4>
                                <ul className="text-green-800 space-y-2">
                                    <li>✅ Upload services</li>
                                    <li>✅ Appear in customer searches</li>
                                    <li>✅ Receive bookings</li>
                                    <li>✅ Manage your profile</li>
                                </ul>
                            </div>

                            <div className="text-center">
                                <Link
                                    to="/barbers/profile/me"
                                    className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-all"
                                >
                                    Go to Dashboard →
                                </Link>
                            </div>
                        </div>
                    )}

                    {selectedStatus === 'rejected' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-red-500 to-rose-500 p-8 text-white text-center rounded-2xl">
                                <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <XCircle className="w-12 h-12" />
                                </div>
                                <h1 className="text-3xl font-black mb-2">Application Not Approved</h1>
                                <p className="text-red-50">Your provider application was not approved</p>
                            </div>

                            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                                <h4 className="font-bold text-red-900 mb-2">What can you do?</h4>
                                <p className="text-red-800 mb-4">
                                    If you believe this is an error, please contact our support team to discuss your application.
                                </p>
                                <a
                                    href="mailto:support@trimz.com"
                                    className="text-red-600 font-bold underline hover:text-red-700"
                                >
                                    Contact Support
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* How It Works */}
                <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-4">📋 How the Approval System Works:</h3>
                    <ol className="space-y-3 text-blue-800">
                        <li className="flex gap-3">
                            <span className="font-bold">1.</span>
                            <span>Provider registers with role = "provider"</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold">2.</span>
                            <span>Status automatically set to "pending"</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold">3.</span>
                            <span>Owner receives email with approval link</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold">4.</span>
                            <span>When provider logs in, they see the pending approval page</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold">5.</span>
                            <span>Owner clicks approve → Status changes to "approved"</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold">6.</span>
                            <span>Provider can now access full features</span>
                        </li>
                    </ol>
                </div>

                {/* Test Links */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/register"
                        className="bg-white border-2 border-gray-200 p-4 rounded-lg text-center hover:border-blue-500 transition-all"
                    >
                        <User className="mx-auto mb-2" size={32} />
                        <div className="font-bold">Test Registration</div>
                        <div className="text-sm text-gray-500">Sign up as provider</div>
                    </Link>

                    <Link
                        to="/pending-approval"
                        className="bg-white border-2 border-gray-200 p-4 rounded-lg text-center hover:border-amber-500 transition-all"
                    >
                        <Clock className="mx-auto mb-2 text-amber-500" size={32} />
                        <div className="font-bold">Pending Page</div>
                        <div className="text-sm text-gray-500">View pending approval</div>
                    </Link>

                    <Link
                        to="/login"
                        className="bg-white border-2 border-gray-200 p-4 rounded-lg text-center hover:border-green-500 transition-all"
                    >
                        <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
                        <div className="font-bold">Test Login</div>
                        <div className="text-sm text-gray-500">Login as provider</div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProviderStatusDemo;
