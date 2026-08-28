const Toast = ({ message }) => {
  if (!message) return null;
  return <div className={`toast-message ${message.type}`}>{message.text}</div>;
};

export default Toast;
