import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import OrderForm from '../components/OrderForm';
import { Search, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Bangles', 'Anklets', 'Studs', 'Jhumkas', 'Chains', 'Necklaces'];

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(res => {
                setProducts(res.data);
                setFiltered(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        let result = products;
        if (activeTab !== 'All') {
            result = result.filter(p => p.category === activeTab);
        }
        if (searchTerm) {
            result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        setFiltered(result);
    }, [activeTab, searchTerm, products]);

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-6xl font-bold brand-font">Our <span className="gold-gradient">Catalogue</span></h1>
                <p className="text-slate-400">Browse our exquisite range of handcrafted jewellery pieces, each one a testament to luxury and artistry.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === cat
                                    ? 'bg-amber-500 text-slate-950'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="input-field pl-12"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filtered.length > 0 ? (
                    filtered.map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onOrder={(p) => setSelectedProduct(p)}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <Filter size={48} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-500 text-xl font-bold">No products found in this category.</p>
                    </div>
                )}
            </div>

            {selectedProduct && (
                <OrderForm
                    product={selectedProduct}
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default Shop;
