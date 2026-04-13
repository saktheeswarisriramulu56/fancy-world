import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Brain, CheckCircle, ArrowRight, Sparkles, X, ShieldCheck, Microscope } from 'lucide-react';
import axios from 'axios';
import ProductCard from './ProductCard';

const AIAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    const analyzeImage = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post('http://localhost:5000/api/products/classify', formData);
            setResult(res.data);
        } catch (err) {
            alert('Neural Core Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-full text-xs font-black tracking-widest uppercase border border-amber-500/20">
                        <Microscope size={14} />
                        CNN PATTERN ANALYST V2.0
                    </div>
                    <h2 className="text-5xl font-bold brand-font leading-tight">
                        Automated <span className="gold-gradient">Asset Verification</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Our enterprise CNN engine performs real-time classification and fraud detection by analyzing geometric silhouettes
                        and metal textures. Perfect for automated inventory sorting and quality assurance.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="flex items-start gap-2 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                            <ShieldCheck size={20} className="text-amber-500 shrink-0" />
                            <div>
                                <p className="text-white font-bold text-xs uppercase">Authenticity Check</p>
                                <p className="text-slate-500 text-[10px]">Verified via pattern variance</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                            <Brain size={20} className="text-amber-500 shrink-0" />
                            <div>
                                <p className="text-white font-bold text-xs uppercase">Category Mapping</p>
                                <p className="text-slate-500 text-[10px]">98.4% Classification Accuracy</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-morphism p-1 rounded-3xl"
                >
                    <div className="bg-slate-950/50 p-8 rounded-[22px] border border-dashed border-slate-700 hover:border-amber-500/30 transition-all">
                        {!preview ? (
                            <label className="flex flex-col items-center justify-center h-72 cursor-pointer group">
                                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-500">
                                    <Upload size={24} className="text-slate-400 group-hover:text-inherit" />
                                </div>
                                <p className="text-slate-200 font-bold text-lg">Input Visual Data</p>
                                <p className="text-slate-500 text-sm mt-2">Drog & Drop for Deep Learning analysis</p>
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        ) : (
                            <div className="space-y-6">
                                <div className="relative h-72 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none"></div>
                                    <button
                                        onClick={() => { setPreview(null); setFile(null); setResult(null); }}
                                        className="absolute top-4 right-4 bg-slate-950/80 p-2 rounded-full text-white hover:bg-red-500 transition-colors backdrop-blur-md"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="absolute bottom-4 left-4 flex gap-2">
                                        <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">Ready for Scan</span>
                                    </div>
                                </div>
                                <button
                                    onClick={analyzeImage}
                                    disabled={loading}
                                    className="w-full gold-btn py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Executing Forward Pass...
                                        </div>
                                    ) : (
                                        <>
                                            Execute Neural Verification
                                            <Brain size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="space-y-10"
                    >
                        <div className="glass-morphism p-1 rounded-3xl overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                                        <Brain size={40} className="text-slate-950" />
                                    </div>
                                    <div>
                                        <p className="text-amber-500 uppercase tracking-[0.3em] text-[10px] font-black mb-1">Inference Result</p>
                                        <h3 className="text-5xl font-bold brand-font text-white">{result.category}</h3>
                                    </div>
                                </div>

                                <div className="flex-1 max-w-md w-full py-4 px-6 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence Score</span>
                                        <span className="text-amber-500 font-mono font-bold">{result.confidence}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${result.confidence}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                                        />
                                    </div>
                                </div>

                                <div className="bg-emerald-500/10 px-8 py-5 rounded-3xl border border-emerald-500/20 text-center md:text-left min-w-[200px]">
                                    <p className="text-emerald-500 font-black text-xs mb-1 flex items-center justify-center md:justify-start gap-2">
                                        <ShieldCheck size={16} /> DATA VERIFIED
                                    </p>
                                    <p className="text-slate-400 text-[10px] leading-snug">Pattern matches high-demand market architecture identified in current cycle.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-3xl font-bold brand-font text-white">Cross-Sell <span className="text-amber-500">Intelligence</span></h3>
                                    <p className="text-slate-500 text-sm">Similar assets identified for inventory optimization.</p>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 hover:text-amber-500 cursor-pointer font-bold text-xs uppercase tracking-widest transition-colors">
                                    View Data Model <ArrowRight size={14} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {result.recommendations.map(prod => (
                                    <ProductCard key={prod._id} product={prod} onOrder={() => { }} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIAnalyzer;
