import './Toast.css';

export default function Toast({ message, type = 'success' }) {
  return (
    <div className={`toast toast--${type}`}>
      <span className="toast-icon">
        {type === 'success' ? '✓' : type === 'info' ? 'ℹ' : '⚠'}
      </span>
      <span className="toast-message">{message}</span>
    </div>
  );
}
