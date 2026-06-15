import { z } from 'zod';
import type { POLineItem, POCreatePayload } from '../types/purchaseOrder.types';

const lineItemSchema = z.object({
  itemCode: z.string().min(1),
  itemName: z.string().optional().default(''),
  uom: z.string().min(1),
  quantity: z.coerce.number().positive(),
  rate: z.coerce.number().positive(),
  discPercent: z.coerce.number().min(0).default(0),
  discAmt: z.coerce.number().min(0).default(0),
  netValue: z.coerce.number().min(0).default(0),
  tolPlus: z.coerce.number().min(0).default(0),
  tolMinus: z.coerce.number().min(0).default(0),
});

export const poCreateBodySchema = z.object({
  supplierCode: z.string().min(1),
  supplierName: z.string().min(1),
  address: z.string().min(1),
  shipmentMode: z.string().min(1),
  paymentTerm: z.string().min(1),
  docLocation: z.string().min(1),
  locationCode: z.string().min(1),
  location: z.string().optional(),
  documentDate: z.string().min(1),
  deliveryDate: z.string().min(1),
  currency: z.string().min(1),
  exchangeRate: z.coerce.number().positive(),
  discount: z.coerce.number().min(0).optional().default(0),
  remarks: z.string().optional().default(''),
  inclusiveVat: z.boolean().optional().default(false),
  docType: z.string().optional().default(''),
  taxInvoiceDoc: z.string().optional().default(''),
  items: z.array(lineItemSchema).min(1),
}).strict();

export const poUpdateBodySchema = poCreateBodySchema.partial().extend({
  items: z.array(lineItemSchema).min(1).optional(),
});

export function validateDocumentDateIsToday(documentDate: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return documentDate === today;
}

export type POCreateBody = z.infer<typeof poCreateBodySchema>;
export type POUpdateBody = z.infer<typeof poUpdateBodySchema>;

export function validateCreatePayload(payload: POCreatePayload): {
  valid: boolean;
  errors: Record<string, string[]>;
} {
  const result = poCreateBodySchema.safeParse(payload);
  if (!result.success) {
    return { valid: false, errors: result.error.flatten().fieldErrors as Record<string, string[]> };
  }
  if (!validateDocumentDateIsToday(result.data.documentDate)) {
    return { valid: false, errors: { documentDate: ['Document date must be today'] } };
  }
  return { valid: true, errors: {} };
}

export function calcLineItem(item: POLineItem): POLineItem {
  const discAmt = item.quantity * item.rate * (item.discPercent / 100);
  const netValue = item.quantity * item.rate - discAmt;
  return { ...item, discAmt, netValue };
}
