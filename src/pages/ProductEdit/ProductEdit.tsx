import { useState, useEffect } from 'react';
import { Button } from '@components/atoms/Button';
import { Icon } from '@components/atoms/Icon';
import { Input } from '@components/atoms/Input';
import { TextArea } from '@components/atoms/TextArea';
import { Dropdown } from '@components/atoms/Dropdown';
import { RadioButton } from '@components/atoms/RadioButton';
import { SegmentedControl } from '@components/atoms/SegmentedControl';
import { Badge } from '@components/atoms/Badge';
import styles from './ProductEdit.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const parsePrice = (s: string) => parseFloat(s.replace(/[^\d.]/g, '')) || 0;

const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => {
  const y = String(2024 - i);
  return { value: y, label: y };
});
const BINDING_OPTIONS = [
  { value: 'soft',   label: 'Softcover' },
  { value: 'hard',   label: 'Hardcover' },
  { value: 'spiral', label: 'Spiral-bound' },
];
const LANG_OPTIONS = [
  { value: 'ua', label: 'Ukrainian' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
];
const CATEGORY_OPTIONS = [
  { value: 'programming', label: 'Programming' },
  { value: 'fiction',     label: 'Sci-Fi' },
  { value: 'self-dev',    label: 'Self-help' },
  { value: 'classic',     label: 'Classics' },
  { value: 'non-fiction', label: 'Non-fiction' },
  { value: 'ukrainian',   label: 'Ukrainian lit.' },
  { value: 'poetry',      label: 'Poetry' },
  { value: 'business',    label: 'Business' },
  { value: 'philosophy',  label: 'Philosophy' },
];
const AUTHOR_OPTIONS = [
  { value: 'shevchenko', label: 'Taras Shevchenko' },
  { value: 'franko',     label: 'Ivan Franko' },
  { value: 'lesia',      label: 'Lesya Ukrainka' },
  { value: 'martin',     label: 'Robert C. Martin' },
  { value: 'rowling',    label: 'J.K. Rowling' },
  { value: 'orwell',     label: 'George Orwell' },
];
const PUBLISHER_OPTIONS = [
  { value: 'staryi-lev',  label: 'Staryi Lev' },
  { value: 'a-ba-ba',     label: 'A-BA-BA-HA-LA-MA-HA' },
  { value: 'nash-format', label: 'Nash Format' },
  { value: 'folio',       label: 'Folio' },
];
const SERIES_OPTIONS = [
  { value: 'world-classic', label: 'World classics' },
  { value: 'modern-uk',     label: 'Contemporary Ukrainian' },
  { value: 'tech-books',    label: 'Tech Books' },
];

/* ── Progress calculation ─────────────────────────────────────────────────── */
function calcProgress(fields: {
  productType: string; title: string; category: string; slug: string;
  author: string; purchasePrice: string; salePrice: string;
}) {
  const required = [
    fields.productType,
    fields.title.trim(),
    fields.category,
    fields.slug.trim(),
    fields.author,
    fields.purchasePrice.trim(),
    fields.salePrice.trim(),
  ];
  const filled = required.filter(Boolean).length;
  return Math.round((filled / required.length) * 100);
}

/* ── AI sparkle button ────────────────────────────────────────────────────── */
function AiBtn() {
  return (
    <button className={styles.aiBtn} type="button" aria-label="AI generation">
      <Icon name="ai" size={16} />
    </button>
  );
}

/* ── Dashed divider ───────────────────────────────────────────────────────── */
function Divider() {
  return <div className={styles.divider} />;
}

/* ── Section title ────────────────────────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className={styles.sectionTitle}>{children}</p>;
}

/* ── Product type card ────────────────────────────────────────────────────── */
function TypeCard({
  label, selected, name, value, onChange,
}: { label: string; selected: boolean; name: string; value: string; onChange: () => void }) {
  return (
    <label className={cx(styles.typeCard, selected && styles.typeCardSelected)} onClick={onChange}>
      <div className={styles.typeCardThumb} />
      <span className={styles.typeCardLabel}>{label}</span>
      <RadioButton selected={selected} name={name} value={value} onChange={onChange} />
    </label>
  );
}

/* ══ ProductEdit ════════════════════════════════════════════════════════════ */
export function ProductEdit({ onClose }: { onClose?: () => void }) {
  const [activeTab, setActiveTab] = useState('main');
  const [productType, setProductType] = useState('book');

  /* ── Form state ─────────────────────────────────────────────────────────── */
  const [title, setTitle]               = useState('');
  const [category, setCategory]         = useState('');
  const [slug, setSlug]                 = useState('');
  const [shortDesc, setShortDesc]       = useState('');
  const [fullDesc, setFullDesc]         = useState('');
  const [author, setAuthor]             = useState('');
  const [publisher, setPublisher]       = useState('');
  const [isbn, setIsbn]                 = useState('978-966-7047-45-2');
  const [year, setYear]                 = useState('');
  const [binding, setBinding]           = useState('');
  const [language, setLanguage]         = useState('');
  const [series, setSeries]             = useState('');
  const [pages, setPages]               = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice]       = useState('');
  const [promoPrice, setPromoPrice]     = useState('');

  /* ── Close on Escape ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  /* ── Derived ─────────────────────────────────────────────────────────────── */
  const progress = calcProgress({ productType, title, category, slug, author, purchasePrice, salePrice });
  const profit = salePrice && purchasePrice
    ? parsePrice(salePrice) - parsePrice(purchasePrice)
    : 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>

        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            {/* Book meta */}
            <div className={styles.headerMeta}>
              <div className={styles.bookThumb} />
              <div className={styles.bookInfo}>
                <p className={styles.bookTitle}>Product</p>
                <p className={styles.bookIsbn}>{isbn || '978-966-7047-45-2'}</p>
              </div>
            </div>
            {/* Close */}
            <button className={styles.closeBtn} type="button" onClick={onClose} aria-label="Close">
              <Icon name="close-large" size={20} />
            </button>
          </div>

          {/* Tabs */}
          <SegmentedControl
            value={activeTab}
            onChange={setActiveTab}
            label="Product sections"
            options={[
              { value: 'main',     label: 'Basic information' },
              { value: 'variants', label: 'Variants & Inventory', badge: 3 },
              { value: 'seo',      label: 'SEO', badge: 2 },
            ]}
          />
        </div>

        {/* ── MAIN CONTENT (scrollable) ──────────────────────────────────────── */}
        <div className={styles.content}>

          {/* ── Product type ──────────────────────────────────────────────────── */}
          <div className={styles.formSection}>
            <div className={styles.fieldGroup}>
              <p className={styles.fieldLabel}>
                Product type <span className={styles.required}>*</span>
              </p>
              <div className={styles.typeGrid}>
                <TypeCard
                  label="Book"
                  selected={productType === 'book'}
                  name="productType"
                  value="book"
                  onChange={() => setProductType('book')}
                />
                <TypeCard
                  label="Stationery"
                  selected={productType === 'stationery'}
                  name="productType"
                  value="stationery"
                  onChange={() => setProductType('stationery')}
                />
              </div>
            </div>
          </div>

          <Divider />

          {/* ── Basic data ────────────────────────────────────────────────── */}
          <div className={styles.formSection}>
            <SectionTitle>Basic data</SectionTitle>
            <div className={styles.fieldsBlock}>

              {/* Row 1: Title | Category | URL slug */}
              <div className={styles.row3}>
                <Input
                  label
                  labelText="Product title *"
                  placeholder="e.g. Kobzar"
                  value={title}
                  onChange={setTitle}
                  className={styles.flex1}
                />
                <Dropdown
                  size="m"
                  label="Category *"
                  placeholder="—"
                  value={category}
                  onChange={setCategory}
                  options={CATEGORY_OPTIONS}
                  className={styles.flex1}
                />
                <div className={cx(styles.flex1, styles.inputWithAi)}>
                  <Input
                    label
                    labelText="URL slug *"
                    disclaimer
                    placeholder="kobzar-taras-shevchenko"
                    value={slug}
                    onChange={setSlug}
                    className={styles.fullWidth}
                  />
                  <AiBtn />
                </div>
              </div>

              {/* Short description */}
              <TextArea
                label
                labelText="Short description"
                placeholder="Short description for the catalog (1-2 sentences)"
                value={shortDesc}
                onChange={setShortDesc}
                maxChars={80}
                className={styles.textAreaShort}
              />

              {/* Full description */}
              <div className={styles.inputWithAi}>
                <TextArea
                  label
                  labelText="Full description"
                  placeholder="Detailed product description with formatting support..."
                  value={fullDesc}
                  onChange={setFullDesc}
                  maxChars={80}
                  className={styles.textAreaFull}
                />
                <AiBtn />
              </div>

            </div>
          </div>

          <Divider />

          {/* ── Specific attributes ─────────────────────────────────────────── */}
          <div className={styles.formSection}>
            <SectionTitle>Specific attributes</SectionTitle>
            <div className={styles.fieldsBlock}>

              {/* Row: Author | Publisher | ISBN */}
              <div className={styles.row3}>
                <Dropdown
                  size="m"
                  label="Author *"
                  placeholder="Start typing a name..."
                  value={author}
                  onChange={setAuthor}
                  options={AUTHOR_OPTIONS}
                  className={styles.flex1}
                />
                <Dropdown
                  size="m"
                  label="Publisher"
                  placeholder="Select or create"
                  value={publisher}
                  onChange={setPublisher}
                  options={PUBLISHER_OPTIONS}
                  className={styles.flex1}
                />
                <div className={cx(styles.flex1, styles.inputWithAi)}>
                  <Input
                    label
                    labelText="ISBN"
                    disclaimer
                    placeholder="978-966-7047-45-2"
                    value={isbn}
                    onChange={setIsbn}
                    className={styles.fullWidth}
                  />
                  <AiBtn />
                </div>
              </div>

              {/* Row: Year | Binding | Language */}
              <div className={styles.row3}>
                <Dropdown
                  size="m"
                  label="Publication year"
                  placeholder="2024"
                  value={year}
                  onChange={setYear}
                  options={YEAR_OPTIONS}
                  className={styles.flex1}
                />
                <Dropdown
                  size="m"
                  label="Binding"
                  placeholder="—"
                  value={binding}
                  onChange={setBinding}
                  options={BINDING_OPTIONS}
                  className={styles.flex1}
                />
                <Dropdown
                  size="m"
                  label="Language"
                  placeholder="—"
                  value={language}
                  onChange={setLanguage}
                  options={LANG_OPTIONS}
                  className={styles.flex1}
                />
              </div>

              {/* Row: Series | Number of pages */}
              <div className={styles.row2half}>
                <Dropdown
                  size="m"
                  label="Series"
                  placeholder="World classics"
                  value={series}
                  onChange={setSeries}
                  options={SERIES_OPTIONS}
                  className={styles.halfCol}
                />
                <Input
                  label
                  labelText="Number of pages"
                  placeholder="256"
                  value={pages}
                  onChange={setPages}
                  type="number"
                  min="1"
                  className={styles.halfCol}
                />
              </div>

            </div>
          </div>

          <Divider />

          {/* ── Pricing ──────────────────────────────────────────────── */}
          <div className={styles.formSection}>
            <SectionTitle>Pricing</SectionTitle>
            <div className={styles.fieldsBlock}>
              <div className={styles.row3}>
                <Input
                  label
                  labelText="Purchase price ₴ *"
                  placeholder="256"
                  value={purchasePrice}
                  onChange={setPurchasePrice}
                  type="number"
                  min="0"
                  className={styles.flex1}
                />
                <div className={cx(styles.flex1, styles.priceWithBadge)}>
                  <Input
                    label
                    labelText="Sale price ₴ *"
                    placeholder="600"
                    value={salePrice}
                    onChange={setSalePrice}
                    type="number"
                    min="0"
                    className={styles.fullWidth}
                  />
                  {profit > 0 && (
                    <span className={styles.profitBadge}>+{profit}</span>
                  )}
                </div>
                <Input
                  label
                  labelText="Promo price"
                  placeholder="256"
                  value={promoPrice}
                  onChange={setPromoPrice}
                  type="number"
                  min="0"
                  className={styles.flex1}
                />
              </div>
            </div>
          </div>

        </div>

        {/* ── PROGRESS BAR ────────────────────────────────────────────────────── */}
        <div className={styles.progressBar}>
          <div className={styles.progressLabel}>
            <span className={styles.progressText}>Fields completed</span>
            <span className={styles.progressPct}>{progress}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <Button
              variant="secondary"
              size="l"
              leftIcon={<Icon name="eye" size={20} />}
              type="button"
            >
              Preview
            </Button>
            <Button variant="secondary" size="l" type="button">
              Save as draft
            </Button>
          </div>
          <Button variant="primary" size="l" type="button">
            Update
          </Button>
        </div>

      </div>
    </div>
  );
}
