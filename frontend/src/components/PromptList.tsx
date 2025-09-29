import type { Prompt } from '../lib/api';

interface PromptListProps {
  prompts: Prompt[];
  onEdit: (prompt: Prompt) => void;
  onDelete: (prompt: Prompt) => Promise<void>;
}

export function PromptList({ prompts, onEdit, onDelete }: PromptListProps) {
  if (prompts.length === 0) {
    return <p role="status">No prompts yet. Create your first prompt to get started.</p>;
  }

  return (
    <ul className="prompt-grid" aria-label="saved prompts">
      {prompts.map((prompt) => (
        <li key={prompt.id} className="card" tabIndex={0}>
          <div className="prompt-header">
            <div>
              <h3>{prompt.title}</h3>
              <span className="category" aria-label={`Category ${prompt.category}`}>
                {prompt.category}
              </span>
            </div>
            <div className="actions">
              <button type="button" onClick={() => onEdit(prompt)} aria-label={`Edit ${prompt.title}`}>
                Edit
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => onDelete(prompt)}
                aria-label={`Delete ${prompt.title}`}
              >
                Delete
              </button>
            </div>
          </div>
          <pre>{prompt.content}</pre>
        </li>
      ))}
    </ul>
  );
}
