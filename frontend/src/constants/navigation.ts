import type { TranslationMap } from '../types/i18n';

export interface NavNode {
  id: string;
  label: string;
  code?: string;
  route?: string;
  status?: 'live' | 'pending' | 'future';
  pendingReason?: string;
  children?: NavNode[];
}

export function getNavigation(t: TranslationMap): NavNode[] {
  return [
    {
      id: 'purchase-order',
      label: t.nav.purchaseOrder,
      children: [
        { id: 'po-list', label: t.nav.purchaseOrderList, code: 'PO001', route: '/po/list', status: 'live' },
        { id: 'po-gh', label: t.nav.poGh, code: 'PO_GH', route: '/po/gh-delivery', status: 'pending', pendingReason: 'Waiting for DB team: ORACLE_SUPPLIER_VIEW' },
        { id: 'po-all', label: t.nav.poAll, code: 'PO_ALL', route: '/po/all', status: 'pending', pendingReason: 'Waiting for DB team: ORACLE_PO_LINE_VIEW' },
        { id: 'po-exp', label: t.nav.poExp, code: 'PO_EXP', route: '/po/exp', status: 'future', pendingReason: 'Future module' },
        { id: 'po-ast', label: t.nav.poAst, code: 'PO_AST', route: '/po/ast', status: 'future', pendingReason: 'Future module' },
        { id: 'po-gr', label: t.nav.poGr, code: 'PO_GR', route: '/po/gr', status: 'pending', pendingReason: 'Waiting for DB team: ORACLE_GRN_VIEW' },
      ],
    },
  ];
}

export function isNavNodeActive(node: NavNode, pathname: string): boolean {
  if (node.route && pathname.startsWith(node.route)) return true;
  if (pathname.startsWith('/purchase-orders')) {
    return node.id === 'purchase-order';
  }
  if (node.children) {
    return node.children.some((child) => isNavNodeActive(child, pathname));
  }
  return false;
}
