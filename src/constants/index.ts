export const Permissions = [
  'STAFFMEM',
  'ROLE',
  'WORKFLOW',
  'TICKET',
  'BRAND',
  'CATEGORY',
  'PRODUCT',
  'DASHBOARD',
  'STOCKADJUST',
  'WAREHOUSE',
  'SUPPLIER',
  'CUSTOMER',
  'EXPENSECATEGORY',
  'EXPENSE',
  'POS',
  'CASHANDBANK',
  'SALES',
  'STOCKTRANSFER',
  'PURCHASE',
  'REPORT',
  'SALE_RETURN',
  'PURCHASE_RETURN',
] as const;


export const Roles = ['ADMIN'] as const;

type PermissionsUnion = typeof Permissions[number];

export const PermissionsLabels: Record<PermissionsUnion, string> = {
  STAFFMEM: 'Staff Members',
  ROLE: 'Roles',
  WORKFLOW: 'Workflows',
  TICKET: 'Tickets',
  BRAND: 'Brands',
  CATEGORY: 'Categories',
  PRODUCT: 'Products',
  DASHBOARD: 'Dashboard',
  STOCKADJUST: 'Stock Adjustment',
  WAREHOUSE: 'Warehouse',
  SUPPLIER: 'Suppliers',
  CUSTOMER: 'Customers',
  EXPENSECATEGORY: 'Expense Category',
  EXPENSE: 'Expenses',
  POS: 'POS',
  CASHANDBANK: 'Cash, Bank and Account',
  SALES: 'Sales',
  STOCKTRANSFER: 'Stock Transfer',
  PURCHASE: 'Purchase',
  REPORT: 'Reports',
  SALE_RETURN: 'Sale Return',
  PURCHASE_RETURN: 'Purchase Return',
};
