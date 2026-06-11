import { useMemo, type KeyboardEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNavigation, isNavNodeActive, type NavNode } from '../constants/navigation';
import { KEYBOARD_SHORTCUTS } from '../constants/keyboardShortcuts';
import { useSidebarExpanded } from '../hooks/useSidebarExpanded';
import type { TranslationMap } from '../types/i18n';

interface SideMenuProps {
  collapsed: boolean;
  onToggle: () => void;
  t: TranslationMap;
}

function NavIcon() {
  return (
    <span className="nav-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    </span>
  );
}

interface NavTreeProps {
  nodes: NavNode[];
  depth: number;
  collapsed: boolean;
  pathname: string;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onNavigate: (route: string) => void;
  onKeyDown: (e: KeyboardEvent, action: () => void) => void;
}

function NavTree({
  nodes,
  depth,
  collapsed,
  pathname,
  expandedIds,
  onToggleExpand,
  onNavigate,
  onKeyDown,
}: NavTreeProps) {
  return (
    <>
      {nodes.map((node) => {
        const hasChildren = Boolean(node.children?.length);
        const isLeaf = Boolean(node.route);
        const isExpanded = expandedIds.has(node.id);
        const isActive = isLeaf && node.route
          ? pathname.startsWith(node.route)
          : isNavNodeActive(node, pathname);

        if (isLeaf && node.route) {
          return (
            <button
              key={node.id}
              type="button"
              className={`nav-child${isActive ? ' active' : ''}`}
              role="menuitem"
              title={collapsed ? node.label : undefined}
              onClick={() => onNavigate(node.route!)}
              onKeyDown={(e) => onKeyDown(e, () => onNavigate(node.route!))}
            >
              {node.code && <span className="nav-child-code">{node.code}</span>}
              <span>{node.label}</span>
            </button>
          );
        }

        const className = depth === 0 ? 'nav-parent' : 'nav-group';

        return (
          <div key={node.id}>
            <button
              type="button"
              className={className}
              role="menuitem"
              aria-expanded={hasChildren ? isExpanded : undefined}
              title={collapsed ? node.label : undefined}
              onClick={() => hasChildren && onToggleExpand(node.id)}
              onKeyDown={(e) => onKeyDown(e, () => hasChildren && onToggleExpand(node.id))}
            >
              {depth === 0 && <NavIcon />}
              <span className="nav-parent-label">{node.label}</span>
              {hasChildren && (
                <span className={`nav-chevron${isExpanded ? ' expanded' : ''}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              )}
            </button>
            {hasChildren && isExpanded && !collapsed && (
              <div className="nav-children">
                <NavTree
                  nodes={node.children!}
                  depth={depth + 1}
                  collapsed={collapsed}
                  pathname={pathname}
                  expandedIds={expandedIds}
                  onToggleExpand={onToggleExpand}
                  onNavigate={onNavigate}
                  onKeyDown={onKeyDown}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

function SideMenu({ collapsed, onToggle, t }: SideMenuProps) {
  const { expandedIds, toggleExpand } = useSidebarExpanded();
  const navigation = useMemo(() => getNavigation(t), [t]);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleKeyDown = (e: KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <aside className={`side-menu${collapsed ? ' collapsed' : ''}`}>
      <nav className="side-menu-nav" role="navigation" aria-label={t.sidebar.mainNav}>
        <NavTree
          nodes={navigation}
          depth={0}
          collapsed={collapsed}
          pathname={pathname}
          expandedIds={expandedIds}
          onToggleExpand={toggleExpand}
          onNavigate={navigate}
          onKeyDown={handleKeyDown}
        />
      </nav>

      <div className="side-menu-footer">
        <button type="button" className="nav-logout" title={t.nav.logout} disabled>
          <span className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          <span className="nav-logout-label">{t.nav.logout}</span>
        </button>
      </div>

      <div className="side-menu-rail">
        <button
          type="button"
          className="side-menu-toggle"
          onClick={onToggle}
          aria-label={collapsed ? t.sidebar.expand : t.sidebar.collapse}
          aria-keyshortcuts={KEYBOARD_SHORTCUTS.toggleSidebar.label}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {collapsed ? (
              <path d="M9 18l6-6-6-6" />
            ) : (
              <path d="M15 18l-6-6 6-6" />
            )}
          </svg>
        </button>
      </div>
    </aside>
  );
}

export default SideMenu;
