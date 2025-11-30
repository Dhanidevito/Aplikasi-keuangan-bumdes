import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp } from 'lucide-react';
import { Transaction, BusinessUnit } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  units: BusinessUnit[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, units }) => {
  
  // Calculate Summary Stats
  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === 'INCOME') income += t.amount;
      else expense += t.amount;
    });
    return {
      income,
      expense,
      balance: income - expense,
      margin: income > 0 ? ((income - expense) / income) * 100 : 0
    };
  }, [transactions]);

  // Chart Data Preparation
  const chartData = useMemo(() => {
    const data: Record<string, { name: string; Masuk: number; Keluar: number }> = {};
    
    // Group by Month (Last 6 months usually better, but keeping simple for all data)
    transactions.forEach(t => {
      const date = new Date(t.date);
      const key = `${date.toLocaleString('id-ID', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!data[key]) data[key] = { name: key, Masuk: 0, Keluar: 0 };
      
      if (t.type === 'INCOME') data[key].Masuk += t.amount;
      else data[key].Keluar += t.amount;
    });

    return Object.values(data);
  }, [transactions]);

  // Unit Performance Data
  const unitData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.filter(t => t.type === 'INCOME').forEach(t => {
       const unitName = units.find(u => u.id === t.unitId)?.name || 'Lainnya';
       data[unitName] = (data[unitName] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions, units]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Pemasukan</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatRupiah(stats.income)}</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-2 font-medium">+12% dari bulan lalu</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Pengeluaran</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatRupiah(stats.expense)}</h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-red-600 mt-2 font-medium">+5% dari bulan lalu</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Saldo Bersih</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatRupiah(stats.balance)}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Aman untuk operasional</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Profit Margin</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.margin.toFixed(1)}%</h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2 font-medium">Kondisi Sehat</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Arus Kas Bulanan</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(val) => `Rp${val/1000000}jt`} />
                <Tooltip 
                  formatter={(value: number) => formatRupiah(value)}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                <Bar dataKey="Masuk" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="Keluar" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Pendapatan per Unit</h3>
          <div className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={unitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {unitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatRupiah(value)} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {unitData.map((item, idx) => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                 <div className="flex items-center">
                   <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                   <span className="text-slate-600">{item.name}</span>
                 </div>
                 <span className="font-medium text-slate-800">{((item.value / stats.income) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
