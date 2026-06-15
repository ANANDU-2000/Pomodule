import type { ReactNode } from 'react';
import { AppIcon, Loader2, Printer, Save } from '../icons';

export interface StickyActionBarProps {
  readOnly: boolean;
  isEditMode: boolean;
  saving: boolean;
  canPrint: boolean;
  canEdit: boolean;
  canApprove: boolean;
  onCancel: () => void;
  onPrint: () => void;
  onSave: () => void;
  onEdit: () => void;
  onApprove: () => void;
  cancelLabel: string;
  printLabel: string;
  saveLabel: string;
  savingLabel: string;
  updateLabel: string;
  editLabel: string;
  approveLabel: string;
  approvingLabel: string;
  extraActions?: ReactNode;
}

export default function StickyActionBar({
  readOnly,
  isEditMode,
  saving,
  canPrint,
  canEdit,
  canApprove,
  onCancel,
  onPrint,
  onSave,
  onEdit,
  onApprove,
  cancelLabel,
  printLabel,
  saveLabel,
  savingLabel,
  updateLabel,
  editLabel,
  approveLabel,
  approvingLabel,
  extraActions,
}: StickyActionBarProps) {
  return (
    <div className="sticky-action-bar no-print">
      {!readOnly && (
        <>
          <button type="button" className="btn btn-default" onClick={onCancel} disabled={saving}>
            {cancelLabel}
          </button>
          {canPrint && (
            <button type="button" className="btn btn-default sticky-action-btn" onClick={onPrint}>
              <AppIcon icon={Printer} size={16} />
              {printLabel}
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary sticky-action-btn"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? (
              <AppIcon icon={Loader2} size={16} className="animate-spin" />
            ) : (
              <AppIcon icon={Save} size={16} />
            )}
            {saving ? savingLabel : isEditMode ? updateLabel : saveLabel}
          </button>
        </>
      )}
      {readOnly && (
        <>
          {canEdit && (
            <button type="button" className="btn btn-default" onClick={onEdit}>
              {editLabel}
            </button>
          )}
          {canPrint && (
            <button type="button" className="btn btn-default sticky-action-btn" onClick={onPrint}>
              <AppIcon icon={Printer} size={16} />
              {printLabel}
            </button>
          )}
          {canApprove && (
            <button
              type="button"
              className="btn btn-success"
              onClick={onApprove}
              disabled={saving}
            >
              {saving ? approvingLabel : approveLabel}
            </button>
          )}
        </>
      )}
      {extraActions}
    </div>
  );
}
