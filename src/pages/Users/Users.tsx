import { useState } from 'react';
import { Sidebar } from '@components/atoms/Sidebar';
import { BookStoreLogo } from '@components/atoms/Sidebar/BookStoreLogo';
import { Button } from '@components/atoms/Button';
import { SearchInput } from '@components/atoms/SearchInput';
import { Icon } from '@components/atoms/Icon';
import { SegmentedControl } from '@components/atoms/SegmentedControl';
import { Dropdown } from '@components/atoms/Dropdown';
import { Badge } from '@components/atoms/Badge/Badge';
import { TableCellTitleCheckbox } from '@components/atoms/TableCell/TableCellTitleCheckbox';
import { TableCellTitle } from '@components/atoms/TableCell/TableCellTitle';
import { TableCellCheckbox } from '@components/atoms/TableCell/TableCellCheckbox';
import type { SidebarNavItem, SidebarUser } from '@components/atoms/Sidebar/Sidebar.types';
import type { BadgeColor } from '@components/atoms/Badge/Badge.types';
import styles from './Users.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

/* ── Navigation ─────────────────────────────────────────────────────────────── */
function makeNavItems(onNavigate?: (page: string) => void): SidebarNavItem[] {
  return [
    { id: 'dashboard', icon: 'dashboard',    label: 'Dashboard',  onClick: () => onNavigate?.('dashboard') },
    { id: 'orders',    icon: 'shopping-bag', label: 'Orders', badge: 12, onClick: () => onNavigate?.('orders') },
    { id: 'users',     icon: 'user',         label: 'Users',  selected: true, onClick: () => onNavigate?.('users') },
    { id: 'products',  icon: 'barcode',      label: 'Products',   onClick: () => onNavigate?.('products') },
    { id: 'tasks',     icon: 'task-list',    label: 'Work tasks', onClick: () => onNavigate?.('tasks') },
    { id: 'blog',      icon: 'news',         label: 'Blog',       onClick: () => onNavigate?.('blog') },
  ];
}

const BOTTOM_ITEMS: SidebarNavItem[] = [
  { id: 'settings', icon: 'settings', label: 'Settings' },
  { id: 'help',     icon: 'question', label: 'Help' },
];

const SIDEBAR_USER: SidebarUser = {
  initials: 'OM',
  name: 'Oleksandr Melnyk',
  role: 'Warehouse manager',
};

/* ── Types ───────────────────────────────────────────────────────────────────── */
type UserRole   = 'Superadmin' | 'Admin' | 'User';
type UserStatus = 'Active' | 'Blocked';

interface User {
  rowId:      string;
  name:       string;
  email:      string;
  role:       UserRole;
  status:     UserStatus;
  activity:   string;
  registered: string;
}

/* ── Data ────────────────────────────────────────────────────────────────────── */
const INITIAL_USERS: User[] = [
  { rowId:'1',  name:'Oleksandr Kovalenko', email:'artem.admin@bookstore.com',      role:'Superadmin', status:'Active',  activity:'2026-04-10', registered:'2026-04-10' },
  { rowId:'2',  name:'Olha Seienko',        email:'olga.admin@bookstore.com',       role:'Admin',      status:'Active',  activity:'2026-04-12', registered:'2026-04-12' },
  { rowId:'3',  name:'Ihor Lyshko',         email:'igor.admin@bookstore.com',       role:'User',       status:'Blocked', activity:'2026-04-11', registered:'2026-04-11' },
  { rowId:'4',  name:'Oleksandra Sova',     email:'oleksandra.admin@bookstore.com', role:'Admin',      status:'Active',  activity:'2026-04-09', registered:'2026-04-09' },
  { rowId:'5',  name:'Dmytro Lysenko',      email:'dmytro@bookstore.com',          role:'User',       status:'Active',  activity:'2026-04-08', registered:'2026-04-08' },
  { rowId:'6',  name:'Tetiana Moroz',       email:'tetyana@bookstore.com',         role:'Admin',      status:'Active',  activity:'2026-04-07', registered:'2026-04-07' },
  { rowId:'7',  name:'Artem Grytsenko',     email:'artem@bookstore.com',           role:'User',       status:'Blocked', activity:'2026-04-06', registered:'2026-04-06' },
  { rowId:'8',  name:'Nataliia Bondarenko', email:'natalia@bookstore.com',         role:'User',       status:'Active',  activity:'2026-04-05', registered:'2026-04-05' },
  { rowId:'9',  name:'Serhii Savchenko',    email:'serhiy@bookstore.com',          role:'Admin',      status:'Active',  activity:'2026-04-04', registered:'2026-04-04' },
  { rowId:'10', name:'Maria Petrenko',      email:'maria@bookstore.com',           role:'User',       status:'Active',  activity:'2026-04-03', registered:'2026-04-03' },
  { rowId:'11', name:'Vasyl Koval',         email:'vasyl@bookstore.com',           role:'User',       status:'Blocked', activity:'2026-04-02', registered:'2026-04-02' },
  { rowId:'12', name:'Iryna Zakharchenko',  email:'iryna@bookstore.com',           role:'Admin',      status:'Active',  activity:'2026-04-01', registered:'2026-04-01' },
  { rowId:'13', name:'Pavlo Shevchenko',    email:'pavlo@bookstore.com',           role:'User',       status:'Active',  activity:'2026-03-31', registered:'2026-03-31' },
  { rowId:'14', name:'Liudmyla Kravchenko', email:'liudmyla@bookstore.com',        role:'User',       status:'Active',  activity:'2026-03-30', registered:'2026-03-30' },
  { rowId:'15', name:'Mykola Romanenko',    email:'mykola@bookstore.com',          role:'Superadmin', status:'Active',  activity:'2026-03-29', registered:'2026-03-29' },
  { rowId:'16', name:'Kateryna Bilyk',      email:'kateryna@bookstore.com',        role:'User',       status:'Active',  activity:'2026-03-28', registered:'2026-03-28' },
  { rowId:'17', name:'Oleh Pryimak',        email:'oleg@bookstore.com',            role:'Admin',      status:'Active',  activity:'2026-03-27', registered:'2026-03-27' },
  { rowId:'18', name:'Yuliia Vyshnivska',   email:'yuliia@bookstore.com',          role:'User',       status:'Blocked', activity:'2026-03-26', registered:'2026-03-26' },
  { rowId:'19', name:'Roman Honcharenko',   email:'roman@bookstore.com',           role:'User',       status:'Active',  activity:'2026-03-25', registered:'2026-03-25' },
  { rowId:'20', name:'Viktoriia Yaremenko', email:'viktoria@bookstore.com',        role:'Admin',      status:'Active',  activity:'2026-03-24', registered:'2026-03-24' },
  { rowId:'21', name:'Andrii Kolomiiets',   email:'andriy@bookstore.com',          role:'User',       status:'Active',  activity:'2026-03-23', registered:'2026-03-23' },
  { rowId:'22', name:'Larysa Demydenko',    email:'larysa@bookstore.com',          role:'User',       status:'Active',  activity:'2026-03-22', registered:'2026-03-22' },
  { rowId:'23', name:'Bohdan Tkachuk',      email:'bohdan@bookstore.com',          role:'Admin',      status:'Blocked', activity:'2026-03-21', registered:'2026-03-21' },
  { rowId:'24', name:'Olena Fedorenko',     email:'olena@bookstore.com',           role:'User',       status:'Active',  activity:'2026-03-20', registered:'2026-03-20' },
  { rowId:'25', name:'Stepan Melnychuk',    email:'stepan@bookstore.com',          role:'User',       status:'Active',  activity:'2026-03-19', registered:'2026-03-19' },
  { rowId:'26', name:'Tamara Polishchuk',   email:'tamara@bookstore.com',          role:'Admin',      status:'Active',  activity:'2026-03-18', registered:'2026-03-18' },
  { rowId:'27', name:'Denys Zadorozhnii',   email:'denys@bookstore.com',           role:'User',       status:'Active',  activity:'2026-03-17', registered:'2026-03-17' },
  { rowId:'28', name:'Oksana Kyrylenko',    email:'oksana@bookstore.com',          role:'User',       status:'Blocked', activity:'2026-03-16', registered:'2026-03-16' },
  { rowId:'29', name:'Maksym Rudenko',      email:'maksym@bookstore.com',          role:'Superadmin', status:'Active',  activity:'2026-03-15', registered:'2026-03-15' },
  { rowId:'30', name:'Nadiia Khomenko',     email:'nadiia@bookstore.com',          role:'User',       status:'Active',  activity:'2026-03-14', registered:'2026-03-14' },
  { rowId:'31', name:'Hennadii Sirko',      email:'hennadiy@bookstore.com',        role:'User',       status:'Active',  activity:'2026-03-13', registered:'2026-03-13' },
  { rowId:'32', name:'Alla Musiienko',      email:'alla@bookstore.com',            role:'Admin',      status:'Active',  activity:'2026-03-12', registered:'2026-03-12' },
  { rowId:'33', name:'Yaroslav Levchenko',  email:'yaroslav@bookstore.com',        role:'User',       status:'Active',  activity:'2026-03-11', registered:'2026-03-11' },
  { rowId:'34', name:'Svitlana Doroshenko', email:'svitlana@bookstore.com',        role:'User',       status:'Blocked', activity:'2026-03-10', registered:'2026-03-10' },
  { rowId:'35', name:'Ivan Kostenko',       email:'ivan@bookstore.com',            role:'Admin',      status:'Active',  activity:'2026-03-09', registered:'2026-03-09' },
  { rowId:'36', name:'Alina Panchenko',     email:'alina@bookstore.com',           role:'User',       status:'Active',  activity:'2026-03-08', registered:'2026-03-08' },
  { rowId:'37', name:'Mykyta Hladchenko',   email:'mykyta@bookstore.com',          role:'User',       status:'Active',  activity:'2026-03-07', registered:'2026-03-07' },
  { rowId:'38', name:'Zoia Tymchenko',      email:'zoia@bookstore.com',            role:'Admin',      status:'Active',  activity:'2026-03-06', registered:'2026-03-06' },
];

/* ── Config ──────────────────────────────────────────────────────────────────── */
const ROLE_OPTIONS = [
  { value: 'Superadmin', label: 'Superadmin' },
  { value: 'Admin',      label: 'Admin' },
  { value: 'User',       label: 'User' },
];

const SORT_OPTIONS = [
  { value: 'default',  label: 'Default' },
  { value: 'name_asc', label: 'By name (A-Z)' },
  { value: 'name_desc',label: 'By name (Z-A)' },
  { value: 'date_desc',label: 'Newest first' },
  { value: 'date_asc', label: 'Oldest first' },
];

const PAGE_SIZE_OPTIONS = [
  { value: '15', label: '15' },
  { value: '25', label: '25' },
  { value: '40', label: '40' },
];

const STATUS_BADGE_COLOR: Record<UserStatus, BadgeColor> = {
  'Active':  'green',
  'Blocked': 'red',
};

const TAB_FILTER: Record<string, ((u: User) => boolean) | undefined> = {
  all:        undefined,
  superadmin: u => u.role === 'Superadmin',
  admin:      u => u.role === 'Admin',
  user:       u => u.role === 'User',
  blocked:    u => u.status === 'Blocked',
};


/* ── Helpers ─────────────────────────────────────────────────────────────────── */
const ThreeDotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="3"  cy="8" r="1.5" fill="currentColor" />
    <circle cx="8"  cy="8" r="1.5" fill="currentColor" />
    <circle cx="13" cy="8" r="1.5" fill="currentColor" />
  </svg>
);

const PageBtn = ({
  children, active = false, disabled = false, onClick,
}: {
  children: React.ReactNode; active?: boolean; disabled?: boolean; onClick?: () => void;
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

function UserAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className={styles.userAvatar}>
      <span className={styles.userAvatarText}>{initials}</span>
    </div>
  );
}

/* ══ Users page ══════════════════════════════════════════════════════════════ */
export function Users({ onNavigate }: { onNavigate?: (page: string) => void } = {}) {
  const [sidebarFolded, setSidebarFolded] = useState(() => window.innerWidth < 768);
  const [users, setUsers]                 = useState<User[]>(INITIAL_USERS);
  const [search, setSearch]               = useState('');
  const [activeTab, setActiveTab]         = useState('all');
  const [sortValue, setSortValue]         = useState('');
  const [selectedRows, setSelectedRows]   = useState<Set<string>>(new Set());
  const [pageSize, setPageSize]           = useState('15');
  const [currentPage, setCurrentPage]     = useState(1);

  /* ── Filtering ────────────────────────────────────────────────────────────── */
  const filterFn = TAB_FILTER[activeTab];
  const filtered = (filterFn ? users.filter(filterFn) : users).filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Sorting ──────────────────────────────────────────────────────────────── */
  const sorted = [...filtered].sort((a, b) => {
    if (sortValue === 'name_asc')  return a.name.localeCompare(b.name, 'en');
    if (sortValue === 'name_desc') return b.name.localeCompare(a.name, 'en');
    if (sortValue === 'date_desc') return b.registered.localeCompare(a.registered);
    if (sortValue === 'date_asc')  return a.registered.localeCompare(b.registered);
    return 0;
  });

  /* ── Pagination ───────────────────────────────────────────────────────────── */
  const pageSizeNum  = parseInt(pageSize, 10);
  const totalPages   = Math.max(1, Math.ceil(sorted.length / pageSizeNum));
  const visibleUsers = sorted.slice((currentPage - 1) * pageSizeNum, currentPage * pageSizeNum);

  /* ── Selection ────────────────────────────────────────────────────────────── */
  const selectedCount = selectedRows.size;
  const allSelected   = visibleUsers.length > 0 && visibleUsers.every(u => selectedRows.has(u.rowId));
  const someSelected  = visibleUsers.some(u => selectedRows.has(u.rowId));

  const toggleAll  = (checked: boolean) =>
    setSelectedRows(checked ? new Set(visibleUsers.map(u => u.rowId)) : new Set());
  const toggleRow  = (id: string, checked: boolean) =>
    setSelectedRows(prev => { const s = new Set(prev); checked ? s.add(id) : s.delete(id); return s; });

  /* ── Bulk actions ─────────────────────────────────────────────────────────── */
  const handleBlockAll = () => {
    setUsers(prev => prev.map(u => selectedRows.has(u.rowId) ? { ...u, status: 'Blocked' } : u));
    setSelectedRows(new Set());
  };
  const handleUnblockAll = () => {
    setUsers(prev => prev.map(u => selectedRows.has(u.rowId) ? { ...u, status: 'Active' } : u));
    setSelectedRows(new Set());
  };

  /* ── Role change ──────────────────────────────────────────────────────────── */
  const handleRoleChange = (rowId: string, role: string) => {
    setUsers(prev => prev.map(u => u.rowId === rowId ? { ...u, role: role as UserRole } : u));
  };

  /* ── Pagination pages to show ─────────────────────────────────────────────── */
  const showPagination = totalPages > 1;
  const paginationPages = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1, 2, 3];
    if (currentPage > 4) pages.push('...');
    if (currentPage > 3 && currentPage < totalPages - 2) pages.push(currentPage);
    pages.push('...');
    pages.push(totalPages);
    return pages;
  })();

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
        user={SIDEBAR_USER}
        onLogout={() => onNavigate?.('login')}
        className={styles.sidebar}
      />

      {/* ══ MAIN ═══════════════════════════════════════════════════════════════ */}
      <div className={styles.main}>

        {/* ── HEADER ─────────────────────────────────────────────────────────── */}
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Users</h1>
          <SearchInput
            value={search}
            onChange={v => { setSearch(v); setCurrentPage(1); }}
            placeholder="Search by name or email"
            className={styles.headerSearch}
          />
          <div className={styles.headerActions}>
            <Button variant="primary" size="l" leftIcon={<Icon name="add" size={20} />}>
              Add user
            </Button>
          </div>
        </header>

        {/* ── BODY ───────────────────────────────────────────────────────────── */}
        <div className={styles.body}>

          {/* ── FILTER BAR ───────────────────────────────────────────────────── */}
          <div className={styles.filterBar}>
            <SegmentedControl
              value={activeTab}
              onChange={v => { setActiveTab(v); setCurrentPage(1); }}
              label="Role filter"
              options={[
                { value: 'all',        label: 'All' },
                { value: 'superadmin', label: 'Superadmin' },
                { value: 'admin',      label: 'Admin' },
                { value: 'user',       label: 'User' },
                { value: 'blocked',    label: 'Blocked' },
              ]}
            />
            <div className={styles.filterRight}>
              <Dropdown
                value={sortValue}
                onChange={v => { setSortValue(v); setCurrentPage(1); }}
                options={SORT_OPTIONS}
                placeholder="Default"
                size="m"
                className={styles.sortDropdown}
              />
              <Button
                variant="transparent"
                size="m"
                iconOnly
                leftIcon={<Icon name="filter" size={20} />}
                type="button"
                aria-label="Filters"
              />
            </div>
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
              <TableCellTitle labelText="User"       showSort={false} />
              <TableCellTitle labelText="Role"       showSort={false} />
              <TableCellTitle labelText="Status"     showSort={false} />
              <TableCellTitle labelText="Activity"   showSort={false} />
              <TableCellTitle labelText="Registered" showSort={false} />
              <TableCellTitle showLabel={false} showSort={false} />
            </div>

            {/* Data rows */}
            {visibleUsers.map(user => (
              <div
                key={user.rowId}
                className={cx(styles.tableRow, selectedRows.has(user.rowId) && styles.tableRowSelected)}
              >
                {/* Checkbox */}
                <TableCellCheckbox
                  checked={selectedRows.has(user.rowId)}
                  onChange={checked => toggleRow(user.rowId, checked)}
                />

                {/* User: avatar + name + email */}
                <div className={styles.userCell}>
                  <UserAvatar name={user.name} />
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{user.name}</span>
                    <span className={styles.userEmail}>{user.email}</span>
                  </div>
                </div>

                {/* Role: inline dropdown */}
                <div className={styles.roleCell}>
                  <Dropdown
                    value={user.role}
                    onChange={v => handleRoleChange(user.rowId, v)}
                    options={ROLE_OPTIONS}
                    size="s"
                    className={styles.roleDropdown}
                  />
                </div>

                {/* Status: badge */}
                <div className={styles.statusCell}>
                  <Badge
                    color={STATUS_BADGE_COLOR[user.status]}
                    labelText={user.status}
                    type="outlined"
                  />
                </div>

                {/* Activity date */}
                <div className={styles.dateCell}>
                  <span className={styles.dateText}>{user.activity}</span>
                </div>

                {/* Registration date */}
                <div className={styles.dateCell}>
                  <span className={styles.dateText}>{user.registered}</span>
                </div>

                {/* Actions */}
                <div className={styles.actionsCell}>
                  <button className={styles.moreBtn} aria-label="More actions" type="button">
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
              <span className={styles.totalText}>of {sorted.length} users</span>
            </div>

            {showPagination && (
              <div className={styles.paginationRight}>
                <PageBtn disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                  <Icon name="arrow-left-double" size={16} />
                </PageBtn>
                <PageBtn disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                  <Icon name="arrow-left" size={16} />
                </PageBtn>
                {paginationPages.map((p, i) =>
                  p === '...'
                    ? <span key={`dots-${i}`} className={styles.pageDots}>…</span>
                    : <PageBtn key={p} active={currentPage === p} onClick={() => setCurrentPage(p as number)}>{p}</PageBtn>
                )}
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
      </div>
    </div>

    {/* ══ BULK ACTION BAR ════════════════════════════════════════════════════ */}
    {selectedCount > 0 && (
      <div className={styles.bulkBar}>
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
            /{visibleUsers.length} selected
          </span>
        </div>

        <div className={styles.bulkActions}>
          <button className={cx(styles.bulkActionBtn, styles.bulkActionBtnDanger)} type="button" onClick={handleBlockAll}>
            Block all
          </button>
          <button className={cx(styles.bulkActionBtn, styles.bulkActionBtnSuccess)} type="button" onClick={handleUnblockAll}>
            Unblock all
          </button>
          <Button variant="primary" size="m" type="button">
            Change role
          </Button>
        </div>
      </div>
    )}
    </>
  );
}
