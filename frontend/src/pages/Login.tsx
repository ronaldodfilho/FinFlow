import React, { useState } from 'react';
import { useAuthStore, AuthState } from '../store/authStore';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state: AuthState) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, id, name, role } = response.data;
      login(token, { id, name, email, role });
      navigate('/');
    } catch (err) {
      setError('E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen bg-finflow-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-finflow-card p-8 rounded-2xl border border-finflow-border shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-finflow-primary to-finflow-accent flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            F
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo(a)</h2>
          <p className="text-finflow-textMuted">Faça login para acessar o FinFlow</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-finflow-textMuted mb-1">E-mail</label>
            <input
              type="email"
              required
              className="w-full bg-finflow-dark border border-finflow-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-finflow-primary focus:ring-1 focus:ring-finflow-primary transition-colors"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-finflow-textMuted mb-1">Senha</label>
            <input
              type="password"
              required
              className="w-full bg-finflow-dark border border-finflow-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-finflow-primary focus:ring-1 focus:ring-finflow-primary transition-colors"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-finflow-primary hover:bg-finflow-primaryHover text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
