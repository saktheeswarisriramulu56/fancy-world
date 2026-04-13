import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product, onOrder }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="glass-morphism rounded-2xl overflow-hidden group border border-white/5 hover:border-amber-500/30 transition-all"
        >
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.trending && (
                    <div className="absolute top-4 left-4 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Star size={12} fill="currentColor" />
                        TRENDING
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button
                        onClick={() => onOrder(product)}
                        className="w-full gold-btn flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={18} />
                        ORDER NOW
                    </button>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-amber-500/80 text-xs font-semibold tracking-widest uppercase">{product.category}</span>
                    <span className="text-white font-bold">₹{product.price.toLocaleString()}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-2 truncate">{product.name}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{product.description}</p>
            </div>
        </motion.div>
    );
};

export default ProductCard;
