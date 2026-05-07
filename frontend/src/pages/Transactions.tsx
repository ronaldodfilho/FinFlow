import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ArrowRightLeft } from 'lucide-react';
import { api } from '../services/api';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  transactionDate: string;
  category: string;
  isSync: boolean;
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'EXPENSE',
    transactionDate: new Date().toISOString().split('T')[0],
    category: '',
  });

  const fetchTransactions = async () => {
    setLoading(true);
    const response = await api.get('/transactions');
    setTransactions(response.data);
    setLoading(false);
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, amount: parseFloat(form.amount), transactionDate: `${form.transactionDate}T00:00:00` };
    if (editId) {
      await api.put(`/transactions/${editId}`, payload);
    } else {
      await api.post('/transactions', payload);
    }
    setForm({ description: '', amount: '', type: 'EXPENSE', transactionDate: new Date().toISOString().split('T')[0], category: '' });
    setShowForm(false);
    setEditId(null);
    fetchTransactions();
  };

  const handleEdit = (t: Transaction) => {
    setForm({
      description: t.description,
      amount: String(t.amount),
      type: t.type,
      transactionDate: t.transactionDate.split('T')[0],
      category: t.category || '',
    });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja remover esta transação?')) {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    }
  };

  const filtered = transactions.filter((t) => {
    const matchType = filterType === 'ALL' || t.type === filterType;
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || (t.category || '').toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transações</h1>
          <p className="text-finflow-textMuted mt-1">Histórico completo de movimentações financeiras.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ description: '', amount: '', type: 'EXPENSE', transactionDate: new Date().toISOString().split('T')[0], category: '' }); }}
          className="flex items-center gap-2 bg-finflow-primary hover:bg-finflow-primaryHover text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <Plus size={16} /> Nova Transação
        </button>
      </div>

      {showForm && (
        <div className="bg-finflow-card border border-finflow-border rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">{editId ? 'Editar Transação' : 'Nova Transação'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-finflow-textMuted mb-1">Descrição</label>
              <input required className="w-full bg-finflow-dark border border-finflow-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-finflow-primary"
                value={form.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, description: e.target.value })} placeholder="Ex: Venda de produto" />
            </div>
            <div>
              <label className="block text-sm text-finflow-textMuted mb-1">Valor (R$)</label>
              <input required type="number" step="0.01" className="w-full bg-finflow-dark border border-finflow-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-finflow-primary"
                value={form.amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm text-finflow-textMuted mb-1">Tipo</label>
              <select className="w-full bg-finflow-dark border border-finflow-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-finflow-primary"
                value={form.type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, type: e.target.value as 'INCOME' | 'EXPENSE' })}>
                <option value="EXPENSE">Despesa</option>
                <option value="INCOME">Receita</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-finflow-textMuted mb-1">Data</label>
              <input required type="date" className="w-full bg-finflow-dark border border-finflow-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-finflow-primary"
                value={form.transactionDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, transactionDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-finflow-textMuted mb-1">Categoria</label>
              <input className="w-full bg-finflow-dark border border-finflow-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-finflow-primary"
                value={form.category} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, category: e.target.value })} placeholder="Ex: Alimentação" />
            </div>
            <div className="flex items-end gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-finflow-textMuted hover:text-white text-sm transition-colors">Cancelar</button>
              <button type="submit" className="px-5 py-2 bg-finflow-primary hover:bg-finflow-primaryHover text-white rounded-lg text-sm font-medium transition-colors">
                {editId ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar por descrição ou categoria..."
          className="flex-1 bg-finflow-card border border-finflow-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-finflow-primary placeholder:text-finflow-textMuted"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          {(['ALL', 'INCOME', 'EXPENSE'] as const).map((f) => (
            <button key={f} onClick={() => setFilterType(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === f ? 'bg-finflow-primary text-white' : 'bg-finflow-card border border-finflow-border text-finflow-textMuted hover:text-white'}`}>
              {f === 'ALL' ? 'Todos' : f === 'INCOME' ? 'Receitas' : 'Despesas'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-finflow-card border border-finflow-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-finflow-border/30 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-finflow-textMuted">
            <ArrowRightLeft size={36} className="mx-auto mb-2 opacity-20" />
            <p>{search || filterType !== 'ALL' ? 'Nenhum resultado encontrado.' : 'Nenhuma transação ainda.'}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-finflow-border">
              <tr className="text-left text-finflow-textMuted">
                <th className="px-6 py-4 font-medium">Descrição</th>
                <th className="px-6 py-4 font-medium">Categoria</th>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium">Tipo</th>
                <th className="px-6 py-4 font-medium">Valor</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-finflow-border">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-white font-medium">
                    {t.description}
                    {t.isSync && <span className="ml-2 px-1.5 py-0.5 bg-finflow-primary/10 text-finflow-primary rounded text-xs align-middle">Open Finance</span>}
                  </td>
                  <td className="px-6 py-4 text-finflow-textMuted">{t.category || '—'}</td>
                  <td className="px-6 py-4 text-finflow-textMuted">{new Date(t.transactionDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.type === 'INCOME' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'}`}>
                      {t.type === 'INCOME' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-semibold ${t.type === 'INCOME' ? 'text-finflow-secondary' : 'text-red-400'}`}>
                    {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(t)} className="p-1.5 text-finflow-textMuted hover:text-white transition-colors rounded-lg hover:bg-white/5"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 text-finflow-textMuted hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/5"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Transactions;
