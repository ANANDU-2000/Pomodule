import { useCallback, type Dispatch, type SetStateAction } from 'react';
import type { FormFieldDef } from '../types/formConfig';
import type { POFormValues } from '../types/formConfig';
import { validatePOForm, validateSingleField } from '../schemas/poForm.schema';
import type { POFormTab } from '../components/form/POFormPageLayout';

interface UsePOFieldValidationOptions {
  fields: FormFieldDef[];
  values: POFormValues;
  setErrors: Dispatch<SetStateAction<Record<string, string[]>>>;
  setActiveTab: (tab: POFormTab) => void;
  messages: {
    deliveryDateAfterDocument: string;
    itemsMinLength: string;
  };
}

export function scrollToFirstError() {
  requestAnimationFrame(() => {
    const el = document.querySelector('[data-field-error="true"]');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

export function usePOFieldValidation({
  fields,
  values,
  setErrors,
  setActiveTab,
  messages,
}: UsePOFieldValidationOptions) {
  const validateField = useCallback(
    (apiField: string) => {
      const fieldErrors = validateSingleField(
        fields,
        values as unknown as Record<string, unknown>,
        apiField,
        messages,
      );
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldErrors.length > 0) {
          next[apiField] = fieldErrors;
        } else {
          delete next[apiField];
        }
        return next;
      });
    },
    [fields, values, setErrors, messages],
  );

  const validateAll = useCallback((): boolean => {
    const validation = validatePOForm(
      fields,
      values as unknown as Record<string, unknown>,
      messages,
    );
    if (!validation.valid) {
      setErrors(validation.errors);
      const errorKeys = Object.keys(validation.errors);
      const hasHeaderErrors = errorKeys.some((k) => k !== 'items');
      const hasItemErrors = errorKeys.includes('items') || errorKeys.some((k) => k.startsWith('items'));
      if (hasItemErrors && !hasHeaderErrors) {
        setActiveTab('itemDetails');
      } else if (hasHeaderErrors) {
        setActiveTab('basicInfo');
      }
      scrollToFirstError();
      return false;
    }
    setErrors({});
    return true;
  }, [fields, values, setErrors, setActiveTab, messages]);

  return { validateField, validateAll };
}
