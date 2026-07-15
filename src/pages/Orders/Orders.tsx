import { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@components/atoms/Sidebar';
import { BookStoreLogo } from '@components/atoms/Sidebar/BookStoreLogo';
import { Button } from '@components/atoms/Button';
import { SearchInput } from '@components/atoms/SearchInput';
import { Icon } from '@components/atoms/Icon';
import { SegmentedControl } from '@components/atoms/SegmentedControl';
import { Dropdown } from '@components/atoms/Dropdown';
import { TableCellTitleCheckbox } from '@components/atoms/TableCell/TableCellTitleCheckbox';
import { TableCellTitle } from '@components/atoms/TableCell/TableCellTitle';
import { TableCellCheckbox } from '@components/atoms/TableCell/TableCellCheckbox';
import { TableCellText } from '@components/atoms/TableCell/TableCellText';
import { TableCellBadge } from '@components/atoms/TableCell/TableCellBadge';
import type { SidebarNavItem, SidebarUser } from '@components/atoms/Sidebar/Sidebar.types';
import type { BadgeColor } from '@components/atoms/Badge/Badge.types';
import type { StatusStatus } from '@components/atoms/Status/Status.types';
import { OrderDrawer } from './OrderDrawer';
import type { DrawerOrder } from './OrderDrawer';
import styles from './Orders.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

/* ── Navigation ─────────────────────────────────────────────────────────────── */
function makeNavItems(onNavigate?: (page: string) => void): SidebarNavItem[] {
  return [
    { id: 'dashboard', icon: 'dashboard',    label: 'Dashboard',              onClick: () => onNavigate?.('dashboard') },
    { id: 'orders',    icon: 'shopping-bag', label: 'Orders', badge: 12, selected: true, onClick: () => onNavigate?.('orders') },
    { id: 'users',     icon: 'user',         label: 'Users',                  onClick: () => onNavigate?.('users') },
    { id: 'products',  icon: 'barcode',      label: 'Products',               onClick: () => onNavigate?.('products') },
    { id: 'tasks',     icon: 'task-list',    label: 'Work tasks',             onClick: () => onNavigate?.('tasks') },
    { id: 'blog',      icon: 'news',         label: 'Blog',                   onClick: () => onNavigate?.('blog') },
  ];
}

const BOTTOM_ITEMS: SidebarNavItem[] = [
  { id: 'settings', icon: 'settings', label: 'Settings' },
  { id: 'help',     icon: 'question', label: 'Help' },
];

const USER: SidebarUser = {
  initials: 'OM',
  name: 'Oleksandr Melnyk',
  role: 'Warehouse manager',
};

/* ── Stat cards ─────────────────────────────────────────────────────────────── */
const STAT_CARDS = [
  { label: 'New orders',       value: '243',    change: '+20%', positive: true  },
  { label: 'Pending orders',   value: '25',     change: '-6%',  positive: false },
  { label: 'Completed orders', value: '1 879',  change: '+12%', positive: true  },
];

/* ── Dropdown options ────────────────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: 'default',    label: 'Default' },
  { value: 'date_desc',  label: 'Newest first' },
  { value: 'date_asc',   label: 'Oldest first' },
  { value: 'amount',     label: 'By amount' },
];

const PAGE_SIZE_OPTIONS = [
  { value: '15', label: '15' },
  { value: '25', label: '25' },
  { value: '40', label: '40' },
];

const MARK_AS_OPTIONS = [
  { value: 'new',        label: 'New' },
  { value: 'processing', label: 'Processing' },
  { value: 'done',       label: 'Completed' },
  { value: 'cancelled',  label: 'Cancelled' },
];

/* ── Table data ─────────────────────────────────────────────────────────────── */
type OrderStatus = 'New' | 'Processing' | 'Completed' | 'Cancelled';

interface Order {
  rowId: string;
  id: string;
  client: string;
  phone: string;
  status: OrderStatus;
  amount: string;
  paymentStatus: string;
  paymentStatusType: StatusStatus;
  paymentMethod: string;
  deliveryCarrier: string;
  deliveryAddress: string;
  date: string;
  time: string;
}

const INITIAL_ORDERS: Order[] = [
  {
    rowId: '1',
    id: 'ORD-1234',
    client: 'Oleksandr Kovalenko',
    phone: '+380 50 123 4924',
    status: 'New',
    amount: '1 250 ₴',
    paymentStatus: 'Paid',
    paymentStatusType: 'success',
    paymentMethod: 'Online',
    deliveryCarrier: 'Nova Poshta',
    deliveryAddress: 'Kyiv, Branch #12',
    date: '2026-04-10',
    time: '12:15',
  },
  {
    rowId: '2',
    id: 'ORD-1235',
    client: 'Maria Petrenko',
    phone: '+380 67 234 5678',
    status: 'Processing',
    amount: '3 490 ₴',
    paymentStatus: 'Pending',
    paymentStatusType: 'warning',
    paymentMethod: 'Card',
    deliveryCarrier: 'Courier delivery',
    deliveryAddress: 'Lviv, 15 Zelena St., apt. 42',
    date: '2026-04-12',
    time: '09:30',
  },
  {
    rowId: '3',
    id: 'ORD-1236',
    client: 'Ivan Sydorenko',
    phone: '+380 93 345 6789',
    status: 'Completed',
    amount: '780 ₴',
    paymentStatus: 'Paid',
    paymentStatusType: 'success',
    paymentMethod: 'Cash',
    deliveryCarrier: 'Pickup',
    deliveryAddress: 'Book World store, Odesa',
    date: '2026-04-11',
    time: '15:45',
  },
  {
    rowId: '4',
    id: 'ORD-1237',
    client: 'Olha Kravchenko',
    phone: '+380 50 456 7890',
    status: 'Cancelled',
    amount: '2 100 ₴',
    paymentStatus: 'Refunded',
    paymentStatusType: 'disabled',
    paymentMethod: 'Online',
    deliveryCarrier: 'Ukrposhta',
    deliveryAddress: 'Kharkiv, Branch #5',
    date: '2026-04-09',
    time: '11:00',
  },
  { rowId: '5',  id: 'ORD-1238', client: 'Dmytro Lysenko',      phone: '+380 63 512 3344', status: 'New',        amount: '560 ₴',   paymentStatus: 'Paid',     paymentStatusType: 'success',  paymentMethod: 'Card',   deliveryCarrier: 'Nova Poshta',     deliveryAddress: 'Dnipro, Branch #3',              date: '2026-04-13', time: '08:20' },
  { rowId: '6',  id: 'ORD-1239', client: 'Tetiana Moroz',       phone: '+380 97 621 5599', status: 'Processing', amount: '1 890 ₴', paymentStatus: 'Pending',  paymentStatusType: 'warning',  paymentMethod: 'Online', deliveryCarrier: 'Courier delivery', deliveryAddress: 'Zaporizhzhia, 8 Peremohy St.',   date: '2026-04-13', time: '10:05' },
  { rowId: '7',  id: 'ORD-1240', client: 'Artem Grytsenko',     phone: '+380 50 733 8821', status: 'Completed',  amount: '4 200 ₴', paymentStatus: 'Paid',     paymentStatusType: 'success',  paymentMethod: 'Card',   deliveryCarrier: 'Nova Poshta',     deliveryAddress: 'Kyiv, Branch #44',               date: '2026-04-08', time: '14:00' },
  { rowId: '8',  id: 'ORD-1241', client: 'Nataliia Bondarenko', phone: '+380 67 844 2200', status: 'New',        amount: '990 ₴',   paymentStatus: 'Paid',     paymentStatusType: 'success',  paymentMethod: 'Online', deliveryCarrier: 'Ukrposhta',       deliveryAddress: 'Poltava, Branch #2',             date: '2026-04-14', time: '09:55' },
  { rowId: '9',  id: 'ORD-1242', client: 'Serhii Savchenko',    phone: '+380 93 955 1177', status: 'Cancelled',  amount: '3 300 ₴', paymentStatus: 'Refunded', paymentStatusType: 'disabled', paymentMethod: 'Card',   deliveryCarrier: 'Nova Poshta',     deliveryAddress: 'Sumy, Branch #7',                date: '2026-04-07', time: '16:30' },
  { rowId: '10', id: 'ORD-1243', client: 'Yuliia Zakharchenko', phone: '+380 50 066 4433', status: 'Processing', amount: '2 750 ₴', paymentStatus: 'Pending',  paymentStatusType: 'warning',  paymentMethod: 'Online', deliveryCarrier: 'Courier delivery', deliveryAddress: 'Vinnytsia, 3 Soborna St.',       date: '2026-04-14', time: '11:40' },
  { rowId: '11', id: 'ORD-1244', client: 'Pavlo Shevchenko',    phone: '+380 67 177 6655', status: 'Completed',  amount: '1 100 ₴', paymentStatus: 'Paid',     paymentStatusType: 'success',  paymentMethod: 'Cash',   deliveryCarrier: 'Pickup',          deliveryAddress: 'Book World store, Kyiv',         date: '2026-04-06', time: '13:15' },
  { rowId: '12', id: 'ORD-1245', client: 'Viktoriia Tkachenko', phone: '+380 93 288 9900', status: 'New',        amount: '650 ₴',   paymentStatus: 'Paid',     paymentStatusType: 'success',  paymentMethod: 'Card',   deliveryCarrier: 'Nova Poshta',     deliveryAddress: 'Odesa, Branch #18',              date: '2026-04-15', time: '07:50' },
  { rowId: '13', id: 'ORD-1246', client: 'Roman Kyrylenko',     phone: '+380 50 399 1122', status: 'Processing', amount: '5 600 ₴', paymentStatus: 'Pending',  paymentStatusType: 'warning',  paymentMethod: 'Online', deliveryCarrier: 'Ukrposhta',       deliveryAddress: 'Kherson, Branch #1',             date: '2026-04-15', time: '12:00' },
  { rowId: '14', id: 'ORD-1247', client: 'Liudmyla Yatsenko',   phone: '+380 97 410 5566', status: 'Completed',  amount: '3 750 ₴', paymentStatus: 'Paid',     paymentStatusType: 'success',  paymentMethod: 'Card',   deliveryCarrier: 'Nova Poshta',     deliveryAddress: 'Lviv, Branch #9',                date: '2026-04-05', time: '17:20' },
  { rowId: '15', id: 'ORD-1248', client: 'Mykola Ivanenko',     phone: '+380 63 521 7788', status: 'Cancelled',  amount: '1 470 ₴', paymentStatus: 'Refunded', paymentStatusType: 'disabled', paymentMethod: 'Online', deliveryCarrier: 'Courier delivery', deliveryAddress: 'Rivne, 22 Dubenska St.',        date: '2026-04-04', time: '10:30' },
  { rowId: '16', id: 'ORD-1249', client: 'Inna Nazarenko',      phone: '+380 50 632 8844', status: 'New',        amount: '820 ₴',   paymentStatus: 'Paid',     paymentStatusType: 'success',  paymentMethod: 'Card',   deliveryCarrier: 'Nova Poshta',     deliveryAddress: 'Chernihiv, Branch #4',           date: '2026-04-16', time: '08:45' },
  { rowId: '17', id: 'ORD-1250', client: 'Andrii Oliinyk',      phone: '+380 67 743 3322', status: 'Processing', amount: '2 200 ₴', paymentStatus: 'Pending',  paymentStatusType: 'warning',  paymentMethod: 'Online', deliveryCarrier: 'Ukrposhta',       deliveryAddress: 'Khmelnytskyi, Branch #6',        date: '2026-04-16', time: '13:55' },
  { rowId: '18', id: 'ORD-1251', client: 'Kateryna Vlasenko',   phone: '+380 93 854 0011', status: 'Completed',  amount: '490 ₴',   paymentStatus: 'Paid',     paymentStatusType: 'success',  paymentMethod: 'Cash',   deliveryCarrier: 'Pickup',          deliveryAddress: 'Book World store, Kharkiv',      date: '2026-04-03', time: '15:10' },
  { rowId: '19', id: 'ORD-1252', client: 'Yevhen Kravets',      phone: '+380 50 965 2233', status: 'New',        amount: '1 680 ₴', paymentStatus: 'Paid',     paymentStatusType: 'success',  paymentMethod: 'Card',   deliveryCarrier: 'Nova Poshta',     deliveryAddress: 'Kropyvnytskyi, Branch #2',       date: '2026-04-17', time: '09:10' },
  { rowId: '20', id: 'ORD-1253', client: 'Oksana Rudenko',      phone: '+380 97 076 4455', status: 'Cancelled',  amount: '3 900 ₴', paymentStatus: 'Refunded', paymentStatusType: 'disabled', paymentMethod: 'Online', deliveryCarrier: 'Ukrposhta',       deliveryAddress: 'Zhytomyr, Branch #3',            date: '2026-04-02', time: '11:25' },
  { rowId: '21', id: 'ORD-1254', client: 'Bohdan Melnyk',       phone: '+380 63 187 6677', status: 'Processing', amount: '7 100 ₴', paymentStatus: 'Pending',  paymentStatusType: 'warning',  paymentMethod: 'Card',   deliveryCarrier: 'Courier delivery', deliveryAddress: 'Uzhhorod, 5 Haharina St.',       date: '2026-04-17', time: '14:40' },
  { rowId: '22', id: 'ORD-1255', client: 'Halyna Polishchuk',   phone: '+380 50 298 8899', status: 'Completed',  amount: '2 350 ₴', paymentStatus: 'Paid',     paymentStatusType: 'success',  paymentMethod: 'Online', deliveryCarrier: 'Nova Poshta',     deliveryAddress: 'Lutsk, Branch #10',              date: '2026-04-01', time: '16:05' },
  { rowId: '23', id: 'ORD-1256', client: 'Maksym Lytvyn',       phone: '+380 67 309 5544', status: 'New',        amount: '430 ₴',   paymentStatus: 'Paid',     paymentStatusType: 'success',  paymentMethod: 'Card',   deliveryCarrier: 'Ukrposhta',       deliveryAddress: 'Ternopil, Branch #5',            date: '2026-04-18', time: '07:30' },
  { rowId: '24', id: 'ORD-1257', client: 'Svitlana Hnatenko',   phone: '+380 93 420 2211', status: 'Processing', amount: '1 540 ₴', paymentStatus: 'Pending',  paymentStatusType: 'warning',  paymentMethod: 'Online', deliveryCarrier: 'Nova Poshta',     deliveryAddress: 'Ivano-Frankivsk, Branch #8',     date: '2026-04-18', time: '10:50' },
  { rowId: '25', id: 'ORD-1258', client: 'Leonid Stets',        phone: '+380 50 531 9988', status: 'Completed',  amount: '6 800 ₴', paymentStatus: 'Paid',     paymentStatusType: 'success',  paymentMethod: 'Card',   deliveryCarrier: 'Courier delivery', deliveryAddress: 'Chernivtsi, 14 Holovna St.',    date: '2026-03-31', time: '13:00' },
  { rowId: '26', id: 'ORD-1259', client: 'Alla Dovhal',         phone: '+380 67 642 7733', status: 'Cancelled',  amount: '910 ₴',   paymentStatus: 'Refunded', paymentStatusType: 'disabled', paymentMethod: 'Cash',   deliveryCarrier: 'Pickup',          deliveryAddress: 'Book World store, Dnipro',       date: '2026-03-30', time: '15:35' },
  { rowId: '27', id: 'ORD-1260', client: 'Valentyn Prymak',     phone: '+380 93 753 6622', status: 'New',        amount: '2 980 ₴', paymentStatus: 'Paid',     paymentStatusType: 'success',  paymentMethod: 'Online', deliveryCarrier: 'Ukrposhta',       deliveryAddress: 'Mariupol, Branch #2',            date: '2026-04-19', time: '08:00' },
  { rowId: '28', id: 'ORD-1261', client: 'Nadiia Romanenko',    phone: '+380 50 864 1100', status: 'Processing', amount: '3 120 ₴', paymentStatus: 'Pending',  paymentStatusType: 'warning',  paymentMethod: 'Card',   deliveryCarrier: 'Nova Poshta',     deliveryAddress: 'Zaporizhzhia, Branch #21',       date: '2026-04-19', time: '11:15' },
];

const STATUS_BADGE_COLOR: Record<OrderStatus, BadgeColor> = {
  'New':        'blue',
  'Processing': 'orange',
  'Completed':  'green',
  'Cancelled':  'red',
};

const MARK_AS_TO_STATUS: Record<string, OrderStatus> = {
  new:        'New',
  processing: 'Processing',
  done:       'Completed',
  cancelled:  'Cancelled',
};

type PaymentInfo = { paymentStatus: string; paymentStatusType: StatusStatus };
const STATUS_PAYMENT_MAP: Record<OrderStatus, PaymentInfo> = {
  'New':        { paymentStatus: 'Paid',     paymentStatusType: 'success'  },
  'Processing': { paymentStatus: 'Pending',  paymentStatusType: 'warning'  },
  'Completed':  { paymentStatus: 'Paid',     paymentStatusType: 'success'  },
  'Cancelled':  { paymentStatus: 'Refunded', paymentStatusType: 'disabled' },
};

const TAB_FILTER: Record<string, OrderStatus | null> = {
  all:        null,
  new:        'New',
  processing: 'Processing',
  done:       'Completed',
  cancelled:  'Cancelled',
};

/* ── Sort helpers ────────────────────────────────────────────────────────────── */
type SortField = 'id' | 'client' | 'date' | 'amount' | 'method';
type SortDir   = 'asc' | 'desc';

const parseAmount = (s: string) => parseInt(s.replace(/\D/g, ''), 10) || 0;
const parseDateMs = (date: string, time: string) =>
  new Date(`${date}T${time}`).getTime();

function applySort(orders: Order[], field: SortField | null, dir: SortDir): Order[] {
  if (!field) return orders;
  return [...orders].sort((a, b) => {
    let cmp = 0;
    if (field === 'id')     cmp = a.id.localeCompare(b.id);
    if (field === 'client') cmp = a.client.localeCompare(b.client, 'en');
    if (field === 'date')   cmp = parseDateMs(a.date, a.time) - parseDateMs(b.date, b.time);
    if (field === 'amount') cmp = parseAmount(a.amount) - parseAmount(b.amount);
    if (field === 'method') cmp = a.paymentMethod.localeCompare(b.paymentMethod, 'en');
    return dir === 'asc' ? cmp : -cmp;
  });
}

/* ── Three-dots icon ─────────────────────────────────────────────────────────── */
const ThreeDotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="3"  cy="8" r="1.5" fill="currentColor" />
    <circle cx="8"  cy="8" r="1.5" fill="currentColor" />
    <circle cx="13" cy="8" r="1.5" fill="currentColor" />
  </svg>
);

/* ── Pagination button ───────────────────────────────────────────────────────── */
const PageBtn = ({
  children,
  active = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => (
  <button
    className={cx(styles.pageBtn, active && styles.pageBtnActive)}
    disabled={disabled}
    onClick={onClick}
    type="button"
  >
    {children}
  </button>
);

/* ══ Orders page ═════════════════════════════════════════════════════════════ */
export function Orders({ onNavigate }: { onNavigate?: (page: string) => void } = {}) {
  const [sidebarFolded, setSidebarFolded] = useState(() => window.innerWidth < 768);
  const [orders, setOrders]               = useState<Order[]>(INITIAL_ORDERS);
  const [search, setSearch]               = useState('');
  const [activeTab, setActiveTab]         = useState('all');
  const [sortValue, setSortValue]         = useState('');
  const [colSort, setColSort]             = useState<{ field: SortField; dir: SortDir } | null>(null);
  const [selectedRows, setSelectedRows]   = useState<Set<string>>(new Set());
  const [markAs, setMarkAs]               = useState('');
  const [markAsOpen, setMarkAsOpen]       = useState(false);
  const markAsRef                         = useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize]           = useState('15');
  const [currentPage, setCurrentPage]     = useState(1);
  const [drawerOrder, setDrawerOrder]     = useState<DrawerOrder | null>(null);

  const openDrawer = (order: Order) => setDrawerOrder({
    ...order,
    products: [
      { id: 'p1', name: 'Encyclopedia of Art',      price: 1250, qty: 1 },
      { id: 'p2', name: 'The Great Book of Nature', price: 890,  qty: 2 },
      { id: 'p3', name: "Children's World Atlas",   price: 560,  qty: 1 },
    ],
    logEvents: [
      { id: 'e1', badgeLabel: 'Status',  badgeColor: 'green', title: 'Order created',    executor: 'Customer',            date: order.date, time: order.time },
      { id: 'e2', badgeLabel: 'Payment', badgeColor: 'lilac', title: 'Refund initiated', executor: 'Oleksandr Kovalenko', date: order.date, time: order.time },
      { id: 'e3', badgeLabel: 'Status',  badgeColor: 'green', title: 'Order cancelled',  executor: 'Customer',            date: order.date, time: order.time },
    ],
  });

  const handleDrawerSave = (updated: DrawerOrder) => {
    setOrders(prev => prev.map(o =>
      o.id === updated.id
        ? { ...o, status: updated.status, paymentStatus: updated.paymentStatus,
            paymentMethod: updated.paymentMethod, client: updated.client,
            phone: updated.phone, deliveryCarrier: updated.deliveryCarrier,
            deliveryAddress: updated.deliveryAddress }
        : o
    ));
    setDrawerOrder(updated);
  };

  useEffect(() => {
    if (!markAsOpen) return;
    const handler = (e: MouseEvent) => {
      if (markAsRef.current && !markAsRef.current.contains(e.target as Node)) {
        setMarkAsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [markAsOpen]);

  const handleMarkAs = (value: string) => {
    const newStatus = MARK_AS_TO_STATUS[value];
    if (!newStatus) return;
    const payment = STATUS_PAYMENT_MAP[newStatus];
    setOrders(prev => prev.map(o =>
      selectedRows.has(o.rowId) ? { ...o, status: newStatus, ...payment } : o
    ));
    setMarkAs(value);
    setMarkAsOpen(false);
    setSelectedRows(new Set());
  };

  const handlePrint = () => window.print();

  /* ── Sort resolution: dropdown wins over column sort ── */
  let sortField: SortField | null = colSort?.field ?? null;
  let sortDir: SortDir            = colSort?.dir   ?? 'asc';
  if (sortValue === 'date_desc') { sortField = 'date';   sortDir = 'desc'; }
  if (sortValue === 'date_asc')  { sortField = 'date';   sortDir = 'asc';  }
  if (sortValue === 'amount')    { sortField = 'amount'; sortDir = 'desc'; }

  const handleDropdownSort = (v: string) => {
    setSortValue(v);
    setColSort(null);
    setCurrentPage(1);
  };

  const handleColSort = (field: SortField) => {
    setColSort(prev =>
      prev?.field === field
        ? { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { field, dir: 'asc' }
    );
    setSortValue('');
    setCurrentPage(1);
  };

  const colSortDir = (field: SortField): 'asc' | 'desc' | null =>
    colSort?.field === field ? colSort.dir : sortValue === 'date_desc' && field === 'date' ? 'desc'
    : sortValue === 'date_asc' && field === 'date' ? 'asc'
    : sortValue === 'amount' && field === 'amount' ? 'desc'
    : null;

  const filterStatus   = TAB_FILTER[activeTab];
  const filteredOrders = filterStatus ? orders.filter(o => o.status === filterStatus) : orders;
  const sortedOrders   = applySort(filteredOrders, sortField, sortDir);
  const pageSizeNum    = parseInt(pageSize, 10);
  const totalPages     = Math.max(1, Math.ceil(sortedOrders.length / pageSizeNum));
  const showPagination = sortedOrders.length > pageSizeNum;
  const visibleOrders  = sortedOrders.slice((currentPage - 1) * pageSizeNum, currentPage * pageSizeNum);
  const allSelected    = visibleOrders.length > 0 && visibleOrders.every(o => selectedRows.has(o.rowId));
  const someSelected   = visibleOrders.some(o => selectedRows.has(o.rowId));
  const selectedCount  = visibleOrders.filter(o => selectedRows.has(o.rowId)).length;

  const toggleAll = (checked: boolean) => {
    setSelectedRows(checked ? new Set(visibleOrders.map(o => o.rowId)) : new Set());
  };

  const toggleRow = (rowId: string, checked: boolean) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (checked) next.add(rowId); else next.delete(rowId);
      return next;
    });
  };

  return (
    <>
    <div className={styles.layout}>

      {/* ══ SIDEBAR ════════════════════════════════════════════════════════════ */}
      {!sidebarFolded && (
        <div className={styles.sidebarBackdrop} onClick={() => setSidebarFolded(true)} />
      )}
      <Sidebar
        folded={sidebarFolded}
        onToggleFold={() => setSidebarFolded(f => !f)}
        logo={<BookStoreLogo />}
        appName="BookStore"
        navItems={makeNavItems(onNavigate)}
        bottomItems={BOTTOM_ITEMS}
        user={USER}
        onLogout={() => onNavigate?.('login')}
        className={styles.sidebar}
      />

      {/* ══ MAIN ═══════════════════════════════════════════════════════════════ */}
      <div className={styles.main}>

        {/* ── HEADER ─────────────────────────────────────────────────────────── */}
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Orders</h1>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by ID, name or phone number"
            className={styles.headerSearch}
          />
          <div className={styles.headerActions}>
            <Button
              variant="secondary"
              size="l"
              iconOnly
              leftIcon={<Icon name="download" size={24} />}
              aria-label="Download"
            />
            <Button variant="primary" size="l" leftIcon={<Icon name="add" size={20} />}>
              Create an order
            </Button>
          </div>
        </header>

        {/* ── BODY ───────────────────────────────────────────────────────────── */}
        <div className={styles.body}>

          {/* ── STAT CARDS ───────────────────────────────────────────────────── */}
          <div className={styles.statsRow}>
            {STAT_CARDS.map((card, idx) => (
              <div key={idx} className={styles.statCard}>
                <span className={styles.statLabel}>{card.label}</span>
                <div className={styles.statBottom}>
                  <span className={styles.statValue}>{card.value}</span>
                  <div className={styles.statChangeWrap}>
                    <div className={styles.statDivider} />
                    <div className={styles.statChange}>
                      <div className={styles.statChangePct}>
                        <span className={card.positive ? styles.statPctPositive : styles.statPctNegative}>
                          {card.change}
                        </span>
                        <Icon
                          name={card.positive ? 'arrow-up-chevron' : 'arrow-down-chevron'}
                          size={16}
                          color={card.positive ? 'var(--text-success)' : 'var(--text-error)'}
                        />
                      </div>
                      <span className={styles.statSubtext}>to last month</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── FILTER BAR ───────────────────────────────────────────────────── */}
          <div className={styles.filterBar}>
            <SegmentedControl
              value={activeTab}
              onChange={v => { setActiveTab(v); setCurrentPage(1); }}
              label="Status filter"
              options={[
                { value: 'all',       label: 'All' },
                { value: 'new',       label: 'New' },
                { value: 'processing',label: 'Processing' },
                { value: 'done',      label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
            <Dropdown
              value={sortValue}
              onChange={handleDropdownSort}
              options={SORT_OPTIONS}
              placeholder="Default"
              size="m"
              className={styles.sortDropdown}
            />
          </div>

          {/* ── TABLE ────────────────────────────────────────────────────────── */}
          <div className={styles.tableWrap}>

            {/* Header row */}
            <div className={styles.tableHeader}>
              <TableCellTitleCheckbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={toggleAll}
              />
              <TableCellTitle labelText="ID"          onSort={() => handleColSort('id')}     sortDir={colSortDir('id')} />
              <TableCellTitle labelText="Client"      onSort={() => handleColSort('client')}  sortDir={colSortDir('client')} />
              <TableCellTitle labelText="Status"      showSort={false} />
              <TableCellTitle labelText="Amount"        onSort={() => handleColSort('amount')}  sortDir={colSortDir('amount')} />
              <TableCellTitle labelText="Payment method" onSort={() => handleColSort('method')} sortDir={colSortDir('method')} />
              <TableCellTitle labelText="Delivery"      showSort={false} />
              <TableCellTitle labelText="Date & time"   onSort={() => handleColSort('date')}    sortDir={colSortDir('date')} />
              <TableCellTitle showLabel={false} showSort={false} />
            </div>

            {/* Data rows */}
            {visibleOrders.map(order => (
              <div
                key={order.rowId}
                className={cx(
                  styles.tableRow,
                  selectedRows.has(order.rowId) && styles.tableRowSelected,
                )}
              >
                <TableCellCheckbox
                  checked={selectedRows.has(order.rowId)}
                  onChange={checked => toggleRow(order.rowId, checked)}
                />
                <TableCellText titleText={order.id} />
                <TableCellText
                  titleText={order.client}
                  subtitle
                  subtitleText={order.phone}
                />
                <TableCellBadge
                  badges={[order.status]}
                  getBadgeColor={label => STATUS_BADGE_COLOR[label as OrderStatus] ?? 'gray'}
                />
                <TableCellText
                  titleText={order.amount}
                  status
                  statusText={order.paymentStatus}
                  statusType={order.paymentStatusType}
                />
                <TableCellText titleText={order.paymentMethod} />
                <TableCellText
                  titleText={order.deliveryCarrier}
                  subtitle
                  subtitleText={order.deliveryAddress}
                  titleWrap
                />
                <TableCellText
                  titleText={order.date}
                  subtitle
                  subtitleText={order.time}
                />
                <div className={styles.actionsCell}>
                  <button
                    className={styles.moreBtn}
                    aria-label="More actions"
                    type="button"
                    onClick={() => openDrawer(order)}
                  >
                    <ThreeDotsIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── PAGINATION ───────────────────────────────────────────────────── */}
          <div className={styles.paginationBar}>
            <div className={styles.paginationLeft}>
              <Dropdown
                value={pageSize}
                onChange={v => { setPageSize(v); setCurrentPage(1); }}
                options={PAGE_SIZE_OPTIONS}
                placeholder="15"
                size="s"
                className={styles.pageSizeDropdown}
              />
              <span className={styles.totalText}>of {orders.length} orders</span>
            </div>

            {showPagination && (
              <div className={styles.paginationRight}>
                <PageBtn disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                  <Icon name="arrow-left-double" size={16} />
                </PageBtn>
                <PageBtn disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                  <Icon name="arrow-left" size={16} />
                </PageBtn>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <PageBtn key={p} active={currentPage === p} onClick={() => setCurrentPage(p)}>{p}</PageBtn>
                ))}
                <PageBtn disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                  <Icon name="arrow-right" size={16} />
                </PageBtn>
                <PageBtn disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                  <Icon name="arrow-right-double" size={16} />
                </PageBtn>
              </div>
            )}
          </div>

        </div>

        {/* ══ BULK ACTION BAR ════════════════════════════════════════════════════ */}
        {selectedCount > 0 && (
          <div className={styles.bulkBar}>
            {/* Left: close + count */}
            <div className={styles.bulkLeft}>
              <button
                className={styles.bulkCloseBtn}
                onClick={() => setSelectedRows(new Set())}
                type="button"
                aria-label="Clear selection"
              >
                <Icon name="close-small" size={24} />
              </button>
              <span className={styles.bulkCount}>
                <span className={styles.bulkCountNum}>{selectedCount}</span>
                /{visibleOrders.length} selected
              </span>
            </div>

            {/* Right: print + divider + mark-as */}
            <div className={styles.bulkRight}>
              <div className={styles.bulkPrintGroup}>
                <Button
                  variant="ghost"
                  size="m"
                  leftIcon={<Icon name="printer" size={20} />}
                  type="button"
                  onClick={handlePrint}
                >
                  Print waybill
                </Button>
              </div>

              <div className={styles.bulkDivider} />

              <div className={styles.markAsWrap} ref={markAsRef}>
                {markAsOpen && (
                  <div className={styles.markAsPanel}>
                    {MARK_AS_OPTIONS.map((opt, i) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={cx(
                          styles.markAsItem,
                          i === MARK_AS_OPTIONS.length - 2 && styles.markAsItemDivided,
                        )}
                        onClick={() => handleMarkAs(opt.value)}
                      >
                        <span className={cx(
                          styles.markAsItemText,
                          opt.value === 'cancelled' && styles.markAsItemTextError,
                        )}>
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                <Button
                  variant="primary"
                  size="m"
                  type="button"
                  onClick={() => setMarkAsOpen(v => !v)}
                >
                  Mark as
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>

    <OrderDrawer
      order={drawerOrder}
      onClose={() => setDrawerOrder(null)}
      onSave={handleDrawerSave}
    />
    </>
  );
}
