import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { APP_ROUTES } from '@/lib/routing';

export default function useForgotPasswordState(getEmail) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const openForgotPassword = useCallback(() => {
    setEmail(String(getEmail() || '').trim());
    setError('');
    setNotice('');
    setIsOpen(true);
  }, [getEmail]);

  const closeForgotPassword = useCallback(() => {
    setIsOpen(false);
    setLoading(false);
    setError('');
    setNotice('');
  }, []);

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

  return {
    isOpen,
    email,
    loading,
    error,
    notice,
    openForgotPassword,
    closeForgotPassword,
    onEmailChange: handleEmailChange,
    onSubmit: handleSubmit,
  };
}
