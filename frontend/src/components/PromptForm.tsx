import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import type { PromptInput } from '../lib/api';

interface PromptFormProps {
  initialValues?: PromptInput;
  onSubmit: (values: PromptInput) => Promise<void>;
  submitLabel?: string;
}

const defaultValues: PromptInput = {
  title: '',
  content: '',
  category: ''
};

export function PromptForm({ initialValues, onSubmit, submitLabel = 'Save Prompt' }: PromptFormProps) {
  const [values, setValues] = useState<PromptInput>(initialValues ?? { ...defaultValues });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    } else {
      setValues({ ...defaultValues });
    }
  }, [initialValues]);

  const handleChange = (key: keyof PromptInput) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(values);
      if (!initialValues) {
        setValues({ ...defaultValues });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} aria-label="prompt form">
      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={values.title}
          onChange={handleChange('title')}
          minLength={3}
          maxLength={120}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          value={values.category}
          onChange={handleChange('category')}
          minLength={2}
          maxLength={50}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="content">Prompt Content</label>
        <textarea
          id="content"
          value={values.content}
          onChange={handleChange('content')}
          minLength={10}
          required
          rows={5}
        />
      </div>
      {error && (
        <div role="alert" className="error">
          {error}
        </div>
      )}
      <button type="submit" className="primary" disabled={loading}>
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
