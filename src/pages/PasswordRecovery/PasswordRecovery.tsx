import { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from '@components/atoms/Input';
import { Button } from '@components/atoms/Button';
import { Icon } from '@components/atoms/Icon';
import styles from './PasswordRecovery.module.css';

export function PasswordRecovery({ onNavigate }: { onNavigate?: (page: string) => void } = {}) {
  const [email, setEmail] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onNavigate?.('login');
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Button
          variant="ghost"
          size="s"
          leftIcon={<Icon name="arrow-left" size={20} />}
          type="button"
          className={styles.backBtn}
          onClick={() => onNavigate?.('login')}
        >
          Back to log in
        </Button>

        <div className={styles.header}>
          <h1 className={styles.title}>Password recovery</h1>
          <p className={styles.subtitle}>Enter your email to receive a link</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            labelText="Email"
            placeholder="admin@bookstore.com"
            value={email}
            onChange={setEmail}
            state={email ? 'entered' : 'default'}
            type="email"
            autoComplete="email"
            className={styles.field}
          />

          <Button variant="primary" size="l" type="submit" className={styles.submitBtn}>
            Send link
          </Button>
        </form>
      </div>

      <div className={styles.securityNotice}>
        <Icon name="lock" size={20} color="var(--icon-brand-color, #ffc229)" />
        <div className={styles.securityText}>
          <p className={styles.securityTitle}>Data security</p>
          <p className={styles.securityDesc}>
            All data is transmitted over a secure connection. We never ask for your password via email or SMS.
          </p>
        </div>
      </div>
    </div>
  );
}
