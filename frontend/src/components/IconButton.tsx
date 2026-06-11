import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label?: string;
  variant?: 'toolbar' | 'ghost';
  active?: boolean;
  iconOnly?: boolean;
}

function IconButton({
  icon,
  label,
  variant = 'toolbar',
  active = false,
  iconOnly = false,
  className = '',
  ...props
}: IconButtonProps) {
  const classes = [
    'icon-btn',
    variant === 'ghost' ? 'ghost' : '',
    active ? 'active' : '',
    iconOnly ? 'icon-only' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} {...props}>
      <span className="icon-btn-icon">{icon}</span>
      {label && !iconOnly && <span>{label}</span>}
    </button>
  );
}

export default IconButton;
