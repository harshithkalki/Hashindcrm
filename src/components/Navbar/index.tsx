import { Navbar, ScrollArea, createStyles } from '@mantine/core';
import {
  IconFileAnalytics,
  IconBuildingStore,
  IconReceipt2,
  IconUser,
} from '@tabler/icons';
import type { NavData } from '../CollapsibleLink';
import LinksGroup from '../CollapsibleLink';
import { useState } from 'react';
import { UserMenu } from '../UserMenu';
import { trpc } from '@/utils/trpc';
import type { RootState } from '@/store';
import store from '@/store';
import { useSelector } from 'react-redux';

// import { UserMenu } from '../UserMenu';

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
] as const;

const CompanyData: NavData['links'] = [
  { label: 'Manage companies', link: '/company' },
  { label: 'Create company', link: '/company/new' },
];

const RolesData: NavData['links'] = [
  { label: 'All Roles', link: '/roles' },
  { label: 'Create Role', link: '/roles/new' },
];
const ProductManagerData: NavData['links'] = [
  { label: 'Products', link: '/products' },
  { label: 'Brands', link: '/brands' },
  { label: 'Categories', link: '/categories' },
  // { label: "Create Role", link: "/roles/new" },
];
const Stockdata: NavData['links'] = [
  { label: 'Stock Adjustment', link: '/stockadjustment' },
  { label: 'Stock Transfer', link: '/stocktransfer' },
];
const PartiesData: NavData['links'] = [
  { label: 'Suppliers', link: '/parties/supplier' },
  { label: 'Staff Members', link: '/parties/staff' },
  { label: 'Customers', link: '/parties/customer' },
];
const SalesData: NavData['links'] = [
  { label: 'Sales', link: '/sales' },
  { label: 'Sales Returns', link: '/sales/return' },
];
const PurchaseData: NavData['links'] = [
  { label: 'Purchase', link: '/purchases' },
  { label: 'Purchase Returns', link: '/purchases/return' },
];
const ExpensesData: NavData['links'] = [
  { label: 'Expenses', link: '/expenses' },
  { label: 'Expense Categories', link: '/expenses/categories' },
];
const ReportDate: NavData['links'] = [
  { label: 'Payment Report', link: '/reports/payments' },
  { label: 'Stock Alert', link: '/reports/stockalert' },
  { label: 'sales', link: '/reports/sales' },
  { label: 'Stock Reports', link: '/reports/stock' },
  { label: 'Rate List', link: '/reports/ratelist' },
  { label: 'Product Sales', link: '/reports/productsales' },
  { label: 'UserReports', link: '/reports/userreports' },
  { label: 'Profit & Loss', link: '/reports/profitandloss' },
];

const mockdata: NavData[] = [
  { links: '/dashboard', label: 'DashBoard', icon: IconFileAnalytics },
  { links: CompanyData, label: 'Companies', icon: IconBuildingStore },
  { links: RolesData, label: 'Roles', icon: IconReceipt2 },
  { links: ProductManagerData, label: 'Product Manager', icon: IconReceipt2 },
  { links: '/workflow', label: 'WorkFlow', icon: IconFileAnalytics },
  { links: '/tickets', label: 'Tickets', icon: IconReceipt2 },
  { links: Stockdata, label: 'Stock', icon: IconReceipt2 },
  { links: '/pos', label: 'POS', icon: IconReceipt2 },
  { links: PartiesData, label: 'Parties', icon: IconReceipt2 },
  { links: SalesData, label: 'Sales', icon: IconReceipt2 },
  { links: PurchaseData, label: 'Purchase', icon: IconReceipt2 },
  { links: '/cashandbank', label: 'Cash and Bank', icon: IconReceipt2 },
  { links: ExpensesData, label: 'Expenses', icon: IconReceipt2 },
  { links: ReportDate, label: 'Reports', icon: IconReceipt2 },
  { links: '/settings', label: 'Settings', icon: IconReceipt2 },
  //   { links: "/logs", label: "Audit Logs", icon: IconFileAnalytics },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    maxHeight: '100%',
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
}));

interface Props {
  hide: boolean;
}

export default function NavbarNested({ hide }: Props) {
  const { classes } = useStyles();
  const [active, setActive] = useState('Billing');
  const logout = trpc.auth.logout.useMutation();
  const client = useSelector<RootState, RootState['clientState']['client']>(
    (state) => state.clientState.client
  );

  const links = mockdata
    .filter((value) => {
      if (client?.isSuperAdmin) {
        if (typeof value.links === 'string') {
          if (value.links === allLinks[28]) {
            return true;
          }
          return false;
        } else {
          value.links = value.links.filter((item) => {
            if (item.link === allLinks[10]) {
              return true;
            }
            return false;
          });

          if (value.links.length > 0) {
            return true;
          }
          return false;
        }
      }
    })
    .map((item) => (
      <LinksGroup
        {...item}
        key={item.label}
        onClick={() => {
          setActive(item.label);
        }}
        active={item.label === active}
      />
    ));

  return (
    <Navbar
      p='md'
      className={classes.navbar}
      hiddenBreakpoint='sm'
      hidden={hide}
    >
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <UserMenu
          logout={async () => {
            await logout.mutateAsync();
            window.location.reload();
          }}
        />
      </Navbar.Section>
    </Navbar>
  );
}
