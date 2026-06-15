import { memo, type InputHTMLAttributes } from 'react';

interface ERPInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  error?: boolean;
  className?: string;
}

function ERPInputInner({ error, className = '', ...props }: ERPInputProps) {
  return (
    <input
      {...props}
      aria-invalid={error || undefined}
      className={`erp-input${error ? ' erp-input-error' : ''} ${className}`.trim()}
    />
  );
}

const ERPInput = memo(ERPInputInner);
export default ERPInput;
