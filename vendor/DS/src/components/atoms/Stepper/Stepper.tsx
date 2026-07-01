import type { StepperProps, StepState } from './Stepper.types';
import styles from './Stepper.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

const CheckIcon = () => (
  <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
    <path d="M1 4.5L4.5 8.5L12 1" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M5.5 3.5L8.5 7L5.5 10.5" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function getState(index: number, activeStep: number): StepState {
  if (index < activeStep)   return 'passed';
  if (index === activeStep) return 'active';
  return 'next';
}

export function Stepper({ steps, activeStep, className, style }: StepperProps) {
  return (
    <div className={cx(styles.stepper, className)} style={style}>
      {steps.map((step, i) => {
        const state  = getState(i, activeStep);
        const isLast = i === steps.length - 1;
        const isNext = state === 'next';

        return (
          <div key={i} className={styles.step}>

            {/* ── Indicator column ─────────────────────────────────────────── */}
            <div className={styles.indicatorCol}>
              <div className={cx(styles.indicator, styles[state])} aria-label={`Step ${i + 1}: ${state}`}>
                <CheckIcon />
              </div>
              {!isLast && <div className={styles.connector} />}
            </div>

            {/* ── Content ──────────────────────────────────────────────────── */}
            <div className={cx(styles.content, !isLast && styles.contentSpaced)}>

              {/* Badge */}
              {step.badge && (
                <span className={cx(styles.badge, step.badgeColor === 'gray' ? styles.badgeGray : styles.badgeWhite)}>
                  {step.badge}
                </span>
              )}

              {/* Title + actor / date block */}
              <div className={cx(styles.bodyRow, (step.date || step.time) && styles.bodyRowWithDate)}>

                <div className={styles.textBlock}>
                  {/* Title */}
                  <span className={cx(styles.label, isNext && styles.labelNext)}>
                    {step.label}
                  </span>

                  {/* Actor row */}
                  {step.actor && (
                    <div className={cx(styles.actorRow, isNext && styles.actorRowNext)}>
                      <span className={styles.actorPrefix}>Assignee:</span>
                      <span className={styles.actorName}>{step.actor}</span>
                      <ArrowRightIcon />
                    </div>
                  )}
                </div>

                {/* Date / time (optional) */}
                {(step.date || step.time) && (
                  <div className={cx(styles.dateBlock, isNext && styles.dateBlockNext)}>
                    {step.date && <span className={styles.dateText}>{step.date}</span>}
                    {step.time && <span className={styles.timeText}>{step.time}</span>}
                  </div>
                )}
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
}
