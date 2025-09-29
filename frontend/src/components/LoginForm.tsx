import { FormEvent, useState } from 'react';

interface LoginFormProps {
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  submitLabel?: string;
}

export function LoginForm({ onSubmit, submitLabel = 'Sign In' }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ email, password });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" aria-label="authentication form">
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />
      </div>
      {error && (
        <div role="alert" className="error">
          {error}
        </div>
      )}
      <button type="submit" disabled={loading} className="primary">
        {loading ? 'Please wait…' : submitLabel}
      </button>
    </form>
  );
}
