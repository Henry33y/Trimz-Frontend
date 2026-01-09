import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, UserPlus, LogOut, Users, Shield, History, RefreshCw, Moon, Sun } from 'lucide-react';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';
import { useTheme } from '../../context/ThemeContext';

const OwnerDashboard = () => {
    const { user, token, role } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [activeTab, setActiveTab] = useState('providers');
    const [statusFilter, setStatusFilter] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'
    const [rejectionReason, setRejectionReason] = useState({});
    const [showHistory, setShowHistory] = useState({});

    // Redirect if not admin
    useEffect(() => {
        if (!user || (role !== 'admin' && role !== 'superadmin')) {
            toast.error('Unauthorized access');
            navigate('/login');
        }
    }, [user, role, navigate]);

    // Fetch providers when filter changes
    useEffect(() => {
        if (activeTab === 'providers') {
            fetchProviders();
        }
    }, [statusFilter, activeTab]);

    const fetchProviders = async () => {
        try {
            setLoading(true);
            const endpoint = statusFilter === 'all'
                ? `${BASE_URL}/admin/providers`
                : `${BASE_URL}/admin/providers?status=${statusFilter}`;

            const res = await fetch(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to fetch providers');

            const data = await res.json();
            setProviders(data.data || []);
        } catch (error) {
            console.error('Error fetching providers:', error);
            toast.error('Failed to load providers');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (providerId, action) => {
        setActionLoading(providerId);
        try {
            const body = action === 'reject' && rejectionReason[providerId]
                ? { reason: rejectionReason[providerId] }
                : {};

            const res = await fetch(`${BASE_URL}/admin/providers/${providerId}/${action}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: action === 'reject' ? JSON.stringify(body) : undefined
            });

            if (!res.ok) throw new Error(`Failed to ${action} provider`);

            const data = await res.json();
            toast.success(data.message || `Provider ${action}d successfully!`);

            // Refresh the list
            fetchProviders();
            setRejectionReason({});

        } catch (error) {
            console.error(`Error ${action}ing provider:`, error);
            toast.error(`Failed to ${action} provider`);
        } finally {
            setActionLoading(null);
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login');
        toast.success('Logged out successfully');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 md:p-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-gray-100">Admin Dashboard</h1>
                        <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm sm:text-base">{user?.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-500 text-white font-bold rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition w-full sm:w-auto"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 border-b border-gray-200 dark:border-slate-700">
                    <button
                        onClick={() => setActiveTab('providers')}
                        className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-3 font-bold transition ${activeTab === 'providers'
                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <Users size={20} />
                        <span className="text-sm sm:text-base">Provider Management</span>
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'providers' ? (
                    <div>
                        {/* Status Filters */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {['pending', 'approved', 'rejected', 'all'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 sm:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm capitalize transition ${statusFilter === status
                                        ? 'bg-blue-600 dark:bg-blue-500 text-white'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        {/* Providers Table */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                                        <tr>
                                            <th className="px-6 py-4 font-bold text-slate-700 dark:text-gray-300 sticky left-0 z-10 bg-gray-50 dark:bg-slate-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Name</th>
                                            <th className="px-6 py-4 font-bold text-slate-700 dark:text-gray-300">Email</th>
                                            <th className="px-6 py-4 font-bold text-slate-700 dark:text-gray-300">Status</th>
                                            <th className="px-6 py-4 font-bold text-slate-700 dark:text-gray-300">Date Joined</th>
                                            <th className="px-6 py-4 font-bold text-slate-700 dark:text-gray-300">History</th>
                                            <th className="px-6 py-4 font-bold text-slate-700 dark:text-gray-300 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                        {providers.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-gray-400">
                                                    No providers found for this filter.
                                                </td>
                                            </tr>
                                        ) : (
                                            providers.map((provider) => (
                                                <tr key={provider._id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-gray-100 sticky left-0 z-10 bg-white dark:bg-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                                        {provider.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-gray-400">
                                                        {provider.email}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${provider.status === 'approved' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                                                            provider.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                                                                'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                                                            }`}>
                                                            {provider.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 dark:text-gray-400">
                                                        {new Date(provider.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {provider.approvalHistory?.length > 0 && (
                                                            <button
                                                                onClick={() => setShowHistory({
                                                                    ...showHistory,
                                                                    [provider._id]: !showHistory[provider._id]
                                                                })}
                                                                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-bold"
                                                            >
                                                                <History size={14} />
                                                                {provider.approvalHistory.length}
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {provider.status === 'pending' ? (
                                                            <div className="flex gap-2 justify-end">
                                                                <button
                                                                    onClick={() => handleAction(provider._id, 'approve')}
                                                                    disabled={actionLoading === provider._id}
                                                                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition disabled:opacity-50"
                                                                >
                                                                    {actionLoading === provider._id ? <Loader2 size={14} className="animate-spin" /> : 'Approve'}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAction(provider._id, 'reject')}
                                                                    disabled={actionLoading === provider._id}
                                                                    className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition disabled:opacity-50"
                                                                >
                                                                    {actionLoading === provider._id ? <Loader2 size={14} className="animate-spin" /> : 'Reject'}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex gap-2 justify-end items-center">
                                                                {provider.status === 'approved' && (
                                                                    <button
                                                                        onClick={() => handleAction(provider._id, 'reject')}
                                                                        disabled={actionLoading === provider._id}
                                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white font-bold rounded hover:bg-orange-700 transition disabled:opacity-50 text-xs"
                                                                    >
                                                                        <RefreshCw size={12} />
                                                                        Reject
                                                                    </button>
                                                                )}
                                                                {provider.status === 'rejected' && (
                                                                    <button
                                                                        onClick={() => handleAction(provider._id, 'approve')}
                                                                        disabled={actionLoading === provider._id}
                                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition disabled:opacity-50 text-xs"
                                                                    >
                                                                        <RefreshCw size={12} />
                                                                        Re-approve
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* History Panels */}
                            {providers.map((provider) => (
                                showHistory[provider._id] && provider.approvalHistory?.length > 0 && (
                                    <div key={`history-${provider._id}`} className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                                        <h4 className="font-bold text-slate-900 mb-3">Approval History for {provider.name}</h4>
                                        <div className="space-y-2">
                                            {provider.approvalHistory.map((entry, idx) => (
                                                <div key={idx} className="bg-white p-3 rounded border border-gray-200 text-xs">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className={`px-2 py-0.5 rounded font-bold ${entry.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {entry.status.toUpperCase()}
                                                        </span>
                                                        <span className="text-slate-500">
                                                            {new Date(entry.timestamp).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="text-slate-600">
                                                        <span className="font-medium">By:</span> {entry.changedByEmail}
                                                    </div>
                                                    {entry.reason && (
                                                        <div className="text-slate-600 mt-1">
                                                            <span className="font-medium">Reason:</span> {entry.reason}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default OwnerDashboard;
