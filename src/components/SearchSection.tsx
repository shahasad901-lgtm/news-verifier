import React, { useState } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface SearchSectionProps {
  onVerify: (input: string) => void;
  isLoading: boolean;
}

export default function SearchSection({ onVerify, isLoading }: SearchSectionProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onVerify(input.trim());
    }
  };

  return (
    <section className="max-w-4xl mx-auto py-16 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-12 gap-10"
      >
        <div className="md:col-span-12 lg:col-span-5 flex flex-col">
          <div className="bg-white border-2 border-slate-200 p-8 flex-1 brutalist-shadow">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-blue-600"></div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Analysis Target</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <label className="block text-sm font-bold mb-3 text-slate-600 uppercase tracking-wide">Headline or Snippet</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste news claim or link here..."
                className="w-full bg-slate-50 border-2 border-slate-200 p-6 h-[240px] text-slate-800 italic leading-relaxed text-lg outline-none focus:border-blue-600/30 transition-colors resize-none"
                disabled={isLoading}
              />
              
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="mt-6 w-full py-5 bg-slate-900 text-white font-bold uppercase tracking-widest text-sm hover:bg-blue-600 transition-all border-b-4 border-slate-700 active:translate-y-1 active:border-b-0 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Auditing...
                  </>
                ) : (
                  <>
                    Start Investigation
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-12 lg:col-span-7 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tight text-slate-900 leading-[0.9]">
              AUDIT NEWS <br /> <span className="text-blue-600">REAL-TIME.</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-md italic leading-snug">
              "We leverage direct search grounding as 'News Verifier HQ' to separate fact from propaganda using a geometric audit protocol."
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {["Local gold price surge", "International trade pacts", "Political rumors", "Sports medical news"].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-left p-4 border border-slate-200 bg-white hover:border-blue-600 transition-colors group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1 group-hover:text-blue-600">Quick Scan</span>
                  <span className="text-xs font-bold text-slate-700">{q}</span>
                </button>
             ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
