import { ShieldCheck, Search, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 45 }}
          className="w-10 h-10 border border-slate-200 flex items-center justify-center rounded-none"
        >
          <span className="-rotate-45 font-bold text-lg" style={{ color: 'red' }}>HQ</span>
        </motion.div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase text-slate-800 leading-none">
            News Verifier
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
            Investigative Protocol
          </p>
        </div>
      </div>

      <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <span className="text-blue-600 border-b-2 border-blue-600 pb-1 cursor-pointer">Verify</span>
        <span className="hover:text-blue-600 transition-colors cursor-pointer">Archive</span>
        <span className="hover:text-blue-600 transition-colors cursor-pointer">Methodology</span>
      </div>
    </header>
  );
}
