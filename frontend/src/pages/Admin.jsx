import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock, Search, MapPin, Phone, User, Calendar, Activity, Info, BarChart3, ListChecks } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import MetricsDashboard from '../components/MetricsDashboard';

const STATUS_OPTIONS = ['Placed', 'Dispatched', 'Delivered'];

const Admin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ total: 0, pending: 0, delivered: 0 });
    const [activeTab, setActiveTab] = useState('metrics'); // 'metrics' or 'orders'
    const [socket, setSocket] = useState(null);
    const [realTimeMetrics, setRealTimeMetrics] = useState({ activeUsers: 0, pageVisits: {} });

    useEffect(() => {
        fetchOrders();

        // Initialize Real-time Connection
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        newSocket.on('newOrder', (newOrder) => {
            setOrders(prev => [newOrder, ...prev]);
            if (Notification.permission === "granted") {
                new Notification("New Order Received!", { body: `Custom: ${newOrder.customerName}` });
            }
        });

        newSocket.on('orderUpdate', (updatedOrder) => {
            setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
        });

        newSocket.on('metricsUpdate', (data) => {
            setRealTimeMetrics(data);
        });

        return () => newSocket.disconnect();
    }, []);

    useEffect(() => {
        const total = orders.length;
        const pending = orders.filter(o => o.status !== 'Delivered').length;
        const delivered = orders.filter(o => o.status === 'Delivered').length;
        setStats({ total, pending, delivered });
    }, [orders]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/orders/${orderId}`, {
                status: newStatus,
                note: `Order marked as ${newStatus} via BI Dashboard`
            });
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Placed': return <Clock size={16} className="text-blue-400" />;
            case 'Dispatched': return <Truck size={16} className="text-purple-400" />;
            case 'Delivered': return <CheckCircle size={16} className="text-green-400" />;
            default: return null;
        }
    };

    const filteredOrders = orders.filter(o =>
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.orderID && o.orderID.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-5xl font-bold brand-font">Business <span className="gold-gradient">Intelligence</span></h1>
                    <p className="text-slate-400 mt-2">Enterprise-grade tracking, analytics and CNN vision integration.</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 self-start md:self-auto">
                    <button
                        onClick={() => setActiveTab('metrics')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'metrics' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}
                    >
                        <BarChart3 size={18} />
                        Real-Time Metrics
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}
                    >
                        <ListChecks size={18} />
                        Order Management
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'metrics' ? (
                    <motion.div
                        key="metrics"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <MetricsDashboard metrics={realTimeMetrics} socket={socket} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="orders"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex gap-4 w-full md:w-auto">
                                <div className="glass-morphism px-6 py-3 rounded-2xl border border-white/5">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Orders</span>
                                    <span className="text-xl font-bold">{stats.total}</span>
                                </div>
                                <div className="glass-morphism px-6 py-3 rounded-2xl border border-white/5">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Pending</span>
                                    <span className="text-xl font-bold text-amber-500">{stats.pending}</span>
                                </div>
                            </div>

                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search Order ID, Client or Pattern..."
                                    className="input-field pl-12"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {loading ? (
                                <div className="text-center py-20">
                                    <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
                                    <p className="mt-4 text-slate-400">Syncing Ledger...</p>
                                </div>
                            ) : filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <motion.div
                                        layout
                                        key={order._id}
                                        className="glass-morphism rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all p-8"
                                    >
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                            <div className="space-y-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] text-amber-500 font-black tracking-widest uppercase">System Reference</span>
                                                    <h4 className="font-mono text-sm font-bold text-slate-300">{order.orderID}</h4>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                                                        <Package size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 uppercase font-bold">Identification</p>
                                                        <h3 className="text-lg font-bold text-white">{order.productName}</h3>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-white font-bold text-sm">
                                                    <User size={14} className="text-slate-500" />
                                                    {order.customerName}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                                                    <Phone size={12} />
                                                    {order.phoneNumber}
                                                </div>
                                                <div className="flex items-start gap-2 text-slate-400 text-[11px]">
                                                    <MapPin size={12} className="mt-1 flex-shrink-0" />
                                                    {order.address}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <p className="text-xs text-slate-500 uppercase font-bold">Operational Status</p>
                                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full w-fit">
                                                    {getStatusIcon(order.status)}
                                                    <span className="font-bold text-[10px] uppercase tracking-widest">{order.status}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <p className="text-xs text-slate-500 uppercase font-bold">Fulfillment Control</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {STATUS_OPTIONS.map(opt => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => updateStatus(order._id, opt)}
                                                            className={`flex-1 min-w-[70px] text-[9px] font-bold py-2 rounded-lg transition-all ${order.status === opt
                                                                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10'
                                                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                                }`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-20 glass-morphism rounded-3xl text-slate-500 font-bold">
                                    No records found.
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Admin;
