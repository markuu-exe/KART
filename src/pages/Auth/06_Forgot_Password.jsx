import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Card } from '@/components';
import fieldIcon from '@/assets/Icons/Icon=Icon.svg';
import { supabase } from '@/lib/supabase';
import { APP_ROUTES } from '@/lib/routing';

export default function ForgotPasswordModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get('modal') === 'forgot-password';
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const closeModal = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('modal');
    nextParams.delete('email');

    if (!nextParams.has('mode')) {
      nextParams.set('mode', 'login');
    }

    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    setEmail(searchParams.get('email') || '');
    setError('');
    setNotice('');
    setLoading(false);

    const handleEscapeClose = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEscapeClose);

    return () => {
      window.removeEventListener('keydown', handleEscapeClose);
    };
  }, [isOpen, searchParams, closeModal]);

  const handleEmailChange = useCallback((event) => {
    setEmail(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      setError('');
      setNotice('');

      try {
        const normalizedEmail = String(email || '').trim().toLowerCase();

        if (!normalizedEmail) {
          throw new Error('Please enter your email address.');
        }

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: `${window.location.origin}${APP_ROUTES.AUTH}`,
        });

        if (resetError) {
          throw resetError;
        }

        setNotice('Reset link sent. Check your inbox and spam folder.');
      } catch (resetError) {
        setError(resetError instanceof Error ? resetError.message : 'Unable to send reset link right now.');
      } finally {
        setLoading(false);
      }
    },
    [email]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="auth-forgotOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <Card variant="Base" className="auth-forgotCard w-full max-w-100 mx-auto">
        <div className="auth-forgotCard__content">
          <div className="auth-forgotCard__header">
            <h2 id="forgot-password-title" className="auth-forgotCard__title">
              Reset Password
            </h2>
            <p className="auth-forgotCard__description">
              Enter your account email and we&apos;ll send a reset link.
            </p>
          </div>

          <form className="auth-forgotForm w-full" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span className="auth-field__label">EMAIL ADDRESS</span>
              <div className="auth-field__control">
                <input
                  className="auth-field__input"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="name@yourmail.com"
                  autoComplete="email"
                  inputMode="email"
                />
                <span className="auth-field__suffix">
                  <img src={fieldIcon} alt="" aria-hidden="true" />
                </span>
              </div>
            </label>

            {error ? (
              <p className="auth-form__error" role="alert">
                {error}
              </p>
            ) : null}

            {notice ? (
              <p className="auth-form__notice" role="status">
                {notice}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="auth-form__submit"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <button type="button" className="auth-form__toggle" onClick={closeModal}>
              Back to Login
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
