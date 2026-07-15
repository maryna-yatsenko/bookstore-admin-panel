import { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@components/atoms/Sidebar';
import { BookStoreLogo } from '@components/atoms/Sidebar/BookStoreLogo';
import { Button } from '@components/atoms/Button';
import { SearchInput } from '@components/atoms/SearchInput';
import { Icon } from '@components/atoms/Icon';
import { SegmentedControl } from '@components/atoms/SegmentedControl';
import { Dropdown } from '@components/atoms/Dropdown';
import { Input } from '@components/atoms/Input';
import { TableCellTitleCheckbox } from '@components/atoms/TableCell/TableCellTitleCheckbox';
import { TableCellTitle } from '@components/atoms/TableCell/TableCellTitle';
import { TableCellCheckbox } from '@components/atoms/TableCell/TableCellCheckbox';
import { TableCellText } from '@components/atoms/TableCell/TableCellText';
import { TableCellBadge } from '@components/atoms/TableCell/TableCellBadge';
import type { SidebarNavItem, SidebarUser } from '@components/atoms/Sidebar/Sidebar.types';
import type { BadgeColor } from '@components/atoms/Badge/Badge.types';
import styles from './Products.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

/* ── Navigation ─────────────────────────────────────────────────────────────── */
function makeNavItems(onNavigate?: (page: string) => void): SidebarNavItem[] {
  return [
    { id: 'dashboard', icon: 'dashboard',    label: 'Dashboard',  onClick: () => onNavigate?.('dashboard') },
    { id: 'orders',    icon: 'shopping-bag', label: 'Orders', badge: 12, onClick: () => onNavigate?.('orders') },
    { id: 'users',     icon: 'user',         label: 'Users',      onClick: () => onNavigate?.('users') },
    { id: 'products',  icon: 'barcode',      label: 'Products', selected: true, onClick: () => onNavigate?.('products') },
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
type ProductStatus = 'active' | 'draft';
type Availability  = 'In stock' | 'Low stock' | 'Out of stock';

interface Product {
  rowId:        string;
  title:        string;
  author:       string;
  isbn:         string;
  stock:        number;
  availability: Availability;
  price:        string;
  category:     string;
  status:       ProductStatus;
}

/* ── Data ────────────────────────────────────────────────────────────────────── */
const INITIAL_PRODUCTS: Product[] = [
  { rowId:'1',  title:'Clean Code',                          author:'Robert C. Martin',          isbn:'978-0-13-235088-4', stock:5,  availability:'In stock',    price:'450 ₴',  category:'Programming',       status:'active' },
  { rowId:'2',  title:"Harry Potter and the Philosopher's Stone", author:'J.K. Rowling',          isbn:'978-966-97823-0-5', stock:12, availability:'In stock',    price:'280 ₴',  category:'Sci-Fi',            status:'active' },
  { rowId:'3',  title:'Atomic Habits',                        author:'James Clear',               isbn:'978-0-7352-1129-2', stock:0,  availability:'Out of stock', price:'350 ₴',  category:'Self-help',         status:'draft'  },
  { rowId:'4',  title:'The Master and Margarita',              author:'Mikhail Bulgakov',          isbn:'978-966-14-1234-5', stock:2,  availability:'Low stock',   price:'320 ₴',  category:'Classics',          status:'active' },
  { rowId:'5',  title:'Sapiens',                              author:'Yuval Noah Harari',         isbn:'978-0-06-231609-7', stock:8,  availability:'In stock',    price:'420 ₴',  category:'Non-fiction',       status:'active' },
  { rowId:'6',  title:'1984',                                 author:'George Orwell',             isbn:'978-966-14-9876-3', stock:3,  availability:'Low stock',   price:'210 ₴',  category:'Classics',          status:'active' },
  { rowId:'7',  title:'Dune',                                 author:'Frank Herbert',             isbn:'978-0-44-100590-0', stock:0,  availability:'Out of stock', price:'390 ₴',  category:'Sci-Fi',            status:'draft'  },
  { rowId:'8',  title:'Kobzar',                                author:'Taras Shevchenko',          isbn:'978-966-14-5432-1', stock:15, availability:'In stock',    price:'180 ₴',  category:'Poetry',            status:'active' },
  { rowId:'9',  title:'The Little Prince',                     author:'Antoine de Saint-Exupéry',  isbn:'978-966-0-03333-0', stock:6,  availability:'In stock',    price:'190 ₴',  category:'Classics',          status:'active' },
  { rowId:'10', title:'Thinking, Fast and Slow',                author:'Daniel Kahneman',          isbn:'978-966-14-2200-2', stock:4,  availability:'Low stock',   price:'410 ₴',  category:'Self-help',         status:'active' },
  { rowId:'11', title:'The City',                               author:'Valerian Pidmohylny',       isbn:'978-966-03-0754-3', stock:1,  availability:'Low stock',   price:'260 ₴',  category:'Ukrainian lit.',    status:'active' },
  { rowId:'12', title:'Shadows of Forgotten Ancestors',         author:'Mykhailo Kotsiubynsky',     isbn:'978-966-03-1234-2', stock:7,  availability:'In stock',    price:'150 ₴',  category:'Ukrainian lit.',    status:'active' },
  { rowId:'13', title:'Vorpal Blade',                          author:'John Ringo',                isbn:'978-1-41-651698-8', stock:0,  availability:'Out of stock', price:'380 ₴',  category:'Sci-Fi',            status:'draft'  },
  { rowId:'14', title:'The Pragmatic Programmer',              author:'Andrew Hunt',               isbn:'978-0-13-595705-9', stock:9,  availability:'In stock',    price:'490 ₴',  category:'Programming',       status:'active' },
  { rowId:'15', title:'Designing Data-Intensive Apps',         author:'Martin Kleppmann',          isbn:'978-1-49-193388-0', stock:4,  availability:'Low stock',   price:'520 ₴',  category:'Programming',       status:'active' },
  { rowId:'16', title:'Pride and Prejudice',                    author:'Jane Austen',               isbn:'978-966-14-6789-4', stock:11, availability:'In stock',    price:'220 ₴',  category:'Classics',          status:'active' },
  { rowId:'17', title:'The Solar Machine',                      author:'Volodymyr Vynnychenko',     isbn:'978-966-03-0987-5', stock:2,  availability:'Low stock',   price:'270 ₴',  category:'Ukrainian lit.',    status:'active' },
  { rowId:'18', title:'Homo Deus',                             author:'Yuval Noah Harari',         isbn:'978-0-06-246431-6', stock:6,  availability:'In stock',    price:'400 ₴',  category:'Non-fiction',       status:'active' },
  { rowId:'19', title:'Lolita',                                author:'Vladimir Nabokov',          isbn:'978-0-67-972523-3', stock:0,  availability:'Out of stock', price:'290 ₴',  category:'Classics',          status:'draft'  },
  { rowId:'20', title:'Brave New World',                       author:'Aldous Huxley',             isbn:'978-0-06-085052-4', stock:5,  availability:'In stock',    price:'230 ₴',  category:'Classics',          status:'active' },
  { rowId:'21', title:'JavaScript: The Good Parts',           author:'Douglas Crockford',         isbn:'978-0-59-651774-8', stock:3,  availability:'Low stock',   price:'340 ₴',  category:'Programming',       status:'active' },
  { rowId:'22', title:'The Garden of Gethsemane',               author:'Ivan Bahrianyi',            isbn:'978-966-03-2134-4', stock:8,  availability:'In stock',    price:'240 ₴',  category:'Ukrainian lit.',    status:'active' },
  { rowId:'23', title:'The Enchanted Desna',                    author:'Oleksandr Dovzhenko',       isbn:'978-966-14-3456-7', stock:4,  availability:'Low stock',   price:'160 ₴',  category:'Ukrainian lit.',    status:'active' },
  { rowId:'24', title:'Zero to One',                           author:'Peter Thiel',               isbn:'978-0-80-414794-0', stock:7,  availability:'In stock',    price:'360 ₴',  category:'Business',          status:'active' },
  { rowId:'25', title:'The Lean Startup',                      author:'Eric Ries',                 isbn:'978-0-30-788791-7', stock:0,  availability:'Out of stock', price:'330 ₴',  category:'Business',          status:'draft'  },
  { rowId:'26', title:'Deep Work',                             author:'Cal Newport',               isbn:'978-1-45-553016-1', stock:10, availability:'In stock',    price:'310 ₴',  category:'Self-help',         status:'active' },
  { rowId:'27', title:'Crossroads',                             author:'Larysa Denysenko',          isbn:'978-966-14-4567-8', stock:1,  availability:'Low stock',   price:'200 ₴',  category:'Ukrainian lit.',    status:'active' },
  { rowId:'28', title:'The Forest Song',                        author:'Lesya Ukrainka',            isbn:'978-966-03-3456-7', stock:6,  availability:'In stock',    price:'140 ₴',  category:'Poetry',            status:'active' },
  { rowId:'29', title:'Refactoring',                           author:'Martin Fowler',             isbn:'978-0-13-468599-1', stock:2,  availability:'Low stock',   price:'480 ₴',  category:'Programming',       status:'active' },
  { rowId:'30', title:"A Billionaire's Thoughts",               author:'Serhiy Tihipko',            isbn:'978-966-14-8765-2', stock:0,  availability:'Out of stock', price:'290 ₴',  category:'Business',          status:'draft'  },
  { rowId:'31', title:'Enchiridion',                           author:'Epictetus',                 isbn:'978-0-40-691148-0', stock:9,  availability:'In stock',    price:'170 ₴',  category:'Philosophy',        status:'active' },
  { rowId:'32', title:'The Art of War',                        author:'Sun Tzu',                   isbn:'978-1-59-030760-5', stock:14, availability:'In stock',    price:'130 ₴',  category:'Philosophy',        status:'active' },
  { rowId:'33', title:'Intermezzo',                            author:'Mykhailo Kotsiubynsky',     isbn:'978-966-03-0541-9', stock:3,  availability:'Low stock',   price:'155 ₴',  category:'Ukrainian lit.',    status:'active' },
  { rowId:'34', title:'Clean Architecture',                    author:'Robert C. Martin',          isbn:'978-0-13-449416-6', stock:6,  availability:'In stock',    price:'470 ₴',  category:'Programming',       status:'active' },
  { rowId:'35', title:'Voroshilovgrad',                         author:'Serhiy Zhadan',             isbn:'978-966-14-7890-3', stock:5,  availability:'In stock',    price:'285 ₴',  category:'Ukrainian lit.',    status:'active' },
];

/* ── Config ──────────────────────────────────────────────────────────────────── */
const PAGE_SIZE_OPTIONS = [
  { value: '15', label: '15' },
  { value: '25', label: '25' },
  { value: '40', label: '40' },
];

const AVAIL_BADGE_COLOR: Record<Availability, BadgeColor> = {
  'In stock':    'green',
  'Low stock':   'orange',
  'Out of stock':'red',
};

const TAB_FILTER: Record<string, ((p: Product) => boolean) | undefined> = {
  all:    undefined,
  active: p => p.status === 'active',
  draft:  p => p.status === 'draft',
};

const CATEGORIES = [...new Set(INITIAL_PRODUCTS.map(p => p.category))].sort();

const CATEGORY_OPTIONS = [
  { value: '', label: 'All categories' },
  ...CATEGORIES.map(c => ({ value: c, label: c })),
];

const PUB_STATUS_OPTIONS = [
  { value: '',       label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'draft',  label: 'Draft' },
];

const AVAIL_OPTIONS = [
  { value: '',             label: 'All statuses' },
  { value: 'In stock',     label: 'In stock' },
  { value: 'Low stock',    label: 'Low stock' },
  { value: 'Out of stock', label: 'Out of stock' },
];

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
const parsePrice = (s: string) => parseInt(s.replace(/[^\d]/g, ''), 10) || 0;

const applyPanelFilter = (
  list: Product[],
  cat: string, pub: string, avail: string, from: string, to: string,
) => list
  .filter(p => !cat   || p.category     === cat)
  .filter(p => !pub   || p.status       === pub)
  .filter(p => !avail || p.availability === avail)
  .filter(p => {
    const price  = parsePrice(p.price);
    const fromN  = parsePrice(from);
    const toN    = parsePrice(to);
    if (fromN && price < fromN) return false;
    if (toN   && price > toN)   return false;
    return true;
  });

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

/* ══ Products page ═══════════════════════════════════════════════════════════ */
export function Products({ onNavigate }: { onNavigate?: (page: string) => void } = {}) {
  const [sidebarFolded, setSidebarFolded] = useState(() => window.innerWidth < 768);
  const [products, setProducts]           = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch]               = useState('');
  const [activeTab, setActiveTab]         = useState('all');
  const [selectedRows, setSelectedRows]   = useState<Set<string>>(new Set());
  const [pageSize, setPageSize]           = useState('15');
  const [currentPage, setCurrentPage]     = useState(1);

  /* ── Filter panel state ───────────────────────────────────────────────────── */
  const [filterOpen, setFilterOpen]           = useState(false);
  const [pendingCat, setPendingCat]           = useState('');
  const [pendingPub, setPendingPub]           = useState('');
  const [pendingAvail, setPendingAvail]       = useState('');
  const [pendingFrom, setPendingFrom]         = useState('0');
  const [pendingTo, setPendingTo]             = useState('10000');
  const [appliedCat, setAppliedCat]           = useState('');
  const [appliedPub, setAppliedPub]           = useState('');
  const [appliedAvail, setAppliedAvail]       = useState('');
  const [appliedFrom, setAppliedFrom]         = useState('0');
  const [appliedTo, setAppliedTo]             = useState('10000');

  const filterPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const handler = (e: MouseEvent) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [filterOpen]);

  /* ── Filtering ────────────────────────────────────────────────────────────── */
  const tabFn = TAB_FILTER[activeTab];
  const baseFiltered = (tabFn ? products.filter(tabFn) : products).filter(p =>
    !search ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.author.toLowerCase().includes(search.toLowerCase()) ||
    p.isbn.toLowerCase().includes(search.toLowerCase())
  );
  const filtered     = applyPanelFilter(baseFiltered, appliedCat, appliedPub, appliedAvail, appliedFrom, appliedTo);
  const pendingCount = applyPanelFilter(baseFiltered, pendingCat, pendingPub, pendingAvail, pendingFrom, pendingTo).length;

  /* ── Pagination ───────────────────────────────────────────────────────────── */
  const pageSizeNum  = parseInt(pageSize, 10);
  const totalPages   = Math.max(1, Math.ceil(filtered.length / pageSizeNum));
  const visibleRows  = filtered.slice((currentPage - 1) * pageSizeNum, currentPage * pageSizeNum);

  /* ── Selection ────────────────────────────────────────────────────────────── */
  const selectedCount = selectedRows.size;
  const allSelected   = visibleRows.length > 0 && visibleRows.every(p => selectedRows.has(p.rowId));
  const someSelected  = visibleRows.some(p => selectedRows.has(p.rowId));

  const toggleAll = (checked: boolean) =>
    setSelectedRows(checked ? new Set(visibleRows.map(p => p.rowId)) : new Set());
  const toggleRow = (id: string, checked: boolean) =>
    setSelectedRows(prev => { const s = new Set(prev); checked ? s.add(id) : s.delete(id); return s; });

  /* ── Bulk actions ─────────────────────────────────────────────────────────── */
  const handleDelete = () => {
    setProducts(prev => prev.filter(p => !selectedRows.has(p.rowId)));
    setSelectedRows(new Set());
  };
  const handleDuplicate = () => {
    const duped = products
      .filter(p => selectedRows.has(p.rowId))
      .map(p => ({ ...p, rowId: `${p.rowId}-copy-${Date.now()}`, title: `${p.title} (copy)`, status: 'draft' as ProductStatus }));
    setProducts(prev => [...prev, ...duped]);
    setSelectedRows(new Set());
  };
  const handleDraft = () => {
    setProducts(prev => prev.map(p => selectedRows.has(p.rowId) ? { ...p, status: 'draft' } : p));
    setSelectedRows(new Set());
  };
  const handleActivate = () => {
    setProducts(prev => prev.map(p => selectedRows.has(p.rowId) ? { ...p, status: 'active' } : p));
    setSelectedRows(new Set());
  };

  /* ── Filter panel actions ─────────────────────────────────────────────────── */
  const handleApply = () => {
    setAppliedCat(pendingCat);
    setAppliedPub(pendingPub);
    setAppliedAvail(pendingAvail);
    setAppliedFrom(pendingFrom);
    setAppliedTo(pendingTo);
    setCurrentPage(1);
    setFilterOpen(false);
  };
  const handleReset = () => {
    setPendingCat(''); setPendingPub(''); setPendingAvail('');
    setPendingFrom('0'); setPendingTo('10000');
    setAppliedCat(''); setAppliedPub(''); setAppliedAvail('');
    setAppliedFrom('0'); setAppliedTo('10000');
    setCurrentPage(1);
  };

  /* ── Pagination pages ─────────────────────────────────────────────────────── */
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

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
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

      {/* ── MAIN ─────────────────────────────────────────────────────────────── */}
      <div className={styles.main}>

        {/* ── HEADER ──────────────────────────────────────────────────────────── */}
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Products</h1>
          <SearchInput
            value={search}
            onChange={v => { setSearch(v); setCurrentPage(1); }}
            placeholder="Search by title, author, ISBN, barcode"
            className={styles.headerSearch}
          />
          <div className={styles.headerActions}>
            <Button
              variant="secondary"
              size="l"
              iconOnly
              leftIcon={<Icon name="upload" size={20} />}
              type="button"
              aria-label="Import/Export"
            />
            <Button variant="primary" size="l" leftIcon={<Icon name="add" size={20} />} type="button">
              Add product
            </Button>
          </div>
        </header>

        {/* ── BODY ─────────────────────────────────────────────────────────────── */}
        <div className={styles.body}>

          {/* ── FILTER BAR ────────────────────────────────────────────────────── */}
          <div className={styles.filterBar}>
            <SegmentedControl
              value={activeTab}
              onChange={v => { setActiveTab(v); setCurrentPage(1); }}
              label="Status filter"
              options={[
                { value: 'all',    label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'draft',  label: 'Draft' },
              ]}
            />

            {/* Filter button + panel */}
            <div className={styles.filterRight} ref={filterPanelRef}>
              <Button
                variant="transparent"
                size="m"
                iconOnly
                leftIcon={<Icon name="filter" size={20} />}
                type="button"
                aria-label="Filters"
                onClick={() => setFilterOpen(o => !o)}
                style={filterOpen ? { backgroundColor: 'var(--btn-transparent-selected-bg, #ffd05c)' } : undefined}
              />

              {filterOpen && (
                <div className={styles.filterPanel}>
                  {/* Fields */}
                  <div className={styles.filterPanelFields}>
                    <Dropdown
                      size="m"
                      label="Category"
                      placeholder="All categories"
                      value={pendingCat}
                      onChange={setPendingCat}
                      options={CATEGORY_OPTIONS}
                      className={styles.filterPanelField}
                    />
                    <Dropdown
                      size="m"
                      label="Publication status"
                      placeholder="All statuses"
                      value={pendingPub}
                      onChange={setPendingPub}
                      options={PUB_STATUS_OPTIONS}
                      className={styles.filterPanelField}
                    />
                    <Dropdown
                      size="m"
                      label="Availability"
                      placeholder="All statuses"
                      value={pendingAvail}
                      onChange={setPendingAvail}
                      options={AVAIL_OPTIONS}
                      className={styles.filterPanelField}
                    />
                    <div className={styles.priceRow}>
                      <Input
                        label
                        labelText="Price from"
                        value={pendingFrom}
                        onChange={setPendingFrom}
                        type="number"
                        min="0"
                        className={styles.priceInput}
                      />
                      <Input
                        label
                        labelText="Price to"
                        value={pendingTo}
                        onChange={setPendingTo}
                        type="number"
                        min="0"
                        className={styles.priceInput}
                      />
                    </div>
                  </div>

                  {/* Result count */}
                  <div className={styles.filterPanelCount}>
                    {pendingCount} found
                  </div>

                  {/* Actions */}
                  <div className={styles.filterPanelActions}>
                    <div className={styles.filterPanelBtns}>
                      <Button
                        variant="secondary"
                        size="m"
                        type="button"
                        onClick={handleReset}
                        className={styles.filterPanelBtn}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="primary"
                        size="m"
                        type="button"
                        onClick={handleApply}
                        className={styles.filterPanelBtn}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── TABLE ─────────────────────────────────────────────────────────── */}
          <div className={styles.tableWrap}>

            {/* Header row */}
            <div className={styles.tableHeader}>
              <TableCellTitleCheckbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={toggleAll}
              />
              <TableCellTitle labelText="Product"     showSort />
              <TableCellTitle labelText="ISBN/SKU"    showSort />
              <TableCellTitle labelText="Stock"       showSort />
              <TableCellTitle labelText="Availability" showSort />
              <TableCellTitle labelText="Price"       showSort />
              <TableCellTitle labelText="Category"    showSort />
              <TableCellTitle showLabel={false} showSort={false} />
            </div>

            {/* Data rows */}
            {visibleRows.map(product => (
              <div
                key={product.rowId}
                className={cx(styles.tableRow, selectedRows.has(product.rowId) && styles.tableRowSelected)}
              >
                <TableCellCheckbox
                  checked={selectedRows.has(product.rowId)}
                  onChange={checked => toggleRow(product.rowId, checked)}
                />
                <TableCellText
                  image
                  titleText={product.title}
                  subtitle
                  subtitleText={product.author}
                />
                <TableCellText titleText={product.isbn} />
                <TableCellText titleText={`${product.stock} pcs.`} />
                <TableCellBadge
                  badges={[product.availability]}
                  getBadgeColor={() => AVAIL_BADGE_COLOR[product.availability]}
                />
                <TableCellText titleText={product.price} />
                <TableCellText titleText={product.category} />
                <div className={styles.actionsCell}>
                  <button
                    className={styles.moreBtn}
                    type="button"
                    aria-label="More actions"
                    onClick={() => onNavigate?.('product-edit')}
                  >
                    <ThreeDotsIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── PAGINATION ─────────────────────────────────────────────────────── */}
          <div className={styles.paginationBar}>
            <div className={styles.paginationLeft}>
              <div className={styles.pageSizeWrap}>
                <select
                  className={styles.pageSizeSelect}
                  value={pageSize}
                  onChange={e => { setPageSize(e.target.value); setCurrentPage(1); }}
                  aria-label="Rows per page"
                >
                  {PAGE_SIZE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <span className={styles.totalText}>of {filtered.length} products</span>
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

    {/* ══ BULK ACTION BAR ═════════════════════════════════════════════════════ */}
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
            /{visibleRows.length} selected
          </span>
        </div>

        <div className={styles.bulkActions}>
          <button className={cx(styles.bulkBtn, styles.bulkBtnDanger)} type="button" onClick={handleDelete}>
            Delete
          </button>
          <button className={styles.bulkBtn} type="button" onClick={handleDuplicate}>
            Duplicate
          </button>
          <button className={styles.bulkBtn} type="button" onClick={handleDraft}>
            Move to drafts
          </button>
          <button className={cx(styles.bulkBtn, styles.bulkBtnIcon)} type="button">
            <Icon name="edit" size={16} />
            Edit
          </button>
          <div className={styles.bulkDivider} />
          <Button variant="primary" size="m" type="button" onClick={handleActivate}>
            Activate
          </Button>
        </div>
      </div>
    )}
    </>
  );
}
