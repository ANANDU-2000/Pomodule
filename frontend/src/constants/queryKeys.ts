export const queryKeys = {
  purchaseOrders: {
    all: ['purchase-orders'] as const,
    list: (params: unknown) => ['purchase-orders', 'list', params] as const,
    detail: (orderNo: string) => ['purchase-orders', 'detail', orderNo] as const,
    lineItems: (orderNo: string) => ['purchase-orders', 'line-items', orderNo] as const,
  },
};
