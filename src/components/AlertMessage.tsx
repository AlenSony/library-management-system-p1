interface AlertMessageProps {
  type: 'success' | 'error' | null;
  message: string;
  onClose: () => void;
}

const AlertMessage = ({ type, message, onClose }: AlertMessageProps) => {
  if (!type || !message) return null;

  return (
    <div className={`${type === 'success' ? 'library-alert-success' : 'library-alert-error'} mb-4 fade-in`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 text-lg font-bold hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AlertMessage;