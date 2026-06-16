// MOCK DATA — remove imports from services when real API is live
import type { LookupItem } from '../types/formConfig';
import { getLocationByCode } from './locations.mock';
import { getPaymentTermLabel } from './paymentTerms.mock';

export interface MockSupplier extends LookupItem {
  suppCode: string;
  suppName: string;
  address: string;
  shipMode: string;
  payTerm: string;
  docLocn: string;
}

export const MOCK_SUPPLIERS: MockSupplier[] = [
  { code: 'SUP001', name: 'Al Futtaim Trading LLC', suppCode: 'SUP001', suppName: 'Al Futtaim Trading LLC', address: 'Dubai Investment Park, Dubai, UAE', shipMode: 'SEA', payTerm: 'NET30', docLocn: 'WH-DXB-01' },
  { code: 'SUP002', name: 'Dubai Supply Co.', suppCode: 'SUP002', suppName: 'Dubai Supply Co.', address: 'Jebel Ali Free Zone, Dubai', shipMode: 'SEA', payTerm: 'NET60', docLocn: 'WH-DXB-02' },
  { code: 'SUP003', name: 'Gulf Industrial Parts', suppCode: 'SUP003', suppName: 'Gulf Industrial Parts', address: 'Sharjah Industrial Area 12', shipMode: 'LAND', payTerm: 'NET30', docLocn: 'WH-SHJ-01' },
  { code: 'SUP004', name: 'Emirates Wholesale Trading', suppCode: 'SUP004', suppName: 'Emirates Wholesale Trading', address: 'Abu Dhabi Mussafah M-37', shipMode: 'LAND', payTerm: 'COD', docLocn: 'WH-AUH-01' },
  { code: 'SUP005', name: 'Bangkok Merchants Ltd', suppCode: 'SUP005', suppName: 'Bangkok Merchants Ltd', address: 'Lat Krabang Industrial Estate, Bangkok', shipMode: 'AIR', payTerm: 'NET30', docLocn: 'WH-BKK-01' },
  { code: 'SUP006', name: 'Siam Distribution Co.', suppCode: 'SUP006', suppName: 'Siam Distribution Co.', address: 'Samut Prakan, Thailand', shipMode: 'SEA', payTerm: 'NET60', docLocn: 'WH-BKK-02' },
  { code: 'SUP007', name: 'Riyadh Trading House', suppCode: 'SUP007', suppName: 'Riyadh Trading House', address: '2nd Industrial City, Riyadh', shipMode: 'LAND', payTerm: 'NET30', docLocn: 'WH-RUH-01' },
  { code: 'SUP008', name: 'Qatar General Supplies', suppCode: 'SUP008', suppName: 'Qatar General Supplies', address: 'Doha Industrial Area', shipMode: 'SEA', payTerm: 'NET45', docLocn: 'WH-DOH-01' },
  { code: 'SUP009', name: 'Kuwait Import Export', suppCode: 'SUP009', suppName: 'Kuwait Import Export', address: 'Shuwaikh Industrial, Kuwait', shipMode: 'SEA', payTerm: 'NET30', docLocn: 'WH-KWI-01' },
  { code: 'SUP010', name: 'Oman Gulf Trading', suppCode: 'SUP010', suppName: 'Oman Gulf Trading', address: 'Rusayl Industrial Estate, Muscat', shipMode: 'LAND', payTerm: 'NET30', docLocn: 'WH-MCT-01' },
  { code: 'SUP011', name: 'Bahrain Commerce Group', suppCode: 'SUP011', suppName: 'Bahrain Commerce Group', address: 'Sitra Industrial Area', shipMode: 'SEA', payTerm: 'NET30', docLocn: 'WH-BAH-01' },
  { code: 'SUP012', name: 'Singapore Asia Pte Ltd', suppCode: 'SUP012', suppName: 'Singapore Asia Pte Ltd', address: 'Tuas Avenue, Singapore', shipMode: 'AIR', payTerm: 'NET30', docLocn: 'WH-SIN-01' },
  { code: 'SUP013', name: 'Hong Kong Pacific Trading', suppCode: 'SUP013', suppName: 'Hong Kong Pacific Trading', address: 'Kwai Chung, Hong Kong', shipMode: 'SEA', payTerm: 'NET60', docLocn: 'WH-HKG-01' },
  { code: 'SUP014', name: 'Mumbai Exports Pvt Ltd', suppCode: 'SUP014', suppName: 'Mumbai Exports Pvt Ltd', address: 'Navi Mumbai MIDC', shipMode: 'SEA', payTerm: 'NET45', docLocn: 'WH-BOM-01' },
  { code: 'SUP015', name: 'Cairo Nile Trading', suppCode: 'SUP015', suppName: 'Cairo Nile Trading', address: '6th October City, Egypt', shipMode: 'SEA', payTerm: 'NET30', docLocn: 'WH-CAI-01' },
  { code: 'SUP016', name: 'SS Steel & Supplies Co.', suppCode: 'SUP016', suppName: 'SS Steel & Supplies Co.', address: 'Samut Sakhon Industrial, Thailand', shipMode: 'SEA', payTerm: 'NET30', docLocn: 'WH-BKK-03' },
  { code: 'SUP017', name: 'SS Global Trading', suppCode: 'SUP017', suppName: 'SS Global Trading', address: 'Laem Chabang Port Zone, Thailand', shipMode: 'SEA', payTerm: 'NET45', docLocn: 'WH-BKK-04' },
  { code: 'SUP018', name: 'YSG Preferred Supplier', suppCode: 'SUP018', suppName: 'YSG Preferred Supplier', address: 'Bangkok HQ Warehouse', shipMode: 'LAND', payTerm: 'NET30', docLocn: 'WH-BKK-01' },
];

export function toSupplierLookupItem(s: MockSupplier): LookupItem {
  const location = getLocationByCode(s.docLocn);
  return {
    code: s.suppCode,
    name: s.suppName,
    address: s.address,
    shipmentMode: s.shipMode,
    paymentTerm: getPaymentTermLabel(s.payTerm, s.suppCode),
    docLocation: s.docLocn,
    locationCode: s.docLocn,
    locationName: location?.name ?? s.docLocn,
  };
}
