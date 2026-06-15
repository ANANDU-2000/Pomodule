export interface TranslationMap {
  pageTitle: string;
  purchaseOrders: string;

  nav: {
    purchaseOrder: string;
    purchaseOrderList: string;
    poTransaction: string;
    poGh: string;
    poAll: string;
    poExp: string;
    poAst: string;
    poGr: string;
    logout: string;
  };

  pages: {
    viewTitle: string;
    editTitle: string;
    newTitle: string;
    notFound: string;
    loadError: string;
    listLoadError: string;
    saveError: string;
    approveError: string;
    unsavedChanges: string;
  };

  form: {
    save: string;
    saveOrder: string;
    updateOrder: string;
    saving: string;
    cancel: string;
    back: string;
    edit: string;
    print: string;
    basicInfo: string;
    supplierInfo: string;
    documentInfo: string;
    financialInfo: string;
    additionalInfo: string;
    itemDetails: string;
    auditInfo: string;
    supplier: string;
    address: string;
    shipmentMode: string;
    paymentTerm: string;
    docLocation: string;
    location: string;
    documentDate: string;
    deliveryDate: string;
    currency: string;
    exchangeRate: string;
    discount: string;
    remarks: string;
    inclusiveVat: string;
    docType: string;
    taxInvoiceDoc: string;
    itemCode: string;
    itemName: string;
    uom: string;
    quantity: string;
    rate: string;
    discPercent: string;
    discAmt: string;
    tolPlus: string;
    tolMinus: string;
    netValue: string;
    subtotal: string;
    headerDiscount: string;
    vat: string;
    orderTotal: string;
    totalNet: string;
    addLine: string;
    removeLine: string;
    removeLineAria: string;
    deliveryDateAfterDocument: string;
    itemsMinLength: string;
    documentDateToday: string;
    validationTitle: string;
    lookupPlaceholder: string;
    clearLookup: string;
    minSearchChars: string;
    searching: string;
    noLookupResults: string;
    lookupNotConfigured: string;
    lineItemsNotConfigured: string;
    createdBy: string;
    createdDate: string;
    updatedBy: string;
    updatedDate: string;
    approvedBy: string;
    approvedDate: string;
    unsavedChanges: string;
    leaveAnyway: string;
  };

  columns: {
    orderNo: string;
    documentDate: string;
    supplierCode: string;
    supplierName: string;
    location: string;
    locationCode: string;
    orderQty: string;
    currency: string;
    lineItemCount: string;
    terms: string;
    orderValue: string;
    status: string;
    deliveryDate: string;
    remarks: string;
    userId: string;
    userName: string;
    actions: string;
  };

  moduleTitles: {
    poGh: string;
    poAll: string;
    poExp: string;
    poAst: string;
    poGr: string;
  };

  filters: {
    today: string;
    yesterday: string;
    lastWeek: string;
    thisWeek: string;
    thisMonth: string;
    lastMonth: string;
    all: string;
    none: string;
  };

  status: {
    pending: string;
    approved: string;
    rejected: string;
    draft: string;
  };

  actions: {
    view: string;
    edit: string;
    search: string;
    filter: string;
    addPurchaseOrder: string;
    approve: string;
    approving: string;
    retry: string;
  };

  pagination: {
    showing: string;
    of: string;
    records: string;
    rowsPerPage: string;
    auto: string;
    previousPage: string;
    nextPage: string;
  };

  sidebar: {
    expand: string;
    collapse: string;
    mainNav: string;
  };

  search: {
    ariaLabel: string;
    clear: string;
  };

  empty: {
    noResults: string;
  };

  accessibility: {
    skipToContent: string;
    pageActions: string;
    language: string;
  };
}
