import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, RefreshCw, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore, AuthState } from '../store/authStore';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  transactionDate: string;
  category: string;
  isSync: boolean;
}

const monthlyData = [
  { name: 'Jan', receitas: 4200, despesas: 2400 },
  { name: 'Fev', receitas: 5800, despesas: 1398 },
  { name: 'Mar', receitas: 3200, despesas: 5800 },
  { name: 'Abr', receitas: 6780, despesas: 3908 },
  { name: 'Mai', receitas: 5890, despesas: 4800 },
  { name: 'Jun', receitas: 7390, despesas: 3800 },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const user = useAuthStore((state: AuthState) => state.user);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage('');
    try {
      const response = await api.post('/open-finance/sync');
      setSyncMessage(`✅ ${response.data.transactionsAdded} transações importadas!`);
      await fetchTransactions();
    } catch (err) {
      setSyncMessage('❌ Erro na sincronização.');
    } finally {
      setSyncing(false);
    }
  };

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
    .slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-finflow-textMuted mt-1">Olá, {user?.name}! Aqui está o resumo financeiro.</p>
        </div>
        <div className="flex items-center gap-3">
          {syncMessage && (
            <span className="text-sm text-finflow-textMuted">{syncMessage}</span>
          )}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-finflow-primary hover:bg-finflow-primaryHover disabled:opacity-60 transition-colors text-white px-5 py-2.5 rounded-xl shadow font-medium text-sm"
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Sincronizando...' : 'Sincronizar Banco'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-finflow-card border border-finflow-border rounded-2xl p-6 flex items-start justify-between">
          <div>
            <p className="text-finflow-textMuted text-sm font-medium">Saldo Total</p>
            <p className={`text-3xl font-bold mt-2 ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
              {loading ? '...' : formatCurrency(balance)}
            </p>
            <p className="text-finflow-textMuted text-xs mt-1">Atualizado agora</p>
          </div>
          <div className="w-12 h-12 bg-finflow-primary/10 rounded-xl flex items-center justify-center">
            <DollarSign size={22} className="text-finflow-primary" />
          </div>
        </div>

        <div className="bg-finflow-card border border-finflow-border rounded-2xl p-6 flex items-start justify-between">
          <div>
            <p className="text-finflow-textMuted text-sm font-medium">Total de Receitas</p>
            <p className="text-3xl font-bold text-finflow-secondary mt-2">
              {loading ? '...' : formatCurrency(totalIncome)}
            </p>
            <p className="text-finflow-textMuted text-xs mt-1">{transactions.filter(t => t.type === 'INCOME').length} transações</p>
          </div>
          <div className="w-12 h-12 bg-finflow-secondary/10 rounded-xl flex items-center justify-center">
            <TrendingUp size={22} className="text-finflow-secondary" />
          </div>
        </div>

        <div className="bg-finflow-card border border-finflow-border rounded-2xl p-6 flex items-start justify-between">
          <div>
            <p className="text-finflow-textMuted text-sm font-medium">Total de Despesas</p>
            <p className="text-3xl font-bold text-red-400 mt-2">
              {loading ? '...' : formatCurrency(totalExpense)}
            </p>
            <p className="text-finflow-textMuted text-xs mt-1">{transactions.filter(t => t.type === 'EXPENSE').length} transações</p>
          </div>
          <div className="w-12 h-12 bg-red-400/10 rounded-xl flex items-center justify-center">
            <TrendingDown size={22} className="text-red-400" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-finflow-card border border-finflow-border rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-6">Fluxo Mensal</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#161B22', border: '1px solid #374151', borderRadius: '12px' }}
              labelStyle={{ color: '#F3F4F6' }}
              formatter={(value: number) => [formatCurrency(value), '']}
            />
            <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#10B981" strokeWidth={2} fill="url(#colorReceitas)" />
            <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#6366F1" strokeWidth={2} fill="url(#colorDespesas)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="bg-finflow-card border border-finflow-border rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-5">Últimas Transações</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-finflow-border/30 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="text-center py-10 text-finflow-textMuted">
            <ArrowUpRight size={32} className="mx-auto mb-2 opacity-30" />
            <p>Nenhuma transação ainda.</p>
            <p className="text-sm mt-1">Clique em "Sincronizar Banco" para importar.</p>
          </div>
        ) : (
          <div className="divide-y divide-finflow-border">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3.5 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === 'INCOME' ? 'bg-finflow-secondary/10' : 'bg-red-400/10'
                  }`}>
                    {tx.type === 'INCOME' ? (
                      <TrendingUp size={16} className="text-finflow-secondary" />
                    ) : (
                      <TrendingDown size={16} className="text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{tx.description}</p>
                    <p className="text-xs text-finflow-textMuted">
                      {new Date(tx.transactionDate).toLocaleDateString('pt-BR')}
                      {tx.isSync && <span className="ml-2 px-1.5 py-0.5 bg-finflow-primary/10 text-finflow-primary rounded text-xs">Open Finance</span>}
                    </p>
                  </div>
                </div>
                <span className={`font-semibold text-sm ${tx.type === 'INCOME' ? 'text-finflow-secondary' : 'text-red-400'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
