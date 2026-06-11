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
    unsavedChanges: string;
  };

  form: {
    save: string;
    cancel: string;
    back: string;
    edit: string;
  };

  columns: {
    orderNo: string;
    documentDate: string;
    supplierCode: string;
    supplierName: string;
    location: string;
    orderValue: string;
    status: string;
    deliveryDate: string;
    remarks: string;
    userId: string;
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
