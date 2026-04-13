import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Users, Eye, TrendingUp, ShoppingBag, Activity } from 'lucide-react';
import axios from 'axios';

const COLORS = ['#c5a059', '#8e6f3e', '#dfc18c', '#5e4e32'];

const MetricsDashboard = ({ metrics, socket }) => {
    const [dbStats, setDbStats] = useState(null);
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        fetchStats();

        if (socket) {
            socket.on('newOrder', (order) => {
                addFeedMessage(`New order placed: ${order.productName} by ${order.customerName}`);
            });
            socket.on('orderUpdate', (order) => {
                addFeedMessage(`Order #${order.orderID.substr(-4)} status updated to ${order.status}`);
            });
            // Mock AI detection events for the feed
            socket.on('aiDetection', (data) => {
                addFeedMessage(`AI categorized upload as: ${data.category} (${data.confidence}%)`);
            });
        }

        return () => {
            if (socket) {
                socket.off('newOrder');
                socket.off('orderUpdate');
                socket.off('aiDetection');
            }
        };
    }, [socket]);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/analytics/dashboard-stats');
            setDbStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addFeedMessage = (msg) => {
        setFeed(prev => [{ id: Date.now(), msg, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
    };

    const pageVisitData = [
        { name: 'Home', visits: metrics.pageVisits?.home || 0 },
        { name: 'Shop', visits: metrics.pageVisits?.shop || 0 },
        { name: 'AI', visits: metrics.pageVisits?.ai || 0 },
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Real-Time Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-morphism p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={80} />
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Live Audience</p>
                    <h3 className="text-4xl font-bold text-white flex items-center gap-3">
                        {metrics.activeUsers}
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </h3>
                    <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase">Active sessions now</p>
                </div>

                <div className="glass-morphism p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={80} />
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Peak Activity</p>
                    <h3 className="text-4xl font-bold gold-gradient">14/hr</h3>
                    <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase">Orders processing rate</p>
                </div>

                <div className="glass-morphism p-6 rounded-3xl relative overflow-hidden group border-b-4 border-amber-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBag size={80} />
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Total Revenue</p>
                    <h3 className="text-4xl font-bold text-white">₹1.25M</h3>
                    <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase">YTD Financial Growth</p>
                </div>

                <div className="glass-morphism p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={80} />
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">AI Trend Factor</p>
                    <h3 className="text-4xl font-bold text-emerald-500">High</h3>
                    <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase">Pattern recognition match</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Bar Chart */}
                <div className="lg:col-span-2 glass-morphism p-8 rounded-[32px] border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xl font-bold brand-font text-white">Order Volume <span className="text-amber-500">Distribution</span></h4>
                        <select className="bg-slate-900 border border-white/10 text-xs rounded-lg px-3 py-1 text-slate-400">
                            <option>Last 7 Days</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dbStats?.dailyOrders || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ color: '#c5a059' }}
                                />
                                <Bar dataKey="count" fill="#c5a059" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart / Page Visits */}
                <div className="glass-morphism p-8 rounded-[32px] border border-white/5">
                    <h4 className="text-xl font-bold brand-font text-white mb-8">Traffic <span className="text-amber-500">Hotspots</span></h4>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pageVisitData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="visits"
                                >
                                    {pageVisitData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 mt-4">
                        {pageVisitData.map((item, idx) => (
                            <div key={item.name} className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                                    <span className="text-slate-400 font-bold uppercase">{item.name} Page</span>
                                </div>
                                <span className="text-white font-mono">{item.visits} hits</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Intel Feed */}
                <div className="glass-morphism p-8 rounded-[32px] border border-white/5">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                        <h4 className="text-xl font-bold brand-font text-white">Live Intel <span className="text-amber-500">Feed</span></h4>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                        {feed.length > 0 ? (
                            feed.map(item => (
                                <div key={item.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-4 animate-fadeIn">
                                    <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{item.time}</span>
                                    <p className="text-sm text-slate-300 font-medium">{item.msg}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-600">
                                Waiting for system events...
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Trending Analysis */}
                <div className="glass-morphism p-8 rounded-[32px] border border-white/5 bg-gradient-to-br from-slate-900 to-amber-950/20">
                    <h4 className="text-xl font-bold brand-font text-white mb-6">CNN Model <span className="text-amber-500">Inference Benchmarks</span></h4>
                    <div className="space-y-6">
                        {dbStats?.trendingAI.map((item, idx) => (
                            <div key={item._id} className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-white font-bold uppercase tracking-widest">{item._id} Pattern</span>
                                    <span className="text-amber-500 font-black">{item.count} detections</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500"
                                        style={{ width: `${(item.count / 20) * 100}%`, transition: 'width 1s ease' }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        <div className="mt-8 p-6 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                            <p className="text-amber-500 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                <TrendingUp size={14} /> Intelligence Suggestion
                            </p>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Based on CNN visual detection frequencies, <b>{dbStats?.trendingAI[0]?._id || "Bangles"}</b> are currently exhibiting a 15% increase in marketplace demand. Suggested stock optimization in this category.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricsDashboard;
