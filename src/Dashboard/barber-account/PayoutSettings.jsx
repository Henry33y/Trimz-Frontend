import { useState, useEffect } from "react";
import { BASE_URL, token } from "../../config";
import { toast } from "react-toastify";
import { Loader2, CreditCard, Landmark, CheckCircle2, AlertCircle, Trash2, Smartphone } from "lucide-react";

const PayoutSettings = ({ barberData }) => {
    const [loading, setLoading] = useState(false);
    const [payoutData, setPayoutData] = useState({
        bankCode: barberData?.paystackBankCode || "",
        accountNumber: barberData?.paystackAccountNumber || "",
        accountName: barberData?.name || "",
    });

    const banks = [
        { code: "MTN", name: "MTN Mobile Money", type: "momo" },
        { code: "VOD", name: "Telecel (Vodafone) Cash", type: "momo" },
        { code: "ATL", name: "AirtelTigo Money", type: "momo" },
        { code: "058", name: "GTBank Ghana", type: "bank" },
        { code: "044", name: "Ecobank Ghana", type: "bank" },
        { code: "030", name: "GCB Bank", type: "bank" },
        { code: "017", name: "Fidelity Bank", type: "bank" },
        { code: "013", name: "Access Bank", type: "bank" },
    ];

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to remove your payout settings? This will deactivate automatic splits on Paystack.")) return;
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/payments/settings`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token()}`,
                },
            });

            const result = await res.json();
            if (result.success) {
                toast.success("Payout settings removed successfully");
                setPayoutData({ bankCode: "", accountNumber: "", accountName: "" });
            } else {
                toast.error(result.message || "Failed to remove settings");
            }
        } catch (error) {
            toast.error("Network error deleting payout settings");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/payments/settings`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payoutData),
            });

            const result = await res.json();
            if (result.success) {
                toast.success("Payout settings updated! You are now ready for automatic splits.");
            } else {
                toast.error(result.message || "Failed to update settings");
            }
        } catch (error) {
            toast.error("Network error updating payout settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                    <CreditCard size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Payout</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Automatic Split Configuration</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={handleUpdate} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-8 shadow-sm">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 text-left">Settlement Channel</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {banks.map((bank) => (
                                        <button
                                            key={bank.code}
                                            type="button"
                                            onClick={() => setPayoutData({ ...payoutData, bankCode: bank.code })}
                                            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${payoutData.bankCode === bank.code
                                                ? "border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                                                : "border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 dark:bg-slate-900/50"
                                                }`}
                                        >
                                            <div className={`p-2 rounded-xl ${payoutData.bankCode === bank.code ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                                                {bank.type === 'momo' ? <Smartphone size={16} /> : <Landmark size={16} />}
                                            </div>
                                            <span className="text-xs font-bold">{bank.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Mobile Number / Bank Account</label>
                                    <input
                                        type="text"
                                        value={payoutData.accountNumber}
                                        onChange={(e) => setPayoutData({ ...payoutData, accountNumber: e.target.value })}
                                        placeholder="054XXXXXXX"
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 outline-none transition-all dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Identity Name (On Account)</label>
                                    <input
                                        type="text"
                                        value={payoutData.accountName}
                                        onChange={(e) => setPayoutData({ ...payoutData, accountName: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 outline-none transition-all dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                    {barberData?.paystackSubaccountCode ? "Update Settings" : "Activate Payouts"}
                                </button>

                                {barberData?.paystackSubaccountCode && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={loading}
                                        className="px-6 py-5 bg-rose-500/10 text-rose-500 rounded-2xl font-black text-[10px] uppercase hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-600/20">
                        <Landmark size={32} className="mb-6 opacity-50" />
                        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4">Instant Settlement</h3>
                        <p className="text-xs font-medium leading-loose text-indigo-100">
                            By adding your Momo details, you enable the **Paystack Dynamic Split**. Every time a customer pays, your share is sent directly to this account by the platform bank.
                        </p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-[2rem] p-8">
                        <div className="flex items-center gap-3 mb-4 text-amber-600">
                            <AlertCircle size={20} />
                            <h4 className="text-xs font-black uppercase tracking-widest">Verify Details</h4>
                        </div>
                        <p className="text-[10px] font-bold text-amber-800 dark:text-amber-200 uppercase leading-relaxed tracking-wider">
                            Ensure the phone number provided is registered on the correct network. Incorrect details may result in delayed settlement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayoutSettings;
