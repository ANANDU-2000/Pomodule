import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Filter,
  LogOut,
  Pencil,
  Plus,
  Search,
  X,
} from 'lucide-react';

export const ICON_SIZE = 16;
export const ICON_SIZE_NAV = 16;

export {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Filter,
  LogOut,
  Pencil,
  Plus,
  Search,
  X,
};

export function AppIcon({
  icon: Icon,
  size = ICON_SIZE,
  className,
  ...props
}: { icon: ComponentType<LucideProps> } & Omit<LucideProps, 'ref'>) {
  return <Icon size={size} strokeWidth={2} className={className} aria-hidden {...props} />;
}
