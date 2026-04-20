import { useState } from 'react';
import { Button, Card } from '@/components';
import { Eye, EyeOff } from 'lucide-react';
import fieldIcon from '@/assets/Icons/Icon=Icon.svg';
import './01_Auth.css';

function AuthField({
  label,
  name,
  type = 'text',
  value,
  onChange,
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
        <input
          className="auth-field__input"
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
        />
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp && password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      // TODO: Connect this phone-based auth form to the backend contract.
      // Expected payload: { mode: 'login' | 'register', firstName, lastName, phoneNumber, password, confirmPassword }.
      // Supabase email/password auth is intentionally not used here because this screen is phone-first.
      throw new Error('Auth flow is not connected yet.');
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Auth flow is not connected yet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
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
              <AuthTabButton active={!isSignUp} onClick={() => setIsSignUp(false)}>
                Log in
              </AuthTabButton>
              <AuthTabButton active={isSignUp} onClick={() => setIsSignUp(true)}>
                Register
              </AuthTabButton>
            </div>

            <form className="auth-form" onSubmit={handleAuth}>
              {isSignUp ? (
                <div className="auth-form__nameRow">
                  <AuthField
                    label="FIRST NAME"
                    name="firstName"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Enter first name"
                    autoComplete="given-name"
                    suffix={<img src={fieldIcon} alt="" aria-hidden="true" />}
                  />
                  <AuthField
                    label="LAST NAME"
                    name="lastName"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Enter last name"
                    autoComplete="family-name"
                    suffix={<img src={fieldIcon} alt="" aria-hidden="true" />}
                  />
                </div>
              ) : null}

              <AuthField
                label="PHONE NUMBER"
                name="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="9XX XXX XXXX"
                autoComplete="tel-national"
                inputMode="tel"
                prefix={'+63'}
                suffix={<img src={fieldIcon} alt="" aria-hidden="true" />}
              />

              <AuthField
                label="PASSWORD"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                suffix={
                  showPassword ? (
                    <EyeOff className="auth-field__icon" aria-hidden="true" />
                  ) : (
                    <Eye className="auth-field__icon" aria-hidden="true" />
                  )
                }
                onSuffixClick={() => setShowPassword((currentValue) => !currentValue)}
              />

              {isSignUp ? (
                <AuthField
                  label="CONFIRM PASSWORD"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  suffix={
                    showConfirmPassword ? (
                      <EyeOff className="auth-field__icon" aria-hidden="true" />
                    ) : (
                      <Eye className="auth-field__icon" aria-hidden="true" />
                    )
                  }
                  onSuffixClick={() => setShowConfirmPassword((currentValue) => !currentValue)}
                />
              ) : null}

              {error ? (
                <p className="auth-form__error" role="alert">
                  {error}
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
                onClick={() => setIsSignUp((currentValue) => !currentValue)}
              >
                {isSignUp ? 'Already have an account? Log in' : 'Need an account? Register'}
              </button>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
}