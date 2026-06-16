import { memo, type InputHTMLAttributes } from 'react';
import ERPInput from '../ERPInput';

export type CurrencyInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type' | 'inputMode'> & {
  error?: boolean;
  className?: string;
};

function CurrencyInputInner({ className = '', ...props }: CurrencyInputProps) {
  return (
    <ERPInput
      type="number"
      inputMode="decimal"
      step="any"
      className={`erp-input-numeric ${className}`.trim()}
      {...props}
    />
  );
}

const CurrencyInput = memo(CurrencyInputInner);
export default CurrencyInput;
