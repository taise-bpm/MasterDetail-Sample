import { useCallback, useEffect, useState } from 'react';

// Shared toast-message state: auto-hides itself after `duration` ms.
const useToast = (duration = 3000) => {
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = setTimeout(() => setToastMessage(null), duration);
    return () => clearTimeout(timer);
  }, [toastMessage, duration]);

  const showToast = useCallback((type, text) => setToastMessage({ type, text }), []);

  return [toastMessage, showToast];
};

export default useToast;
