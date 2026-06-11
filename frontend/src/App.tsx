import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import PurchaseOrderListPage from './pages/PurchaseOrderListPage';
import POTransactionListPage from './pages/POTransactionListPage';
import PurchaseOrderViewPage from './pages/PurchaseOrderViewPage';
import PurchaseOrderEditPage from './pages/PurchaseOrderEditPage';
import PurchaseOrderNewPage from './pages/PurchaseOrderNewPage';
import { useSidebarState } from './hooks/useSidebarState';
import { useLanguage } from './hooks/useLanguage';

function AppLayout() {
  const { collapsed, toggle } = useSidebarState();
  const { lang, t, setLang } = useLanguage();

  useEffect(() => {
    document.title = t.pageTitle;
  }, [t.pageTitle]);

  const pageProps = { onToggleSidebar: toggle, t, lang, setLang };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--color-bg-app)',
    }}>
      <SideMenu collapsed={collapsed} onToggle={toggle} t={t} />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
      }}>
        <Routes>
          <Route path="/" element={<Navigate to="/po/list" replace />} />
          <Route path="/po/list" element={<PurchaseOrderListPage {...pageProps} />} />
          <Route path="/po/gh-delivery" element={<POTransactionListPage {...pageProps} moduleCode="po-gh" />} />
          <Route path="/po/all" element={<POTransactionListPage {...pageProps} moduleCode="po-all" />} />
          <Route path="/po/exp" element={<POTransactionListPage {...pageProps} moduleCode="po-exp" />} />
          <Route path="/po/ast" element={<POTransactionListPage {...pageProps} moduleCode="po-ast" />} />
          <Route path="/po/gr" element={<POTransactionListPage {...pageProps} moduleCode="po-gr" />} />
          <Route path="/purchase-orders/:orderNo/view" element={<PurchaseOrderViewPage t={t} lang={lang} setLang={setLang} />} />
          <Route path="/purchase-orders/:orderNo/edit" element={<PurchaseOrderEditPage t={t} lang={lang} setLang={setLang} />} />
          <Route path="/purchase-orders/new" element={<PurchaseOrderNewPage t={t} lang={lang} setLang={setLang} />} />
          <Route path="*" element={<Navigate to="/po/list" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
