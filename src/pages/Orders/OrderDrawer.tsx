import { useState, useEffect } from 'react';
import { Button } from '@components/atoms/Button';
import { Badge } from '@components/atoms/Badge/Badge';
import { Icon } from '@components/atoms/Icon/Icon';
import { SegmentedControl } from '@components/atoms/SegmentedControl';
import { Dropdown } from '@components/atoms/Dropdown';
import { Input } from '@components/atoms/Input';
import { TextArea } from '@components/atoms/TextArea/TextArea';
import type { BadgeColor } from '@components/atoms/Badge/Badge.types';
import type { IconName } from '@components/atoms/Icon/Icon.types';
import styles from './OrderDrawer.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

type OrderStatus = 'New' | 'Processing' | 'Completed' | 'Cancelled';

const STATUS_BADGE_COLOR: Record<OrderStatus, BadgeColor> = {
  'New':        'blue',
  'Processing': 'orange',
  'Completed':  'green',
  'Cancelled':  'red',
};

const STATUS_OPTIONS = (['New', 'Processing', 'Completed', 'Cancelled'] as OrderStatus[]).map(v => ({
  value: v,
  label: v,
  badge: <Badge color={STATUS_BADGE_COLOR[v]} labelText={v} type="filled" />,
}));
const PAYMENT_STATUS_OPTIONS = ['Paid', 'Pending', 'Refunded'].map(v => ({ value: v, label: v }));
const DELIVERY_OPTIONS = ['Nova Poshta', 'Ukrposhta', 'Courier delivery', 'Pickup'].map(v => ({ value: v, label: v }));
const PAYMENT_METHOD_OPTIONS = ['Online', 'Card', 'Cash'].map(v => ({ value: v, label: v }));

export interface DrawerLogEvent {
  id: string;
  badgeLabel: string;
  badgeColor: BadgeColor;
  title: string;
  executor: string;
  date: string;
  time: string;
}

export interface DrawerProduct {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface DrawerOrder {
  id: string;
  client: string;
  phone: string;
  email?: string;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethod: string;
  deliveryCarrier: string;
  deliveryAddress: string;
  trackingNumber?: string;
  date: string;
  time: string;
  products?: DrawerProduct[];
  logEvents?: DrawerLogEvent[];
}

interface OrderDrawerProps {
  order: DrawerOrder | null;
  onClose: () => void;
  onSave?: (updated: DrawerOrder) => void;
}

const TAB_OPTIONS = [
  { value: 'info',      label: 'Information' },
  { value: 'products',  label: 'Products',  badge: 3 },
  { value: 'logistics', label: 'Logistics', badge: 2 },
];

interface FormState {
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  client: string;
  phone: string;
  email: string;
  deliveryCarrier: string;
  deliveryAddress: string;
  trackingNumber: string;
}

function initForm(order: DrawerOrder): FormState {
  return {
    status:          order.status,
    paymentStatus:   order.paymentStatus,
    paymentMethod:   order.paymentMethod,
    client:          order.client,
    phone:           order.phone,
    email:           order.email ?? 'artem.admin@bookstore.com',
    deliveryCarrier: order.deliveryCarrier,
    deliveryAddress: order.deliveryAddress,
    trackingNumber:  order.trackingNumber ?? '# 14565767777333256',
  };
}

export function OrderDrawer({ order, onClose, onSave }: OrderDrawerProps) {
  const [tab, setTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<FormState>(() => order ? initForm(order) : initForm({
    id: '', client: '', phone: '', status: 'New', paymentStatus: '',
    paymentMethod: '', deliveryCarrier: '', deliveryAddress: '', date: '', time: '',
  }));

  useEffect(() => {
    if (order) {
      setTab('info');
      setIsEditing(false);
      setForm(initForm(order));
    }
  }, [order?.id]);

  useEffect(() => {
    if (!order) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditing) setIsEditing(false);
        else onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [order, onClose, isEditing]);

  if (!order) return null;

  const setField = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const fmtUAH = (n: number) =>
    n.toLocaleString('en-US').replace(/,/g, ' ') + ' ₴';

  const handleSave = () => {
    onSave?.({
      ...order,
      status:          form.status as OrderStatus,
      paymentStatus:   form.paymentStatus,
      paymentMethod:   form.paymentMethod,
      client:          form.client,
      phone:           form.phone,
      email:           form.email,
      deliveryCarrier: form.deliveryCarrier,
      deliveryAddress: form.deliveryAddress,
      trackingNumber:  form.trackingNumber,
    });
    setIsEditing(false);
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.panel}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerLeft}>
              <div className={styles.logoPlaceholder} />
              <div className={styles.headerMeta}>
                <div className={styles.titleRow}>
                  <h2 className={styles.titleMain}>Order</h2>
                  <span className={styles.titleId}>{order.id}</span>
                </div>
                <span className={styles.headerDate}>{order.date} • {order.time}</span>
              </div>
            </div>
            <Button
              variant="transparent"
              size="m"
              iconOnly
              leftIcon={<Icon name="close-large" size={20} />}
              onClick={onClose}
              type="button"
              aria-label="Close"
              className={styles.closeBtn}
            />
          </div>

          <SegmentedControl
            value={tab}
            onChange={setTab}
            options={TAB_OPTIONS}
            label="Order section"
            className={styles.tabs}
          />
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        {tab === 'products' ? (
          <div className={styles.body}>
            <div className={styles.productsSection}>
              <span className={styles.sectionLabel}>Responsible persons</span>
              <div className={styles.productList}>
                {(order.products ?? []).map((p, i, arr) => (
                  <div
                    key={p.id}
                    className={cx(styles.productRow, i < arr.length - 1 && styles.productRowBordered)}
                  >
                    <div className={styles.productThumb} />
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>{p.name}</span>
                      <span className={styles.productSub}>{fmtUAH(p.price)} * {p.qty}</span>
                    </div>
                    <span className={styles.productPrice}>{fmtUAH(p.price * p.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : tab === 'logistics' ? (
          <div className={styles.body}>
            <div className={styles.logisticsSection}>
              <span className={styles.sectionLabel}>Event list</span>
              <div className={styles.eventList}>
                {(order.logEvents ?? []).map((evt, i, arr) => {
                  const isFirst = i === 0;
                  const isLast = i === arr.length - 1;
                  return (
                    <div key={evt.id} className={cx(styles.eventRow, !isFirst && styles.eventRowEnd)}>
                      <div className={cx(styles.stepCol, isFirst && styles.stepColFirst)}>
                        {!isFirst && <div className={styles.stepLineTop} />}
                        <div className={cx(styles.stepCircle, isLast && styles.stepCircleActive)}>
                          <StepCheck active={isLast} />
                        </div>
                        <div className={cx(styles.stepLineBottom, isFirst && styles.stepLineBottomFlex, isLast && styles.stepLineBottomHidden)} />
                      </div>
                      <div className={styles.eventContent}>
                        <Badge
                          color={evt.badgeColor}
                          labelText={evt.badgeLabel}
                          type="outlined"
                        />
                        <div className={styles.eventInfo}>
                          <div className={styles.eventMeta}>
                            <span className={styles.eventTitle}>{evt.title}</span>
                            <div className={styles.eventExecutorRow}>
                              <span className={styles.eventExecutorLabel}>Assignee:</span>
                              <a className={styles.eventExecutorLink}>{evt.executor}</a>
                              <Icon name="arrow-right" size={16} />
                            </div>
                          </div>
                          <div className={styles.eventDate}>
                            <span className={styles.eventDatePrimary}>{evt.date}</span>
                            <span className={styles.eventDateSecondary}>{evt.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : isEditing ? (
          <div className={styles.body}>

            <InfoRow icon="signpost" label="Status">
              <Dropdown
                size="m"
                value={form.status}
                onChange={v => setField('status', v)}
                options={STATUS_OPTIONS}
                className={styles.statusDropdown}
              />
            </InfoRow>

            <div className={styles.divider} />

            <InfoRow icon="money" label="Payment" alignStart>
              <div className={styles.formRow}>
                <Dropdown
                  size="m"
                  value={form.paymentStatus}
                  onChange={v => setField('paymentStatus', v)}
                  options={PAYMENT_STATUS_OPTIONS}
                  label="Status"
                  className={styles.formField}
                />
                <Dropdown
                  size="m"
                  value={form.paymentMethod}
                  onChange={v => setField('paymentMethod', v)}
                  options={PAYMENT_METHOD_OPTIONS}
                  label="Method"
                  className={styles.formField}
                />
              </div>
            </InfoRow>

            <div className={styles.divider} />

            <InfoRow icon="user" label="Customer" alignStart>
              <div className={styles.formStack}>
                <Input
                  value={form.client}
                  onChange={v => setField('client', v)}
                  label
                  labelText="Customer full name"
                  state={form.client ? 'entered' : 'default'}
                  autoComplete="off"
                  className={styles.fullWidth}
                />
                <Input
                  value={form.phone}
                  onChange={v => setField('phone', v)}
                  label
                  labelText="Contact number"
                  state={form.phone ? 'entered' : 'default'}
                  autoComplete="off"
                  className={styles.fullWidth}
                />
                <Input
                  value={form.email}
                  onChange={v => setField('email', v)}
                  label
                  labelText="Email"
                  state={form.email ? 'entered' : 'default'}
                  autoComplete="off"
                  className={styles.fullWidth}
                />
              </div>
            </InfoRow>

            <div className={styles.divider} />

            <InfoRow icon="bike" label="Delivery" alignStart>
              <div className={styles.formStack}>
                <Dropdown
                  size="m"
                  value={form.deliveryCarrier}
                  onChange={v => setField('deliveryCarrier', v)}
                  options={DELIVERY_OPTIONS}
                  label="Delivery method"
                  className={styles.deliveryDropdown}
                />
                <TextArea
                  value={form.deliveryAddress}
                  onChange={v => setField('deliveryAddress', v)}
                  label
                  labelText="Delivery address"
                  state={form.deliveryAddress ? 'entered' : 'default'}
                  maxChars={80}
                  supporting={false}
                  className={styles.fullWidth}
                />
              </div>
            </InfoRow>

            <div className={styles.divider} />

            <InfoRow icon="barcode" label="Logistics">
              <Input
                value={form.trackingNumber}
                onChange={v => setField('trackingNumber', v)}
                label
                labelText="Tracking number"
                state={form.trackingNumber ? 'entered' : 'default'}
                className={styles.fullWidth}
              />
            </InfoRow>

          </div>
        ) : (
          <div className={styles.body}>

            <InfoRow icon="signpost" label="Status">
              <Badge
                color={STATUS_BADGE_COLOR[order.status]}
                labelText={order.status}
                type="outlined"
              />
            </InfoRow>

            <div className={styles.divider} />

            <InfoRow icon="money" label="Payment">
              <span className={styles.valueText}>{order.paymentStatus}, {order.paymentMethod}</span>
            </InfoRow>

            <div className={styles.divider} />

            <InfoRow icon="user" label="Customer" alignStart>
              <div className={styles.clientBlock}>
                <div className={styles.clientNameRow}>
                  <span className={styles.clientName}>{order.client}</span>
                  <Icon name="arrow-right" size={16} />
                </div>
                <span className={styles.clientPhone}>{order.phone}</span>
                <span className={styles.clientEmail}>{order.email ?? 'artem.admin@bookstore.com'}</span>
              </div>
            </InfoRow>

            <div className={styles.divider} />

            <InfoRow icon="bike" label="Delivery" alignStart>
              <div className={styles.stackBlock}>
                <span className={styles.valueText}>{order.deliveryCarrier}</span>
                <span className={styles.subText}>{order.deliveryAddress}</span>
              </div>
            </InfoRow>

            <div className={styles.divider} />

            <InfoRow icon="barcode" label="Logistics" alignStart>
              <div className={styles.stackBlock}>
                <span className={styles.valueText}>Tracking number</span>
                <div className={styles.trackRow}>
                  <span className={styles.subText}>{order.trackingNumber ?? '# 14565767777333256'}</span>
                  <Icon name="external-link" size={16} />
                </div>
              </div>
            </InfoRow>

          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className={styles.footer}>
          {tab === 'products' || tab === 'logistics' ? (
            <>
              <Button variant="secondary" size="l" leftIcon={<Icon name="printer" size={20} />} type="button">
                Print waybill
              </Button>
              <Button variant="secondary" size="l" leftIcon={<Icon name="edit" size={20} />} type="button">
                Edit order
              </Button>
            </>
          ) : isEditing ? (
            <Button variant="primary" size="l" type="button" onClick={handleSave}>
              Save changes
            </Button>
          ) : (
            <>
              <Button variant="secondary" size="l" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button variant="secondary" size="l" type="button" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="primary" size="l" type="button">
                Create task
              </Button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

function StepCheck({ active }: { active: boolean }) {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
      <path
        d="M1 5L4.5 8.5L11.5 1"
        stroke={active ? '#5b3d00' : '#a36d00'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoRow({
  icon,
  label,
  children,
  alignStart = false,
}: {
  icon: IconName;
  label: string;
  children: React.ReactNode;
  alignStart?: boolean;
}) {
  return (
    <div className={cx(styles.infoRow, alignStart && styles.infoRowTop)}>
      <div className={styles.infoLabel}>
        <Icon name={icon} size={20} />
        <span className={styles.labelText}>{label}</span>
      </div>
      <div className={styles.infoValue}>{children}</div>
    </div>
  );
}
