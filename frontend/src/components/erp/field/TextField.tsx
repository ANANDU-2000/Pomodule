import { memo, type InputHTMLAttributes } from 'react';
import ERPInput from '../ERPInput';

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> & {
  error?: boolean;
  className?: string;
};

function TextFieldInner(props: TextFieldProps) {
  return <ERPInput type="text" {...props} />;
}

const TextField = memo(TextFieldInner);
export default TextField;
