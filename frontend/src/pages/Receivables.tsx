import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, TrendingUp } from 'lucide-react';
import { api } from '../services/api';

interface AccountReceivable {
  id: number;
  description: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
}

const statusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20',
  PAID: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20',
  OVERDUE: 'bg-red-400/10 text-red-400 border border-red-400/20',
  CANCELLED: 'bg-gray-400/10 text-gray-400 border border-gray-400/20',
};
const statusLabel: Record<string, string> = { PENDING: 'Pendente', PAID: 'Recebido', OVERDUE: 'Atrasado', CANCELLED: 'Cancelado' };

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const Receivables = () => {
  const [receivables, setReceivables] = useState<AccountReceivable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '', dueDate: '' });
  const [editId, setEditId] = useState<number | null>(null);

  const fetchReceivables = async () => {
    setLoading(true);
    const response = await api.get('/receivables');
    setReceivables(response.data);
    setLoading(false);
  };

  useEffect(() => { fetchReceivables(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/receivables/${editId}`, { ...form, amount: parseFloat(form.amount), status: 'PENDING' });
    } else {
      await api.post('/receivables', { ...form, amount: parseFloat(form.amount), status: 'PENDING' });
    }
    setForm({ description: '', amount: '', dueDate: '' });
    setShowForm(false);
    setEditId(null);
    fetchReceivables();
  };

  const handleEdit = (r: AccountReceivable) => {
    setForm({ description: r.description, amount: String(r.amount), dueDate: r.dueDate });
    setEditId(r.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja remover esta conta?')) {
      await api.delete(`/receivables/${id}`);
      fetchReceivables();
    }
  };

  const handleMarkReceived = async (r: AccountReceivable) => {
    await api.put(`/receivables/${r.id}`, { ...r, status: 'PAID' });
    fetchReceivables();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contas a Receber</h1>
          <p className="text-finflow-textMuted mt-1">Gerencie cobranças e receitas previstas.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ description: '', amount: '', dueDate: '' }); }}
          className="flex items-center gap-2 bg-finflow-primary hover:bg-finflow-primaryHover text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <Plus size={16} /> Nova Cobrança
        </button>
      </div>

      {showForm && (
        <div className="bg-finflow-card border border-finflow-border rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">{editId ? 'Editar Cobrança' : 'Nova Conta a Receber'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-finflow-textMuted mb-1">Descrição</label>
              <input required className="w-full bg-finflow-dark border border-finflow-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-finflow-primary"
                value={form.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, description: e.target.value })} placeholder="Ex: Serviço prestado" />
            </div>
            <div>
              <label className="block text-sm text-finflow-textMuted mb-1">Valor (R$)</label>
              <input required type="number" step="0.01" className="w-full bg-finflow-dark border border-finflow-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-finflow-primary"
                value={form.amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm text-finflow-textMuted mb-1">Vencimento</label>
              <input required type="date" className="w-full bg-finflow-dark border border-finflow-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-finflow-primary"
                value={form.dueDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div className="sm:col-span-3 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-finflow-textMuted hover:text-white text-sm transition-colors">Cancelar</button>
              <button type="submit" className="px-5 py-2 bg-finflow-primary hover:bg-finflow-primaryHover text-white rounded-lg text-sm font-medium transition-colors">
                {editId ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-finflow-card border border-finflow-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-finflow-border/30 rounded-xl animate-pulse" />)}
          </div>
        ) : receivables.length === 0 ? (
          <div className="text-center py-16 text-finflow-textMuted">
            <TrendingUp size={36} className="mx-auto mb-2 opacity-20" />
            <p>Nenhuma conta a receber cadastrada.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-finflow-border">
              <tr className="text-left text-finflow-textMuted">
                <th className="px-6 py-4 font-medium">Descrição</th>
                <th className="px-6 py-4 font-medium">Vencimento</th>
                <th className="px-6 py-4 font-medium">Valor</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-finflow-border">
              {receivables.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{r.description}</td>
                  <td className="px-6 py-4 text-finflow-textMuted">{new Date(r.dueDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-finflow-secondary font-semibold">{formatCurrency(r.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[r.status]}`}>{statusLabel[r.status]}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {r.status === 'PENDING' && (
                        <button onClick={() => handleMarkReceived(r)} className="text-xs text-finflow-secondary hover:text-emerald-300 transition-colors px-2 py-1 rounded bg-emerald-400/5 hover:bg-emerald-400/10">Marcar Recebido</button>
                      )}
                      <button onClick={() => handleEdit(r)} className="p-1.5 text-finflow-textMuted hover:text-white transition-colors rounded-lg hover:bg-white/5"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 text-finflow-textMuted hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/5"><Trash2 size={14} /></button>
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

export default Receivables;
