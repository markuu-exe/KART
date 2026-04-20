import './ProgressBar.css';

const STEPS = ['Accepted', 'At Store', 'Purchased', 'Delivered'];

export default function ProgressBar({
  currentStep = 'Accepted',
  className = '',
  ...props
}) {
  const stepIndex = STEPS.indexOf(currentStep);
  const progressPercent = stepIndex === -1 ? 0 : ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <div className={`progress-bar-wrapper ${className}`} {...props}>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="progress-labels">
        {STEPS.map((step) => (
          <div
            key={step}
            className={`progress-label ${
              STEPS.indexOf(step) <= stepIndex ? 'active' : ''
            } ${step === currentStep ? 'current' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
