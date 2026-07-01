import type { SidebarProps, SidebarNavItem } from './Sidebar.types';
import { MenuItem } from '../MenuItem';
import { Icon } from '../Icon';
import styles from './Sidebar.module.css';

const cx = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(' ');

/* Single nav/footer row — handles both expanded (complex) and folded (icon-button) */
function NavRow({ item, folded }: { item: SidebarNavItem; folded: boolean }) {
  const state = item.danger ? 'danger' : item.selected ? 'selected' : 'default';
  return (
    <MenuItem
      type={folded ? 'icon-button' : 'complex'}
      state={state}
      label={item.label}
      icon={<Icon name={item.icon} size={20} />}
      badge={!folded && item.badge !== undefined}
      badgeCount={item.badge}
      onClick={item.onClick}
      /* full-width in expanded mode overrides the fixed 239px */
      style={folded ? undefined : { width: '100%' }}
    />
  );
}

export function Sidebar({
  folded = false,
  onToggleFold,
  logo,
  appName = 'BookStore',
  navItems = [],
  bottomItems = [],
  user,
  onLogout,
  className,
}: SidebarProps) {
  return (
    <div className={cx(styles.sidebar, folded ? styles.folded : styles.expanded, className)}>

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <div className={cx(styles.header, folded ? styles.headerFolded : styles.headerExpanded)}>
        {folded ? (
          <button
            className={styles.foldBtn}
            onClick={onToggleFold}
            aria-label="Expand sidebar"
          >
            <Icon name="sidebar-unfold" size={24} />
          </button>
        ) : (
          <>
            <div className={styles.logoRow}>
              <div className={styles.logo}>{logo}</div>
              {appName && <span className={styles.appName}>{appName}</span>}
            </div>
            <button
              className={styles.foldBtn}
              onClick={onToggleFold}
              aria-label="Collapse sidebar"
            >
              <Icon name="sidebar-fold" size={24} />
            </button>
          </>
        )}
      </div>

      {/* ══ NAVIGATION ══════════════════════════════════════════════════════ */}
      <div className={styles.nav}>
        <div className={styles.navList}>
          {navItems.map((item) => (
            <NavRow key={item.id} item={item} folded={folded} />
          ))}
        </div>
      </div>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <div className={styles.footer}>

        {/* Utility items: Settings, Help… */}
        {bottomItems.length > 0 && (
          <div className={styles.footerList}>
            {bottomItems.map((item) => (
              <NavRow key={item.id} item={item} folded={folded} />
            ))}
          </div>
        )}

        {/* User info */}
        {user && (
          folded ? (
            /* Collapsed — just the avatar square */
            <div className={styles.avatar}>{user.initials}</div>
          ) : (
            /* Expanded — white card with avatar + name + role */
            <div className={styles.userCard}>
              <div className={styles.avatar}>{user.initials}</div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userRole}>{user.role}</span>
              </div>
            </div>
          )
        )}

        {/* Divider */}
        <div className={styles.divider} />

        {/* Log out */}
        <MenuItem
          type={folded ? 'icon-button' : 'complex'}
          state="danger"
          label="Log out"
          icon={<Icon name="logout" size={20} />}
          onClick={onLogout}
          style={folded ? undefined : { width: '100%' }}
        />
      </div>
    </div>
  );
}
