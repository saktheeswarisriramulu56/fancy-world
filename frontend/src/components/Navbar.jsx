import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, LayoutDashboard, BrainCircuit, Home } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="glass-morphism fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">J</span>
                </div>
                <span className="text-2xl font-bold gold-gradient brand-font tracking-wider">AURA JEWELS</span>
            </Link>

            <div className="flex items-center gap-8">
                <Link to="/" className="text-slate-300 hover:text-amber-500 transition-colors flex items-center gap-2">
                    <Home size={18} />
                    <span className="hidden md:inline">Home</span>
                </Link>
                <Link to="/shop" className="text-slate-300 hover:text-amber-500 transition-colors flex items-center gap-2">
                    <ShoppingBag size={18} />
                    <span className="hidden md:inline">Shop</span>
                </Link>
                <Link to="/ai-insights" className="text-slate-300 hover:text-amber-500 transition-colors flex items-center gap-2">
                    <BrainCircuit size={18} />
                    <span className="hidden md:inline">AI Analysis</span>
                </Link>
                <Link to="/admin" className="text-slate-300 hover:text-amber-500 transition-colors flex items-center gap-2">
                    <LayoutDashboard size={18} />
                    <span className="hidden md:inline">Admin</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
