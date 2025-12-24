/* eslint-disable react/prop-types */
import { MessageCircle, Phone, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProviderContact = ({ providerData }) => {
    const handleWhatsApp = () => {
        if (providerData?.phone) {
            const message = encodeURIComponent(`Hi ${providerData.name}, I'd like to connect regarding professional collaboration.`);
            window.open(`https://wa.me/${providerData.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
        } else {
            toast.error('Phone number not available');
        }
    };

    const handleCall = () => {
        if (providerData?.phone) {
            window.location.href = `tel:${providerData.phone}`;
        } else {
            toast.error('Phone number not available');
        }
    };

    const handleSendMessage = () => {
        // Placeholder for in-app messaging feature
        toast.info('In-app messaging coming soon! For now, use WhatsApp or call.');
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-2">
                    Connect with {providerData?.name}
                </h2>
                <p className="text-slate-600 dark:text-gray-400">
                    Reach out for collaboration, client referrals, or professional inquiries
                </p>
            </div>

            {/* Provider Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4">
                    <img
                        src={providerData?.profilePicture?.url || '/placeholder.jpg'}
                        alt={providerData?.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md"
                        onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
                    />
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-gray-100 text-lg">{providerData?.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-gray-400">{providerData?.specialization || 'Professional Stylist'}</p>
                        {providerData?.location && (
                            <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">📍 {providerData.location}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Contact Options */}
            <div className="space-y-3 mb-6">
                <h3 className="text-sm font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                    Choose Contact Method
                </h3>

                {/* WhatsApp Button */}
                <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center gap-3 p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all shadow-lg shadow-green-500/20 active:scale-95"
                >
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <FaWhatsapp className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                        <div className="font-bold">Message on WhatsApp</div>
                        <div className="text-xs text-green-100">Start a quick conversation</div>
                    </div>
                </button>

                {/* Phone Call Button */}
                <button
                    onClick={handleCall}
                    className="w-full flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                        <div className="font-bold">Call Directly</div>
                        <div className="text-xs text-blue-100">
                            {providerData?.phone || 'Phone number not available'}
                        </div>
                    </div>
                </button>

                {/* In-App Message Button (Coming Soon) */}
                <button
                    onClick={handleSendMessage}
                    className="w-full flex items-center gap-3 p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-300 rounded-xl transition-all border-2 border-slate-200 dark:border-slate-600 active:scale-95"
                >
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                        <Send className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                        <div className="font-bold">Send In-App Message</div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">Coming soon!</div>
                    </div>
                </button>
            </div>

            {/* Why Connect Section */}
            <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-5">
                <h4 className="font-bold text-slate-900 dark:text-gray-100 mb-3 text-sm">Why Connect?</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                        <span>Collaborate on projects or share workspace</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                        <span>Refer clients when you're fully booked</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                        <span>Exchange tips, tools, and industry insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                        <span>Build professional networking opportunities</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ProviderContact;
