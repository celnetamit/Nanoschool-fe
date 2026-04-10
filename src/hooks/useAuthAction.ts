import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { checkSession } from "@/lib/auth";

export function useAuthAction() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const pathname = usePathname();

  const performAction = useCallback(async (action: () => void) => {
    setIsVerifying(true);
    try {
      const session = await checkSession();
      if (session) {
        action();
      } else {
        setShowLoginModal(true);
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      // Fallback to showing modal if check fails
      setShowLoginModal(true);
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  return {
    performAction,
    showLoginModal,
    closeLoginModal,
    isVerifying,
    currentPath: pathname
  };
}
