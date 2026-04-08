"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  Search, 
  Terminal, 
  Zap, 
  Share2, 
  Info, 
  Play, 
  Network, 
  FileText,
  Clock,
  Cpu,
  X
} from "lucide-react";
import { executeQuery, PipelineResult } from "../lib/engine";
import traces from "../data/traces.json";

// --- Components ---

const ArtifactInspector = ({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data: any }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="p-3 md:p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Artifact Inspector</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors">
              <X size={16} className="text-slate-500" />
            </button>
          </div>
          <div className="p-4 md:p-6 overflow-auto custom-scrollbar font-mono text-[10px] md:text-xs leading-relaxed text-teal-300">
            <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const TimelineStep = ({ step, color, index, onInspect }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-6 md:pl-8 pb-4 md:pb-6 group"
    >
      <div className="absolute left-[9px] md:left-[11px] top-6 bottom-0 w-px bg-slate-800 group-last:hidden" />
      <div className={`absolute left-0 top-1 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-slate-900 z-10 flex items-center justify-center bg-slate-800 transition-colors group-hover:border-[${color}]`}
           style={{ backgroundColor: '#1e293b' }}>
        <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white opacity-20" />
      </div>

      <div 
        onClick={() => onInspect(step.data)}
        className="glass p-3 md:p-4 rounded-xl cursor-pointer border-transparent hover:border-slate-700/50 hover:bg-slate-800/40 transition-all active:scale-[0.98] group"
      >
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="text-[10px] md:text-xs font-bold text-slate-200 uppercase tracking-wide group-hover:text-white transition-colors">{step.label}</h4>
            <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 md:mt-1 leading-snug">{step.desc}</p>
          </div>
          <div className="text-[8px] md:text-[9px] font-mono text-slate-600 bg-slate-950/50 px-1.5 py-0.5 rounded border border-slate-800 uppercase flex-shrink-0">View</div>
        </div>
      </div>
    </motion.div>
  );
};

const PipelineColumn = ({ title, icon: Icon, color, results, isGraph, isProcessing }: any) => {
  const [inspectData, setInspectData] = useState<any>(null);

  const isIdle = !results && !isProcessing;

  return (
    <div className="flex flex-col h-full space-y-4">
      <ArtifactInspector 
        isOpen={!!inspectData} 
        onClose={() => setInspectData(null)} 
        data={inspectData} 
      />

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 md:p-2 rounded-lg bg-slate-900 border border-slate-800" style={{ color: color }}>
            <Icon size={16} className="md:w-[18px] md:h-[18px]" />
          </div>
          <h3 className="font-bold text-slate-200 tracking-tight text-sm md:text-base">{title}</h3>
          {isProcessing && (
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 rounded-full" 
              style={{ backgroundColor: color }} 
            />
          )}
        </div>
        {results && (
          <div className="flex gap-2 md:gap-3 text-[9px] md:text-[10px] font-mono text-slate-500">
             <div className="flex items-center gap-1"><Clock size={10} /> {results.metrics.latency}</div>
             <div className="hidden xs:flex items-center gap-1"><Cpu size={10} /> {results.metrics.tokens} tkn</div>
          </div>
        )}
      </div>

      <div className="flex-1 px-1 custom-scrollbar space-y-1 relative min-h-[350px]">
        {isIdle && (
          <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
            <div className={`p-4 rounded-full bg-slate-900/50 mb-4`} style={{ color: color }}>
               <Icon size={32} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-2">System Ready</p>
            <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
              Waiting for query execution to initiate {title} sequence.
            </p>
          </div>
        )}

        {results?.steps.map((step: any, i: number) => (
          <TimelineStep 
            key={step.id} 
            step={step} 
            color={color} 
            index={i} 
            onInspect={setInspectData}
          />
        ))}

        {isProcessing && (
           <div className="pl-6 md:pl-8 py-4 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 md:h-16 bg-slate-900/20 rounded-xl border border-dashed border-slate-800 animate-pulse" />
              ))}
           </div>
        )}
        
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 p-4 md:p-5 rounded-2xl border-2 border-slate-800 bg-slate-900/60 shadow-2xl relative overflow-hidden"
            style={{ borderColor: isGraph ? 'rgba(245, 158, 11, 0.2)' : 'rgba(45, 212, 191, 0.2)' }}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 rounded-full`} style={{ backgroundColor: color }} />
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <Terminal size={12} className={isGraph ? 'text-amber-500' : 'text-teal-500'} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">LLM Synthesis</span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed italic relative z-10">
              "{results.answer}"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- Main Page ---

export default function SherlockDashboard() {
  const [query, setQuery] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [activeQuery, setActiveQuery] = useState<any>(null);
  
  const [standardResults, setStandardResults] = useState<PipelineResult | null>(null);
  const [graphResults, setGraphResults] = useState<PipelineResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExecute = async (targetQuery?: string, qObj?: any) => {
    const qText = targetQuery || query;
    if (!qText.trim()) return;

    setIsProcessing(true);
    setStandardResults(null);
    setGraphResults(null);
    
    // Auto-match if typing a demo query manually
    if (!qObj) {
      const match = (traces.queries as any).find((d: any) => d.query.toLowerCase() === qText.toLowerCase());
      if (match) setActiveQuery(match);
      else setActiveQuery({ type: 'General' });
    }

    // Parallel execution
    const [standard, graph] = await Promise.all([
      executeQuery(qText, 'standard', isDemoMode),
      executeQuery(qText, 'graph', isDemoMode)
    ]);

    setStandardResults(standard);
    setGraphResults(graph);
    setIsProcessing(false);
  };

  const handleDemoSelect = (q: any) => {
    setActiveQuery(q);
    setQuery(q.query);
    // Removed immediate execution to allow user to click 'Execute' manually
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto selection:bg-amber-500/30">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Network size={20} className="text-amber-500 md:w-5 md:h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500 tracking-tighter">
              SHERLOCK <span className="text-amber-500 ml-1">GraphRAG</span>
            </h1>
          </div>
          <p className="text-slate-500 text-[10px] md:text-xs font-medium max-w-xl">
            Retreival Pipeline Visualizer • <span className="text-slate-300">Comparing Semantic Chunking vs. Community Summaries</span>
          </p>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 bg-slate-900/80 p-1.5 pr-4 rounded-2xl border border-slate-800 shadow-xl self-start md:self-auto w-full md:w-auto">
          <div className={`px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-tighter transition-all ${isDemoMode ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
            {isDemoMode ? 'Demo Mode' : 'Live Inference'}
          </div>
          <button 
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`relative w-10 h-5 rounded-full transition-colors ${isDemoMode ? 'bg-amber-500/20' : 'bg-slate-800'}`}
          >
            <motion.div 
              animate={{ x: isDemoMode ? 20 : 4 }}
              className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-lg" 
            />
          </button>
        </div>
      </header>

      {/* Query Engine */}
      <section className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-amber-500/5 rounded-2xl md:rounded-3xl blur-2xl md:blur-3xl group-hover:bg-amber-500/10 transition-all duration-700" />
          <div className={`relative flex flex-col md:flex-row items-stretch md:items-center p-1 md:p-2 rounded-2xl md:rounded-3xl border transition-all duration-300 ${isProcessing ? 'border-amber-500 bg-slate-900' : 'border-slate-800 bg-slate-900/40'}`}>
            <div className="flex items-center flex-1">
              <div className="p-3 text-slate-600">
                <Search size={20} className={isProcessing ? 'animate-pulse text-amber-500' : ''} />
              </div>
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Query database..."
                className="bg-transparent border-none outline-none flex-1 text-slate-200 placeholder:text-slate-700 text-base md:text-lg py-3"
                onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
              />
              {activeQuery && (
                 <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mr-2">
                  <Zap size={10} className="text-amber-500" />
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">{activeQuery.type}</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => handleExecute()}
              disabled={isProcessing}
              className="bg-white text-black px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-slate-200 active:scale-95 transition-all shadow-xl shadow-white/5 disabled:opacity-50 m-1 md:m-0"
            >
              {isProcessing ? 'Processing' : 'Execute'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 transition-all">
          {traces.queries.map((q: any) => (
            <button
              key={q.id}
              onClick={() => handleDemoSelect(q)}
              className={`px-4 py-2.5 rounded-xl text-[10px] md:text-[11px] font-bold tracking-tight transition-all flex items-center gap-2 border ${
                activeQuery?.id === q.id 
                  ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/10' 
                  : 'bg-slate-900/50 text-slate-500 border-slate-800/80 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              <Zap size={10} className={activeQuery?.id === q.id ? 'text-black' : 'text-slate-700'} fill="currentColor" />
              {q.query}
            </button>
          ))}
        </div>
      </section>

      {/* Comparison Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 min-h-0 pb-8 md:pb-12">
        <PipelineColumn 
          title="Vector RAG" 
          icon={FileText} 
          color="#2DD4BF" 
          results={standardResults}
          isProcessing={isProcessing}
        />
        
        <PipelineColumn 
          title="GraphRAG" 
          icon={Network} 
          color="#F59E0B" 
          results={graphResults}
          isProcessing={isProcessing}
          isGraph
        />
      </div>

      {/* Persistence Info */}
      <footer className="pt-6 md:pt-8 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600">
        <div className="flex items-center gap-6 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">
           <a href="#" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
            <Share2 size={10} /> Source
           </a>
           <a href="#" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
            <Info size={10} /> Reference
           </a>
        </div>
        <div className="text-[10px] font-medium text-slate-700 italic md:border-l md:border-slate-900 md:pl-4 text-center md:text-left">
          Data: Scandal in Bohemia / Red-Headed League indexed via Leiden Hierarchies.
        </div>
      </footer>
    </div>
  );
}
