import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import PurchaseOrderListPage from './pages/PurchaseOrderListPage';
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

  const listPageProps = { onToggleSidebar: toggle, t, lang, setLang };

  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        {t.accessibility.skipToContent}
      </a>
      <SideMenu collapsed={collapsed} onToggle={toggle} t={t} />
      <main id="main-content" className="app-main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Navigate to="/po/list" replace />} />
          <Route path="/po/list" element={<PurchaseOrderListPage {...listPageProps} />} />
          <Route path="/po/gh-delivery" element={<PurchaseOrderListPage {...listPageProps} pageTitle={t.moduleTitles.poGh} />} />
          <Route path="/po/all" element={<PurchaseOrderListPage {...listPageProps} pageTitle={t.moduleTitles.poAll} />} />
          <Route path="/po/exp" element={<PurchaseOrderListPage {...listPageProps} pageTitle={t.moduleTitles.poExp} />} />
          <Route path="/po/ast" element={<PurchaseOrderListPage {...listPageProps} pageTitle={t.moduleTitles.poAst} />} />
          <Route path="/po/gr" element={<PurchaseOrderListPage {...listPageProps} pageTitle={t.moduleTitles.poGr} />} />
          <Route path="/purchase-orders/:orderNo/view" element={<PurchaseOrderViewPage t={t} lang={lang} setLang={setLang} />} />
          <Route path="/purchase-orders/:orderNo/edit" element={<PurchaseOrderEditPage t={t} lang={lang} setLang={setLang} />} />
          <Route path="/purchase-orders/new" element={<PurchaseOrderNewPage t={t} lang={lang} setLang={setLang} />} />
          <Route path="*" element={<Navigate to="/po/list" replace />} />
        </Routes>
      </main>
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
