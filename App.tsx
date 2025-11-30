import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TransactionManager } from './components/TransactionManager';
import { AIAdvisor } from './components/AIAdvisor';
import { Transaction, BusinessUnit, PageView } from './types';
import { Menu } from 'lucide-react';

const INITIAL_UNITS: BusinessUnit[] = [
  { id: 'u1', name: 'Unit Perdagangan (Toko Desa)', description: 'Toko kelontong dan ATK' },
  { id: 'u2', name: 'Unit Pariwisata', description: 'Pengelolaan tiket wisata sungai' },
  { id: 'u3', name: 'Unit Jasa Sewa', description: 'Sewa tenda dan kursi' },
  { id: 'u4', name: 'Unit Simpan Pinjam', description: 'Layanan keuangan mikro' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2023-10-01', description: 'Penjualan Tiket Wisata', amount: 2500000, type: 'INCOME', category: 'Penjualan', unitId: 'u2' },
  { id: 't2', date: '2023-10-02', description: 'Belanja Stok Toko', amount: 1200000, type: 'EXPENSE', category: 'Persediaan', unitId: 'u1' },
  { id: 't3', date: '2023-10-03', description: 'Sewa Tenda Hajatan', amount: 500000, type: 'INCOME', category: 'Jasa', unitId: 'u3' },
  { id: 't4', date: '2023-10-05', description: 'Gaji Penjaga Toko', amount: 800000, type: 'EXPENSE', category: 'Gaji', unitId: 'u1' },
  { id: 't5', date: '2023-10-10', description: 'Bagi Hasil Simpan Pinjam', amount: 350000, type: 'INCOME', category: 'Bunga', unitId: 'u4' },
  { id: 't6', date: '2023-10-12', description: 'Perbaikan Toilet Wisata', amount: 300000, type: 'EXPENSE', category: 'Perawatan', unitId: 'u2' },
  { id: 't7', date: '2023-10-15', description: 'Penjualan Toko Mingguan', amount: 4500000, type: 'INCOME', category: 'Penjualan', unitId: 'u1' },
];

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>(PageView.DASHBOARD);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load from local storage on mount (mock persistence)
  useEffect(() => {
    const saved = localStorage.getItem('bumdes_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('bumdes_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Yakin ingin menghapus transaksi ini?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-200 ease-in-out z-30 md:static`}>
         <Sidebar currentPage={currentPage} onNavigate={(page) => { setCurrentPage(page); setIsSidebarOpen(false); }} />
      </div>

      <div className="flex-1 flex flex-col md:ml-64 min-w-0 transition-all duration-300">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="font-bold text-lg text-slate-800">BUMDes Pro</div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {currentPage === PageView.DASHBOARD && (
              <Dashboard transactions={transactions} units={INITIAL_UNITS} />
            )}
            
            {currentPage === PageView.TRANSACTIONS && (
              <TransactionManager 
                transactions={transactions} 
                units={INITIAL_UNITS}
                onAddTransaction={handleAddTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}

            {currentPage === PageView.AI_ADVISOR && (
              <AIAdvisor transactions={transactions} units={INITIAL_UNITS} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
