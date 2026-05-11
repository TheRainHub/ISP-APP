import { useState, useCallback } from "react";

interface Toast {
  show: boolean;
  msg: string;
}

export function useToast() {
  const [toast, setToast] = useState<Toast>({ show: false, msg: "" });

  const showToast = useCallback((msg: string, duration = 3000) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), duration);
  }, []);

  return { toast, showToast };
}
