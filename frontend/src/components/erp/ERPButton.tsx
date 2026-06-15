import { memo, type ButtonHTMLAttributes, type ReactNode } from 'react';

type ERPButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

interface ERPButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ERPButtonVariant;
  children: ReactNode;
  className?: string;
}

const VARIANT_CLASS: Record<ERPButtonVariant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-default',
  danger: 'btn btn-danger',
  success: 'btn btn-success',
};

function ERPButtonInner({ variant = 'secondary', children, className = '', ...props }: ERPButtonProps) {
  return (
    <button type="button" className={`erp-btn ${VARIANT_CLASS[variant]} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

const ERPButton = memo(ERPButtonInner);
export default ERPButton;
