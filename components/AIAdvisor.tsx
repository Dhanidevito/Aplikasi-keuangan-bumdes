import React, { useState } from 'react';
import { Bot, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateFinancialAdvice } from '../services/geminiService';
import { Transaction, BusinessUnit } from '../types';

interface AIAdvisorProps {
  transactions: Transaction[];
  units: BusinessUnit[];
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions, units }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateAdvice = async () => {
    setLoading(true);
    const result = await generateFinancialAdvice(transactions, units);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Konsultan Cerdas BUMDes</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Dapatkan analisis mendalam tentang kesehatan keuangan BUMDes Anda menggunakan teknologi AI terbaru.
        </p>
      </div>

      {!advice && !loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <Bot className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Siap Menganalisis Data</h3>
          <p className="text-slate-500 mb-6">
            AI akan membaca ringkasan transaksi dari unit usaha: {units.map(u => u.name).join(', ')}.
          </p>
          <button
            onClick={handleGenerateAdvice}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg shadow-indigo-200"
          >
            <Sparkles className="w-5 h-5" />
            <span>Mulai Analisis Sekarang</span>
          </button>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Sedang mempelajari data keuangan desa...</p>
          <p className="text-sm text-slate-400 mt-2">Mohon tunggu sebentar</p>
        </div>
      )}

      {advice && !loading && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-white font-bold flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>Hasil Analisis AI</span>
            </h3>
            <button 
              onClick={handleGenerateAdvice}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              title="Analisis Ulang"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="p-8 prose prose-slate max-w-none prose-headings:text-indigo-900 prose-p:text-slate-600">
             <ReactMarkdown>{advice}</ReactMarkdown>
          </div>
          <div className="bg-indigo-50 px-6 py-4 border-t border-indigo-100 flex items-start space-x-3">
             <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
             <p className="text-xs text-indigo-800">
               Catatan: Analisis ini dibuat oleh AI (Gemini) berdasarkan data transaksi yang tersedia. Gunakan sebagai bahan pertimbangan, bukan nasihat keuangan mutlak.
             </p>
          </div>
        </div>
      )}
    </div>
  );
};
