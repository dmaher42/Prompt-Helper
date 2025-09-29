import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Prompt, PromptInput } from '../lib/api';
import { PromptForm } from '../components/PromptForm';
import { PromptList } from '../components/PromptList';
import { useAuth } from '../contexts/auth-context';

export function DashboardPage() {
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  const promptsQuery = useQuery({
    queryKey: ['prompts'],
    queryFn: api.listPrompts
  });

  const createPrompt = useMutation({
    mutationFn: (values: PromptInput) => api.createPrompt(values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prompts'] });
    }
  });

  const updatePrompt = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<PromptInput> }) =>
      api.updatePrompt(id, values),
    onSuccess: () => {
      setEditingPrompt(null);
      void queryClient.invalidateQueries({ queryKey: ['prompts'] });
    }
  });

  const deletePrompt = useMutation({
    mutationFn: (prompt: Prompt) => api.deletePrompt(prompt.id),
    onSuccess: () => {
      setEditingPrompt(null);
      void queryClient.invalidateQueries({ queryKey: ['prompts'] });
    }
  });

  const handleSubmit = async (values: PromptInput) => {
    if (editingPrompt) {
      await updatePrompt.mutateAsync({ id: editingPrompt.id, values });
    } else {
      await createPrompt.mutateAsync(values);
    }
  };

  const handleDelete = async (prompt: Prompt) => {
    await deletePrompt.mutateAsync(prompt);
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p aria-live="polite">Signed in as {user?.email}</p>
        </div>
        <button type="button" onClick={() => logout()}>
          Sign Out
        </button>
      </header>
      <section className="dashboard-content">
        <div className="column">
          <h2>{editingPrompt ? 'Edit Prompt' : 'Create Prompt'}</h2>
          <PromptForm
            initialValues={editingPrompt ?? undefined}
            onSubmit={handleSubmit}
            submitLabel={editingPrompt ? 'Update Prompt' : 'Save Prompt'}
          />
        </div>
        <div className="column">
          <h2>Your Library</h2>
          {promptsQuery.isLoading ? (
            <p role="status">Loading prompts…</p>
          ) : promptsQuery.isError ? (
            <p role="alert">{(promptsQuery.error as Error).message}</p>
          ) : (
            <PromptList
              prompts={promptsQuery.data?.prompts ?? []}
              onEdit={(prompt) => setEditingPrompt(prompt)}
              onDelete={handleDelete}
            />
          )}
        </div>
      </section>
    </main>
  );
}
