import './Input.css';

export default function Input({
  type = 'Text',
  state = 'Default',
  label = '',
  placeholder = '',
  prefix = null,
  suffix = null,
  maxLength = 500,
  value = '',
  onChange = () => {},
  className = '',
  ...props
}) {
  const isTextarea = type === 'Textarea';
  const charCount = value.length;

  const inputClasses = `input input-${type.toLowerCase()} input-${state.toLowerCase()} ${className}`;

  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">{label}</label>
      )}

      {isTextarea ? (
        <div className={`textarea-container ${state === 'Focused' ? 'focused' : ''}`}>
          <textarea
            className={inputClasses}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            placeholder={placeholder}
            {...props}
          />
          <div className="char-count">
            {charCount} / {maxLength}
          </div>
        </div>
      ) : (
        <div className={`input-container ${state === 'Focused' ? 'focused' : ''}`}>
          {prefix && <span className="input-prefix">{prefix}</span>}
          <input
            type="text"
            className={inputClasses}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            {...props}
          />
          {suffix && <span className="input-suffix">{suffix}</span>}
        </div>
      )}
    </div>
  );
}
