import { useState, useEffect } from 'react';
import { Button } from '@components/atoms/Button';
import { Icon } from '@components/atoms/Icon';
import { Input } from '@components/atoms/Input';
import { TextArea } from '@components/atoms/TextArea';
import { Dropdown } from '@components/atoms/Dropdown';
import { RadioButton } from '@components/atoms/RadioButton';
import { SegmentedControl } from '@components/atoms/SegmentedControl';
import { Checkbox } from '@components/atoms/Checkbox/Checkbox';
import { MediaGallery } from './MediaGallery';
import styles from './ProductEdit.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

/* ── Static data ─────────────────────────────────────────────────────────── */
const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => {
  const y = String(2024 - i);
  return { value: y, label: y };
});

const BINDING_OPTIONS = [
  { value: 'soft',   label: 'Soft cover' },
  { value: 'hard',   label: 'Hard cover' },
  { value: 'spiral', label: 'Spiral' },
];

const LANG_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ua', label: 'Ukrainian' },
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
  { value: 'lesia',      label: 'Lesia Ukrainka' },
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
  { value: 'world-classic', label: 'World Classics' },
  { value: 'modern-uk',     label: 'Modern Ukrainian' },
  { value: 'tech-books',    label: 'Tech Books' },
];

const BRAND_OPTIONS = [
  { value: 'buromax',     label: 'Buromax' },
  { value: 'kite',        label: 'Kite' },
  { value: 'maxi',        label: 'Maxi' },
  { value: 'panta-plast', label: 'Panta Plast' },
  { value: 'axent',       label: 'Axent' },
];

/* ── Progress ────────────────────────────────────────────────────────────── */
function calcProgress(fields: {
  productType: string; title: string; category: string; slug: string;
  author: string; brand: string; purchasePrice: string; salePrice: string;
}) {
  const typeSpecific = fields.productType === 'stationery' ? fields.brand : fields.author;
  const required = [
    fields.productType,
    fields.title.trim(),
    fields.category,
    fields.slug.trim(),
    typeSpecific,
    fields.purchasePrice.trim(),
    fields.salePrice.trim(),
  ];
  const filled = required.filter(Boolean).length;
  return Math.round((filled / required.length) * 100);
}

/* ── Sub-components ──────────────────────────────────────────────────────── */
function AiBtn() {
  return (
    <button className={styles.aiBtn} type="button" aria-label="AI generation">
      <Icon name="ai" size={16} />
    </button>
  );
}

function Divider() {
  return <div className={styles.divider} />;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className={styles.sectionTitle}>{children}</p>;
}

function BoxIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4L28 10L16 16L4 10L16 4Z" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M4 10L16 16V28L4 22V10Z" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M28 10L16 16V28L28 22V10Z" fill="#C4B5FD" stroke="#7C3AED" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function TypeCard({
  label, selected, name, value, onChange,
}: { label: string; selected: boolean; name: string; value: string; onChange: () => void }) {
  return (
    <div
      className={cx(styles.typeCard, selected && styles.typeCardSelected)}
      onClick={onChange}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') onChange(); }}
    >
      <div className={styles.typeCardThumb} />
      <span className={styles.typeCardLabel}>{label}</span>
      <RadioButton selected={selected} name={name} value={value} onChange={onChange} />
    </div>
  );
}

function FieldLabel({ children, required, info }: {
  children: React.ReactNode;
  required?: boolean;
  info?: boolean;
}) {
  return (
    <div className={styles.customLabel}>
      <span className={styles.customLabelText}>{children}</span>
      {required && <span className={styles.required}> *</span>}
      {info && <Icon name="info" size={16} className={styles.infoIcon} />}
    </div>
  );
}

/* ── Variant type ────────────────────────────────────────────────────────── */
type Variant = {
  id: string;
  checked: boolean;
  image?: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
};

function createVariant(): Variant {
  return { id: crypto.randomUUID(), checked: false, name: '', sku: '', price: '0', stock: '0' };
}

/* ── VariantsTable ───────────────────────────────────────────────────────── */
function VariantsTable({
  variants,
  onUpdate,
  onDelete,
  onDuplicate,
  onToggleAll,
  onToggle,
  onOpenMediaGallery,
}: {
  variants: Variant[];
  onUpdate: (id: string, field: keyof Variant, value: string | boolean) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  onToggle: (id: string) => void;
  onOpenMediaGallery: () => void;
}) {
  const allChecked = variants.length > 0 && variants.every(v => v.checked);

  return (
    <div className={styles.variantsTable}>
      {/* Header row */}
      <div className={styles.variantsRow}>
        <div className={styles.variantsCellCheckHdr}>
          <Checkbox
            checked={allChecked}
            indeterminate={!allChecked && variants.some(v => v.checked)}
            onChange={onToggleAll}
          />
        </div>
        <div className={cx(styles.variantsCellNum, styles.variantsHeaderCell)}>
          <span className={styles.variantsHeaderText}>№</span>
        </div>
        <div className={styles.variantsCellImgHdr} />
        <div className={cx(styles.variantsCellName, styles.variantsHeaderCell)}>
          <span className={styles.variantsHeaderText}>Variant name</span>
        </div>
        <div className={cx(styles.variantsCellSku, styles.variantsHeaderCell)}>
          <span className={styles.variantsHeaderText}>SKU</span>
          <Icon name="ai" size={16} color="var(--icon-accent)" className={styles.variantsCellSkuIcon} />
        </div>
        <div className={cx(styles.variantsCellPrice, styles.variantsHeaderCell)}>
          <span className={styles.variantsHeaderText}>Price ₴</span>
        </div>
        <div className={cx(styles.variantsCellStock, styles.variantsHeaderCell)}>
          <span className={styles.variantsHeaderText}>Stock</span>
        </div>
        <div className={styles.variantsCellActionsHdr} />
      </div>

      {/* Data rows */}
      {variants.map((v, idx) => (
        <div key={v.id} className={styles.variantsRow}>
          <div className={styles.variantsCellCheck}>
            <Checkbox
              checked={v.checked}
              onChange={() => onToggle(v.id)}
            />
          </div>
          <div className={cx(styles.variantsCellNum, styles.variantsDataCell)}>
            <span className={styles.variantsNumText}>{idx + 1}</span>
          </div>
          <div className={styles.variantsCellImg}>
            {v.image ? (
              <img
                src={v.image}
                alt="variant"
                className={styles.variantsImgThumb}
                onClick={onOpenMediaGallery}
              />
            ) : (
              <button
                type="button"
                className={styles.variantsImgUpload}
                onClick={onOpenMediaGallery}
                aria-label="Upload image"
              >
                <Icon name="download" size={20} color="var(--icon-tertiary, #747479)" />
              </button>
            )}
          </div>
          <div className={cx(styles.variantsCellName, styles.variantsDataCell)}>
            <input
              className={styles.variantsInput}
              placeholder="e.g. Blue color"
              value={v.name}
              onChange={e => onUpdate(v.id, 'name', e.target.value)}
            />
          </div>
          <div className={cx(styles.variantsCellSku, styles.variantsDataCell)}>
            <input
              className={styles.variantsInput}
              placeholder="-"
              value={v.sku}
              onChange={e => onUpdate(v.id, 'sku', e.target.value)}
            />
          </div>
          <div className={cx(styles.variantsCellPrice, styles.variantsDataCell)}>
            <input
              className={styles.variantsInput}
              type="number"
              min="0"
              placeholder="0"
              value={v.price}
              onChange={e => onUpdate(v.id, 'price', e.target.value)}
            />
          </div>
          <div className={cx(styles.variantsCellStock, styles.variantsDataCell)}>
            <input
              className={styles.variantsInput}
              type="number"
              min="0"
              placeholder="0"
              value={v.stock}
              onChange={e => onUpdate(v.id, 'stock', e.target.value)}
            />
          </div>
          <div className={cx(styles.variantsCellActions, styles.variantsDataCell)}>
            <Button
              variant="ghost"
              size="s"
              iconOnly
              leftIcon={<Icon name="copy" size={16} />}
              type="button"
              aria-label="Duplicate"
              onClick={() => onDuplicate(v.id)}
            />
            <Button
              variant="ghost"
              size="s"
              iconOnly
              leftIcon={<Icon name="delete-bin" size={16} />}
              type="button"
              aria-label="Delete"
              onClick={() => onDelete(v.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══ ProductEdit ════════════════════════════════════════════════════════════ */
export function ProductEdit({ onClose }: { onClose?: () => void }) {
  const [activeTab, setActiveTab]   = useState('main');
  const [productType, setProductType] = useState('book');
  const [variants, setVariants] = useState<Variant[]>([]);
  const [showMediaGallery, setShowMediaGallery] = useState(false);

  function addVariant() {
    setVariants(prev => [...prev, createVariant()]);
  }

  function updateVariant(id: string, field: keyof Variant, value: string | boolean) {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  }

  function deleteVariant(id: string) {
    setVariants(prev => prev.filter(v => v.id !== id));
  }

  function duplicateVariant(id: string) {
    setVariants(prev => {
      const idx = prev.findIndex(v => v.id === id);
      if (idx === -1) return prev;
      const copy = { ...prev[idx], id: crypto.randomUUID(), checked: false };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  }

  function toggleAll(checked: boolean) {
    setVariants(prev => prev.map(v => ({ ...v, checked })));
  }

  function toggleVariant(id: string) {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, checked: !v.checked } : v));
  }

  const [metaTitle, setMetaTitle]       = useState('');
  const [metaDesc, setMetaDesc]         = useState('');

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
  const [brand, setBrand]               = useState('');
  const [sku, setSku]                   = useState('');
  const [color, setColor]               = useState('');
  const [color2, setColor2]             = useState('');
  const [material, setMaterial]         = useState('');
  const [qtyPerPack, setQtyPerPack]     = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice]       = useState('');
  const [promoPrice, setPromoPrice]     = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const progress    = calcProgress({ productType, title, category, slug, author, brand, purchasePrice, salePrice });
  const purchaseNum = parseFloat(purchasePrice) || 0;
  const saleNum     = parseFloat(salePrice) || 0;
  const profit      = purchaseNum && saleNum ? Math.round(saleNum - purchaseNum) : 0;

  return (
    <>
    {showMediaGallery && <MediaGallery onClose={() => setShowMediaGallery(false)} />}
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerMeta}>
              <div className={styles.bookThumb} />
              <div className={styles.bookInfo}>
                <p className={styles.bookTitle}>Product</p>
                <p className={styles.bookIsbn}>{isbn}</p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.closeBtn}
                type="button"
                onClick={onClose}
                aria-label="Close"
              >
                <Icon name="close-large" size={20} />
              </button>
            </div>
          </div>

          <SegmentedControl
            value={activeTab}
            onChange={setActiveTab}
            label="Product sections"
            className={styles.tabBar}
            options={[
              { value: 'main',     label: 'General info' },
              { value: 'variants', label: 'Variants & Inventory', ...(productType === 'book' ? { badge: 3 } : {}) },
              { value: 'seo',      label: 'SEO', ...(productType === 'book' ? { badge: 2 } : {}) },
            ]}
          />
        </div>

        {/* ── CONTENT ─────────────────────────────────────────────────────── */}
        <div className={styles.content}>
        {activeTab === 'variants' && (
          <>
            {/* ── Variants & Inventory ──────────────────────────────────────── */}
            <div className={styles.variantsSectionHeader}>
              <div className={styles.variantsTitleGroup}>
                <span className={styles.variantsSectionTitle}>Variants &amp; Inventory</span>
                <Icon name="info" size={18} className={styles.infoIcon} />
              </div>
              <Button
                variant="ghost"
                size="m"
                leftIcon={<Icon name="add" size={16} />}
                type="button"
                onClick={addVariant}
              >
                Add product
              </Button>
            </div>

            {variants.length === 0 ? (
              <div className={styles.emptyCard}>
                <div className={styles.emptyCardInner}>
                  <div className={styles.boxIconWrap}>
                    <BoxIcon />
                  </div>
                  <div className={styles.emptyTextGroup}>
                    <p className={styles.emptyTitle}>No variants</p>
                    <p className={styles.emptyDesc}>
                      Add variants if the product has different versions (color, size, format)
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="l"
                    leftIcon={<Icon name="add" size={20} />}
                    type="button"
                    onClick={addVariant}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ) : (
              <VariantsTable
                variants={variants}
                onUpdate={updateVariant}
                onDelete={deleteVariant}
                onDuplicate={duplicateVariant}
                onToggleAll={toggleAll}
                onToggle={toggleVariant}
                onOpenMediaGallery={() => setShowMediaGallery(true)}
              />
            )}
          </>
        )}
        {activeTab === 'main' && (<>

          {/* ── Product type ────────────────────────────────────────────────── */}
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

          {/* ── General information ─────────────────────────────────────────── */}
          <div className={styles.formSection}>
            <SectionTitle>General information</SectionTitle>
            <div className={styles.fieldsBlock}>

              {/* Row: Product name | Category | URL slug */}
              <div className={styles.row3}>
                <div className={styles.fieldWrap}>
                  <FieldLabel required>Product name</FieldLabel>
                  <Input
                    label={false}
                    placeholder="e.g. Kobzar"
                    value={title}
                    onChange={setTitle}
                    className={styles.fullWidth}
                  />
                </div>
                <div className={styles.fieldWrap}>
                  <FieldLabel required>Category</FieldLabel>
                  <Dropdown
                    size="m"
                    placeholder="—"
                    value={category}
                    onChange={setCategory}
                    options={CATEGORY_OPTIONS}
                    className={styles.fullWidth}
                  />
                </div>
                <div className={cx(styles.flex1, styles.inputWithAi)}>
                  <div className={styles.fieldWrapFull}>
                    <FieldLabel required info>URL slug</FieldLabel>
                    <Input
                      label={false}
                      placeholder="kobzar-taras-shevchenko"
                      value={slug}
                      onChange={setSlug}
                      className={styles.fullWidth}
                    />
                  </div>
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
                supporting={false}
                className={styles.textAreaShort}
              />

              {/* Full description */}
              <div className={styles.inputWithAi}>
                <TextArea
                  label
                  labelText="Full description"
                  placeholder="Detailed product description with formatting options..."
                  value={fullDesc}
                  onChange={setFullDesc}
                  maxChars={80}
                  supporting={false}
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

              {productType === 'book' ? (
                <>
                  {/* Row: Author | Publisher | ISBN */}
                  <div className={styles.row3}>
                    <div className={styles.fieldWrap}>
                      <FieldLabel required>Author</FieldLabel>
                      <Dropdown
                        size="m"
                        placeholder="Start typing a name..."
                        value={author}
                        onChange={setAuthor}
                        options={AUTHOR_OPTIONS}
                        className={styles.fullWidth}
                      />
                    </div>
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
                      label="Year of publication"
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

                  {/* Row: Series | Page count */}
                  <div className={styles.row2half}>
                    <Dropdown
                      size="m"
                      label="Series"
                      placeholder="World Classics"
                      value={series}
                      onChange={setSeries}
                      options={SERIES_OPTIONS}
                      className={styles.halfCol}
                    />
                    <Input
                      label
                      labelText="Page count"
                      placeholder="256"
                      value={pages}
                      onChange={setPages}
                      type="number"
                      min="1"
                      className={styles.halfCol}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Row: Brand/Manufacturer | SKU (with AI) | Color */}
                  <div className={styles.row3}>
                    <div className={styles.fieldWrap}>
                      <FieldLabel required>Brand/Manufacturer</FieldLabel>
                      <Dropdown
                        size="m"
                        placeholder="Select brand..."
                        value={brand}
                        onChange={setBrand}
                        options={BRAND_OPTIONS}
                        className={styles.fullWidth}
                      />
                    </div>
                    <div className={cx(styles.flex1, styles.inputWithAi)}>
                      <Input
                        label
                        labelText="SKU"
                        placeholder="BM-1234"
                        value={sku}
                        onChange={setSku}
                        className={styles.fullWidth}
                      />
                      <AiBtn />
                    </div>
                    <Input
                      label
                      labelText="Color"
                      placeholder="Blue"
                      value={color}
                      onChange={setColor}
                      className={styles.flex1}
                    />
                  </div>

                  {/* Row: Color | Material | Qty per pack */}
                  <div className={styles.row3}>
                    <Input
                      label
                      labelText="Color"
                      placeholder="Blue"
                      value={color2}
                      onChange={setColor2}
                      className={styles.flex1}
                    />
                    <Input
                      label
                      labelText="Material"
                      placeholder="Plastic"
                      value={material}
                      onChange={setMaterial}
                      className={styles.flex1}
                    />
                    <Input
                      label
                      labelText="Quantity per pack"
                      placeholder="10"
                      value={qtyPerPack}
                      onChange={setQtyPerPack}
                      type="number"
                      min="1"
                      className={styles.flex1}
                    />
                  </div>
                </>
              )}

            </div>
          </div>

          <Divider />

          {/* ── Pricing ─────────────────────────────────────────────────────── */}
          <div className={styles.formSection}>
            <SectionTitle>Pricing</SectionTitle>
            <div className={styles.fieldsBlock}>
              <div className={styles.row3}>
                <div className={styles.fieldWrap}>
                  <FieldLabel required>Purchase price ₴</FieldLabel>
                  <Input
                    label={false}
                    placeholder="256"
                    value={purchasePrice}
                    onChange={setPurchasePrice}
                    type="number"
                    min="0"
                    className={styles.fullWidth}
                  />
                </div>
                <div className={cx(styles.flex1, styles.priceWithBadge)}>
                  <div className={styles.fieldWrapFull}>
                    <FieldLabel required>Sale price ₴</FieldLabel>
                    <Input
                      label={false}
                      placeholder="600"
                      value={salePrice}
                      onChange={setSalePrice}
                      type="number"
                      min="0"
                      className={styles.fullWidth}
                    />
                  </div>
                  {profit > 0 && (
                    <span className={styles.profitBadge}>+{profit}</span>
                  )}
                </div>
                <Input
                  label
                  labelText="Promo price"
                  placeholder="—"
                  value={promoPrice}
                  onChange={setPromoPrice}
                  type="number"
                  min="0"
                  className={styles.flex1}
                />
              </div>
            </div>
          </div>

        </>)}

        {activeTab === 'seo' && (
          <>
            {/* ── Media gallery ─────────────────────────────────────────────── */}
            <div className={styles.seoSection}>
              <SectionTitle>Media gallery</SectionTitle>
              <label className={styles.uploadZone} aria-label="Upload media">
                <input type="file" accept="image/*" multiple hidden />
                <div className={styles.uploadZoneContent}>
                  <div className={styles.uploadIconBox}>
                    <Icon name="upload-cloud" size={24} color="var(--icon-secondary, #454548)" />
                  </div>
                  <div className={styles.uploadTextGroup}>
                    <p className={styles.uploadTitle}>Drag and drop a photo or click to select</p>
                    <p className={styles.uploadSubtitle}>PNG, JPG up to 10MB. Recommended 1200×1200px</p>
                  </div>
                </div>
              </label>
            </div>

            <Divider />

            {/* ── SEO inputs ────────────────────────────────────────────────── */}
            <div className={styles.seoSection}>
              <div className={styles.seoTitleRow}>
                <SectionTitle>Search engine optimisation</SectionTitle>
                <Icon name="info" size={18} className={styles.infoIcon} />
              </div>
              <div className={styles.seoFields}>
                <div className={styles.inputWithAi}>
                  <TextArea
                    label
                    labelText="Meta title"
                    placeholder="For example: Kobzar - Taras Shevchenko | Buy the book"
                    value={metaTitle}
                    onChange={setMetaTitle}
                    maxChars={80}
                    supporting={false}
                    className={styles.fullWidth}
                  />
                  <AiBtn />
                </div>
                <div className={styles.inputWithAi}>
                  <TextArea
                    label
                    labelText="Full description"
                    placeholder="For example: Buy Taras Shevchenko's Kobzar. A classic of Ukrainian literature. Delivery across Ukraine."
                    value={metaDesc}
                    onChange={setMetaDesc}
                    maxChars={200}
                    supporting={false}
                    className={styles.fullWidth}
                  />
                  <AiBtn />
                </div>
              </div>
            </div>

            <Divider />

            {/* ── Google preview ────────────────────────────────────────────── */}
            <div className={styles.seoSection}>
              <SectionTitle>Google preview</SectionTitle>
              <div className={styles.googlePreviewCard}>
                <div className={styles.googlePreviewSite}>
                  <div className={styles.googlePreviewSiteIcon} />
                  <span className={styles.googlePreviewDomain}>bookstore.com</span>
                </div>
                <div className={styles.googlePreviewTexts}>
                  <p className={styles.googlePreviewTitle}>
                    {metaTitle || title || 'Product name'}
                  </p>
                  <p className={styles.googlePreviewUrl}>
                    {`https://bookstore.com/products/${slug || 'url-slug'}`}
                  </p>
                  <p className={styles.googlePreviewDesc}>
                    {metaDesc || 'Product description will appear here...'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        </div>

        {/* ── PROGRESS BAR ────────────────────────────────────────────────────── */}
        <div className={styles.progressWrap}>
          <div className={styles.progressLabel}>
            <span className={styles.progressText}>Field completion</span>
            <span className={styles.progressPct}>{progress}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
        <div className={styles.footer}>
          {activeTab === 'main' ? (
            <>
              <div className={styles.footerLeft}>
                <Button
                  variant="secondary"
                  size="l"
                  leftIcon={<Icon name="eye-view" size={20} />}
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
            </>
          ) : (
            <div className={styles.footerRight}>
              <Button variant="secondary" size="l" type="button">
                Save as draft
              </Button>
              <Button variant="primary" size="l" type="button">
                Update
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
    </>
  );
}
