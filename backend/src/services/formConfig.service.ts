import { env } from '../config/env';
import { TEMPORARY_FORM_SECTIONS } from '../modules/po/poForm.config';
import type { FormConfigResponse } from '../types/formConfig.types';

export function getFormConfig(): FormConfigResponse {
  if (env.ORACLE_FORM_CONFIG_VIEW) {
    // Oracle config table not yet delivered — fall through to temporary fallback
    // Future: query ORACLE_FORM_CONFIG_VIEW and map rows to FormFieldDef[]
  }

  return {
    source: 'temporary-fallback',
    sections: TEMPORARY_FORM_SECTIONS,
  };
}
