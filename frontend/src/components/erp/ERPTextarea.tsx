import { memo, type TextareaHTMLAttributes } from 'react';

interface ERPTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  error?: boolean;
  className?: string;
}

function ERPTextareaInner({ error, className = '', rows = 2, ...props }: ERPTextareaProps) {
  return (
    <textarea
      {...props}
      rows={rows}
      aria-invalid={error || undefined}
      className={`erp-textarea${error ? ' erp-input-error' : ''} ${className}`.trim()}
    />
  );
}

const ERPTextarea = memo(ERPTextareaInner);
export default ERPTextarea;
