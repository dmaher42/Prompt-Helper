import { useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { LoginForm } from '../components/LoginForm';

export function LandingPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleLogin = async (values: { email: string; password: string }) => {
    if (mode === 'login') {
      await login(values);
    } else {
      await register(values);
    }
  };

  return (
    <main className="layout">
      <section className="hero">
        <h1>PromptHelper</h1>
        <p>
          Build a shared prompt library that keeps your marketing team aligned, searchable, and ready to
          launch the next campaign.
        </p>
        <ul className="feature-list">
          <li>Capture reusable prompt templates with rich context.</li>
          <li>Organize by campaigns, channels, or personas with instant search.</li>
          <li>Collaborate securely with team-based access and histories.</li>
        </ul>
        <div className="auth-toggle" role="radiogroup" aria-label="Authentication mode">
          <button
            type="button"
            role="radio"
            aria-checked={mode === 'login'}
            className={mode === 'login' ? 'primary' : ''}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={mode === 'register'}
            className={mode === 'register' ? 'primary' : ''}
            onClick={() => setMode('register')}
          >
            Create Account
          </button>
        </div>
      </section>
      <section className="panel" aria-live="polite">
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your workspace'}</h2>
        <LoginForm onSubmit={handleLogin} submitLabel={mode === 'login' ? 'Sign In' : 'Create Account'} />
      </section>
    </main>
  );
}
