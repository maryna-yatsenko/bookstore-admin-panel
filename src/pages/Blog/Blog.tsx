import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import type { ReactNode, KeyboardEvent, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Sidebar } from '@components/atoms/Sidebar';
import { BookStoreLogo } from '@components/atoms/Sidebar/BookStoreLogo';
import { Button } from '@components/atoms/Button';
import { SearchInput } from '@components/atoms/SearchInput';
import { Icon } from '@components/atoms/Icon';
import { SegmentedControl } from '@components/atoms/SegmentedControl';
import { Dropdown } from '@components/atoms/Dropdown';
import { Badge } from '@components/atoms/Badge';
import { Checkbox } from '@components/atoms/Checkbox/Checkbox';
import { Tooltip } from '@components/atoms/Tooltip/Tooltip';
import { Input } from '@components/atoms/Input';
import { TextArea } from '@components/atoms/TextArea';
import { TabGroup, TabItem } from '@components/atoms/Tab';
import { RadioButton } from '@components/atoms/RadioButton';
import { Datepicker } from '@components/atoms/Datepicker';
import { TableCellTitleCheckbox } from '@components/atoms/TableCell/TableCellTitleCheckbox';
import { TableCellTitle } from '@components/atoms/TableCell/TableCellTitle';
import { TableCellCheckbox } from '@components/atoms/TableCell/TableCellCheckbox';
import { TableCellText } from '@components/atoms/TableCell/TableCellText';
import { TableCellBadge } from '@components/atoms/TableCell/TableCellBadge';
import type { SidebarNavItem, SidebarUser } from '@components/atoms/Sidebar/Sidebar.types';
import type { BadgeColor } from '@components/atoms/Badge/Badge.types';
import type { DateRange } from '@components/atoms/Datepicker/Datepicker.types';
import styles from './Blog.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

/* ── Navigation ─────────────────────────────────────────────────────────────── */
function makeNavItems(onNavigate?: (page: string) => void): SidebarNavItem[] {
  return [
    { id: 'dashboard', icon: 'dashboard',    label: 'Dashboard',  onClick: () => onNavigate?.('dashboard') },
    { id: 'orders',    icon: 'shopping-bag', label: 'Orders', badge: 12, onClick: () => onNavigate?.('orders') },
    { id: 'users',     icon: 'user',         label: 'Users',      onClick: () => onNavigate?.('users') },
    { id: 'products',  icon: 'barcode',      label: 'Products',   onClick: () => onNavigate?.('products') },
    { id: 'tasks',     icon: 'task-list',    label: 'Work tasks', onClick: () => onNavigate?.('tasks') },
    { id: 'blog',      icon: 'news',         label: 'Blog', selected: true, onClick: () => onNavigate?.('blog') },
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
type PostStatus = 'published' | 'draft';

interface Author {
  name: string;
  role: string;
}

interface BlogPost {
  id:            string;
  title:         string;
  excerpt:       string;
  category:      string;
  author:        Author;
  tags:          string[];
  status:        PostStatus;
  views:         number;
  publishedDate: string | null;
}

/* ── Data ────────────────────────────────────────────────────────────────────── */
const POST_TEMPLATES = [
  { title: 'Top 10 books for teens this spring 2026',      excerpt: 'We picked the best new releases and classics for spring teen reading' },
  { title: 'How to get your kid reading every day',        excerpt: 'Simple habits that help make reading part of everyday life' },
  { title: "This month's bestsellers, reviewed",            excerpt: "What's selling the most right now and why these books are worth it" },
  { title: 'Five reasons to revisit the classics',          excerpt: 'New translations and reissues worth having on your home shelf' },
  { title: "Book gifts for a kid's birthday",               excerpt: 'Ideas for every age — from board books to teen fantasy' },
  { title: 'What teachers are reading: a school reading list', excerpt: 'Supplementary reading that even reluctant readers enjoy' },
  { title: 'Non-fiction for curious teens',                 excerpt: 'Popular-science books that explain complex ideas simply' },
  { title: 'How to start a book club at home',              excerpt: 'A step-by-step guide and a reading list for your first meetups' },
  { title: 'Upcoming fantasy releases to watch for',        excerpt: 'A look at the series and standalone titles coming out soon' },
  { title: 'Stories by local authors your teens will love', excerpt: 'Contemporary fiction that resonates with younger readers' },
];

const CATEGORIES = ['New releases', 'School reading', 'Parenting tips', 'Reviews', 'Interviews'];

/* Each category gets its own color from the DS badge palette */
const CATEGORY_BADGE_COLOR: Record<string, BadgeColor> = {
  'New releases':   'blue',
  'School reading':  'lilac',
  'Parenting tips':  'orange',
  'Reviews':         'green',
  'Interviews':      'pink',
};

const CATEGORY_DROPDOWN_OPTIONS = CATEGORIES.map(c => ({ value: c, label: c }));

const AUTHORS: Author[] = [
  { name: 'Maria Onishchenko', role: 'Author' },
  { name: 'Oleksii Ilkiv',     role: 'Author' },
  { name: 'Oksana Viktiuk',    role: 'Author' },
];

const AUTHOR_DROPDOWN_OPTIONS = AUTHORS.map(a => ({ value: a.name, name: a.name, position: a.role }));

const TAG_POOL = ['fantasy', 'new in 2026', 'bestseller', "children's books", 'classics', 'non-fiction'];

function mockDate(seed: number): string {
  const m = ((seed * 7) % 12) + 1;
  const d = ((seed * 13) % 28) + 1;
  return `2026-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/* ISO (YYYY-MM-DD) -> MM.DD.YYYY, used on the grid-view card meta row */
function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${m}.${d}.${y}`;
}

const INITIAL_POSTS: BlogPost[] = Array.from({ length: 42 }, (_, i) => {
  const tpl      = POST_TEMPLATES[i % POST_TEMPLATES.length];
  const status: PostStatus = i % 5 === 3 || i % 5 === 4 ? 'draft' : 'published';
  const tagCount = (i % 3) + 1;
  const tags     = Array.from({ length: tagCount }, (_, t) => TAG_POOL[(i + t) % TAG_POOL.length]);
  return {
    id:            `post-${i + 1}`,
    title:         tpl.title,
    excerpt:       tpl.excerpt,
    category:      CATEGORIES[i % CATEGORIES.length],
    author:        AUTHORS[i % AUTHORS.length],
    tags,
    status,
    views:         status === 'draft' ? 0 : ((i * 87) % 1300) + 20,
    publishedDate: status === 'draft' ? null : mockDate(i),
  };
});

/* ── Config ──────────────────────────────────────────────────────────────────── */
const PAGE_SIZE_OPTIONS = [
  { value: '15', label: '15' },
  { value: '25', label: '25' },
  { value: '40', label: '40' },
];

const STATUS_BADGE_COLOR: Record<PostStatus, BadgeColor> = {
  published: 'green',
  draft:     'gray',
};

const STATUS_LABEL: Record<PostStatus, string> = {
  published: 'Published',
  draft:     'Draft',
};

const STATUS_ICON: Record<PostStatus, ReactNode> = {
  published: <Icon name="check" size={12} color="var(--badge-green-text, #1a625d)" />,
  draft:     <Icon name="draft" size={12} color="var(--badge-gray-text, #242425)" />,
};

const TAG_ICON = <Icon name="hashtag" size={12} color="var(--badge-gray-text, #242425)" />;

const TAB_FILTER: Record<string, ((p: BlogPost) => boolean) | undefined> = {
  all:       undefined,
  active:    undefined,
  published: p => p.status === 'published',
  draft:     p => p.status === 'draft',
};

const CATEGORY_OPTIONS = [
  { value: '', label: 'All categories' },
  ...CATEGORIES.map(c => ({ value: c, label: c })),
];

const STATUS_OPTIONS = [
  { value: '',           label: 'All statuses' },
  { value: 'published',  label: 'Published' },
  { value: 'draft',      label: 'Draft' },
];

const applyPanelFilter = (list: BlogPost[], cat: string, status: string) => list
  .filter(p => !cat    || p.category === cat)
  .filter(p => !status || p.status   === status);

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

/* ── Cover / media gallery dropzone — click or drag-and-drop to select a photo ── */
function UploadDropzone({
  previewUrl, iconColor, title, className, inputRef, onFile,
}: {
  previewUrl: string | null;
  iconColor: string;
  title: string;
  className?: string;
  inputRef: RefObject<HTMLInputElement>;
  onFile: (file: File) => void;
}) {
  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      className={cx(styles.postDrawerUpload, className)}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      role="button"
      tabIndex={0}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className={styles.postDrawerUploadInput}
        onClick={e => e.stopPropagation()}
        onChange={e => handleFiles(e.target.files)}
      />
      {previewUrl ? (
        <div className={styles.postDrawerUploadPreview}>
          <img src={previewUrl} alt="" className={styles.postDrawerUploadImg} />
          <span className={styles.postDrawerUploadChange}>Click to change photo</span>
        </div>
      ) : (
        <>
          <div className={styles.postDrawerUploadIconWrap}>
            <Icon name="upload-cloud" size={24} color={iconColor} />
          </div>
          <div className={styles.postDrawerUploadText}>
            <p className={styles.postDrawerUploadTitle}>{title}</p>
            <p className={styles.postDrawerUploadHint}>PNG, JPG up to 10MB. Recommended 1200x1200px</p>
          </div>
        </>
      )}
    </div>
  );
}

/* ══ Blog page ═══════════════════════════════════════════════════════════════ */
export function Blog({ onNavigate }: { onNavigate?: (page: string) => void } = {}) {
  const [sidebarFolded, setSidebarFolded] = useState(() => window.innerWidth < 768);
  const [posts, setPosts]                 = useState<BlogPost[]>(INITIAL_POSTS);
  const [search, setSearch]               = useState('');
  const [activeTab, setActiveTab]         = useState('all');
  const [viewMode, setViewMode]           = useState<'grid' | 'table'>('table');
  const [selectedRows, setSelectedRows]   = useState<Set<string>>(new Set());
  const [pageSize, setPageSize]           = useState('15');
  const [currentPage, setCurrentPage]     = useState(1);

  /* ── New / edit post drawer ───────────────────────────────────────────────── */
  const [isPostDrawerOpen, setIsPostDrawerOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab]         = useState<'content' | 'planning' | 'seo'>('content');
  const [draftCategory, setDraftCategory] = useState('');
  const [draftTags, setDraftTags]         = useState<string[]>([]);
  const [draftTagInput, setDraftTagInput] = useState('');
  const [draftTitle, setDraftTitle]       = useState('');
  const [draftSlug, setDraftSlug]         = useState('');
  const [draftMainText, setDraftMainText] = useState('');
  const [draftShortDesc, setDraftShortDesc] = useState('');
  const [draftPublishMode, setDraftPublishMode] = useState<'immediately' | 'schedule'>('immediately');
  const [draftPublicationDate, setDraftPublicationDate] = useState<DateRange>({});
  const [draftPublicationTime, setDraftPublicationTime] = useState('');
  const [draftAuthor, setDraftAuthor] = useState(AUTHORS[0].name);
  const [draftMetaTitle, setDraftMetaTitle] = useState('');
  const [draftMetaDescription, setDraftMetaDescription] = useState('');
  const [draftCoverPreview, setDraftCoverPreview] = useState<string | null>(null);
  const [draftSeoMediaPreview, setDraftSeoMediaPreview] = useState<string | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const seoFileInputRef = useRef<HTMLInputElement>(null);

  function slugify(title: string): string {
    return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function resetDropzones() {
    setDraftCoverPreview(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
    setDraftSeoMediaPreview(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
  }
  function handleCoverFile(file: File) {
    setDraftCoverPreview(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
  }
  function handleSeoMediaFile(file: File) {
    setDraftSeoMediaPreview(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
  }

  function openNewPostDrawer() {
    setEditingPostId(null);
    setDrawerTab('content');
    setDraftCategory('');
    setDraftTags([]);
    setDraftTagInput('');
    setDraftTitle('');
    setDraftSlug('');
    setDraftMainText('');
    setDraftShortDesc('');
    setDraftPublishMode('immediately');
    setDraftPublicationDate({});
    setDraftPublicationTime('');
    setDraftAuthor(AUTHORS[0].name);
    setDraftMetaTitle('');
    setDraftMetaDescription('');
    resetDropzones();
    setIsPostDrawerOpen(true);
  }
  function openEditPostDrawer(post: BlogPost) {
    setEditingPostId(post.id);
    setDrawerTab('content');
    setDraftCategory(post.category);
    setDraftTags(post.tags);
    setDraftTagInput('');
    setDraftTitle(post.title);
    setDraftSlug(slugify(post.title));
    setDraftMainText('');
    setDraftShortDesc(post.excerpt);
    setDraftPublishMode('immediately');
    setDraftPublicationDate({});
    setDraftPublicationTime('');
    setDraftAuthor(AUTHORS.some(a => a.name === post.author.name) ? post.author.name : AUTHORS[0].name);
    setDraftMetaTitle('');
    setDraftMetaDescription('');
    resetDropzones();
    setIsPostDrawerOpen(true);
  }
  function closeDrawer() {
    setIsPostDrawerOpen(false);
  }

  function handleTagInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const raw = draftTagInput.trim().replace(/^#/, '');
    if (!raw || draftTags.includes(raw)) { setDraftTagInput(''); return; }
    setDraftTags(prev => [...prev, raw]);
    setDraftTagInput('');
  }
  function removeDraftTag(tag: string) {
    setDraftTags(prev => prev.filter(t => t !== tag));
  }

  const completenessFields = [draftCategory, draftTags.length > 0 ? 'x' : '', draftTitle, draftSlug, draftMainText, draftShortDesc, draftAuthor, draftMetaTitle, draftMetaDescription];
  const completenessPct = Math.round((completenessFields.filter(Boolean).length / completenessFields.length) * 100);

  function resolvedPublicationDate(): string {
    if (draftPublishMode === 'schedule' && draftPublicationDate.start) {
      return draftPublicationDate.start.toISOString().slice(0, 10);
    }
    return new Date().toISOString().slice(0, 10);
  }
  function createDraftPost(status: PostStatus): BlogPost {
    const authorEntry = AUTHORS.find(a => a.name === draftAuthor) ?? { name: draftAuthor, role: 'Author' };
    return {
      id:            `post-${Date.now()}`,
      title:         draftTitle.trim(),
      excerpt:       draftShortDesc.trim(),
      category:      draftCategory || CATEGORIES[0],
      author:        authorEntry,
      tags:          draftTags,
      status,
      views:         0,
      publishedDate: status === 'published' ? resolvedPublicationDate() : null,
    };
  }
  function applyDraftToPost(existing: BlogPost, status: PostStatus): BlogPost {
    const authorEntry = AUTHORS.find(a => a.name === draftAuthor) ?? { name: draftAuthor, role: 'Author' };
    return {
      ...existing,
      title:         draftTitle.trim(),
      excerpt:       draftShortDesc.trim(),
      category:      draftCategory || CATEGORIES[0],
      author:        authorEntry,
      tags:          draftTags,
      status,
      publishedDate: status === 'published' ? (existing.publishedDate ?? resolvedPublicationDate()) : existing.publishedDate,
    };
  }
  function saveDrawerPost(status: PostStatus) {
    if (!draftTitle.trim()) return;
    if (editingPostId) {
      setPosts(prev => prev.map(p => p.id === editingPostId ? applyDraftToPost(p, status) : p));
    } else {
      setPosts(prev => [createDraftPost(status), ...prev]);
    }
    closeDrawer();
  }
  function handleSaveAsDraft() {
    saveDrawerPost('draft');
  }
  function handleDrawerContinue() {
    if (drawerTab === 'content') { setDrawerTab('planning'); return; }
    if (drawerTab === 'planning') { setDrawerTab('seo'); return; }
    saveDrawerPost('published');
  }
  function handleDrawerBack() {
    if (drawerTab === 'seo') { setDrawerTab('planning'); return; }
    if (drawerTab === 'planning') { setDrawerTab('content'); return; }
  }

  /* ── Keep the pagination controls visually stable when the page size (or
     page) changes and the resulting content is a different height — anchor
     the scroll position to the distance from the *bottom* of the scroll
     container (where the pagination bar lives) instead of letting the
     browser clamp/shift scrollTop and jump the whole page. ────────────── */
  const mainRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<number | null>(null);

  function captureScrollAnchor() {
    const main = mainRef.current;
    if (main) scrollAnchorRef.current = main.scrollHeight - main.scrollTop;
  }

  /* ── Filter panel state ───────────────────────────────────────────────────── */
  const [filterOpen, setFilterOpen]     = useState(false);
  const [pendingCat, setPendingCat]     = useState('');
  const [pendingStatus, setPendingStatus] = useState('');
  const [appliedCat, setAppliedCat]     = useState('');
  const [appliedStatus, setAppliedStatus] = useState('');

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

  /* ── Column sort ──────────────────────────────────────────────────────────── */
  type SortCol = 'title' | 'category' | 'author' | 'status' | 'views' | 'date';
  const [sortCol, setSortCol] = useState<SortCol | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);

  function handleSort(col: SortCol) {
    captureScrollAnchor();
    if (sortCol !== col) {
      setSortCol(col);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortCol(null);
      setSortDir(null);
    }
    setCurrentPage(1);
  }

  /* ── Sticky columns: only frozen (and only shadowed) once the table is
     actually horizontally scrollable — never on wide screens where every
     column already fits. ────────────────────────────────────────────────── */
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrolledLeft, setScrolledLeft] = useState(false);
  const [scrolledRight, setScrolledRight] = useState(false);

  /* ── Filtering ────────────────────────────────────────────────────────────── */
  const tabFn = TAB_FILTER[activeTab];
  const baseFiltered = (tabFn ? posts.filter(tabFn) : posts).filter(p =>
    !search ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.author.name.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );
  const filtered     = applyPanelFilter(baseFiltered, appliedCat, appliedStatus);
  const pendingCount = applyPanelFilter(baseFiltered, pendingCat, pendingStatus).length;

  const sorted = (() => {
    if (!sortCol || !sortDir) return filtered;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sortCol) {
        case 'title':    return dir * a.title.localeCompare(b.title);
        case 'category': return dir * a.category.localeCompare(b.category);
        case 'author':   return dir * a.author.name.localeCompare(b.author.name);
        case 'status':   return dir * a.status.localeCompare(b.status);
        case 'views':    return dir * (a.views - b.views);
        case 'date':     return dir * (a.publishedDate ?? '').localeCompare(b.publishedDate ?? '');
        default:         return 0;
      }
    });
  })();

  /* ── Pagination ───────────────────────────────────────────────────────────── */
  const pageSizeNum  = parseInt(pageSize, 10);
  const totalPages   = Math.max(1, Math.ceil(sorted.length / pageSizeNum));
  const visibleRows  = sorted.slice((currentPage - 1) * pageSizeNum, currentPage * pageSizeNum);

  useEffect(() => {
    const el = tableWrapRef.current;
    if (!el) return;

    const update = () => {
      const scrollable = el.scrollWidth > el.clientWidth + 1;
      setIsScrollable(scrollable);
      setScrolledLeft(scrollable && el.scrollLeft > 0);
      setScrolledRight(scrollable && el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    };

    update();
    el.addEventListener('scroll', update);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [viewMode, visibleRows.length]);

  useLayoutEffect(() => {
    const main = mainRef.current;
    if (main && scrollAnchorRef.current !== null) {
      main.scrollTop = main.scrollHeight - scrollAnchorRef.current;
      scrollAnchorRef.current = null;
    }
  }, [pageSize, currentPage, viewMode]);

  /* ── Selection ────────────────────────────────────────────────────────────── */
  const selectedCount = selectedRows.size;
  const allSelected   = visibleRows.length > 0 && visibleRows.every(p => selectedRows.has(p.id));
  const someSelected  = visibleRows.some(p => selectedRows.has(p.id));

  const toggleAll = (checked: boolean) =>
    setSelectedRows(checked ? new Set(visibleRows.map(p => p.id)) : new Set());
  const toggleRow = (id: string, checked: boolean) =>
    setSelectedRows(prev => { const s = new Set(prev); checked ? s.add(id) : s.delete(id); return s; });

  /* ── Bulk actions ─────────────────────────────────────────────────────────── */
  const handleDelete = () => {
    setPosts(prev => prev.filter(p => !selectedRows.has(p.id)));
    setSelectedRows(new Set());
  };
  const handleDuplicate = () => {
    const duped = posts
      .filter(p => selectedRows.has(p.id))
      .map(p => ({ ...p, id: `${p.id}-copy-${Date.now()}`, title: `${p.title} (copy)`, status: 'draft' as PostStatus, publishedDate: null }));
    setPosts(prev => [...prev, ...duped]);
    setSelectedRows(new Set());
  };
  const handleMoveToDrafts = () => {
    setPosts(prev => prev.map(p => selectedRows.has(p.id) ? { ...p, status: 'draft', publishedDate: null } : p));
    setSelectedRows(new Set());
  };
  const handlePublish = () => {
    const today = new Date().toISOString().slice(0, 10);
    setPosts(prev => prev.map(p => selectedRows.has(p.id) ? { ...p, status: 'published', publishedDate: p.publishedDate ?? today } : p));
    setSelectedRows(new Set());
  };

  /* ── Filter panel actions ─────────────────────────────────────────────────── */
  const handleApply = () => {
    setAppliedCat(pendingCat);
    setAppliedStatus(pendingStatus);
    setCurrentPage(1);
    setFilterOpen(false);
  };
  const handleReset = () => {
    setPendingCat(''); setPendingStatus('');
    setAppliedCat(''); setAppliedStatus('');
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
      <div className={styles.main} ref={mainRef}>

        {/* ── HEADER ──────────────────────────────────────────────────────────── */}
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Blog</h1>
          <SearchInput
            value={search}
            onChange={v => { setSearch(v); setCurrentPage(1); }}
            placeholder="Search by title, author, tags..."
            className={styles.headerSearch}
          />
          <div className={styles.headerActions}>
            <Button variant="primary" size="l" leftIcon={<Icon name="add" size={20} />} type="button" onClick={openNewPostDrawer}>
              New post
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
                { value: 'all',       label: 'All' },
                { value: 'active',    label: 'Planned' },
                { value: 'published', label: 'Published' },
                { value: 'draft',     label: 'Draft' },
              ]}
            />

            <div className={styles.filterRightGroup}>
              {/* Filter button + panel */}
              <div className={styles.filterRight} ref={filterPanelRef}>
                <button
                  className={cx(styles.iconBtn, filterOpen && styles.iconBtnActive)}
                  aria-label="Filters"
                  type="button"
                  onClick={() => setFilterOpen(o => !o)}
                >
                  <Icon name="filter" size={20} color="var(--icon-secondary, #454548)" />
                </button>

                {filterOpen && (
                  <div className={styles.filterPanel}>
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
                        label="Status"
                        placeholder="All statuses"
                        value={pendingStatus}
                        onChange={setPendingStatus}
                        options={STATUS_OPTIONS}
                        className={styles.filterPanelField}
                      />
                    </div>

                    <div className={styles.filterPanelCount}>
                      {pendingCount} found
                    </div>

                    <div className={styles.filterPanelActions}>
                      <div className={styles.filterPanelBtns}>
                        <Button variant="secondary" size="m" type="button" onClick={handleReset} className={styles.filterPanelBtn}>
                          Reset
                        </Button>
                        <Button variant="primary" size="m" type="button" onClick={handleApply} className={styles.filterPanelBtn}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* View toggle: grid / table */}
              <div className={styles.viewToggle} role="group" aria-label="View mode">
                <button
                  type="button"
                  className={cx(styles.viewBtn, viewMode === 'grid' && styles.viewBtnActive)}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Icon
                    name="grid"
                    size={20}
                    color={viewMode === 'grid' ? 'var(--icon-secondary, #454548)' : 'var(--icon-tertiary, #929297)'}
                  />
                </button>
                <button
                  type="button"
                  className={cx(styles.viewBtn, viewMode === 'table' && styles.viewBtnActive)}
                  onClick={() => setViewMode('table')}
                  aria-label="Table view"
                  aria-pressed={viewMode === 'table'}
                >
                  <Icon
                    name="table"
                    size={20}
                    color={viewMode === 'table' ? 'var(--icon-secondary, #454548)' : 'var(--icon-tertiary, #929297)'}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ── TABLE ─────────────────────────────────────────────────────────── */}
          {viewMode === 'table' && (
          <div className={styles.tableCard}>
            {/* tableArea clips the grid to rounded corners without becoming
                a scroll container, so position:sticky still works. */}
            <div className={styles.tableArea}>
            <div className={styles.tableWrap} ref={tableWrapRef}>
              {/*
                Flat grid: all cells are direct children of .tableGrid so that
                position:sticky works for the frozen checkbox/title (left) and
                actions (right) columns — but only once the table is actually
                horizontally scrollable; on a wide screen where everything
                already fits, cells stay plain static grid cells with no
                shadow, so the rounded card corners render normally. The title
                column is a flexible track (minmax+fr) so the grid's total
                width always matches the container exactly — with no leftover
                unallocated space, which is what previously made the sticky
                actions column detach and leave a gap before it.
              */}
              <div className={styles.tableGrid}>

                {/* ── Header row (9 cells) ───────────────────────────── */}
                <TableCellTitleCheckbox
                  className={cx(isScrollable && styles.stickyL1H)}
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onChange={toggleAll}
                />
                <TableCellTitle
                  className={cx(isScrollable && styles.stickyL2H, scrolledLeft && styles.shadowL)}
                  labelText="Title" showSort
                  sortDir={sortCol === 'title' ? sortDir : null}
                  onSort={() => handleSort('title')}
                />
                <TableCellTitle labelText="Category" showSort
                  sortDir={sortCol === 'category' ? sortDir : null}
                  onSort={() => handleSort('category')}
                />
                <TableCellTitle labelText="Author" showSort
                  sortDir={sortCol === 'author' ? sortDir : null}
                  onSort={() => handleSort('author')}
                />
                <TableCellTitle labelText="Status" showSort
                  sortDir={sortCol === 'status' ? sortDir : null}
                  onSort={() => handleSort('status')}
                />
                <TableCellTitle labelText="Views" showSort
                  sortDir={sortCol === 'views' ? sortDir : null}
                  onSort={() => handleSort('views')}
                />
                <TableCellTitle labelText="Published date" showSort
                  sortDir={sortCol === 'date' ? sortDir : null}
                  onSort={() => handleSort('date')}
                />
                <TableCellTitle labelText="Tags" />
                <TableCellTitle
                  className={cx(isScrollable && styles.stickyRH, scrolledRight && styles.shadowR)}
                  showLabel={false} showSort={false}
                />

                {/* ── Data rows (9 cells × N posts) ─────────────────── */}
                {visibleRows.flatMap((post, idx) => {
                  const isLast     = idx === visibleRows.length - 1;
                  const isSelected = selectedRows.has(post.id);
                  const rowCls     = cx(styles.rowHeight, isSelected && styles.cellSelected, isLast && styles.cellLast);

                  return [
                    <TableCellCheckbox
                      key={`${post.id}-ck`}
                      className={cx(isScrollable && styles.stickyL1, rowCls)}
                      checked={isSelected}
                      onChange={checked => toggleRow(post.id, checked)}
                    />,
                    <TableCellText
                      key={`${post.id}-title`}
                      className={cx(isScrollable && styles.stickyL2, scrolledLeft && styles.shadowL, rowCls)}
                      image
                      titleText={post.title}
                      subtitle
                      subtitleText={post.excerpt}
                      tooltipContent
                    />,
                    <TableCellText
                      key={`${post.id}-cat`}
                      className={rowCls}
                      titleText={post.category}
                    />,
                    <TableCellText
                      key={`${post.id}-author`}
                      className={rowCls}
                      image
                      titleText={post.author.name}
                      subtitle
                      subtitleText={post.author.role}
                    />,
                    <TableCellBadge
                      key={`${post.id}-status`}
                      className={rowCls}
                      badges={[STATUS_LABEL[post.status]]}
                      getBadgeColor={() => STATUS_BADGE_COLOR[post.status]}
                      getBadgeIcon={() => STATUS_ICON[post.status]}
                      badgeType="filled"
                    />,
                    <TableCellText
                      key={`${post.id}-views`}
                      className={rowCls}
                      titleText={String(post.views)}
                    />,
                    <TableCellText
                      key={`${post.id}-date`}
                      className={rowCls}
                      titleText={post.publishedDate ?? 'Not published'}
                    />,
                    <TableCellBadge
                      key={`${post.id}-tags`}
                      className={rowCls}
                      badges={post.tags}
                      getBadgeIcon={() => TAG_ICON}
                      badgeType="filled"
                    />,
                    <div key={`${post.id}-actions`} className={cx(styles.actionsCell, isScrollable && styles.stickyR, scrolledRight && styles.shadowR, rowCls)}>
                      <Button
                        variant="ghost"
                        size="s"
                        iconOnly
                        leftIcon={<Icon name="more" size={16} />}
                        type="button"
                        aria-label="More actions"
                      />
                    </div>,
                  ];
                })}
              </div>
            </div>
            </div>
          </div>
          )}

          {/* ── GRID ──────────────────────────────────────────────────────────── */}
          {viewMode === 'grid' && (
          <div className={styles.postGrid}>
            {visibleRows.map(post => {
              const isSelected = selectedRows.has(post.id);
              return (
                <div
                  key={post.id}
                  className={cx(styles.postCard, isSelected && styles.postCardSelected)}
                  onClick={() => toggleRow(post.id, !isSelected)}
                >
                  <div className={styles.postCardImageWrap}>
                    <div className={styles.postCardImage}>
                      <Badge
                        className={styles.postCardStatusBadge}
                        color={STATUS_BADGE_COLOR[post.status]}
                        type="filled"
                        labelText={STATUS_LABEL[post.status]}
                        leftIcon
                        icon={STATUS_ICON[post.status]}
                      />
                      <Tooltip content="Edit" position="top" portal className={styles.postCardEditWrap}>
                        <button
                          type="button"
                          className={styles.postCardEditBtn}
                          aria-label="Edit post"
                          onClick={e => { e.stopPropagation(); openEditPostDrawer(post); }}
                        >
                          <Icon name="edit" size={20} />
                        </button>
                      </Tooltip>
                    </div>
                    <div className={styles.postCardCheckbox} onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onChange={checked => toggleRow(post.id, checked)}
                      />
                    </div>
                  </div>

                  <div className={styles.postCardBody}>
                    <div className={styles.postCardTopGroup}>
                      <div className={styles.postCardTop}>
                        <Badge color={CATEGORY_BADGE_COLOR[post.category] ?? 'blue'} type="outlined" labelText={post.category} />
                        <span className={styles.postCardViews}>
                          {post.views}
                          <Icon name="eye" size={16} color="var(--text-secondary, #454548)" />
                        </span>
                      </div>

                      <div className={styles.postCardText}>
                        <p className={styles.postCardTitle}>{post.title}</p>
                        <p className={styles.postCardExcerpt}>{post.excerpt}</p>
                      </div>

                      <div className={styles.postCardTags}>
                        {post.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} color="white" type="filled" labelText={tag} leftIcon icon={TAG_ICON} />
                        ))}
                        {post.tags.length > 2 && (
                          <Badge color="white" type="filled" labelText={`+${post.tags.length - 2}`} />
                        )}
                      </div>
                    </div>

                    <div className={styles.postCardAuthor}>
                      <div className={styles.postCardAvatar} aria-hidden="true" />
                      <span className={styles.postCardAuthorMeta}>
                        <span className={styles.postCardAuthorName}>{post.author.name}</span>
                        <span className={styles.postCardDot}>∙</span>
                        <span className={styles.postCardDate}>
                          {post.publishedDate ? formatDisplayDate(post.publishedDate) : 'Not published'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}

          {/* ── PAGINATION ─────────────────────────────────────────────────────── */}
          <div className={styles.paginationBar}>
            <div className={styles.paginationLeft}>
              <Dropdown
                value={pageSize}
                onChange={v => { captureScrollAnchor(); setPageSize(v); setCurrentPage(1); }}
                options={PAGE_SIZE_OPTIONS}
                placeholder={pageSize}
                size="s"
                className={styles.pageSizeDropdown}
              />
              <span className={styles.totalText}>of {filtered.length} posts</span>
            </div>

            {showPagination && (
              <div className={styles.paginationRight}>
                <PageBtn disabled={currentPage === 1} onClick={() => { captureScrollAnchor(); setCurrentPage(1); }}>
                  <Icon name="arrow-left-double" size={16} />
                </PageBtn>
                <PageBtn disabled={currentPage === 1} onClick={() => { captureScrollAnchor(); setCurrentPage(p => Math.max(1, p - 1)); }}>
                  <Icon name="arrow-left" size={16} />
                </PageBtn>
                {paginationPages.map((p, i) =>
                  p === '...'
                    ? <span key={`dots-${i}`} className={styles.pageDots}>…</span>
                    : <PageBtn key={p} active={currentPage === p} onClick={() => { captureScrollAnchor(); setCurrentPage(p as number); }}>{p}</PageBtn>
                )}
                <PageBtn disabled={currentPage === totalPages} onClick={() => { captureScrollAnchor(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}>
                  <Icon name="arrow-right" size={16} />
                </PageBtn>
                <PageBtn disabled={currentPage === totalPages} onClick={() => { captureScrollAnchor(); setCurrentPage(totalPages); }}>
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
          <button className={styles.bulkBtn} type="button" onClick={handleMoveToDrafts}>
            Move to drafts
          </button>
          <button className={cx(styles.bulkBtn, styles.bulkBtnIcon)} type="button">
            <Icon name="edit" size={16} />
            Edit
          </button>
          <div className={styles.bulkDivider} />
          <Button variant="primary" size="m" type="button" onClick={handlePublish}>
            Publish
          </Button>
        </div>
      </div>
    )}

    {/* ══ NEW POST DRAWER ═════════════════════════════════════════════════════ */}
    {isPostDrawerOpen && createPortal(
      <div
        className={styles.postDrawerBackdrop}
        onMouseDown={e => { if (e.target === e.currentTarget) closeDrawer(); }}
      >
        <div className={styles.postDrawerPanel}>
          <div className={styles.postDrawerHeaderBlock}>
            <div className={styles.postDrawerHeader}>
              <div className={styles.postDrawerHeaderMain}>
                <div className={styles.postDrawerAvatar} aria-hidden="true" />
                <div className={styles.postDrawerHeaderText}>
                  <h2 className={styles.postDrawerTitle}>Publication</h2>
                  <p className={styles.postDrawerSubtitle}>Editing</p>
                </div>
              </div>
              <Button
                variant="transparent"
                size="m"
                iconOnly
                leftIcon={<Icon name="close-large" size={20} />}
                onClick={closeDrawer}
                type="button"
                aria-label="Close"
              />
            </div>
            <div className={styles.postDrawerTabsWrap}>
              <TabGroup value={drawerTab} onChange={v => setDrawerTab(v as typeof drawerTab)} label="Publication sections">
                <TabItem value="content">Content & Media</TabItem>
                <TabItem value="planning">Planning</TabItem>
                <TabItem value="seo">SEO</TabItem>
              </TabGroup>
            </div>
          </div>

          <div className={styles.postDrawerBody}>
            {drawerTab === 'content' ? (
              <>
                <div className={styles.postDrawerSection}>
                  <p className={styles.postDrawerSectionLabel}>Cover</p>
                  <div className={styles.postDrawerCoverRow}>
                    <UploadDropzone
                      previewUrl={draftCoverPreview}
                      iconColor="var(--icon-accent, #69388f)"
                      title="Drag a photo or click to select"
                      inputRef={coverFileInputRef}
                      onFile={handleCoverFile}
                    />

                    <div className={styles.postDrawerCategoryCol}>
                      <Dropdown
                        size="m"
                        label="Category"
                        value={draftCategory}
                        onChange={setDraftCategory}
                        options={CATEGORY_DROPDOWN_OPTIONS}
                        placeholder="Choose or create your own"
                        className={styles.postDrawerField}
                      />
                      <div className={styles.postDrawerTagsBlock}>
                        <span className={styles.postDrawerFieldLabel}>Tags</span>
                        <div className={styles.postDrawerTagsInput}>
                          {draftTags.map(tag => (
                            <span key={tag} className={styles.postDrawerTagChip}>
                              <Icon name="hashtag" size={12} color="var(--badge-gray-icon, #747479)" />
                              {tag}
                              <button
                                type="button"
                                className={styles.postDrawerTagRemove}
                                aria-label={`Remove ${tag}`}
                                onClick={() => removeDraftTag(tag)}
                              >
                                <Icon name="close-small" size={12} color="var(--badge-gray-icon, #747479)" />
                              </button>
                            </span>
                          ))}
                          <input
                            type="text"
                            className={styles.postDrawerTagsField}
                            placeholder={draftTags.length === 0 ? 'Enter a tag' : ''}
                            value={draftTagInput}
                            onChange={e => setDraftTagInput(e.target.value)}
                            onKeyDown={handleTagInputKeyDown}
                          />
                        </div>
                        <span className={styles.postDrawerFieldHint}>Start with # for autocomplete or create a new tag</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.postDrawerDivider} />

                <div className={styles.postDrawerSection}>
                  <p className={styles.postDrawerSectionLabel}>General information</p>
                  <div className={styles.postDrawerGeneralGrid}>
                    <div className={styles.postDrawerGeneralRow}>
                      <Input
                        required
                        labelText="Post title"
                        placeholder="Enter the article title"
                        value={draftTitle}
                        onChange={setDraftTitle}
                        state={draftTitle ? 'entered' : 'default'}
                        className={styles.postDrawerField}
                      />
                      <div className={styles.postDrawerSlugWrap}>
                        <Input
                          required
                          labelText="URL slug"
                          disclaimer
                          placeholder="kobzar-taras-shevchenko"
                          value={draftSlug}
                          onChange={setDraftSlug}
                          state={draftSlug ? 'entered' : 'default'}
                          className={styles.postDrawerField}
                        />
                        <span className={styles.postDrawerAiBtn} aria-hidden="true">
                          <Icon name="ai" size={16} />
                        </span>
                      </div>
                    </div>

                    <div className={styles.postDrawerEditor}>
                      <span className={styles.postDrawerFieldLabel}>Main text</span>
                      <div className={styles.postDrawerEditorBox}>
                        <div className={styles.postDrawerEditorToolbar}>
                          <Icon name="bold" size={20} />
                          <Icon name="italic" size={20} />
                          <span className={styles.postDrawerEditorDivider} />
                          <Icon name="list-ordered" size={20} />
                          <Icon name="list-check" size={20} />
                          <span className={styles.postDrawerEditorDivider} />
                          <Icon name="double-quotes" size={20} />
                          <Icon name="link" size={20} />
                        </div>
                        <div className={styles.postDrawerEditorInputWrap}>
                          <textarea
                            className={styles.postDrawerEditorTextarea}
                            placeholder="Start writing your article"
                            value={draftMainText}
                            onChange={e => setDraftMainText(e.target.value)}
                            maxLength={1000}
                          />
                          <span className={styles.postDrawerEditorCounter}>{draftMainText.length}/1000</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.postDrawerShortDescWrap}>
                      <TextArea
                        labelText="Short description"
                        placeholder="Short description for post preview (1-2 sentences)"
                        value={draftShortDesc}
                        onChange={setDraftShortDesc}
                        maxChars={80}
                        supporting={false}
                        state={draftShortDesc ? 'entered' : 'default'}
                        className={styles.postDrawerField}
                      />
                      <span className={styles.postDrawerAiBtnBottom} aria-hidden="true">
                        <Icon name="ai" size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : drawerTab === 'planning' ? (
              <div className={styles.planSection}>
                <p className={styles.postDrawerSectionLabel}>
                  Planning details
                </p>

                <div className={styles.planCardRow}>
                  <div
                    className={cx(styles.planCard, draftPublishMode === 'immediately' && styles.planCardSelected)}
                    onClick={() => setDraftPublishMode('immediately')}
                  >
                    <span className={styles.planCardText}>Publish immediately</span>
                    <RadioButton
                      selected={draftPublishMode === 'immediately'}
                      name="publish-mode"
                      value="immediately"
                      onChange={() => setDraftPublishMode('immediately')}
                    />
                  </div>
                  <div
                    className={cx(styles.planCard, draftPublishMode === 'schedule' && styles.planCardSelected)}
                    onClick={() => setDraftPublishMode('schedule')}
                  >
                    <span className={styles.planCardText}>Schedule publication</span>
                    <RadioButton
                      selected={draftPublishMode === 'schedule'}
                      name="publish-mode"
                      value="schedule"
                      onChange={() => setDraftPublishMode('schedule')}
                    />
                  </div>
                </div>

                {draftPublishMode === 'schedule' && (
                  <div className={styles.planScheduleRow}>
                    <Datepicker
                      value={draftPublicationDate}
                      onChange={setDraftPublicationDate}
                      label="Publication Date"
                      placeholder="dd.mm — dd.mm"
                      className={styles.planFixedField}
                    />
                    <Input
                      labelText="Publication Time"
                      placeholder="00:00"
                      value={draftPublicationTime}
                      onChange={setDraftPublicationTime}
                      state={draftPublicationTime ? 'entered' : 'default'}
                      className={styles.planFixedField}
                    />
                  </div>
                )}

                <div className={styles.planAuthorBlock}>
                  <span className={styles.postDrawerFieldLabel}>Author</span>
                  <Dropdown
                    size="xl"
                    value={draftAuthor}
                    onChange={setDraftAuthor}
                    options={AUTHOR_DROPDOWN_OPTIONS}
                    placeholder="Choose an author"
                    className={styles.planFixedField}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className={styles.postDrawerSection}>
                  <p className={styles.postDrawerSectionLabel}>Media gallery</p>
                  <UploadDropzone
                    previewUrl={draftSeoMediaPreview}
                    iconColor="var(--icon-accent, #69388f)"
                    title="Drag and drop a photo or click to select"
                    className={styles.postDrawerUploadFull}
                    inputRef={seoFileInputRef}
                    onFile={handleSeoMediaFile}
                  />
                </div>

                <div className={styles.postDrawerDivider} />

                <div className={styles.postDrawerSection}>
                  <div className={styles.seoHeading}>
                    <p className={styles.postDrawerSectionLabel}>Search engine optimization</p>
                    <Icon name="info" size={18} color="var(--icon-tertiary, #929297)" />
                  </div>

                  <div className={styles.postDrawerShortDescWrap}>
                    <TextArea
                      labelText="Meta Title"
                      placeholder="For example: Books and stationery for study and work"
                      value={draftMetaTitle}
                      onChange={setDraftMetaTitle}
                      maxChars={80}
                      supporting={false}
                      state={draftMetaTitle ? 'entered' : 'default'}
                      className={styles.postDrawerField}
                    />
                    <span className={styles.postDrawerAiBtnBottom} aria-hidden="true">
                      <Icon name="ai" size={16} />
                    </span>
                  </div>

                  <div className={styles.seoFullDescWrap}>
                    <TextArea
                      labelText="Full description"
                      placeholder="For example: A wide selection of books and stationery for study, work, and creativity. Tips for choosing quality products that enhance productivity and comfort in daily work."
                      value={draftMetaDescription}
                      onChange={setDraftMetaDescription}
                      maxChars={200}
                      supporting={false}
                      state={draftMetaDescription ? 'entered' : 'default'}
                      className={cx(styles.postDrawerField, styles.seoFullDescField)}
                    />
                    <span className={styles.postDrawerAiBtnBottom} aria-hidden="true">
                      <Icon name="ai" size={16} />
                    </span>
                  </div>
                </div>

                <div className={styles.postDrawerDivider} />

                <div className={styles.postDrawerSection}>
                  <p className={styles.postDrawerSectionLabel}>Google preview</p>
                  <div className={styles.seoPreviewCard}>
                    <div className={styles.seoPreviewUrlRow}>
                      <span className={styles.seoPreviewDot} aria-hidden="true" />
                      <span className={styles.seoPreviewDomain}>bookstore.com</span>
                    </div>
                    <div className={styles.seoPreviewBody}>
                      <p className={styles.seoPreviewTitle}>{draftMetaTitle || draftTitle || 'Publication Title'}</p>
                      <p className={styles.seoPreviewLink}>
                        {`https://bookstore.com/products/${draftSlug || 'url-slug'}`}
                      </p>
                      <p className={styles.seoPreviewDesc}>
                        {draftMetaDescription || draftShortDesc || 'Product description will appear here...'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={styles.postDrawerCompleteness}>
            <div className={styles.postDrawerCompletenessRow}>
              <span className={styles.postDrawerCompletenessLabel}>Field Completeness</span>
              <span className={styles.postDrawerCompletenessPct}>{completenessPct}%</span>
            </div>
            <div className={styles.postDrawerProgressTrack}>
              <div className={styles.postDrawerProgressFill} style={{ width: `${completenessPct}%` }} />
            </div>
          </div>

          <div className={styles.postDrawerFooter}>
            <div className={styles.postDrawerFooterLeft}>
              <Button variant="secondary" size="l" leftIcon={<Icon name="eye-fill" size={20} />} type="button" className={styles.postDrawerBtnPreview}>
                Preview
              </Button>
              <Button variant="secondary" size="l" type="button" onClick={handleSaveAsDraft} disabled={!draftTitle.trim()} className={styles.postDrawerBtnDraft}>
                Save as Draft
              </Button>
            </div>
            <div className={styles.postDrawerFooterRight}>
              {drawerTab === 'content' ? (
                <Button variant="secondary" size="l" type="button" onClick={closeDrawer} className={styles.postDrawerBtnCancel}>
                  Cancel
                </Button>
              ) : (
                <Button variant="secondary" size="l" leftIcon={<Icon name="arrow-left" size={20} />} type="button" onClick={handleDrawerBack} className={styles.postDrawerBtnBack}>
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                size="l"
                leftIcon={drawerTab === 'seo' ? <Icon name="globe" size={20} /> : undefined}
                type="button"
                onClick={handleDrawerContinue}
                disabled={drawerTab === 'seo' && !draftTitle.trim()}
                className={drawerTab === 'seo' ? styles.postDrawerBtnPublish : styles.postDrawerBtnContinue}
              >
                {drawerTab === 'seo' ? 'Publish' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    )}
    </>
  );
}
