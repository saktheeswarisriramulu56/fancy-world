import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Admin from './pages/Admin';
import AIInsights from './pages/AIInsights';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 py-12 px-6 mt-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h2 className="brand-font text-2xl gold-gradient font-bold tracking-wider">AURA JEWELS</h2>
              <p className="text-slate-500 text-sm">Crafting timeless elegance through the lens of modern AI. Experience the fusion of art and technology.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="text-slate-500 text-sm space-y-2">
                <li><a href="/" className="hover:text-amber-500">Home</a></li>
                <li><a href="/shop" className="hover:text-amber-500">Shop</a></li>
                <li><a href="/ai-insights" className="hover:text-amber-500">AI Analysis</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="text-slate-500 text-sm space-y-2">
                <li>Email: concierge@aurajewels.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>Address: Beverly Hills, CA</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Newsletter</h3>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="input-field py-2" />
                <button className="gold-btn py-2">Join</button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-900 text-center text-slate-600 text-xs">
            © 2026 Aura Jewels. Powered by CNN Image Recognition. All Rights Reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
