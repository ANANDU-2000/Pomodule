import { memo, type InputHTMLAttributes } from 'react';
import ERPInput from '../ERPInput';

export type NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> & {
  error?: boolean;
  className?: string;
};

function NumberInputInner({ className = '', ...props }: NumberInputProps) {
  return <ERPInput type="number" className={`erp-input-numeric ${className}`.trim()} {...props} />;
}

const NumberInput = memo(NumberInputInner);
export default NumberInput;
