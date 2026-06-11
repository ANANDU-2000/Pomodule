import type { Connection } from 'oracledb';
import type {
  POListQueryParams,
  POListItem,
  POListResponse,
  PODetailResponse,
} from '../types/purchaseOrder.types';
import { env } from '../config/env';
import { toOracleListParams } from '../utils/oracleParams';
import { calcTotalPages } from '../utils/pagination';
import * as mockService from './purchaseOrder.mock.service';

export function mapOracleRow(row: Record<string, unknown>): POListItem {
  // PLACEHOLDER — map Oracle column names to POListItem when DB team shares schema
  return {
    orderNo: String(row.ORDER_NO ?? ''),
    documentDate: String(row.DOCUMENT_DATE ?? ''),
    supplierCode: String(row.SUPPLIER_CODE ?? ''),
    supplierName: String(row.SUPPLIER_NAME ?? ''),
    location: String(row.LOCATION ?? ''),
    orderValue: Number(row.ORDER_VALUE ?? 0),
    status: String(row.STATUS ?? ''),
    deliveryDate: String(row.DELIVERY_DATE ?? ''),
    remarks: String(row.REMARKS ?? ''),
    userId: String(row.USER_ID ?? ''),
  };
}

export async function getPOList(
  params: POListQueryParams,
  conn?: Connection,
): Promise<POListResponse> {
  if (env.DATA_SOURCE === 'mock') {
    return mockService.getPOList(params);
  }

  void conn;
  const binds = toOracleListParams(params);

  // PLACEHOLDER procedure call — replace with actual package.procedure:
  // const result = await conn!.execute(
  //   `BEGIN PKG_PO.GET_PO_LIST(:P_PAGE, :P_PAGE_SIZE, :P_SEARCH, :P_FROM_DATE, :P_TO_DATE, :P_SORT_BY, :P_SORT_ORDER, :P_CURSOR, :P_TOTAL); END;`,
  //   { ...binds, P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }, P_TOTAL: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
  //   { outFormat: oracledb.OUT_FORMAT_OBJECT },
  // );

  void binds;
  return {
    data: [] as POListItem[],
    total: 0,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: calcTotalPages(0, params.pageSize),
  };
}

export async function getPODetail(
  id: string,
  conn?: Connection,
): Promise<PODetailResponse | null> {
  if (env.DATA_SOURCE === 'mock') {
    return mockService.getPODetail(id);
  }

  void conn;

  // PLACEHOLDER procedure call — replace when DB team shares GET detail proc:
  // const result = await conn!.execute(
  //   `BEGIN PKG_PO.GET_PO_DETAIL(:P_ORDER_NO, :P_CURSOR); END;`,
  //   { P_ORDER_NO: id, P_CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } },
  //   { outFormat: oracledb.OUT_FORMAT_OBJECT },
  // );

  void id;
  return null;
}

export async function updatePO(
  id: string,
  payload: Partial<POListItem>,
  conn?: Connection,
): Promise<POListItem | null> {
  if (env.DATA_SOURCE === 'mock') {
    return mockService.updatePO(id, payload);
  }

  void conn;
  void payload;

  // PLACEHOLDER procedure call — replace when DB team shares UPDATE proc

  void id;
  return null;
}

export async function approvePO(
  id: string,
  conn?: Connection,
): Promise<POListItem | null> {
  if (env.DATA_SOURCE === 'mock') {
    return mockService.approvePO(id);
  }

  void conn;

  // PLACEHOLDER procedure call — replace when DB team shares APPROVE proc:
  // await conn!.execute(`BEGIN PKG_PO.APPROVE_PO(:P_ORDER_NO); END;`, { P_ORDER_NO: id });

  void id;
  return null;
}
