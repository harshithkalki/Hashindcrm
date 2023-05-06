import { Navbar, ScrollArea, createStyles, ActionIcon } from '@mantine/core';
import {
  IconBuildingStore,
  IconChevronsLeft,
  IconFileAnalytics,
  IconReceipt2,
} from '@tabler/icons';
import type { NavData } from '../CollapsibleLink';
import LinksGroup from '../CollapsibleLink';
import { useMemo } from 'react';
import type { RootState } from '@/store';
import { useSelector } from 'react-redux';
import type { z } from 'zod';
import type { ZRole } from '@/zobjs/role';
import { useRouter } from 'next/router';

const allLinks = [
  '/company',
  '/company/new',
  '/roles',
  '/roles/new',
  '/products',
  '/brands',
  '/categories',
  '/stockadjustment',
  '/stocktransfer',
  '/parties/supplier',
  '/parties/staff',
  '/parties/customer',
  '/sales',
  '/sales/return',
  '/purchases',
  '/purchases/return',
  '/expenses',
  '/expenses/categories',
  '/reports/payments',
  '/reports/stockalert',
  '/reports/sales',
  '/reports/stock',
  '/reports/ratelist',
  '/reports/productsales',
  '/reports/userreports',
  '/reports/profitandloss',
  '/settings',
  '/logs',
  '/dashboard',
  '/admin',
  '/warehouse',
] as const;

const CompanyData: NavData['links'] = [
  { label: 'Manage companies', link: '/company' },
  { label: 'Create company', link: '/company/new' },
];

const ProductManagerData: NavData['links'] = [
  { label: 'Products', link: '/products', permissionName: 'PRODUCT' },
  { label: 'Brands', link: '/brands', permissionName: 'BRAND' },
  { label: 'Categories', link: '/categories', permissionName: 'CATEGORY' },
  { label: 'Create Role', link: '/roles/new' },
];
const Stockdata: NavData['links'] = [
  {
    label: 'Stock Adjustment',
    link: '/stockadjustment',
    permissionName: 'STOCKADJUST',
  },
  {
    label: 'Stock Transfer',
    link: '/stocktransfer',
    permissionName: 'STOCKTRANSFER',
  },
];
const PartiesData: NavData['links'] = [
  { label: 'Suppliers', link: '/parties/supplier', permissionName: 'SUPPLIER' },
  {
    label: 'Staff Members',
    link: '/parties/staff',
    permissionName: 'STAFFMEM',
  },
  { label: 'Customers', link: '/parties/customer', permissionName: 'CUSTOMER' },
];
const SalesData: NavData['links'] = [
  { label: 'Sales', link: '/sales', permissionName: 'SALES' },
  { label: 'Sales Returns', link: '/sales/return', permissionName: 'SALES' },
];
const PurchaseData: NavData['links'] = [
  { label: 'Purchase', link: '/purchases', permissionName: 'PURCHASE' },
  {
    label: 'Purchase Returns',
    link: '/purchases/return',
    permissionName: 'PURCHASE',
  },
];
const ExpensesData: NavData['links'] = [
  { label: 'Expenses', link: '/expenses', permissionName: 'EXPENSE' },
  {
    label: 'Expense Categories',
    link: '/expenses/categories',
    permissionName: 'EXPENSE',
  },
];
const ReportDate: NavData['links'] = [
  {
    label: 'Payment Report',
    link: '/reports/payments',
    permissionName: 'REPORT',
  },
  {
    label: 'Stock Alert',
    link: '/reports/stockalert',
    permissionName: 'REPORT',
  },
  { label: 'sales', link: '/reports/sales', permissionName: 'REPORT' },

  { label: 'Stock Reports', link: '/reports/stock', permissionName: 'REPORT' },
  { label: 'Rate List', link: '/reports/ratelist', permissionName: 'REPORT' },
  {
    label: 'Product Sales',
    link: '/reports/productsales',
    permissionName: 'REPORT',
  },
  {
    label: 'UserReports',
    link: '/reports/userreports',
    permissionName: 'REPORT',
  },
  {
    label: 'Profit & Loss',
    link: '/reports/profitandloss',
    permissionName: 'REPORT',
  },
];

export const navData: NavData[] = [
  {
    label: 'Roles',
    links: '/roles',
    permissionName: 'ROLE',
    icon: IconReceipt2,
  },
  {
    links: '/dashboard',
    label: 'DashBoard',
    icon: IconFileAnalytics,
    permissionName: 'DASHBOARD',
  },
  {
    links: CompanyData,
    label: 'Companies',
    icon: IconBuildingStore,
  },

  {
    links: ProductManagerData,
    label: 'Product Manager',
    icon: IconReceipt2,
  },
  {
    links: '/workflow',
    label: 'WorkFlow',
    icon: IconFileAnalytics,
    permissionName: 'WORKFLOW',
  },
  {
    links: '/tickets',
    label: 'Tickets',
    icon: IconReceipt2,
    permissionName: 'TICKET',
  },
  { links: Stockdata, label: 'Stock', icon: IconReceipt2 },
  { links: '/pos', label: 'POS', icon: IconReceipt2, permissionName: 'POS' },
  { links: PartiesData, label: 'Parties', icon: IconReceipt2 },
  { links: SalesData, label: 'Sales', icon: IconReceipt2 },
  { links: PurchaseData, label: 'Purchase', icon: IconReceipt2 },
  {
    links: '/cashandbank',
    label: 'Cash, Bank and UPI',
    icon: IconReceipt2,
    permissionName: 'CASHANDBANK',
  },
  { links: ExpensesData, label: 'Expenses', icon: IconReceipt2 },
  { links: ReportDate, label: 'Reports', icon: IconReceipt2 },
  { label: 'Admin', icon: IconReceipt2, links: '/admin' },
  {
    label: 'Warehouse',
    icon: IconReceipt2,
    links: '/warehouse',
    permissionName: 'WAREHOUSE',
  },
  { links: '/logs', label: 'Audit Logs', icon: IconFileAnalytics },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    maxHeight: '100%',
    position: 'relative',
    zIndex: 1,
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    maxHeight: '100%',
  },

  linksInner: {
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  chevron: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));

interface Props {
  hide: boolean;
  setNavOpen: (value: boolean) => void;
}

export default function NavbarNested({ hide, setNavOpen }: Props) {
  const { classes } = useStyles();

  const client = useSelector<RootState, RootState['clientState']['client']>(
    (state) => state.clientState.client
  );
  const { pathname: path } = useRouter();

  const links = useMemo(() => {
    if (client && !client.isSuperAdmin) {
      return filterNavLinks(navData, client.role.permissions);
    }

    if (client && client.isSuperAdmin) {
      return navData.filter((value) => {
        if (typeof value.links === 'string') {
          if (value.links === allLinks[28] || value.links === allLinks[29]) {
            return true;
          }
          return false;
        } else {
          value.links = value.links.filter((item) => {
            if (item.link === allLinks[0] || item.link === allLinks[1]) {
              return true;
            }
            return false;
          });

          if (value.links.length > 0) {
            return true;
          }
          return false;
        }
      });
    }

    return [];
  }, [client]);

  return (
    <Navbar
      p='md'
      className={classes.navbar}
      hiddenBreakpoint='sm'
      hidden={hide}
      py={'2.5rem'}
    >
      <div className={classes.chevron}>
        <ActionIcon size='lg' onClick={() => setNavOpen(false)}>
          <IconChevronsLeft size='1.7rem' />
        </ActionIcon>
      </div>
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>
          {links.map((item) => {
            return (
              <LinksGroup
                {...item}
                key={item.label}
                active={
                  typeof item.links === 'string'
                    ? item.links === path
                    : item.links.some((link) => link.link === path)
                }
              />
            );
          })}
        </div>
      </Navbar.Section>
    </Navbar>
  );
}

function filterNavLinks(
  navLinks: NavData[],
  permissions: z.infer<typeof ZRole>['permissions']
) {
  const filter1 = navLinks.filter((navLink) => {
    if (typeof navLink.links === 'string' && !navLink.permissionName) {
      return false;
    }
    const permission = permissions.find(
      (p) => p.permissionName === navLink.permissionName
    );

    if (permission) {
      const crud = permission.crud;
      return crud.create || crud.read || crud.update || crud.delete;
    }

    return true;
  });

  return filter1.filter((navLink) => {
    if (Array.isArray(navLink.links)) {
      navLink.links = navLink.links.filter((link) => {
        const permission = permissions.find(
          (p) => p.permissionName === link.permissionName
        );

        if (permission) {
          const crud = permission.crud;
          return crud.create || crud.read || crud.update || crud.delete;
        }

        return false;
      });
    }

    return navLink.links.length > 0;
  });
}
