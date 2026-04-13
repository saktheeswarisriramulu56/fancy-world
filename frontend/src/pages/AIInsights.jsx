import React from 'react';
import AIAnalyzer from '../components/AIAnalyzer';

const AIInsights = () => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <h1 className="text-6xl font-bold brand-font">AI <span className="gold-gradient">Intelligence</span></h1>
                <p className="text-slate-400 text-lg">
                    Leverage our proprietary Convolutional Neural Network (CNN) to explore the world of jewellery.
                    Upload an image to get instant insights into type, craftsmanship, and matching sets.
                </p>
            </div>

            <AIAnalyzer />

            {/* Feature Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
                <div className="glass-morphism p-10 rounded-3xl space-y-6">
                    <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <h3 className="text-3xl font-bold brand-font">Trend Identification</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Our AI analyzes thousands of image patterns from global markets to identify emerging trends in real-time.
                        Stay ahead of the fashion curve with metadata-driven insights.
                    </p>
                </div>
                <div className="glass-morphism p-10 rounded-3xl space-y-6">
                    <div className="w-16 h-16 bg-purple-500/20 text-purple-500 rounded-2xl flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <h3 className="text-3xl font-bold brand-font">Pattern Verification</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Every piece in our collection is verified for pattern consistency. Our CNN ensures that "Jhumkas" are
                        correctly identified and categorised based on their geometric silhouette.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AIInsights;
