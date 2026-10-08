// src/components/HeroSection.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, FileText, ShieldCheck, HelpCircle, ArrowRight, Sparkles, Loader2, X } from 'lucide-react';
import { setSearchQuery, setAiAnswer, setAiLoading, clearAiAnswer } from '../store/servicesSlice';
import { askGeminiAssistant } from '../services/geminiService';

export default function HeroSection() {
  const dispatch = useDispatch();
  const { searchQuery, aiAnswer, aiLoading } = useSelector((state) => state.services);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || aiLoading) return;

    dispatch(setAiLoading(true));
    dispatch(clearAiAnswer());

    // Gemini API Call
    const response = await askGeminiAssistant(searchQuery);
    
    dispatch(setAiAnswer(response));
    dispatch(setAiLoading(false));
  };

  return (
    <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        
        {/* Title */}
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
            Digital Citizen Services
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Welcome to the <span className="text-blue-500">Citizen Services Portal</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Access public services, verification, official documentation, and real-time announcements directly from one platform.
          </p>
        </div>

        {/* AI Search Bar Form */}
        <form id="hero-search-input" onSubmit={handleSearch} className="max-w-2xl mx-auto mt-6">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Ask anything (e.g., how to make id card, passport renewal, tax rules)..."
              className="w-full pl-12 pr-28 py-4 bg-slate-950 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 shadow-xl"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="absolute right-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Asking AI...</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* AI Result Card (Search Bar ke Niche Show Hoga) */}
        {(aiAnswer || aiLoading) && (
          <div className="max-w-2xl mx-auto mt-4 p-5 bg-slate-950/90 border border-blue-500/40 rounded-2xl text-left shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles size={16} className="text-yellow-300" />
                <span>AI Service Guidance</span>
              </div>
              <button
                onClick={() => dispatch(clearAiAnswer())}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X size={16} />
              </button>
            </div>

            {aiLoading ? (
              <div className="flex items-center gap-3 py-4 text-slate-400 text-sm">
                <Loader2 size={20} className="animate-spin text-blue-400" />
                <span>Fetching official procedure from Gemini AI...</span>
              </div>
            ) : (
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {aiAnswer}
              </p>
            )}
          </div>
        )}

        {/* Popular Tags */}
        <div className="pt-2 flex flex-wrap justify-center items-center gap-2 text-xs text-slate-400">
          <span className="font-medium text-slate-500">Popular:</span>
          <button 
            type="button"
            onClick={() => dispatch(setSearchQuery('Identity Verification'))}
            className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full border border-slate-700/60 transition-colors"
          >
            Identity Verification
          </button>
          <button 
            type="button"
            onClick={() => dispatch(setSearchQuery('Passport Renewal Process'))}
            className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full border border-slate-700/60 transition-colors"
          >
            Passport Services
          </button>
          <button 
            type="button"
            onClick={() => dispatch(setSearchQuery('Business Registration'))}
            className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full border border-slate-700/60 transition-colors"
          >
            Business Registration
          </button>
        </div>

        {/* Action Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 max-w-4xl mx-auto">
          <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl text-left hover:border-slate-600 transition-all">
            <div className="p-2 bg-blue-600/20 text-blue-400 w-fit rounded-lg mb-3">
              <FileText size={20} />
            </div>
            <h3 className="text-sm font-bold text-white">Online Forms</h3>
            <p className="text-xs text-slate-400 mt-1">Download and submit official applications online.</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl text-left hover:border-slate-600 transition-all">
            <div className="p-2 bg-emerald-600/20 text-emerald-400 w-fit rounded-lg mb-3">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-sm font-bold text-white">Track Application</h3>
            <p className="text-xs text-slate-400 mt-1">Check real-time status of your pending requests.</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl text-left hover:border-slate-600 transition-all">
            <div className="p-2 bg-purple-600/20 text-purple-400 w-fit rounded-lg mb-3">
              <HelpCircle size={20} />
            </div>
            <h3 className="text-sm font-bold text-white">Citizen Support</h3>
            <p className="text-xs text-slate-400 mt-1">Get immediate AI-guided help for services.</p>
          </div>
        </div>

      </div>
    </section>
  );
}