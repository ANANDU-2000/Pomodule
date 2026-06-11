import { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PurchaseOrder } from '../types/PurchaseOrder';
import type { TranslationMap } from '../types/i18n';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useViewportPageSize } from '../hooks/useViewportPageSize';
import { getPoListPageActions } from '../constants/pageActions';
import { MOCK_USER_PERMISSIONS } from '../constants/permissions';
import { getFilterOptions } from '../constants/filterOptions';
import { getPoColumns } from '../data/poColumns';
import { AUTO_PAGE_SIZE } from '../constants/pageSizeOptions';
import type { SearchBarHandle } from '../components/SearchBar';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';

interface PurchaseOrderListPageProps {
  onToggleSidebar: () => void;
  t: TranslationMap;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
  pageTitle?: string;
}

function PurchaseOrderListPage({ onToggleSidebar, t, lang, setLang, pageTitle }: PurchaseOrderListPageProps) {
  const navigate = useNavigate();
  const {
    result,
    loading,
    error,
    retry,
    params,
    setSearch,
    setFilter,
    setSort,
    setPage,
    setPageSize,
  } = usePurchaseOrders();

  const columns = useMemo(() => getPoColumns(t), [t]);
  const filterOptions = useMemo(() => getFilterOptions(t), [t]);
  const pageActions = useMemo(() => getPoListPageActions(t), [t]);
  const visiblePageActions = useMemo(
    () => pageActions.filter(
      (action) => !action.permission || MOCK_USER_PERMISSIONS.includes(action.permission),
    ),
    [pageActions],
  );

  const searchRef = useRef<SearchBarHandle>(null);
  const tableBodyRef = useRef<HTMLDivElement>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isAutoPageSize, setIsAutoPageSize] = useState(true);

  const viewportPageSize = useViewportPageSize(tableBodyRef);

  useEffect(() => {
    if (isAutoPageSize && viewportPageSize > 0 && params.pageSize !== viewportPageSize) {
      setPageSize(viewportPageSize);
    }
  }, [isAutoPageSize, viewportPageSize, params.pageSize, setPageSize]);

  const shortcutHandlers = useMemo(() => ({
    onFocusSearch: () => searchRef.current?.focus(),
    onToggleSidebar,
    onOpenFilter: () => setFilterOpen(true),
  }), [onToggleSidebar]);

  useKeyboardShortcuts(shortcutHandlers);

  const handleSort = useCallback((key: string) => {
    const newDir = params.sortBy === key && params.sortDirection === 'asc' ? 'desc' : 'asc';
    setSort(key as keyof PurchaseOrder | '', newDir);
  }, [params.sortBy, params.sortDirection, setSort]);

  const handleView = useCallback((row: PurchaseOrder) => {
    navigate(`/purchase-orders/${row.orderNo}/view`);
  }, [navigate]);

  const handleEdit = useCallback((row: PurchaseOrder) => {
    navigate(`/purchase-orders/${row.orderNo}/edit`);
  }, [navigate]);

  const handlePageAction = useCallback((actionId: string) => {
    if (actionId === 'new-purchase-order') {
      navigate('/purchase-orders/new');
    }
  }, [navigate]);

  const handlePageSizeChange = useCallback((size: number) => {
    if (size === AUTO_PAGE_SIZE) {
      setIsAutoPageSize(true);
      setPageSize(viewportPageSize);
    } else {
      setIsAutoPageSize(false);
      setPageSize(size);
    }
  }, [setPageSize, viewportPageSize]);

  const total = result?.total ?? 0;
  const totalPages = result?.totalPages ?? 0;
  const currentPage = result?.page ?? params.page;
  const effectivePageSize = params.pageSize;

  return (
    <div className="po-page">
      <PageHeader
        title={pageTitle ?? t.purchaseOrders}
        searchValue={params.search}
        onSearch={setSearch}
        activeFilter={params.filter}
        onFilter={setFilter}
        pageActions={visiblePageActions}
        onPageAction={handlePageAction}
        searchRef={searchRef}
        filterOpen={filterOpen}
        onFilterOpenChange={setFilterOpen}
        t={t}
        lang={lang}
        onLangSwitch={setLang}
        filterOptions={filterOptions}
      />
      {error && (
        <div className="po-list-error" role="alert">
          <span>{t.pages.listLoadError}</span>
          <button type="button" className="btn btn-default" onClick={retry}>
            {t.actions.retry}
          </button>
        </div>
      )}
      <div className="po-page-body" ref={tableBodyRef}>
        <DataTable
          columns={columns}
          data={result?.data ?? []}
          loading={loading}
          sortBy={params.sortBy}
          sortDirection={params.sortDirection}
          onSort={handleSort}
          onView={handleView}
          onEdit={handleEdit}
          t={t}
          lang={lang}
          fillHeight
          skeletonRowCount={effectivePageSize}
        />
      </div>
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        total={total}
        pageSize={effectivePageSize}
        isAutoPageSize={isAutoPageSize}
        viewportPageSize={viewportPageSize}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        t={t}
      />
    </div>
  );
}

export default PurchaseOrderListPage;
