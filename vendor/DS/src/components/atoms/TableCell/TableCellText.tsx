import { Status } from '../Status/Status';
import { Tooltip } from '../Tooltip/Tooltip';
import type { TableCellTextProps } from './TableCell.types';
import styles from './TableCell.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

export function TableCellText({
  titleText,
  subtitle       = false,
  subtitleText   = 'subtitle',
  status         = false,
  statusText     = 'label',
  statusType     = 'success',
  image          = false,
  titleWrap      = false,
  title,
  tooltipContent,
  className,
  style,
}: TableCellTextProps) {
  const textContent = (
    <div className={styles.textContent}>
      {titleText && <span className={cx(styles.titleText, titleWrap && styles.titleTextWrap)}>{titleText}</span>}
      {subtitle && <span className={styles.subtitleText}>{subtitleText}</span>}
      {status && (
        <Status status={statusType} size="small" labelText={statusText} />
      )}
    </div>
  );

  const tooltipNode = tooltipContent === true ? (
    <>
      {titleText && <span className={styles.tooltipTitle}>{titleText}</span>}
      {subtitle && <span className={styles.tooltipSubtitle}>{subtitleText}</span>}
    </>
  ) : tooltipContent;

  return (
    <div className={cx(styles.cell, styles.dataCell, styles.textCell, image && styles.imageCell, className)} style={style} title={title}>
      {image && <div className={styles.imagePlaceholder} aria-hidden="true" />}
      {tooltipNode ? (
        <Tooltip content={tooltipNode} position="right" portal className={styles.tooltipWrap}>
          {textContent}
        </Tooltip>
      ) : textContent}
    </div>
  );
}
