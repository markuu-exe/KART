import { Button, Card } from '@/components';
import fieldIcon from '@/assets/Icons/Icon=Icon.svg';

export default function ForgotPasswordModal({
	isOpen,
	email,
	onEmailChange,
	onSubmit,
	onClose,
	loading,
	error,
	notice,
}) {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="auth-forgotOverlay" role="dialog" aria-modal="true" aria-labelledby="forgot-password-title">
			<Card variant="Base" className="auth-forgotCard">
				<div className="auth-forgotCard__content">
					<div className="auth-forgotCard__header">
						<h2 id="forgot-password-title" className="auth-forgotCard__title">
							Reset Password
						</h2>
						<p className="auth-forgotCard__description">
							Enter your account email and we&apos;ll send a reset link.
						</p>
					</div>

					<form className="auth-forgotForm" onSubmit={onSubmit}>
						<label className="auth-field">
							<span className="auth-field__label">EMAIL ADDRESS</span>
							<div className="auth-field__control">
								<input
									className="auth-field__input"
									type="email"
									value={email}
									onChange={onEmailChange}
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

						<button type="button" className="auth-form__toggle" onClick={onClose}>
							Back to Login
						</button>
					</form>
				</div>
			</Card>
		</div>
	);
}
