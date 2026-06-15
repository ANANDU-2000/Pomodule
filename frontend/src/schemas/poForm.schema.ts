import { z } from 'zod';
import type { FormFieldDef } from '../types/formConfig';

const VAT_RATE = 0.07;

const lineItemSchema = z.object({
  itemCode: z.string().min(1),
  itemName: z.string().optional().default(''),
  uom: z.string().min(1),
  quantity: z.coerce.number().min(0.001),
  rate: z.coerce.number().min(0),
  discPercent: z.coerce.number().min(0).default(0),
  discAmt: z.coerce.number().min(0).default(0),
  netValue: z.coerce.number().min(0).default(0),
  tolPlus: z.coerce.number().min(0).default(0),
  tolMinus: z.coerce.number().min(0).default(0),
});

export interface POValidationMessages {
  deliveryDateAfterDocument: string;
  itemsMinLength: string;
}

const defaultMessages: POValidationMessages = {
  deliveryDateAfterDocument: 'Delivery date must be on or after document date',
  itemsMinLength: 'At least one item is required',
};

function fieldToZod(field: FormFieldDef): z.ZodTypeAny {
  const rules = field.validationSchema.rules;
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'number':
      schema = z.coerce.number();
      if (rules.includes('positiveNumber')) {
        schema = (schema as z.ZodNumber).min(0.0001, 'Exchange rate must be greater than 0');
      }
      break;
    case 'checkbox':
      schema = z.boolean();
      break;
    case 'date':
      schema = z.string();
      if (rules.includes('dateEqualsToday')) {
        schema = (schema as z.ZodString).refine(
          (v) => v === new Date().toISOString().slice(0, 10),
          { message: 'Document date must be today\'s date' },
        );
      }
      break;
    default:
      schema = z.string();
  }

  if (field.required || rules.includes('required')) {
    if (field.type === 'checkbox') return schema;
    if (field.type === 'number') return (schema as z.ZodNumber).min(0);
    return (schema as z.ZodString).min(1);
  }

  return schema.optional();
}

export function buildPOFormSchema(fields: FormFieldDef[], messages: POValidationMessages = defaultMessages) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    shape[field.apiField] = fieldToZod(field);
  }
  shape.items = z.array(lineItemSchema).min(1, messages.itemsMinLength);
  return z.object(shape).superRefine((data, ctx) => {
    const docDate = data.documentDate as string | undefined;
    const delDate = data.deliveryDate as string | undefined;
    if (docDate && delDate && delDate < docDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['deliveryDate'],
        message: messages.deliveryDateAfterDocument,
      });
    }
  });
}

function flattenZodErrors(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : '_form';
    if (!result[key]) result[key] = [];
    result[key].push(issue.message);
  }
  return result;
}

export function validatePOForm(
  fields: FormFieldDef[],
  values: Record<string, unknown>,
  messages: POValidationMessages = defaultMessages,
): { valid: boolean; errors: Record<string, string[]> } {
  const schema = buildPOFormSchema(fields, messages);
  const result = schema.safeParse(values);
  if (!result.success) {
    return {
      valid: false,
      errors: flattenZodErrors(result.error),
    };
  }
  return { valid: true, errors: {} };
}

export function validateSingleField(
  fields: FormFieldDef[],
  values: Record<string, unknown>,
  apiField: string,
  messages: POValidationMessages = defaultMessages,
): string[] {
  const field = fields.find((f) => f.apiField === apiField);
  if (!field) {
    if (apiField === 'deliveryDate') {
      const docDate = values.documentDate as string | undefined;
      const delDate = values.deliveryDate as string | undefined;
      if (docDate && delDate && delDate < docDate) {
        return [messages.deliveryDateAfterDocument];
      }
    }
    return [];
  }

  const fieldSchema = fieldToZod(field);
  const result = fieldSchema.safeParse(values[apiField]);
  const errors: string[] = [];
  if (!result.success) {
    errors.push(...result.error.issues.map((i) => i.message));
  }
  if (apiField === 'deliveryDate') {
    const docDate = values.documentDate as string | undefined;
    const delDate = values.deliveryDate as string | undefined;
    if (docDate && delDate && delDate < docDate) {
      errors.push(messages.deliveryDateAfterDocument);
    }
  }
  return errors;
}

export function calcLineItem(values: {
  quantity: number;
  rate: number;
  discPercent: number;
}) {
  const discAmt = values.quantity * values.rate * (values.discPercent / 100);
  const netValue = values.quantity * values.rate - discAmt;
  return { discAmt, netValue };
}

export function calcOrderTotals(
  items: { netValue: number }[],
  discount: number,
  inclusiveVat: boolean,
) {
  const subtotal = items.reduce((sum, row) => sum + row.netValue, 0);
  const headerDiscount = discount ?? 0;
  const vatBase = subtotal - headerDiscount;
  const vat = inclusiveVat
    ? vatBase - vatBase / (1 + VAT_RATE)
    : vatBase * VAT_RATE;
  const total = inclusiveVat ? vatBase : vatBase + vat;
  return { subtotal, headerDiscount, vat, total };
}
