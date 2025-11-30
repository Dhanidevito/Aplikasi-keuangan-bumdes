import React from 'react';
import { LayoutDashboard, WalletCards, Bot, Building2, LogOut } from 'lucide-react';
import { PageView } from '../types';

interface SidebarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { id: PageView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: PageView.TRANSACTIONS, label: 'Transaksi', icon: WalletCards },
    { id: PageView.AI_ADVISOR, label: 'Analisis AI', icon: Bot },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-10 hidden md:flex shadow-xl">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
        <Building2 className="w-8 h-8 text-emerald-400" />
        <div>
          <h1 className="text-xl font-bold tracking-tight">BUMDes Pro</h1>
          <p className="text-xs text-slate-400">Keuangan Desa Digital</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button className="w-full flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};
