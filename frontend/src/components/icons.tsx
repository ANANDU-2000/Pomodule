import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CircleDollarSign,
  Eye,
  FileText,
  Filter,
  Loader2,
  LogOut,
  Package,
  PanelLeft,
  PanelRight,
  Pencil,
  Plus,
  Printer,
  Save,
  Search,
  StickyNote,
  Trash2,
  X,
} from 'lucide-react';

export const ICON_SIZE_NAV = 16;
export const ICON_SIZE_HEADER = 15;
export const ICON_SIZE_ACTION = 14;
export const ICON_SIZE_SORT = 12;
export const ICON_SIZE_FORM = 14;
export const ICON_SIZE_NAV_BACK = 14;

const ICON_SIZE_DEFAULT = 14;

export {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CircleDollarSign,
  Eye,
  FileText,
  Filter,
  Loader2,
  LogOut,
  Package,
  PanelLeft,
  PanelRight,
  Pencil,
  Plus,
  Printer,
  Save,
  Search,
  StickyNote,
  Trash2,
  X,
};

export function AppIcon({
  icon: Icon,
  size = ICON_SIZE_DEFAULT,
  className,
  ...props
}: { icon: ComponentType<LucideProps> } & Omit<LucideProps, 'ref'>) {
  return <Icon size={size} strokeWidth={1.75} className={className} aria-hidden {...props} />;
}
