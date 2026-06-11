import type { TranslationMap } from '../types/i18n';

export interface NavNode {
  id: string;
  label: string;
  code?: string;
  route?: string;
  children?: NavNode[];
}

export function getNavigation(t: TranslationMap): NavNode[] {
  return [
    {
      id: 'purchase-order',
      label: t.nav.purchaseOrder,
      children: [
        {
          id: 'po-transaction',
          label: t.nav.poTransaction,
          children: [
            { id: 'po-gh', label: t.nav.poGh, code: 'PO_GH', route: '/po/gh-delivery' },
            { id: 'po-list', label: t.nav.purchaseOrderList, code: 'PO001', route: '/po/list' },
            { id: 'po-all', label: t.nav.poAll, code: 'PO_ALL', route: '/po/all' },
            { id: 'po-exp', label: t.nav.poExp, code: 'PO_EXP', route: '/po/exp' },
            { id: 'po-ast', label: t.nav.poAst, code: 'PO_AST', route: '/po/ast' },
            { id: 'po-gr', label: t.nav.poGr, code: 'PO_GR', route: '/po/gr' },
          ],
        },
      ],
    },
  ];
}

export function findNavIdByPath(nodes: NavNode[], pathname: string): string | null {
  for (const node of nodes) {
    if (node.route && pathname.startsWith(node.route)) {
      return node.id;
    }
    if (node.children) {
      const childId = findNavIdByPath(node.children, pathname);
      if (childId) return childId;
    }
  }
  return null;
}

export function isNavNodeActive(node: NavNode, pathname: string): boolean {
  if (node.route && pathname.startsWith(node.route)) return true;
  if (node.children) {
    return node.children.some((child) => isNavNodeActive(child, pathname));
  }
  return false;
}
