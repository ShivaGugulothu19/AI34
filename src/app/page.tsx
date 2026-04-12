"use client";

import { useState } from "react";
import { DiffHighlighter } from "@/components/DiffHighlighter";
import { Loader2, Sparkles, ArrowRight, Link as LinkIcon, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PageContent = {
  headline: string;
  subheadline: string;
  sections: string[];
  cta_text: string;
};

export default function Home() {
  const [adInput, setAdInput] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [original, setOriginal] = useState<PageContent | null>(null);
  const [optimized, setOptimized] = useState<PageContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adInput || !url) return;

    setLoading(true);
    setError(null);
    setOriginal(null);
    setOptimized(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ad_input: adInput, url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate personalization");
      }

      setOriginal(data.original);
      setOptimized(data.optimized);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-200 selection:bg-blue-500 selection:text-white pb-20">
      
      {/* Header */}
      <header className="border-b border-white/20 dark:border-white/5 glass-card sticky top-0 z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Sparkles className="h-6 w-6" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI Landing Page Personalizer
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        
        {/* Input Section */}
        <section className="max-w-3xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card shadow-xl shadow-blue-900/5 rounded-2xl p-6 md:p-8"
          >
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Optimize Any Landing Page</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Paste your ad creative and the target URL. We'll pull the site content and use AI to tailor the messaging.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" /> Ad Creative
                </label>
                <textarea
                  value={adInput}
                  onChange={(e) => setAdInput(e.target.value)}
                  placeholder="Paste your ad creative copy here..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all h-32 resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-blue-500" /> Target URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800/30">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !adInput || !url}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 px-4 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing and Optimizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Personalized Page
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </section>


        {/* Results Section */}
        <AnimatePresence>
          {original && optimized && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-6 lg:gap-8 w-full"
            >
              
              {/* Left Panel: Original */}
              <div className="flex flex-col h-full">
                <div className="bg-slate-200 dark:bg-slate-800 rounded-t-xl px-4 py-3 border-b border-slate-300 dark:border-slate-700 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  Original Page Content
                </div>
                <div className="bg-white dark:bg-slate-900 border border-t-0 border-slate-200 dark:border-slate-800 rounded-b-xl p-6 sm:p-8 flex-1 space-y-8 shadow-sm">
                  
                  <div className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Headline</div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                      {original.headline}
                    </h1>
                    <h2 className="text-lg text-slate-600 dark:text-slate-300">
                      {original.subheadline}
                    </h2>
                  </div>

                  <div className="space-y-4">
                     <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Content Sections</div>
                     <div className="flex flex-col gap-4 text-slate-700 dark:text-slate-300">
                        {original.sections.map((sec, idx) => (
                           <p key={idx} className="leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                             {sec}
                           </p>
                        ))}
                        {original.sections.length === 0 && (
                          <p className="text-sm italic text-slate-400">No substantive sections parsed.</p>
                        )}
                     </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Call to Action</div>
                    <button className="bg-slate-800 dark:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium opacity-80 cursor-default">
                      {original.cta_text}
                    </button>
                  </div>

                </div>
              </div>


              {/* Right Panel: Optimized */}
              <div className="flex flex-col h-full">
                <div className="bg-emerald-100 dark:bg-emerald-950/40 rounded-t-xl px-4 py-3 border-b border-emerald-200 dark:border-emerald-900 flex items-center justify-between text-sm font-semibold text-emerald-800 dark:text-emerald-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    Optimized Personalization
                  </div>
                  <span className="text-xs bg-emerald-200 dark:bg-emerald-900/60 px-2 py-0.5 rounded uppercase tracking-wider opacity-80">AI Generated</span>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-t-0 border-emerald-200 dark:border-emerald-900/50 rounded-b-xl p-6 sm:p-8 flex-1 space-y-8 shadow-xl shadow-emerald-900/5">
                  
                  <div className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70 flex justify-between">
                      <span>Headline</span>
                      <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1 rounded">Changes Highlighted</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                      <DiffHighlighter original={original.headline} modified={optimized.headline} />
                    </h1>
                    <h2 className="text-lg text-slate-600 dark:text-slate-300">
                      <DiffHighlighter original={original.subheadline} modified={optimized.subheadline} />
                    </h2>
                  </div>

                  <div className="space-y-4">
                     <div className="text-xs font-bold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70">Content Sections</div>
                     <div className="flex flex-col gap-4 text-slate-700 dark:text-slate-300">
                        {optimized.sections.map((sec, idx) => (
                           <p key={idx} className="leading-relaxed bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 p-4 rounded-lg">
                             {/* Only do diff checking if the original had a section at this array index to align with */}
                             <DiffHighlighter 
                                original={original.sections[idx] || ""} 
                                modified={sec} 
                              />
                           </p>
                        ))}
                     </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70 mb-3">Call to Action</div>
                    <button className="bg-blue-600 shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                       <DiffHighlighter original={original.cta_text} modified={optimized.cta_text} />
                       <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>

                </div>
              </div>

            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
