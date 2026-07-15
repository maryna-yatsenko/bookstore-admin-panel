import { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from '@components/atoms/Input';
import { Checkbox } from '@components/atoms/Checkbox/Checkbox';
import { Button } from '@components/atoms/Button';
import { Icon } from '@components/atoms/Icon';
import { BookStoreLogo } from '@components/atoms/Sidebar/BookStoreLogo';
import styles from './Login.module.css';

const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748L12.545 10.239Z"
      fill="#0a0a0a"
    />
  </svg>
);

const AppleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M15.769 10.556c-.023-2.31 1.887-3.42 1.972-3.474-1.074-1.57-2.746-1.786-3.34-1.81-1.423-.145-2.777.838-3.499.838-.722 0-1.836-.817-3.02-.795-1.554.023-2.986.905-3.786 2.298-1.615 2.8-.413 6.947 1.16 9.222.77 1.114 1.685 2.365 2.888 2.32 1.16-.046 1.6-.75 3.005-.75 1.406 0 1.798.75 3.024.727 1.25-.023 2.04-1.137 2.804-2.256.884-1.29 1.248-2.54 1.27-2.605-.028-.012-2.437-.936-2.46-3.715h-.018Z"
      fill="#0a0a0a"
    />
    <path
      d="M13.53 3.766c.641-.777 1.075-1.856.955-2.933-.923.037-2.04.615-2.703 1.392-.594.686-1.117 1.79-.977 2.842 1.028.08 2.083-.523 2.725-1.3Z"
      fill="#0a0a0a"
    />
  </svg>
);

export function Login({ onNavigate }: { onNavigate?: (page: string) => void } = {}) {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onNavigate?.('dashboard');
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoBlock}>
          <div className={styles.logoWrap}>
            <BookStoreLogo size={64} />
          </div>
          <div className={styles.header}>
            <h1 className={styles.title}>Log in to Book Store</h1>
            <p className={styles.subtitle}>Enter your credentials to access the admin panel</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fields}>
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
            <Input
              labelText="Password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              state={password ? 'entered' : 'default'}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={styles.field}
              trailingIcon={
                <button
                  type="button"
                  className={styles.passwordToggle}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(v => !v)}
                >
                  <Icon name={showPassword ? 'eye-view' : 'eye-off'} size={20} />
                </button>
              }
            />

            <div className={styles.formRow}>
              <Checkbox checked={rememberMe} onChange={setRememberMe} label="Remember me" />
              <Button variant="ghost" size="s" type="button" onClick={() => onNavigate?.('password-recovery')}>
                Forgot your password?
              </Button>
            </div>
          </div>

          <Button variant="primary" size="l" type="submit" className={styles.submitBtn}>
            Log in
          </Button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>Or log in using</span>
        </div>

        <div className={styles.ssoRow}>
          <Button variant="secondary" size="l" leftIcon={<GoogleLogo />} type="button" className={styles.ssoBtn}>
            Google
          </Button>
          <Button variant="secondary" size="l" leftIcon={<AppleLogo />} type="button" className={styles.ssoBtn}>
            Apple
          </Button>
        </div>

        <div className={styles.footer}>
          <span className={styles.footerText}>Don&apos;t have access yet?</span>
          <Button variant="ghost" size="s" type="button">
            Request access
          </Button>
        </div>
      </div>

      <div className={styles.securityNotice}>
        <Icon name="lock" size={20} color="var(--icon-brand-color, #ffc229)" />
        <div className={styles.securityText}>
          <p className={styles.securityTitle}>Data Security</p>
          <p className={styles.securityDesc}>
            All data is transmitted over a secure connection. We never ask for your password via email or SMS.
          </p>
        </div>
      </div>
    </div>
  );
}
