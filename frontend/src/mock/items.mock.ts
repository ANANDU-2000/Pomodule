// MOCK DATA — remove imports from services when real API is live
// When real DB: calls ORACLE_ITEM_VIEW with search param
// Known query: SELECT ITEM_CODE, ITEM_NAME FROM OM_ITEM WHERE NVL(ITEM_FRZ_FLAG_NUM,2) = 2
import type { LookupItem } from '../types/formConfig';

const UOMS = ['PCS', 'KG', 'MTR', 'BOX', 'CTN'] as const;

const ITEM_NAMES = [
  'Stainless Steel Bolt M8', 'Industrial Lubricant 20L', 'PVC Pipe 2 inch', 'Copper Wire 2.5mm',
  'Safety Helmet Yellow', 'LED Flood Light 100W', 'Hydraulic Hose 1/2"', 'Ball Bearing 6205',
  'Rubber Gasket Set', 'Electric Motor 5HP', 'Steel Plate 6mm', 'Aluminium Profile 40x40',
  'Packaging Carton Large', 'Office Paper A4 Ream', 'Cleaning Solvent 5L', 'Welding Rod 3.2mm',
  'Chain Block 2 Ton', 'Pallet Wood Standard', 'Filter Cartridge HEPA', 'Cable Tray 100mm',
  'Paint Epoxy White 20L', 'Hand Gloves Nitrile', 'Drill Bit Set HSS', 'Conveyor Belt 600mm',
  'Timer Relay 24VDC', 'Pressure Gauge 0-10 bar', 'Flexible Duct 300mm', 'Sealant Silicone Clear',
  'Tool Cabinet 5 Drawer', 'Fire Extinguisher 6kg',
];

export const MOCK_ITEMS: LookupItem[] = [
  { code: 'SSS001', name: 'Stainless Steel Bolt M8', uom: 'PCS' },
  { code: 'SSS002', name: 'Stainless Steel Nut M8', uom: 'PCS' },
  ...ITEM_NAMES.map((name, i) => {
    const num = String(i + 1).padStart(4, '0');
    return {
      code: `ITM${num}`,
      name,
      uom: UOMS[i % UOMS.length],
    };
  }),
];
