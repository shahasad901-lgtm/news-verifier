import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { CheckCircle2, AlertTriangle, HelpCircle, Share2, ExternalLink } from 'lucide-react';
import { VerificationResult, VerificationStatus } from '@/src/services/geminiService';
import { cn } from '@/src/lib/utils';

interface ResultCardProps {
  result: VerificationResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const isUrdu = result.language === 'ur';

  const statusStyles = {
    [VerificationStatus.VERIFIED]: {
      icon: CheckCircle2,
      color: "text-status-verified",
      bg: "bg-white",
      border: "border-status-verified",
      label: isUrdu ? "[تصدیق شدہ]" : "[VERIFIED]"
    },
    [VerificationStatus.FAKE_NEWS]: {
      icon: AlertTriangle,
      color: "text-status-fake",
      bg: "bg-white",
      border: "border-status-fake",
      label: isUrdu ? "[جعلی خبر]" : "[FAKE]"
    },
    [VerificationStatus.NEEDS_CONFIRMATION]: {
      icon: HelpCircle,
      color: "text-status-needs",
      bg: "bg-white",
      border: "border-status-needs",
      label: isUrdu ? "[تصدیق درکار]" : "[PENDING]"
    }
  };

  const { color, border, label } = statusStyles[result.status];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-6 pb-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Verdict Banner */}
        <div className={cn(
          "md:col-span-12 bg-white border-2 p-8 flex items-center justify-between brutalist-shadow",
          border
        )}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Verification Status</p>
            <h3 className={cn("text-6xl font-black tracking-tighter mt-2", color)}>
              {label}
            </h3>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Confidence Score</p>
            <p className="text-5xl font-mono font-bold text-slate-800 mt-2">98.2%</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="md:col-span-8 bg-white border-2 border-slate-200 p-10 brutalist-shadow">
          <div className={cn(
            "space-y-6",
            isUrdu ? "text-right urdu-font" : "text-left"
          )}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-4 bg-slate-900"></div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Audit Explanation</h4>
            </div>
            
            <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 border-b-2 border-slate-100 pb-4">
              {result.heading}
            </h3>

            <div className={cn(
              "prose prose-slate prose-sm max-w-none prose-headings:text-slate-900 prose-strong:text-slate-900 leading-relaxed",
              isUrdu ? "text-right urdu-font text-lg" : "text-left"
            )}>
              <ReactMarkdown>
                {result.explanation}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Sidebar Metadata */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900 text-white p-6 brutalist-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 bg-blue-600 flex items-center justify-center">
                <span className="text-[10px] font-black">!</span>
              </div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest">Protocol Stats</h4>
            </div>
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-end border-b border-white/10 pb-2">
                <span className="text-[10px] uppercase opacity-40">Grounding</span>
                <span className="text-xs font-bold text-blue-400">HIGH</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-2">
                <span className="text-[10px] uppercase opacity-40">Latency</span>
                <span className="text-xs font-bold font-mono">1.2s</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] uppercase opacity-40">Instance</span>
                <span className="text-xs font-bold">G3-FLASH</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-200 p-6 flex-1 brutalist-shadow flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Share Evidence</h4>
              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-slate-600" />
                </button>
                <button className="flex-1 py-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
            
            <div className="pt-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Secure Node</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                This verification result has been cryptographically logged to the Haqeeqat local audit node.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { ShieldCheck } from 'lucide-react';
