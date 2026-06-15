import type { ReactNode } from 'react';
import { AppIcon, CircleDollarSign, FileText, Package, StickyNote, ICON_SIZE_FORM } from '../components/icons';

const iconProps = { size: ICON_SIZE_FORM, className: 'erp-section-icon' };

export const SECTION_ICONS: Record<string, ReactNode> = {
  supplierInfo: <AppIcon icon={Package} {...iconProps} />,
  documentInfo: <AppIcon icon={FileText} {...iconProps} />,
  financialInfo: <AppIcon icon={CircleDollarSign} {...iconProps} />,
  additionalInfo: <AppIcon icon={StickyNote} {...iconProps} />,
};

export function getSectionIcon(sectionId: string): ReactNode | undefined {
  return SECTION_ICONS[sectionId];
}
