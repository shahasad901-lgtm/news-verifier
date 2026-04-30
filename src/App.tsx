import { useState } from 'react';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import ResultCard from './components/ResultCard';
import { verifyNews, VerificationResult } from './services/geminiService';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (input: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await verifyNews(input);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 border-[12px] border-slate-200 relative">
      <Header />
      
      <main className="relative z-10 min-h-[calc(100vh-120px)]">
        <SearchSection onVerify={handleVerify} isLoading={isLoading} />

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-6 mb-8"
            >
              <div className="bg-white border-2 border-red-500 p-6 brutalist-shadow flex items-center gap-4">
                <div className="w-6 h-6 bg-red-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Alert</p>
                   <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {result && <ResultCard key={JSON.stringify(result)} result={result} />}
        </AnimatePresence>
      </main>
      
      <footer className="w-full h-10 bg-slate-200 flex items-center px-10 justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500 sticky bottom-0">
        <div className="flex items-center gap-4">
          <span>Verification Engine v4.12.0-STABLE</span>
          <div className="w-1 h-1 rounded-full bg-slate-400" />
          <span>98+ Grounding Sources Active</span>
        </div>
        <div className="hidden sm:block">
          HQ Protocol: STANDBY
        </div>
      </footer>
    </div>
  );
}
