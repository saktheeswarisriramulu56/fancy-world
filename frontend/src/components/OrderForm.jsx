import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CreditCard, Truck, ShieldCheck, Database } from 'lucide-react';
import axios from 'axios';

const OrderForm = ({ product, isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        phoneNumber: '',
        address: '',
        quantity: 1,
        paymentMethod: 'Razorpay'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/orders', {
                ...formData,
                productName: product.name,
                statusHistory: [{ status: 'Placed', note: 'Order initialized via web interface' }]
            });
            setOrderInfo(response.data);
            setSuccess(true);
            // Don't close immediately so customer can see their Order ID
        } catch (err) {
            alert('Transmission Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="glass-morphism w-full max-w-2xl rounded-[32px] overflow-hidden relative border border-white/10"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white transition-colors z-10"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col md:flex-row min-h-[500px]">
                        <div className="md:w-5/12 relative">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/50 md:hidden"></div>
                            <div className="absolute bottom-6 left-6 right-6 p-4 glass-morphism rounded-2xl border border-white/10">
                                <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">Asset Selection</p>
                                <h3 className="text-white font-bold leading-tight">{product.name}</h3>
                            </div>
                        </div>

                        <div className="p-10 md:w-7/12 bg-slate-950/40">
                            {success ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/10">
                                        <ShieldCheck size={48} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-bold text-white brand-font">Order Logged</h2>
                                        <p className="text-slate-400 text-sm">Transaction recorded in cloud ledger.</p>
                                    </div>
                                    <div className="w-full p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 uppercase font-black">Tracking Reference</span>
                                            <span className="text-amber-500 font-mono font-bold">{orderInfo?.orderID}</span>
                                        </div>
                                        <div className="h-[1px] bg-white/10"></div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 uppercase font-black">Logistics Status</span>
                                            <span className="text-emerald-500 font-bold uppercase">{orderInfo?.status}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="w-full py-4 border border-slate-700 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold"
                                    >
                                        Close Terminal
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-amber-500 mb-2">
                                            <Database size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Data Entry</span>
                                        </div>
                                        <h2 className="text-3xl font-bold text-white brand-font">Order Initialisation</h2>
                                        <p className="text-slate-500 text-xs">Enter client credentials for logistics mapping.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Full Legal Name"
                                                className="input-field py-4"
                                                required
                                                value={formData.customerName}
                                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Primary Contact Node (Phone)"
                                                className="input-field py-4"
                                                required
                                                value={formData.phoneNumber}
                                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            />
                                        </div>

                                        <textarea
                                            placeholder="Deployment Address (Physical Location)"
                                            className="input-field h-24 resize-none py-4"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        ></textarea>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-2">Quantity</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="input-field py-3"
                                                    value={formData.quantity}
                                                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="input-field py-3 flex items-center gap-2 bg-slate-900/50 cursor-not-allowed text-amber-500">
                                                    <ShieldCheck size={16} />
                                                    <span className="text-sm font-bold tracking-wide">Razorpay Secure</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Settlement Total</p>
                                            <p className="text-3xl font-bold text-white">₹{(product.price * formData.quantity).toLocaleString()}</p>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="gold-btn px-10 py-5 flex items-center gap-3 text-sm"
                                        >
                                            {loading ? 'Transmitting...' : 'Commit Order'}
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default OrderForm;
