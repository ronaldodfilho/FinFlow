import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowRightLeft, Settings, RefreshCw } from 'lucide-react';

const Dashboard = () => (
  <div className="p-8">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard Financeiro</h1>
        <p className="text-finflow-textMuted">Bem-vindo de volta ao FinFlow.</p>
      </div>
      <button className="flex items-center gap-2 bg-finflow-primary hover:bg-finflow-primaryHover transition-colors text-white px-4 py-2 rounded-lg shadow-lg font-medium">
        <RefreshCw size={18} />
        Sincronizar Banco
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Cards */}
      <div className="bg-finflow-card p-6 rounded-xl border border-finflow-border shadow-md">
        <div className="text-finflow-textMuted text-sm font-medium mb-2">Saldo Total</div>
        <div className="text-3xl font-bold text-white">R$ 14.520,00</div>
      </div>
      <div className="bg-finflow-card p-6 rounded-xl border border-finflow-border shadow-md">
        <div className="text-finflow-textMuted text-sm font-medium mb-2">Receitas (Mês)</div>
        <div className="text-3xl font-bold text-finflow-secondary">R$ 5.200,00</div>
      </div>
      <div className="bg-finflow-card p-6 rounded-xl border border-finflow-border shadow-md">
        <div className="text-finflow-textMuted text-sm font-medium mb-2">Despesas (Mês)</div>
        <div className="text-3xl font-bold text-red-400">R$ 1.850,00</div>
      </div>
    </div>

    <div className="bg-finflow-card p-6 rounded-xl border border-finflow-border shadow-md h-96 flex items-center justify-center">
      <p className="text-finflow-textMuted">[Gráfico Recharts Aqui]</p>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <div className="flex h-screen bg-finflow-dark text-finflow-text">
        {/* Sidebar */}
        <aside className="w-64 bg-finflow-card border-r border-finflow-border flex flex-col">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-finflow-primary flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-finflow-primary to-finflow-accent flex items-center justify-center text-white">F</div>
              FinFlow
            </h2>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 bg-finflow-dark/50 text-white rounded-lg transition-colors border border-finflow-border/50">
              <LayoutDashboard size={20} className="text-finflow-primary" />
              Dashboard
            </Link>
            <Link to="/transactions" className="flex items-center gap-3 px-4 py-3 text-finflow-textMuted hover:text-white hover:bg-finflow-dark/50 rounded-lg transition-colors">
              <ArrowRightLeft size={20} />
              Transações
            </Link>
            <Link to="/accounts" className="flex items-center gap-3 px-4 py-3 text-finflow-textMuted hover:text-white hover:bg-finflow-dark/50 rounded-lg transition-colors">
              <Wallet size={20} />
              Contas a Pagar/Receber
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<div className="p-8 text-white">Em construção...</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
