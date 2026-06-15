import { memo, type InputHTMLAttributes } from 'react';

interface ERPCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label: string;
  className?: string;
}

function ERPCheckboxInner({ label, className = '', id, ...props }: ERPCheckboxProps) {
  return (
    <label className={`erp-checkbox-label ${className}`.trim()} htmlFor={id}>
      <input id={id} type="checkbox" className="erp-checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}

const ERPCheckbox = memo(ERPCheckboxInner);
export default ERPCheckbox;
