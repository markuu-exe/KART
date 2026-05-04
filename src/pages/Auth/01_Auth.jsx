import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card } from '@/components';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/store/useAppStore';
import PageTransition from '@/components/shared/PageTransition';
import fieldIcon from '@/assets/Icons/Icon=Icon.svg';
import authHeroImage from '@/assets/Images/hero-auth-orangeAbstract.jpg';
import ForgotPasswordModal from './06_Forgot_Password';
import './01_Auth.css';

function AuthField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  register,
  error,
  placeholder,
  prefix,
  suffix,
  onSuffixClick,
  autoComplete,
  inputMode,
  className = '',
}) {
  const suffixNode = onSuffixClick ? (
    <button
      type="button"
      className="auth-field__suffixButton"
      onClick={onSuffixClick}
      aria-label={`Toggle ${label.toLowerCase()}`}
    >
      {suffix}
    </button>
  ) : (
    suffix
  );

  return (
    <label className={`auth-field ${className}`}>
      <span className="auth-field__label">{label}</span>
      <div className={`auth-field__control ${prefix ? 'auth-field__control--prefixed' : ''}`}>
        {prefix ? <span className="auth-field__prefix">{prefix}</span> : null}
        <>
          <input
            className="auth-field__input"
            name={name}
            type={type}
            {...(register ? register(name) : {})}
            value={register ? undefined : value}
            onChange={register ? undefined : onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputMode={inputMode}
            aria-invalid={error ? true : undefined}
          />
          {error ? <p className="text-red-500 text-sm mt-1">{error.message}</p> : null}
        </>
        {suffixNode ? <span className="auth-field__suffix">{suffixNode}</span> : null}
      </div>
    </label>
  );
}

function AuthTabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      className={`auth-tabs__button ${active ? 'is-active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function BenefitItem({ emoji, children }) {
  return (
    <li className="auth-benefit">
      <span className="auth-benefit__badge" aria-hidden="true">
        {emoji}
      </span>
      <span className="auth-benefit__copy">{children}</span>
    </li>
  );
}

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(new URLSearchParams(location.search).get('mode') === 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotNotice, setForgotNotice] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);

  const { setUser, setLoading: setAppLoading } = useAppStore();

  const authSchema = useMemo(() =>
    z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().min(1, 'Email is required').email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().optional(),
      })
      .refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      }),
    []
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  useEffect(() => {
    setIsSignUp(new URLSearchParams(location.search).get('mode') === 'signup');
  }, [location.search]);

  const switchMode = (shouldSignUp) => {
    setIsSignUp(shouldSignUp);
    setError('');
    setNotice('');
    navigate(`/auth?mode=${shouldSignUp ? 'signup' : 'login'}`, { replace: true });
  };

  const getAuthRedirectTo = () => `${window.location.origin}/auth`;

  const handleGoogleAuth = async () => {
    setOauthLoading(true);
    setError('');
    setNotice('');

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthRedirectTo(),
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (oauthError) {
      setError(oauthError instanceof Error ? oauthError.message : 'Unable to continue with Google right now.');
      setOauthLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setMagicLinkLoading(true);
    setError('');
    setNotice('');

    try {
      const normalizedEmail = String(getValues('email') || '').trim().toLowerCase();

      if (!normalizedEmail) {
        throw new Error('Enter your email address first to receive a magic link.');
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: getAuthRedirectTo(),
          shouldCreateUser: isSignUp,
          ...(isSignUp
            ? {
                data: {
                  first_name: String(getValues('firstName') || '').trim(),
                  last_name: String(getValues('lastName') || '').trim(),
                },
              }
            : {}),
        },
      });

      if (otpError) {
        throw otpError;
      }

      setNotice(`Magic link sent to ${normalizedEmail}. Open it on this device to continue.`);
    } catch (otpError) {
      setError(otpError instanceof Error ? otpError.message : 'Unable to send a magic link right now.');
    } finally {
      setMagicLinkLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const normalizedEmail = verificationEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setError('Missing verification email. Please register again.');
      return;
    }

    setVerificationLoading(true);
    setError('');
    setNotice('');

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: normalizedEmail,
      });

      if (resendError) {
        throw resendError;
      }

      setNotice(`Verification email resent to ${normalizedEmail}.`);
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : 'Unable to resend verification email right now.');
    } finally {
      setVerificationLoading(false);
    }
  };

  const openForgotPassword = () => {
    setForgotEmail(String(getValues('email') || ''));
    setForgotError('');
    setForgotNotice('');
    setIsForgotPasswordOpen(true);
  };

  const closeForgotPassword = () => {
    setIsForgotPasswordOpen(false);
    setForgotLoading(false);
    setForgotError('');
    setForgotNotice('');
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotNotice('');

    try {
      const normalizedEmail = forgotEmail.trim().toLowerCase();

      if (!normalizedEmail) {
        throw new Error('Please enter your email address.');
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (resetError) {
        throw resetError;
      }

      setForgotNotice('Reset link sent. Check your inbox and spam folder.');
    } catch (resetError) {
      setForgotError(resetError instanceof Error ? resetError.message : 'Unable to send reset link right now.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleAuth = async (data) => {
    setLoading(true);
    setError('');
    setNotice('');

    try {
      const normalizedEmail = String(data.email || '').trim().toLowerCase();

      if (!normalizedEmail) {
        throw new Error('Please enter your email address.');
      }

      if (!data.password) {
        throw new Error('Please enter your password.');
      }

      if (isSignUp && (!String(data.firstName || '').trim() || !String(data.lastName || '').trim())) {
        throw new Error('Please provide both first and last name.');
      }

      if (isSignUp && data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      if (isSignUp) {
        const { data: signupData, error: authError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: data.password,
          options: {
            data: {
              first_name: String(data.firstName || '').trim(),
              last_name: String(data.lastName || '').trim(),
            },
          },
        });

        if (authError) {
          throw authError;
        }

        if (signupData.user) {
          setUser(signupData.user);
        }

        if (!signupData.session) {
          setVerificationEmail(normalizedEmail);
          setNotice(`Verification required. We sent an email to ${normalizedEmail}.`);
          setIsSignUp(false);
        } else {
          setNotice('Account created successfully.');
          navigate('/auth/onboarding');
        }
      } else {
        const { data: signInData, error: authError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: data.password,
        });

        if (authError) {
          throw authError;
        }

        setUser(signInData.user);
        navigate('/auth/onboarding');
      }

      setAppLoading(false);

      // TODO: Add phone verification as a secondary security checkpoint after successful email auth.
      // Suggested flow: collect phone after login/signup, send OTP, and store verified phone + timestamp.
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Unable to authenticate right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div
        className={`auth-page ${isForgotPasswordOpen ? 'auth-page--modalOpen' : ''}`}
        style={{ '--auth-bg-image': `url(${authHeroImage})` }}
      >
      <div className="auth-shell">
        <aside className="auth-brandPanel" aria-label="Kart brand introduction">
          <div className="auth-brandPanel__content">
            <p className="auth-brandPanel__title">Kart</p>
            <p className="auth-brandPanel__tagline">Skip the checkout line.</p>

            <ul className="auth-benefitsList">
              <BenefitItem emoji="💸">Zero platform fees — always free to use</BenefitItem>
              <BenefitItem emoji="📍">Hyper-local, peer-to-peer delivery</BenefitItem>
              <BenefitItem emoji="🛵">Flat ₱30 runner fee, no hidden charges</BenefitItem>
            </ul>
          </div>
          <div className="auth-brandPanel__glow" aria-hidden="true" />
        </aside>

        <main className="auth-formPanel">
          <div className="auth-mobileBrand">
            <p className="auth-mobileBrand__title">Kart</p>
            <p className="auth-mobileBrand__tagline">Skip the checkout line.</p>
          </div>

          <Card variant="Base" className={`auth-card ${isSignUp ? 'auth-card--register' : 'auth-card--login'}`}>
            <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
              <AuthTabButton active={!isSignUp} onClick={() => switchMode(false)}>
                Log in
              </AuthTabButton>
              <AuthTabButton active={isSignUp} onClick={() => switchMode(true)}>
                Register
              </AuthTabButton>
            </div>

            {verificationEmail ? (
              <div className="auth-verificationBanner" role="status" aria-live="polite">
                <p className="auth-verificationBanner__title">Verify your email to continue</p>
                <p className="auth-verificationBanner__copy">
                  We sent a verification link to <strong>{verificationEmail}</strong>. Check your inbox and spam folder.
                </p>
                <button
                  type="button"
                  className="auth-verificationBanner__action"
                  onClick={handleResendVerification}
                  disabled={verificationLoading}
                >
                  {verificationLoading ? 'Resending...' : 'Resend verification email'}
                </button>
              </div>
            ) : null}

            <form className="auth-form" onSubmit={handleSubmit(handleAuth)}>
              <div className="auth-socialActions">
                <button
                  type="button"
                  className="auth-socialActions__button"
                  onClick={handleGoogleAuth}
                  disabled={oauthLoading || magicLinkLoading || loading}
                >
                  {oauthLoading ? 'Opening Google...' : 'Continue with Google'}
                </button>

                <button
                  type="button"
                  className="auth-socialActions__button auth-socialActions__button--secondary"
                  onClick={handleMagicLink}
                  disabled={oauthLoading || magicLinkLoading || loading}
                >
                  {magicLinkLoading ? 'Sending Magic Link...' : 'Send Magic Link'}
                </button>
              </div>

              <p className="auth-form__divider" role="presentation" aria-hidden="true">
                <span>or continue with email and password</span>
              </p>

              {isSignUp ? (
                <div className="auth-form__nameRow">
                  <AuthField
                    label="FIRST NAME"
                    name="firstName"
                    register={register}
                    error={errors.firstName}
                    placeholder="Enter first name"
                    autoComplete="given-name"
                    suffix={<img src={fieldIcon} alt="" aria-hidden="true" />}
                  />
                  <AuthField
                    label="LAST NAME"
                    name="lastName"
                    register={register}
                    error={errors.lastName}
                    placeholder="Enter last name"
                    autoComplete="family-name"
                    suffix={<img src={fieldIcon} alt="" aria-hidden="true" />}
                  />
                </div>
              ) : null}

              <AuthField
                label="EMAIL ADDRESS"
                name="email"
                type="email"
                register={register}
                error={errors.email}
                placeholder="name@yourmail.com"
                autoComplete="email"
                inputMode="email"
                suffix={<img src={fieldIcon} alt="" aria-hidden="true" />}
              />

              <AuthField
                label="PASSWORD"
                name="password"
                register={register}
                error={errors.password}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                suffix={showPassword ? <EyeOff className="auth-field__icon" aria-hidden="true" /> : <Eye className="auth-field__icon" aria-hidden="true" />}
                onSuffixClick={() => setShowPassword((currentValue) => !currentValue)}
              />

              {!isSignUp ? (
                <button
                  type="button"
                  className="auth-form__forgotLink"
                  onClick={openForgotPassword}
                >
                  Forgot password?
                </button>
              ) : null}

              {isSignUp ? (
                <AuthField
                  label="CONFIRM PASSWORD"
                  name="confirmPassword"
                  register={register}
                  error={errors.confirmPassword}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  suffix={showConfirmPassword ? <EyeOff className="auth-field__icon" aria-hidden="true" /> : <Eye className="auth-field__icon" aria-hidden="true" />}
                  onSuffixClick={() => setShowConfirmPassword((currentValue) => !currentValue)}
                />
              ) : null}

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
                {loading ? 'Working...' : isSignUp ? 'Create account' : 'Continue'}
              </Button>

              <button
                type="button"
                className="auth-form__toggle"
                onClick={() => switchMode(!isSignUp)}
              >
                {isSignUp ? 'Already have an account? Log in' : 'Need an account? Register'}
              </button>
            </form>
          </Card>
        </main>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        email={forgotEmail}
        onEmailChange={(event) => setForgotEmail(event.target.value)}
        onSubmit={handleForgotPassword}
        onClose={closeForgotPassword}
        loading={forgotLoading}
        error={forgotError}
        notice={forgotNotice}
      />
      </div>
    </PageTransition>
  );
}