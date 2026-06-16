// MOCK DATA — remove imports from services when real API is live
import type { LookupItem } from '../types/formConfig';

export const MOCK_LOCATIONS: LookupItem[] = [
  { code: 'WH-BKK-01', name: 'Bangkok Main Warehouse' },
  { code: 'WH-BKK-02', name: 'Bangkok Secondary DC' },
  { code: 'WH-BKK-03', name: 'Bangkok Samut Sakhon DC' },
  { code: 'WH-BKK-04', name: 'Laem Chabang Port Warehouse' },
  { code: 'WH-DXB-01', name: 'Dubai Central Warehouse' },
  { code: 'WH-DXB-02', name: 'Dubai Jebel Ali DC' },
  { code: 'WH-SHJ-01', name: 'Sharjah Distribution Center' },
  { code: 'WH-AUH-01', name: 'Abu Dhabi Warehouse' },
  { code: 'WH-SIN-01', name: 'Singapore Hub' },
  { code: 'WH-HKG-01', name: 'Hong Kong Transit' },
  { code: 'WH-RUH-01', name: 'Riyadh Regional DC' },
  { code: 'WH-DOH-01', name: 'Doha Industrial Warehouse' },
  { code: 'WH-KWI-01', name: 'Kuwait Shuwaikh DC' },
  { code: 'WH-MCT-01', name: 'Muscat Rusayl DC' },
  { code: 'WH-BAH-01', name: 'Bahrain Sitra DC' },
  { code: 'WH-BOM-01', name: 'Mumbai Navi MIDC DC' },
  { code: 'WH-CAI-01', name: 'Cairo 6th October DC' },
];

export function getLocationByCode(code: string): LookupItem | undefined {
  const normalized = code.trim().toUpperCase();
  return MOCK_LOCATIONS.find((loc) => loc.code.toUpperCase() === normalized);
}
