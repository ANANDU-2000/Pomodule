import type { PageActionConfig } from '../constants/pageActions';

interface FutureActionAreaProps {
  actions: PageActionConfig[];
  onAction?: (actionId: string) => void;
}

function FutureActionArea({ actions, onAction }: FutureActionAreaProps) {
  if (actions.length === 0) return null;

  return (
    <div className="future-action-area" role="toolbar" aria-label="Page actions">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          className={`future-action-btn${action.variant === 'primary' ? ' primary' : ''}`}
          onClick={() => onAction?.(action.id)}
        >
          {action.variant === 'primary' && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default FutureActionArea;
