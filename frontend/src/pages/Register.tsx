import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      navigate('/login', { state: { message: 'Conta criada com sucesso! Faça login.' } });
    } catch (err: any) {
      setError(err.response?.data || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-finflow-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-finflow-card p-8 rounded-2xl border border-finflow-border shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-finflow-primary to-finflow-accent flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            F
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Criar Conta</h2>
          <p className="text-finflow-textMuted">Junte-se ao FinFlow hoje mesmo</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-finflow-textMuted mb-1">Nome Completo</label>
            <input
              type="text"
              required
              className="w-full bg-finflow-dark border border-finflow-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-finflow-primary focus:ring-1 focus:ring-finflow-primary transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-finflow-textMuted mb-1">E-mail</label>
            <input
              type="email"
              required
              className="w-full bg-finflow-dark border border-finflow-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-finflow-primary focus:ring-1 focus:ring-finflow-primary transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-finflow-textMuted mb-1">Senha</label>
            <input
              type="password"
              required
              className="w-full bg-finflow-dark border border-finflow-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-finflow-primary focus:ring-1 focus:ring-finflow-primary transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-finflow-textMuted mb-1">Confirmar Senha</label>
            <input
              type="password"
              required
              className="w-full bg-finflow-dark border border-finflow-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-finflow-primary focus:ring-1 focus:ring-finflow-primary transition-colors"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-finflow-primary hover:bg-finflow-primaryHover text-white font-medium py-2.5 rounded-lg transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-finflow-textMuted text-sm">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-finflow-primary hover:text-finflow-primaryHover font-medium transition-colors">
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
