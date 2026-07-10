import { useState, useRef } from 'react';
import { Button } from '@components/atoms/Button';
import { Icon } from '@components/atoms/Icon';
import { Input } from '@components/atoms/Input';
import { Checkbox } from '@components/atoms/Checkbox/Checkbox';
import { Tooltip } from '@components/atoms/Tooltip/Tooltip';
import styles from './MediaGallery.module.css';

type MediaItem =
  | { id: string; type: 'image'; name: string; isMain: boolean; checked: boolean }
  | { id: string; type: 'upload' };

const INITIAL_ITEMS: MediaItem[] = [
  { id: '1', type: 'image', name: 'Hardcover', isMain: false, checked: false },
  { id: '2', type: 'image', name: 'Hardcover', isMain: false, checked: false },
  { id: '3', type: 'image', name: 'Hardcover', isMain: false, checked: false },
  { id: '4', type: 'image', name: 'Hardcover', isMain: true, checked: false },
  { id: '5', type: 'image', name: 'Hardcover', isMain: false, checked: false },
  { id: '6', type: 'upload' },
  { id: '7', type: 'upload' },
  { id: '8', type: 'upload' },
];

interface MediaGalleryProps {
  onClose: () => void;
}

export function MediaGallery({ onClose }: MediaGalleryProps) {
  const [items, setItems] = useState<MediaItem[]>(INITIAL_ITEMS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageItems = items.filter((i): i is Extract<MediaItem, { type: 'image' }> => i.type === 'image');
  const selectedCount = imageItems.filter(i => i.checked).length;

  function toggleItem(id: string) {
    setItems(prev =>
      prev.map(i => i.type === 'image' && i.id === id ? { ...i, checked: !i.checked } : i),
    );
    (document.activeElement as HTMLElement)?.blur();
  }

  function updateName(id: string, name: string) {
    setItems(prev =>
      prev.map(i => i.type === 'image' && i.id === id ? { ...i, name } : i),
    );
  }

  function deleteSelected() {
    setItems(prev => prev.filter(i => i.type === 'upload' || !i.checked));
  }

  function clearSelection() {
    setItems(prev => prev.map(i => i.type === 'image' ? { ...i, checked: false } : i));
  }

  function deleteItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const newImages: MediaItem[] = files.map((file, i) => ({
      id: `img-${Date.now()}-${i}`,
      type: 'image',
      name: file.name.replace(/\.[^/.]+$/, ''),
      isMain: false,
      checked: false,
    }));

    setItems(prev => {
      const uploadSlots = prev.filter(i => i.type === 'upload');
      const existingImages = prev.filter(i => i.type === 'image');
      const remainingSlots = uploadSlots.slice(newImages.length);
      return [...existingImages, ...newImages, ...remainingSlots];
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.title}>Media gallery</span>
          <Button
            variant="ghost"
            size="m"
            iconOnly
            leftIcon={<Icon name="close-large" size={24} />}
            type="button"
            aria-label="Close"
            onClick={onClose}
          />
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.grid}>
            {items.map(item => {
              if (item.type === 'upload') {
                return (
                  <div
                    key={item.id}
                    className={styles.uploadCard}
                    onClick={handleUploadClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && handleUploadClick()}
                    aria-label="Upload image"
                  >
                    <Icon name="upload-cloud" size={24} color="var(--icon-tertiary)" />
                  </div>
                );
              }

              const isHovered = hoveredId === item.id;

              return (
                <div key={item.id} className={styles.cardWrapper}>
                  <div
                    className={`${styles.imageCard} ${isHovered ? styles.imageCardHovered : ''}`}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className={styles.cardCheckbox}>
                      <Checkbox checked={item.checked} onChange={() => toggleItem(item.id)} />
                    </div>

                    {item.isMain && (
                      <div className={styles.mainBadge}>
                        <Icon name="star-filled" size={12} color="#ae36c7" />
                        <span className={styles.mainBadgeText}>Main</span>
                      </div>
                    )}

                    {isHovered && (
                      <div className={styles.cardActions}>
                        <Tooltip content="Generate Alt text" position="top">
                          <Button
                            variant="secondary"
                            size="m"
                            iconOnly
                            leftIcon={<Icon name="ai" size={20} />}
                            type="button"
                            aria-label="Generate Alt text"
                          />
                        </Tooltip>
                        <Tooltip content="Set as main" position="top">
                          <Button
                            variant="secondary"
                            size="m"
                            iconOnly
                            leftIcon={<Icon name="star-outlined" size={20} />}
                            type="button"
                            aria-label="Set as main"
                          />
                        </Tooltip>
                        <Tooltip content="Delete" position="top">
                          <Button
                            variant="secondary"
                            size="m"
                            iconOnly
                            leftIcon={<Icon name="delete-bin" size={20} />}
                            type="button"
                            aria-label="Delete"
                            onClick={() => deleteItem(item.id)}
                          />
                        </Tooltip>
                      </div>
                    )}
                  </div>
                  <Input
                    label={false}
                    value={item.name}
                    onChange={name => updateName(item.id, name)}
                    placeholder="Image name"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer — only visible when at least one card is selected */}
        {selectedCount > 0 && <div className={styles.footer}>
          <div className={styles.selectionInfo}>
            <Button
              variant="ghost"
              size="s"
              iconOnly
              leftIcon={<Icon name="close-small" size={24} />}
              type="button"
              aria-label="Clear selection"
              onClick={clearSelection}
            />
            <span className={styles.selectionText}>
              <strong className={styles.selectionCount}>{selectedCount}</strong>
              <span className={styles.selectionTotal}>/{imageItems.length} selected</span>
            </span>
          </div>
          <div className={styles.footerActions}>
            <Button variant="error" size="m" type="button" onClick={deleteSelected}>
              Delete
            </Button>
            <Button variant="secondary" size="m" type="button">
              AI Alt generation
            </Button>
          </div>
        </div>}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className={styles.hiddenInput}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
