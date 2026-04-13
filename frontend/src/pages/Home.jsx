import axios from 'axios';
import ProductCard from '../components/ProductCard';
import OrderForm from '../components/OrderForm';
import { io } from 'socket.io-client';

const Home = () => {
    const [trending, setTrending] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const socket = io('http://localhost:5000');
        socket.emit('pageVisit', 'home');

        axios.get('http://localhost:5000/api/products')
            .then(res => setTrending(res.data.filter(p => p.trending).slice(0, 4)))
            .catch(err => console.error(err));

        return () => socket.disconnect();
    }, []);

    return (
        <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-32">
            {/* Hero Section */}
            <section className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-full text-sm font-bold tracking-widest uppercase">
                            <Sparkles size={16} /> The Future of Luxury
                        </div>
                        <h1 className="text-7xl font-bold brand-font leading-[1.1]">
                            Elegance <br />
                            <span className="gold-gradient text-8xl">Reimagined</span>
                        </h1>
                        <p className="text-slate-400 text-xl max-w-lg leading-relaxed">
                            Experience the perfect fusion of traditional craftsmanship and AI-driven precision. Discover our curated collection curated by technology.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex gap-4"
                    >
                        <button className="gold-btn px-10 py-5 text-lg flex items-center gap-2">
                            Explore Collection <ArrowRight size={20} />
                        </button>
                        <button className="px-10 py-5 border border-slate-700 rounded-xl hover:bg-white/5 transition-colors font-bold">
                            Our Legacy
                        </button>
                    </motion.div>

                    <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-800">
                        <div>
                            <p className="text-3xl font-bold text-white">10K+</p>
                            <p className="text-slate-500 text-sm">Unique Designs</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">100%</p>
                            <p className="text-slate-500 text-sm">Pure Gold</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">24/7</p>
                            <p className="text-slate-500 text-sm">AI Assistance</p>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="relative"
                >
                    <div className="absolute -inset-10 bg-amber-500/20 blur-[100px] rounded-full"></div>
                    <img
                        src="https://images.unsplash.com/photo-1515562141207-7a88fb0ce33e?q=80&w=1000&auto=format&fit=crop"
                        alt="Hero Jewellery"
                        className="w-full h-[600px] object-cover rounded-[40px] shadow-2xl relative z-10 border border-white/10"
                    />
                    <div className="absolute bottom-10 -left-10 glass-morphism p-6 rounded-2xl z-20 animate-bounce">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                                <ShieldCheck size={24} className="text-slate-950" />
                            </div>
                            <div>
                                <p className="text-white font-bold">Certified Quality</p>
                                <p className="text-slate-400 text-xs">BIS Hallmark Gold</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Featured Section */}
            <section>
                <div className="flex justify-between items-end mb-12">
                    <div className="space-y-2">
                        <p className="text-amber-500 font-bold uppercase tracking-[0.2em] text-sm">Curated Selection</p>
                        <h2 className="text-5xl font-bold brand-font">Trending <span className="gold-gradient">Masterpieces</span></h2>
                    </div>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-amber-500 font-bold transition-colors">
                        View All Series <ArrowRight size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {trending.map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onOrder={(p) => setSelectedProduct(p)}
                        />
                    ))}
                </div>
            </section>

            {/* Trust Badges */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="glass-morphism p-10 rounded-3xl space-y-4">
                    <Zap size={32} className="text-amber-500" />
                    <h3 className="text-2xl font-bold">Fast Delivery</h3>
                    <p className="text-slate-400">Insured express shipping across the globe within 3-5 business days.</p>
                </div>
                <div className="glass-morphism p-10 rounded-3xl space-y-4 border-t-4 border-amber-500">
                    <ShieldCheck size={32} className="text-amber-500" />
                    <h3 className="text-2xl font-bold">AI Verified</h3>
                    <p className="text-slate-400">Every design is analyzed by our CNN algorithm to ensure unique patterns.</p>
                </div>
                <div className="glass-morphism p-10 rounded-3xl space-y-4">
                    <Sparkles size={32} className="text-amber-500" />
                    <h3 className="text-2xl font-bold">Lifetime Warranty</h3>
                    <p className="text-slate-400">We stand by our craftsmanship. Enjoy a lifetime warranty on all pieces.</p>
                </div>
            </section>

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

export default Home;
