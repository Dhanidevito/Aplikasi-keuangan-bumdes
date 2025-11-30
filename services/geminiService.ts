import { GoogleGenAI } from "@google/genai";
import { Transaction, BusinessUnit } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateFinancialAdvice = async (
  transactions: Transaction[],
  units: BusinessUnit[]
): Promise<string> => {
  if (!apiKey) {
    return "API Key tidak ditemukan. Mohon konfigurasi API Key untuk menggunakan fitur AI.";
  }

  // Summarize data for the prompt to save tokens and improve context
  const summary = transactions.reduce((acc, curr) => {
    const unitName = units.find(u => u.id === curr.unitId)?.name || 'Umum';
    if (!acc[unitName]) acc[unitName] = { income: 0, expense: 0 };
    
    if (curr.type === 'INCOME') acc[unitName].income += curr.amount;
    else acc[unitName].expense += curr.amount;
    
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);

  const prompt = `
    Bertindaklah sebagai konsultan keuangan profesional untuk Badan Usaha Milik Desa (BUMDes).
    Saya akan memberikan ringkasan data keuangan per unit usaha. 
    Tolong berikan analisis singkat, poin-poin perbaikan efisiensi, dan saran strategi pengembangan usaha.
    Gunakan Bahasa Indonesia yang formal namun mudah dipahami oleh pengurus desa.
    
    Data Keuangan:
    ${JSON.stringify(summary, null, 2)}
    
    Format jawaban:
    1. **Analisis Kesehatan Keuangan**: (Singkat)
    2. **Saran Efisiensi**: (Poin-poin)
    3. **Rekomendasi Strategi**: (Ide pengembangan)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on simple analysis
      }
    });
    return response.text || "Maaf, tidak dapat menghasilkan analisis saat ini.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kesalahan saat menghubungi layanan AI. Silakan coba lagi nanti.";
  }
};
