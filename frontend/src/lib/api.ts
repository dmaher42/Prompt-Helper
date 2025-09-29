const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${input}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorBody.error ?? 'Request failed');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export const api = {
  login: (payload: { email: string; password: string }) =>
    request<{ user: { id: string; email: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  register: (payload: { email: string; password: string }) =>
    request<{ user: { id: string; email: string } }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  logout: () =>
    request<never>('/api/auth/logout', {
      method: 'POST'
    }),
  currentUser: () => request<{ user: { id: string; email: string } }>('/api/auth/me'),
  listPrompts: () =>
    request<{ prompts: Prompt[] }>('/api/prompts'),
  createPrompt: (payload: PromptInput) =>
    request<{ prompt: Prompt }>('/api/prompts', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updatePrompt: (id: string, payload: Partial<PromptInput>) =>
    request<{ prompt: Prompt }>(`/api/prompts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  deletePrompt: (id: string) =>
    request<never>(`/api/prompts/${id}`, {
      method: 'DELETE'
    })
};

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromptInput {
  title: string;
  content: string;
  category: string;
}
