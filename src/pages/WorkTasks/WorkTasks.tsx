import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
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
import { Badge } from '@components/atoms/Badge';
import { Checkbox } from '@components/atoms/Checkbox/Checkbox';
import { Input } from '@components/atoms/Input';
import { TextArea } from '@components/atoms/TextArea';
import { CardSelection } from '@components/atoms/CardSelection';
import { Calendar } from '@components/atoms/Calendar/Calendar';
import { Tooltip } from '@components/atoms/Tooltip/Tooltip';
import { Status } from '@components/atoms/Status/Status';
import type { StatusStatus } from '@components/atoms/Status/Status.types';
import type { SidebarNavItem, SidebarUser } from '@components/atoms/Sidebar/Sidebar.types';
import type { BadgeColor } from '@components/atoms/Badge/Badge.types';
import styles from './WorkTasks.module.css';

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

const ThreeDotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="3"  cy="8" r="1.5" fill="currentColor" />
    <circle cx="8"  cy="8" r="1.5" fill="currentColor" />
    <circle cx="13" cy="8" r="1.5" fill="currentColor" />
  </svg>
);

const PageBtn = ({
  children, active = false, disabled = false, onClick,
}: { children: React.ReactNode; active?: boolean; disabled?: boolean; onClick?: () => void }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cx(styles.pageBtn, active && styles.pageBtnActive)}
  >
    {children}
  </button>
);

/* Grows from 0 to the dragged card's height so surrounding cards visibly
   part ways to make room, instead of the gap snapping open instantly.
   Positioned via CSS `order` so hovering a new spot slides this same
   instance instead of remounting (which would reset the grow animation). */
function BoardCardPlaceholder({ targetHeight, order }: { targetHeight: number; order: number }) {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setHeight(targetHeight));
    return () => cancelAnimationFrame(raf);
  }, [targetHeight]);
  return <div className={styles.boardCardPlaceholder} style={{ height, order }} />;
}

/* ── Sidebar data ────────────────────────────────────────────────────────── */
function makeNavItems(onNavigate?: (page: string) => void): SidebarNavItem[] {
  return [
    { id: 'dashboard', icon: 'dashboard',    label: 'Dashboard',   onClick: () => onNavigate?.('dashboard') },
    { id: 'orders',    icon: 'shopping-bag', label: 'Orders', badge: 12, onClick: () => onNavigate?.('orders') },
    { id: 'users',     icon: 'user',         label: 'Users',        onClick: () => onNavigate?.('users') },
    { id: 'products',  icon: 'barcode',      label: 'Products',     onClick: () => onNavigate?.('products') },
    { id: 'tasks',     icon: 'task-list',    label: 'Work tasks', selected: true, onClick: () => onNavigate?.('tasks') },
    { id: 'blog',      icon: 'news',         label: 'Blog', onClick: () => onNavigate?.('blog') },
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

/* ── Types ───────────────────────────────────────────────────────────────── */
type StatusFilter = 'all' | 'not-started' | 'in-progress' | 'under-review' | 'completed' | 'archive';
type TaskStage    = Exclude<StatusFilter, 'all'>;
type Priority     = 'critical' | 'high' | 'medium' | 'low';

interface Task {
  id:               string;
  name:             string;
  subtitle:         string;
  category:         string;
  categoryColor:    BadgeColor;
  priority:         Priority;
  responsible:      string;
  responsibleEmail: string;
  deadline:         string | null;
  deadlineOverdue:  boolean;
  created:          string;
  stage:            TaskStage;
}

/* ── Mock data (198 generated tasks) ────────────────────────────────────── */
const TASK_TEMPLATES = [
  { name: 'Conduct an inventory of the "Fiction" section',      subtitle: 'Check the availability of books on the list and the condition of the covers. Pay special attention to new arrivals.' },
  { name: 'Update price tags in the "Stationery" department',   subtitle: 'Replace outdated labels with new ones according to the current price list. Check all stands and shelves.' },
  { name: 'Prepare the promotional display for the entrance',   subtitle: 'Arrange bestsellers and new arrivals on the front display stand. Use the provided layout plan.' },
  { name: 'Process returns from customers',                     subtitle: 'Verify return condition, update inventory records and issue refunds where applicable.' },
  { name: 'Restock the "Children\'s Books" shelves',            subtitle: 'Fill empty slots from the warehouse stock. Maintain alphabetical order by author surname.' },
  { name: 'Audit cash register receipts for the month',         subtitle: 'Cross-check POS data against daily sales reports and flag any discrepancies.' },
  { name: 'Coordinate delivery from supplier #14',              subtitle: 'Confirm delivery window, prepare unloading zone and update incoming stock records.' },
  { name: 'Train new staff on inventory software',              subtitle: 'Walk through the stock management module, demonstrate daily procedures and answer questions.' },
  { name: 'Write copy for the summer sale banner',              subtitle: 'Draft three variants for the marketing team to review. Focus on discount highlights and call-to-action.' },
  { name: 'Clean and reorganise the storage room',              subtitle: 'Remove obsolete stock, label shelving zones and photograph the final layout for records.' },
];
const CATEGORIES: Array<{ label: string; color: BadgeColor }> = [
  { label: 'Warehouse',   color: 'green'  },
  { label: 'Office',      color: 'pink'   },
  { label: 'Marketing',   color: 'lilac'  },
  { label: 'Promotions',  color: 'orange' },
  { label: 'HR',          color: 'blue'   },
];
const PRIORITIES: Priority[]   = ['critical', 'high', 'medium', 'low'];
const STAGES:     TaskStage[]  = ['not-started', 'in-progress', 'under-review', 'completed', 'archive'];
const PEOPLE = [
  { name: 'Artem Kovalenko',  email: 'artem.admin@bookstore.com'     },
  { name: 'Olga Seienko',     email: 'olga.admin@bookstore.com'      },
  { name: 'Ihor Lyshko',      email: 'igor.admin@bookstore.com'      },
  { name: 'Oleksandra Sova',  email: 'oleksandra.admin@bookstore.com' },
  { name: 'Ivan Hrytsak',     email: 'ivan.admin@bookstore.com'      },
];

function pad2(n: number) { return String(n).padStart(2, '0'); }
function mockDate(seed: number) {
  const m = ((seed * 7) % 12) + 1;
  const d = ((seed * 13) % 28) + 1;
  return `2026-${pad2(m)}-${pad2(d)}`;
}

/* dd/mm/yyyy <-> Date, for the deadline field (typed or picked from calendar) */
function formatDDMMYYYY(d: Date): string {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}
function parseDDMMYYYY(s: string): Date | null {
  const m = s.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return Number.isNaN(d.getTime()) ? null : d;
}
/* ISO (YYYY-MM-DD, used on the Task model) <-> dd/mm/yyyy (used by the form field) */
function isoToDDMMYYYY(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function ddmmyyyyToISO(s: string): string | null {
  const d = parseDDMMYYYY(s);
  return d ? `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` : null;
}

const ALL_TASKS: Task[] = Array.from({ length: 26 }, (_, i) => {
  const tpl      = TASK_TEMPLATES[i % TASK_TEMPLATES.length];
  const cat      = CATEGORIES[i % CATEGORIES.length];
  const person   = PEOPLE[i % PEOPLE.length];
  const priority = PRIORITIES[i % PRIORITIES.length];
  const stage    = STAGES[i % STAGES.length];
  const hasDeadline = i % 7 !== 3;
  return {
    id:               String(i + 1),
    name:             tpl.name,
    subtitle:         tpl.subtitle,
    category:         cat.label,
    categoryColor:    cat.color,
    priority,
    responsible:      person.name,
    responsibleEmail: person.email,
    deadline:         hasDeadline ? mockDate(i) : null,
    deadlineOverdue:  hasDeadline && i % 5 === 1,
    created:          mockDate(i + 3),
    stage,
  };
});

/* ── Filter / sort options ───────────────────────────────────────────────── */
const STATUS_FILTER_OPTIONS = [
  { value: 'all',          label: 'All' },
  { value: 'not-started',  label: 'Not started' },
  { value: 'in-progress',  label: 'In progress' },
  { value: 'under-review', label: 'Under review' },
  { value: 'completed',    label: 'Completed' },
  { value: 'archive',      label: 'Archive' },
];

/* In the Kanban board, each stage already has its own column, so the only
   meaningful tabs are "see everything" vs. "see the archive" (which isn't
   a board column). */
const STATUS_FILTER_OPTIONS_GRID = [
  { value: 'all',     label: 'All' },
  { value: 'archive', label: 'Archive' },
];

const EXECUTOR_OPTIONS = [
  { value: 'all', label: 'All executors' },
  ...PEOPLE.map(p => ({ value: p.name, label: p.name })),
];

/* Minimum page size is 15; pagination shows when total > pageSize */
const PAGE_SIZE_OPTIONS = [
  { value: '15', label: '15' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
];

/* ── Create task form options ─────────────────────────────────────────────── */
const CATEGORY_OPTIONS = CATEGORIES.map(c => ({ value: c.label, label: c.label }));

/* ── Display maps ────────────────────────────────────────────────────────── */
const PRIORITY_DOT_COLOR: Record<Priority, string> = {
  critical: '#e50003',
  high:     '#e50003',
  medium:   '#ff8b5e',
  low:      '#b6b6b9',
};

const PRIORITY_LABEL: Record<Priority, string> = {
  critical: 'Critical',
  high:     'High',
  medium:   'Medium',
  low:      'Low',
};

const STATUS_BG: Record<TaskStage, string> = {
  'not-started':  'var(--badge-gray-bg, #ececed)',
  'in-progress':  'var(--badge-blue-bg, #e2ecff)',
  'under-review': 'var(--badge-orange-bg, #ffece0)',
  completed:      'var(--badge-green-bg, #e0f7f5)',
  archive:        'var(--badge-lilac-bg, #f0e7ff)',
};
const STATUS_TEXT_COLOR: Record<TaskStage, string> = {
  'not-started':  'var(--badge-gray-text, #58585c)',
  'in-progress':  'var(--badge-blue-text, #1a4ab0)',
  'under-review': 'var(--badge-orange-text, #b3550a)',
  completed:      'var(--badge-green-text, #1a625d)',
  archive:        'var(--badge-lilac-text, #6a3fc2)',
};
const STATUS_LABEL: Record<TaskStage, string> = {
  'not-started':  'Not started',
  'in-progress':  'In progress',
  'under-review': 'Under review',
  completed:      'Completed',
  archive:        'Archive',
};
const STATUS_KEYS = Object.keys(STATUS_LABEL) as TaskStage[];

/* Kanban board columns — Archive is filter-only, not a board column */
const BOARD_STAGES: TaskStage[] = ['not-started', 'in-progress', 'under-review', 'completed'];

/* Priority → Status-dot semantic + card left-accent stroke color */
const PRIORITY_VISUAL: Record<Priority, { status: StatusStatus; stroke: string }> = {
  critical: { status: 'error',    stroke: 'var(--stroke-error, #ff575a)' },
  high:     { status: 'error',    stroke: 'var(--stroke-error, #ff575a)' },
  medium:   { status: 'warning',  stroke: 'var(--stroke-warning, #ff8b5e)' },
  low:      { status: 'disabled', stroke: 'var(--stroke-disable, #dadadc)' },
};

const PRIORITY_OPTIONS = PRIORITIES.map(p => ({ value: p, label: PRIORITY_LABEL[p] }));
const NEW_TASK_STAGE_OPTIONS = BOARD_STAGES.map(s => ({ value: s, label: STATUS_LABEL[s] }));

/* ── Component ───────────────────────────────────────────────────────────── */
interface WorkTasksProps {
  onNavigate?: (page: string) => void;
}

export function WorkTasks({ onNavigate }: WorkTasksProps) {
  const [tasks, setTasks]                 = useState<Task[]>(ALL_TASKS);
  const [search, setSearch]               = useState('');
  const [statusFilter, setStatusFilter]   = useState<StatusFilter>('all');
  const [executorValue, setExecutorValue] = useState('all');
  const [viewMode, setViewMode]           = useState<'grid' | 'table'>('grid');
  const [checkedIds, setCheckedIds]       = useState<Set<string>>(new Set());
  const [pageSize, setPageSize]           = useState('15');
  const [currentPage, setCurrentPage]     = useState(1);

  /* Column sort state */
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);

  function handleSort(col: string) {
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

  function handleStatusFilterChange(v: StatusFilter) {
    setStatusFilter(v);
    setCurrentPage(1);
  }

  function handleExecutorChange(v: string) {
    setExecutorValue(v);
    setCurrentPage(1);
  }

  /* Per-row mutable status (workflow stage) */
  const [statusMap, setStatusMap] = useState<Record<string, TaskStage>>(
    Object.fromEntries(ALL_TASKS.map(t => [t.id, t.stage]))
  );

  /* Status dropdown state (portal, position: fixed) */
  const [openStatusId, setOpenStatusId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor]     = useState<DOMRect | null>(null);

  /* More-actions menu state (portal, position: fixed) */
  const [openMoreId, setOpenMoreId]   = useState<string | null>(null);
  const [moreAnchor, setMoreAnchor]   = useState<DOMRect | null>(null);

  const PRIORITY_ORDER: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };

  const filteredTasks = tasks.filter(t => {
    if (statusFilter !== 'all' && (statusMap[t.id] ?? t.stage) !== statusFilter) return false;
    if (executorValue !== 'all' && t.responsible !== executorValue) return false;
    return true;
  });

  const sortedTasks = (() => {
    if (!sortCol || !sortDir) return filteredTasks;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filteredTasks].sort((a, b) => {
      switch (sortCol) {
        case 'name':        return dir * a.name.localeCompare(b.name);
        case 'category':    return dir * a.category.localeCompare(b.category);
        case 'priority':    return dir * (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
        case 'responsible': return dir * a.responsible.localeCompare(b.responsible);
        case 'status':      return dir * (statusMap[a.id] ?? a.stage).localeCompare(statusMap[b.id] ?? b.stage);
        case 'deadline': {
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return dir * a.deadline.localeCompare(b.deadline);
        }
        case 'created':     return dir * a.created.localeCompare(b.created);
        default:            return 0;
      }
    });
  })();

  const totalItems  = filteredTasks.length;
  const ps          = Number(pageSize);
  const totalPages  = Math.ceil(totalItems / ps);
  const showPagination = totalItems > ps;
  const pagedTasks  = sortedTasks.slice((currentPage - 1) * ps, currentPage * ps);

  const allChecked  = pagedTasks.length > 0 && pagedTasks.every(t => checkedIds.has(t.id));
  const someChecked = pagedTasks.some(t => checkedIds.has(t.id)) && !allChecked;

  function toggleAll(checked: boolean) {
    setCheckedIds(prev => {
      const next = new Set(prev);
      pagedTasks.forEach(t => checked ? next.add(t.id) : next.delete(t.id));
      return next;
    });
  }
  function toggleRow(id: string, checked: boolean) {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  }

  /* Only one popover/menu/date-picker may be open at a time on this page —
     opening any of them closes all the others. */
  function closeAllMenus() {
    setOpenStatusId(null);
    setMenuAnchor(null);
    setOpenMoreId(null);
    setMoreAnchor(null);
    setOpenAddPerson(false);
    setAddPersonAnchor(null);
    setIsDeadlineCalendarOpen(false);
  }

  function handleStatusOpen(taskId: string, trigger: HTMLButtonElement) {
    if (openStatusId === taskId) {
      setOpenStatusId(null);
      setMenuAnchor(null);
      return;
    }
    closeAllMenus();
    setMenuAnchor(trigger.getBoundingClientRect());
    setOpenStatusId(taskId);
  }

  function handleStatusSelect(taskId: string, status: TaskStage) {
    setStatusMap(prev => ({ ...prev, [taskId]: status }));
    setOpenStatusId(null);
    setMenuAnchor(null);
  }

  function handleMoreOpen(taskId: string, trigger: HTMLButtonElement) {
    if (openMoreId === taskId) {
      setOpenMoreId(null);
      setMoreAnchor(null);
      return;
    }
    closeAllMenus();
    setMoreAnchor(trigger.getBoundingClientRect());
    setOpenMoreId(taskId);
  }

  /* Close status dropdown on click outside */
  useEffect(() => {
    if (!openStatusId) return;
    function close() { setOpenStatusId(null); setMenuAnchor(null); }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openStatusId]);

  /* Close more-actions menu on click outside */
  useEffect(() => {
    if (!openMoreId) return;
    function close() { setOpenMoreId(null); setMoreAnchor(null); }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openMoreId]);

  /* ── Bulk action bar ─────────────────────────────────────────────────────── */
  function handleBulkDelete() {
    setTasks(prev => prev.filter(t => !checkedIds.has(t.id)));
    setCheckedIds(new Set());
  }

  function handleBulkArchive() {
    setStatusMap(prev => {
      const next = { ...prev };
      checkedIds.forEach(id => { next[id] = 'archive'; });
      return next;
    });
    setCheckedIds(new Set());
  }

  const [openAddPerson, setOpenAddPerson]     = useState(false);
  const [addPersonAnchor, setAddPersonAnchor] = useState<DOMRect | null>(null);

  function handleAddPersonOpen(trigger: HTMLButtonElement) {
    if (openAddPerson) {
      setOpenAddPerson(false);
      setAddPersonAnchor(null);
      return;
    }
    closeAllMenus();
    setAddPersonAnchor(trigger.getBoundingClientRect());
    setOpenAddPerson(true);
  }

  function handleAddPersonSelect(person: { name: string; email: string }) {
    setTasks(prev => prev.map(t =>
      checkedIds.has(t.id) ? { ...t, responsible: person.name, responsibleEmail: person.email } : t,
    ));
    setOpenAddPerson(false);
    setAddPersonAnchor(null);
  }

  /* Close add-responsible-person dropdown on click outside */
  useEffect(() => {
    if (!openAddPerson) return;
    function close() { setOpenAddPerson(false); setAddPersonAnchor(null); }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openAddPerson]);

  /* ── Kanban board: pointer-driven drag (not native HTML5 DnD) ─────────────
     Native HTML5 drag/drop cancels the session the instant the dragged node
     is removed or its layout shifts under the cursor, which made the
     "cards make room" gap unreliable. Pointer Events give us full control:
     we track the drag ourselves and only ever touch state, never rely on
     the browser's own drag session. */
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggedCardHeight, setDraggedCardHeight] = useState(0);
  const [dragOverStage, setDragOverStage] = useState<TaskStage | null>(null);
  /* Index into the target column's cards, EXCLUDING the dragged card itself */
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  /* FLIP animation: whenever cards get reordered via CSS `order` (because the
     placeholder moved), measure each card's position before/after and play
     the delta back as a transform transition, so they visibly slide into
     their new spot instead of snapping. */
  const boardCardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const boardCardRects = useRef<Map<string, DOMRect>>(new Map());

  useLayoutEffect(() => {
    /* Web Animations API drives the tween directly — no manual "invert,
       force a reflow, then switch the transition back on" dance, which is
       prone to the browser coalescing both writes into a single frame and
       skipping the visible motion entirely. */
    boardCardRefs.current.forEach((el, id) => {
      /* Cancel any still-running tween first — otherwise its leftover
         transform contaminates the position we measure below, which is
         what made the motion look like a sudden snap instead of a
         continuous slide when you dragged over several cards quickly. */
      el.getAnimations().forEach(a => a.cancel());

      const prev = boardCardRects.current.get(id);
      const next = el.getBoundingClientRect();
      if (prev && (prev.top !== next.top || prev.left !== next.left)) {
        const dx = prev.left - next.left;
        const dy = prev.top - next.top;
        el.animate(
          [
            { transform: `translate(${dx}px, ${dy}px)` },
            { transform: 'translate(0, 0)' },
          ],
          { duration: 200, easing: 'cubic-bezier(0.33, 1, 0.68, 1)', fill: 'both' },
        );
      }
      boardCardRects.current.set(id, next);
    });
  }, [dragOverStage, dragOverIndex, tasks]);
  const [dragPointerPos, setDragPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [dragCardPreview, setDragCardPreview] = useState<{ name: string; category: string; categoryColor: BadgeColor } | null>(null);

  function handleCardPointerDown(e: React.PointerEvent<HTMLDivElement>, task: Task) {
    if (e.button !== 0) return;
    /* Ignore drags started on interactive controls inside the card (checkbox) */
    if ((e.target as HTMLElement).closest('input, label')) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const cardHeight = e.currentTarget.offsetHeight;
    const sourceStage: TaskStage = statusMap[task.id] ?? task.stage;
    let dragging = false;
    let lastStage: TaskStage | null = null;
    let lastOtherIds: string[] = [];
    let lastIndex = 0;
    /* Only ever act on the most recent pointer position, at most once per
       animation frame — raw pointermove can fire far more often than the
       screen repaints, and reacting to every one of them was restarting the
       slide animation before it ever got to finish, which read as a jittery
       snap instead of a smooth glide. */
    let rafId: number | null = null;
    let pendingX = 0;
    let pendingY = 0;

    function computeTarget(clientX: number, clientY: number) {
      const el = document.elementFromPoint(clientX, clientY);
      const columnEl = el?.closest<HTMLElement>('[data-board-column]');
      if (!columnEl) { lastStage = null; setDragOverStage(null); setDragOverIndex(null); return; }

      const stage = columnEl.dataset.boardColumn as TaskStage;

      /* Still hovering the card's own column — don't make room for it yet.
         The "cards yield" effect only kicks in once the card has actually
         crossed into a different column. */
      if (stage === sourceStage) {
        if (lastStage !== null) { lastStage = null; setDragOverStage(null); setDragOverIndex(null); }
        return;
      }

      const cardEls = [...columnEl.querySelectorAll<HTMLElement>('[data-board-card]')]
        .filter(el2 => el2.dataset.boardCard !== task.id);

      /* Small hysteresis: just enough to stop pixel-level jitter right at a
         card's edge, without dulling the response to an actual hover. */
      const hysteresis = 4;
      let index = cardEls.length;
      for (let i = 0; i < cardEls.length; i++) {
        const r = cardEls[i].getBoundingClientRect();
        const bias = i < lastIndex ? hysteresis : -hysteresis;
        if (clientY < r.top + r.height / 2 + bias) { index = i; break; }
      }

      if (stage === lastStage && index === lastIndex) return;

      lastStage    = stage;
      lastOtherIds = cardEls.map(el2 => el2.dataset.boardCard!);
      lastIndex    = index;
      setDragOverStage(stage);
      setDragOverIndex(index);
    }

    function onMove(ev: PointerEvent) {
      if (!dragging) {
        if (Math.abs(ev.clientX - startX) < 4 && Math.abs(ev.clientY - startY) < 4) return;
        dragging = true;
        setDraggedTaskId(task.id);
        setDraggedCardHeight(cardHeight);
        setDragCardPreview({ name: task.name, category: task.category, categoryColor: task.categoryColor });
        document.body.style.cursor = 'grabbing';
      }
      pendingX = ev.clientX;
      pendingY = ev.clientY;
      setDragPointerPos({ x: pendingX, y: pendingY });
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          computeTarget(pendingX, pendingY);
        });
      }
    }

    function onUp() {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      if (rafId !== null) cancelAnimationFrame(rafId);
      document.body.style.cursor = '';

      if (dragging && lastStage) {
        const refId = lastOtherIds[lastIndex];
        setTasks(prev => {
          const dragged = prev.find(t => t.id === task.id);
          if (!dragged) return prev;
          const without = prev.filter(t => t.id !== task.id);
          if (!refId) return [...without, dragged];
          const refPos = without.findIndex(t => t.id === refId);
          const next = [...without];
          next.splice(refPos < 0 ? next.length : refPos, 0, dragged);
          return next;
        });
        setStatusMap(prev => ({ ...prev, [task.id]: lastStage! }));
      }

      setDraggedTaskId(null);
      setDraggedCardHeight(0);
      setDragOverStage(null);
      setDragOverIndex(null);
      setDragPointerPos(null);
      setDragCardPreview(null);
    }

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  /* ── Create / edit task drawer (same form, `editingTaskId` picks the mode) ── */
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTaskId, setEditingTaskId]       = useState<string | null>(null);
  const [newTaskName, setNewTaskName]           = useState('');
  const [newTaskDesc, setNewTaskDesc]           = useState('');
  const [newTaskCategory, setNewTaskCategory]   = useState('');
  const [newTaskDeadline, setNewTaskDeadline]   = useState('');
  const [newTaskPriority, setNewTaskPriority]   = useState<Priority>('medium');
  const [newTaskStage, setNewTaskStage]         = useState<TaskStage>('not-started');
  const [newTaskPeople, setNewTaskPeople]       = useState<Set<string>>(new Set());
  const [isDeadlineCalendarOpen, setIsDeadlineCalendarOpen] = useState(false);
  const [deadlineAnchor, setDeadlineAnchor]     = useState<DOMRect | null>(null);
  const deadlineFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDeadlineCalendarOpen) return;
    const onOutside = (e: MouseEvent) => {
      if (!deadlineFieldRef.current?.contains(e.target as Node)) {
        setIsDeadlineCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [isDeadlineCalendarOpen]);

  function resetCreateTaskForm() {
    setEditingTaskId(null);
    setNewTaskName('');
    setNewTaskDesc('');
    setNewTaskCategory('');
    setNewTaskDeadline('');
    setNewTaskPriority('medium');
    setNewTaskStage('not-started');
    setNewTaskPeople(new Set());
    setIsDeadlineCalendarOpen(false);
  }

  function toggleNewTaskPerson(email: string, selected: boolean) {
    setNewTaskPeople(prev => {
      const next = new Set(prev);
      if (selected) next.add(email); else next.delete(email);
      return next;
    });
  }

  function handleEditTaskOpen(task: Task) {
    setEditingTaskId(task.id);
    setNewTaskName(task.name);
    setNewTaskDesc(task.subtitle);
    setNewTaskCategory(task.category);
    setNewTaskDeadline(task.deadline ? isoToDDMMYYYY(task.deadline) : '');
    setNewTaskPriority(task.priority);
    setNewTaskStage(statusMap[task.id] ?? task.stage);
    setNewTaskPeople(new Set([task.responsibleEmail]));
    setIsCreateTaskOpen(true);
  }

  function handleSubmitTask() {
    if (!newTaskName.trim()) return;
    const category = CATEGORIES.find(c => c.label === newTaskCategory) ?? CATEGORIES[0];
    const person = PEOPLE.find(p => newTaskPeople.has(p.email)) ?? PEOPLE[0];
    const deadline = newTaskDeadline.trim() ? ddmmyyyyToISO(newTaskDeadline.trim()) : null;

    if (editingTaskId) {
      setTasks(prev => prev.map(t => t.id === editingTaskId ? {
        ...t,
        name:             newTaskName.trim(),
        subtitle:         newTaskDesc.trim(),
        category:         category.label,
        categoryColor:    category.color,
        priority:         newTaskPriority,
        responsible:      person.name,
        responsibleEmail: person.email,
        deadline,
        stage:            newTaskStage,
      } : t));
      setStatusMap(prev => ({ ...prev, [editingTaskId]: newTaskStage }));
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const task: Task = {
        id:               `t-${Date.now()}`,
        name:             newTaskName.trim(),
        subtitle:         newTaskDesc.trim(),
        category:         category.label,
        categoryColor:    category.color,
        priority:         newTaskPriority,
        responsible:      person.name,
        responsibleEmail: person.email,
        deadline,
        deadlineOverdue:  false,
        created:          today,
        stage:            newTaskStage,
      };
      setTasks(prev => [task, ...prev]);
      setStatusMap(prev => ({ ...prev, [task.id]: newTaskStage }));
    }
    setIsCreateTaskOpen(false);
    resetCreateTaskForm();
  }

  return (
    <div className={styles.layout}>
      <Sidebar
        logo={<BookStoreLogo />}
        navItems={makeNavItems(onNavigate)}
        bottomItems={BOTTOM_ITEMS}
        user={SIDEBAR_USER}
        className={styles.sidebar}
      />

      <div className={styles.main}>
        {/* ── Page header ──────────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Work tasks</h1>
          <div className={styles.headerActions}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name or email"
              className={styles.headerSearch}
            />
            <Button
              variant="primary"
              size="l"
              leftIcon={<Icon name="add" size={20} />}
              onClick={() => setIsCreateTaskOpen(true)}
            >
              Create task
            </Button>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────── */}
        <div className={styles.body}>

          {/* Filter bar */}
          <div className={styles.filterBar}>
            <SegmentedControl
              value={statusFilter}
              onChange={v => handleStatusFilterChange(v as StatusFilter)}
              options={viewMode === 'grid' ? STATUS_FILTER_OPTIONS_GRID : STATUS_FILTER_OPTIONS}
              label="Task status filter"
            />
            <div className={styles.filterActions}>
              <div className={styles.filterControls}>
                <Dropdown
                  size="m"
                  value={executorValue}
                  onChange={handleExecutorChange}
                  options={EXECUTOR_OPTIONS}
                  placeholder="Executor"
                  className={styles.dropdownExecutor}
                />
                <button className={styles.iconBtn} aria-label="Filters" type="button">
                  <Icon name="filter" size={20} color="var(--icon-secondary, #454548)" />
                </button>
              </div>

              {/* View toggle: grid / table */}
              <div className={styles.viewToggle} role="group" aria-label="View mode">
                <button
                  type="button"
                  className={cx(styles.viewBtn, viewMode === 'grid' && styles.viewBtnActive)}
                  onClick={() => {
                    setViewMode('grid');
                    /* The board only has an "All" / "Archive" tab — collapse
                       any table-only stage filter back to "All". */
                    if (statusFilter !== 'all' && statusFilter !== 'archive') {
                      handleStatusFilterChange('all');
                    }
                  }}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Icon
                    name="grid"
                    size={20}
                    color={viewMode === 'grid'
                      ? 'var(--icon-secondary, #454548)'
                      : 'var(--icon-tertiary, #929297)'}
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
                    color={viewMode === 'table'
                      ? 'var(--icon-secondary, #454548)'
                      : 'var(--icon-tertiary, #929297)'}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ── Table card ───────────────────────────────────────────── */}
          {viewMode === 'table' && (
          <div className={styles.tableCard}>
            {/* tableArea clips the grid to rounded corners without becoming
                a scroll container, so position:sticky still works. The
                paginationBar sits outside so its Dropdown is not clipped. */}
            <div className={styles.tableArea}>
            <div className={styles.tableWrap}>
              {/*
                Flat grid: all cells are direct children of .tableGrid so that
                position:sticky works for the frozen columns (CSS Grid sticky
                requires the scroll container to be an ancestor of the grid
                container, not a sibling row wrapper).

                9 columns per row:
                checkbox | task-name | category | priority | responsible | status | deadline | created | actions
              */}
              <div className={styles.tableGrid}>

                {/* ── Header row (9 cells) ───────────────────────────── */}
                <TableCellTitleCheckbox
                  className={styles.stickyL1H}
                  checked={allChecked}
                  indeterminate={someChecked}
                  onChange={toggleAll}
                />
                <TableCellTitle className={styles.stickyL2H} labelText="Task name"
                  showSort sortDir={sortCol === 'name' ? sortDir : null} onSort={() => handleSort('name')} />
                <TableCellTitle labelText="Category"
                  showSort sortDir={sortCol === 'category' ? sortDir : null} onSort={() => handleSort('category')} />
                <TableCellTitle labelText="Priority"
                  showSort sortDir={sortCol === 'priority' ? sortDir : null} onSort={() => handleSort('priority')} />
                <TableCellTitle labelText="Responsible"
                  showSort sortDir={sortCol === 'responsible' ? sortDir : null} onSort={() => handleSort('responsible')} />
                <TableCellTitle labelText="Status" showSort={false} />
                <TableCellTitle labelText="Deadline"
                  showSort sortDir={sortCol === 'deadline' ? sortDir : null} onSort={() => handleSort('deadline')} />
                <TableCellTitle labelText="Created"
                  showSort sortDir={sortCol === 'created' ? sortDir : null} onSort={() => handleSort('created')} />
                <TableCellTitle className={styles.stickyRH} showLabel={false} showSort={false} />

                {/* ── Data rows (9 cells × N tasks) ─────────────────── */}
                {pagedTasks.flatMap((task, idx) => {
                  const isLast     = idx === pagedTasks.length - 1;
                  const isSelected = checkedIds.has(task.id);
                  const rowCls     = cx(isSelected && styles.cellSelected, isLast && styles.cellLast);
                  const status     = statusMap[task.id];

                  return [
                    /* col 1 – checkbox (sticky left 0) */
                    <TableCellCheckbox
                      key={`${task.id}-ck`}
                      className={cx(styles.stickyL1, rowCls)}
                      checked={isSelected}
                      onChange={c => toggleRow(task.id, c)}
                    />,

                    /* col 2 – task name + description (sticky left 44px) */
                    <TableCellText
                      key={`${task.id}-name`}
                      className={cx(styles.stickyL2, rowCls)}
                      titleText={task.name}
                      subtitle
                      subtitleText={task.subtitle}
                      tooltipContent
                    />,

                    /* col 3 – category badge */
                    <TableCellBadge
                      key={`${task.id}-cat`}
                      className={rowCls}
                      badges={[task.category]}
                      getBadgeColor={() => task.categoryColor}
                    />,

                    /* col 4 – priority dot + label */
                    <div key={`${task.id}-pri`} className={cx(styles.dataCell, rowCls)}>
                      <div className={styles.priorityCell}>
                        <span
                          className={styles.priorityDot}
                          style={{ background: PRIORITY_DOT_COLOR[task.priority] }}
                        />
                        <span className={styles.cellText}>{PRIORITY_LABEL[task.priority]}</span>
                      </div>
                    </div>,

                    /* col 5 – responsible: avatar placeholder + name + email */
                    <TableCellText
                      key={`${task.id}-resp`}
                      className={rowCls}
                      image
                      titleText={task.responsible}
                      subtitle
                      subtitleText={task.responsibleEmail}
                    />,

                    /* col 6 – status (interactive dropdown) */
                    <div key={`${task.id}-status`} className={cx(styles.dataCell, rowCls)}>
                      <button
                        type="button"
                        className={cx(
                          styles.statusDropdown,
                          openStatusId === task.id && styles.statusDropdownOpen,
                        )}
                        onMouseDown={e => {
                          e.stopPropagation();
                          handleStatusOpen(task.id, e.currentTarget);
                        }}
                      >
                        <div className={styles.statusBadgeWrap}>
                          <span
                            className={styles.statusBadge}
                            style={{ background: STATUS_BG[status], color: STATUS_TEXT_COLOR[status] }}
                          >
                            {STATUS_LABEL[status]}
                          </span>
                        </div>
                        <Icon
                          name="arrow-down"
                          size={20}
                          color="var(--_dd-icon)"
                          className={cx(
                            styles.statusArrow,
                            openStatusId === task.id && styles.statusArrowOpen,
                          )}
                        />
                      </button>
                    </div>,

                    /* col 7 – deadline */
                    <div key={`${task.id}-dl`} className={cx(styles.dataCell, rowCls)}>
                      {task.deadline ? (
                        <span
                          className={styles.cellText}
                          style={task.deadlineOverdue ? { color: 'var(--text-error, #e50003)' } : undefined}
                        >
                          {task.deadline}
                        </span>
                      ) : (
                        <span className={styles.cellTextMuted}>No deadline</span>
                      )}
                    </div>,

                    /* col 8 – created */
                    <div key={`${task.id}-cr`} className={cx(styles.dataCell, rowCls)}>
                      <span className={styles.cellText}>{task.created}</span>
                    </div>,

                    /* col 9 – actions (sticky right 0) */
                    <div key={`${task.id}-act`} className={cx(styles.actionsCell, styles.stickyR, rowCls)}>
                      <button
                        className={cx(styles.moreBtn, openMoreId === task.id && styles.moreBtnActive)}
                        aria-label="More actions"
                        type="button"
                        onMouseDown={e => {
                          e.stopPropagation();
                          handleMoreOpen(task.id, e.currentTarget);
                        }}
                      >
                        <ThreeDotsIcon />
                      </button>
                    </div>,
                  ];
                })}
              </div>
            </div>
            </div>{/* /tableArea */}

            {/* ── Pagination ─────────────────────────────────────────── */}
            {showPagination && (
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
                  <span className={styles.totalText}>of {totalItems} items</span>
                </div>

                <div className={styles.paginationRight}>
                  <PageBtn disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                    <Icon name="arrow-left-double" size={16} />
                  </PageBtn>
                  <PageBtn disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                    <Icon name="arrow-left" size={16} />
                  </PageBtn>

                  {(() => {
                    const pages: (number | 'dots')[] = [];
                    const delta = 1; // pages around current
                    const left  = Math.max(2, currentPage - delta);
                    const right = Math.min(totalPages - 1, currentPage + delta);

                    pages.push(1);
                    if (left > 2) pages.push('dots');
                    for (let p = left; p <= right; p++) pages.push(p);
                    if (right < totalPages - 1) pages.push('dots');
                    if (totalPages > 1) pages.push(totalPages);

                    return pages.map((p, i) =>
                      p === 'dots'
                        ? <span key={`dots-${i}`} className={styles.pageDots}>...</span>
                        : <PageBtn key={p} active={currentPage === p} onClick={() => setCurrentPage(p)}>{p}</PageBtn>
                    );
                  })()}

                  <PageBtn disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                    <Icon name="arrow-right" size={16} />
                  </PageBtn>
                  <PageBtn disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                    <Icon name="arrow-right-double" size={16} />
                  </PageBtn>
                </div>
              </div>
            )}
          </div>
          )}

          {/* ── Kanban board ─────────────────────────────────────────── */}
          {viewMode === 'grid' && (
          <div className={styles.board}>
            {(() => {
              const isArchiveView = statusFilter === 'archive';
              return (isArchiveView ? (['archive'] as TaskStage[]) : BOARD_STAGES).map(stage => {
              const cards      = filteredTasks.filter(t => (statusMap[t.id] ?? t.stage) === stage);
              const otherCards = draggedTaskId ? cards.filter(t => t.id !== draggedTaskId) : cards;
              const showPlaceholderAt = dragOverStage === stage ? dragOverIndex : null;
              return (
                <div
                  key={stage}
                  data-board-column={stage}
                  className={cx(
                    styles.boardColumn,
                    isArchiveView && styles.boardColumnGrid,
                    dragOverStage === stage && styles.boardColumnDragOver,
                  )}
                >
                  {!isArchiveView && (
                    <div className={styles.boardColumnHeader}>
                      <p className={styles.boardColumnTitle}>
                        {STATUS_LABEL[stage]}
                      </p>
                    </div>
                  )}

                  {(() => {
                    let otherIdx = 0;
                    return cards.map(task => {
                      const isDragged   = task.id === draggedTaskId;
                      const isSelected  = checkedIds.has(task.id);
                      const priority    = PRIORITY_VISUAL[task.priority];
                      /* Position via CSS order (not DOM order) so the card never
                         remounts as the placeholder moves around it — only its
                         `order` changes, which the browser reflows smoothly.
                         The dragged card keeps its own resting slot (dimmed in
                         place) rather than jumping elsewhere. */
                      const order = otherIdx * 2;
                      if (!isDragged) otherIdx++;
                      return (
                        <div
                          key={task.id}
                          ref={el => {
                            if (el) boardCardRefs.current.set(task.id, el);
                            else boardCardRefs.current.delete(task.id);
                          }}
                          data-board-card={task.id}
                          className={cx(styles.boardCard, isDragged && styles.boardCardDragging)}
                          style={{ borderLeftColor: priority.stroke, order }}
                          onPointerDown={e => handleCardPointerDown(e, task)}
                        >
                          <div className={styles.boardCardTop}>
                            <Badge color={task.categoryColor} labelText={task.category} />
                            <Checkbox
                              checked={isSelected}
                              onChange={c => toggleRow(task.id, c)}
                            />
                          </div>

                          <div className={styles.boardCardMeta}>
                            <Status status={priority.status} labelText={PRIORITY_LABEL[task.priority]} />
                            <div className={styles.boardCardDeadline}>
                              <Icon name="time" size={12} color="var(--text-secondary, #454548)" />
                              <span className={cx(styles.boardCardDeadlineText, task.deadlineOverdue && styles.boardCardDeadlineOverdue)}>
                                {task.deadline ?? 'No deadline'}
                              </span>
                            </div>
                          </div>

                          <div className={styles.boardCardBody}>
                            <p className={styles.boardCardTitle}>{task.name}</p>
                            <p className={styles.boardCardSubtitle}>{task.subtitle}</p>
                          </div>

                          <div className={styles.boardCardFooter}>
                            <div className={styles.boardCardAvatar} aria-hidden="true" />
                            <span className={styles.boardCardResponsible}>{task.responsible}</span>
                          </div>
                        </div>
                      );
                    });
                  })()}

                  {/* Single stable instance — only its `order` changes as you
                      hover different cards, so it slides instead of popping
                      back to zero height and re-growing every time. */}
                  {showPlaceholderAt !== null && (
                    <BoardCardPlaceholder
                      key="placeholder"
                      targetHeight={draggedCardHeight}
                      order={showPlaceholderAt * 2 - 1}
                    />
                  )}
                </div>
              );
              });
            })()}
          </div>
          )}

        </div>{/* /body */}
      </div>{/* /main */}

      {/* ── Drag ghost — follows the pointer while a Kanban card is dragged ──── */}
      {dragPointerPos && dragCardPreview && createPortal(
        <div
          className={styles.boardCardGhost}
          style={{ top: dragPointerPos.y + 12, left: dragPointerPos.x + 12 }}
        >
          <Badge color={dragCardPreview.categoryColor} labelText={dragCardPreview.category} />
          <span className={styles.boardCardGhostTitle}>{dragCardPreview.name}</span>
        </div>,
        document.body,
      )}

      {/* ── More-actions menu portal ──────────────────────────────────────────── */}
      {openMoreId && moreAnchor && createPortal(
        <div
          className={styles.moreMenu}
          style={{
            top:  moreAnchor.bottom + 4,
            left: moreAnchor.right,
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          {[
            { icon: 'edit',    label: 'Edit task', onSelect: () => {
                const task = tasks.find(t => t.id === openMoreId);
                if (task) handleEditTaskOpen(task);
              } },
            { icon: 'copy',    label: 'Duplicate' },
            { icon: 'archive', label: 'Archive' },
            { icon: 'delete',  label: 'Delete',    danger: true },
          ].map(item => (
            <button
              key={item.label}
              type="button"
              className={cx(styles.moreMenuItem, item.danger && styles.moreMenuItemDanger)}
              onMouseDown={() => {
                item.onSelect?.();
                setOpenMoreId(null);
                setMoreAnchor(null);
              }}
            >
              <Icon name={item.icon as never} size={16} color="currentColor" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>,
        document.body,
      )}

      {/* ── Status dropdown menu portal (position:fixed escapes overflow:hidden) */}
      {openStatusId && menuAnchor && createPortal(
        <div
          className={styles.statusMenu}
          style={{
            top:      menuAnchor.bottom + 4,
            left:     menuAnchor.left,
            minWidth: menuAnchor.width,
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          {STATUS_KEYS.map(s => (
            <button
              key={s}
              type="button"
              className={cx(
                styles.statusMenuItem,
                statusMap[openStatusId] === s && styles.statusMenuItemSelected,
              )}
              onMouseDown={() => handleStatusSelect(openStatusId, s)}
            >
              <span
                className={styles.statusBadge}
                style={{ background: STATUS_BG[s], color: STATUS_TEXT_COLOR[s] }}
              >
                {STATUS_LABEL[s]}
              </span>
            </button>
          ))}
        </div>,
        document.body,
      )}

      {/* ── Bulk action bar (floating, bottom-centered) ─────────────────────── */}
      {checkedIds.size > 0 && (
        <div className={styles.bulkBar}>
          <div className={styles.bulkSelectionInfo}>
            <button
              type="button"
              className={styles.bulkCloseBtn}
              onClick={() => setCheckedIds(new Set())}
              aria-label="Clear selection"
            >
              <Icon name="close-small" size={24} color="currentColor" />
            </button>
            <span className={styles.bulkCount}>
              <span className={styles.bulkCountNum}>{checkedIds.size}</span>
              /{viewMode === 'grid' ? filteredTasks.length : pagedTasks.length} selected
            </span>
          </div>

          <div className={styles.bulkActionContainer}>
            <div className={styles.bulkActionGroup}>
              <Button variant="error" size="m" onClick={handleBulkDelete}>Delete</Button>
              <Button variant="secondary" size="m" onClick={handleBulkArchive}>To archive</Button>
            </div>
            <div className={styles.bulkDivider} />
            <Button
              variant="primary"
              size="m"
              leftIcon={<Icon name="add" size={20} />}
              onClick={e => handleAddPersonOpen(e.currentTarget)}
            >
              Add responsible person
            </Button>
          </div>
        </div>
      )}

      {/* ── Add responsible person dropdown portal ──────────────────────────── */}
      {openAddPerson && addPersonAnchor && createPortal(
        <div
          className={styles.statusMenu}
          style={{
            bottom:   window.innerHeight - addPersonAnchor.top + 4,
            left:     addPersonAnchor.left,
            minWidth: addPersonAnchor.width,
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          {PEOPLE.map(p => (
            <button
              key={p.email}
              type="button"
              className={styles.statusMenuItem}
              onMouseDown={() => handleAddPersonSelect(p)}
            >
              <span>{p.name}</span>
            </button>
          ))}
        </div>,
        document.body,
      )}

      {/* ── Deadline calendar popover ────────────────────────────────────────── */}
      {isDeadlineCalendarOpen && deadlineAnchor && createPortal(
        <div
          style={{
            position: 'fixed',
            top:      deadlineAnchor.bottom + 4,
            left:     deadlineAnchor.left,
            zIndex:   300,
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          <Calendar
            mode="single"
            value={parseDDMMYYYY(newTaskDeadline)}
            onChange={date => setNewTaskDeadline(formatDDMMYYYY(date))}
            onApply={() => setIsDeadlineCalendarOpen(false)}
          />
        </div>,
        document.body,
      )}

      {/* ── Create task drawer ───────────────────────────────────────────────── */}
      {isCreateTaskOpen && createPortal(
        <div
          className={styles.createTaskBackdrop}
          onMouseDown={e => {
            if (e.target === e.currentTarget) {
              setIsCreateTaskOpen(false);
              resetCreateTaskForm();
            }
          }}
        >
          <div className={styles.createTaskPanel}>
            <div className={styles.createTaskHeader}>
              <div className={styles.createTaskHeaderMain}>
                <div className={styles.createTaskAvatar} aria-hidden="true" />
                <div className={styles.createTaskHeaderText}>
                  <Tooltip
                    content={editingTaskId ? newTaskName || 'Edit task' : 'New task'}
                    position="bottom"
                    portal
                    className={styles.createTaskTitleTooltip}
                  >
                    <h2 className={styles.createTaskTitle}>{editingTaskId ? newTaskName || 'Edit task' : 'New task'}</h2>
                  </Tooltip>
                  <p className={styles.createTaskSubtitle}>Internal management BookAdmin</p>
                </div>
              </div>
              <Button
                variant="transparent"
                size="m"
                iconOnly
                leftIcon={<Icon name="close-large" size={20} />}
                onClick={() => { setIsCreateTaskOpen(false); resetCreateTaskForm(); }}
                type="button"
                aria-label="Close"
                className={styles.createTaskCloseBtn}
              />
            </div>

            <div className={styles.createTaskBody}>
              <Input
                required
                labelText="Task name"
                placeholder="Enter the main task name"
                value={newTaskName}
                onChange={setNewTaskName}
                state={newTaskName ? 'entered' : 'default'}
                className={styles.createTaskField}
              />
              <TextArea
                labelText="Detailed description"
                placeholder="Add context, steps, or technical requirements"
                value={newTaskDesc}
                onChange={setNewTaskDesc}
                maxChars={250}
                supporting={false}
                state={newTaskDesc ? 'entered' : 'default'}
                className={styles.createTaskField}
              />

              <div className={styles.createTaskGrid2}>
                <Dropdown
                  size="m"
                  label="Category"
                  value={newTaskCategory}
                  onChange={setNewTaskCategory}
                  options={CATEGORY_OPTIONS}
                  placeholder="Default"
                />
                <div ref={deadlineFieldRef}>
                  <Input
                    labelText="Deadline"
                    placeholder="dd/mm/yyyy"
                    value={newTaskDeadline}
                    onChange={setNewTaskDeadline}
                    state={newTaskDeadline ? 'entered' : 'default'}
                    trailingIcon={
                      <button
                        type="button"
                        className={styles.deadlineCalendarToggle}
                        aria-label="Toggle calendar"
                        onClick={() => {
                          if (isDeadlineCalendarOpen) {
                            setIsDeadlineCalendarOpen(false);
                            return;
                          }
                          closeAllMenus();
                          setDeadlineAnchor(deadlineFieldRef.current?.getBoundingClientRect() ?? null);
                          setIsDeadlineCalendarOpen(true);
                        }}
                      >
                        <Icon name="calendar" size={20} />
                      </button>
                    }
                  />
                </div>
                <Dropdown
                  size="m"
                  label="Priority"
                  value={newTaskPriority}
                  onChange={v => setNewTaskPriority(v as Priority)}
                  options={PRIORITY_OPTIONS}
                />
                <Dropdown
                  size="m"
                  label="Status"
                  value={newTaskStage}
                  onChange={v => setNewTaskStage(v as TaskStage)}
                  options={NEW_TASK_STAGE_OPTIONS}
                />
              </div>

              <div className={styles.createTaskResponsible}>
                <span className={styles.createTaskLabel}>Responsible persons</span>
                <div className={styles.createTaskPeopleGrid}>
                  {PEOPLE.map(p => (
                    <CardSelection
                      key={p.email}
                      titleText={p.name}
                      subtitleText="Superadmin"
                      state={newTaskPeople.has(p.email) ? 'selected' : 'default'}
                      onChange={selected => toggleNewTaskPerson(p.email, selected)}
                    />
                  ))}
                </div>
              </div>

              {editingTaskId && (() => {
                const original = tasks.find(t => t.id === editingTaskId);
                if (!original) return null;
                return (
                  <div className={styles.activityHistory}>
                    <span className={styles.createTaskLabel}>Activity history</span>
                    <div className={styles.activityItem}>
                      <div className={styles.activityStep}>
                        <span className={styles.activityStepDot}>
                          <Icon name="check" size={12} color="var(--stepper-default-icon, #a36d00)" />
                        </span>
                        <span className={styles.activityStepLine} />
                      </div>
                      <div className={styles.activityDetails}>
                        <Badge color="white" type="outlined" labelText="Status" />
                        <div className={styles.activityRow}>
                          <div className={styles.activityMain}>
                            <p className={styles.activityTitle}>Task created</p>
                            <div className={styles.activityMeta}>
                              <span className={styles.activityMetaLabel}>Executor:</span>
                              <span className={styles.activityMetaText}>{original.responsible}</span>
                              <Icon name="arrow-right" size={16} color="var(--icon-tertiary, #929297)" />
                            </div>
                          </div>
                          <div className={styles.activityDate}>
                            <span>{original.created}</span>
                            <span className={styles.activityTime}>12:00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className={styles.createTaskFooter}>
              <Button
                variant="secondary"
                size="l"
                onClick={() => { setIsCreateTaskOpen(false); resetCreateTaskForm(); }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="l"
                onClick={handleSubmitTask}
                disabled={!newTaskName.trim()}
              >
                {editingTaskId ? 'Save changes' : 'Create task'}
              </Button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
