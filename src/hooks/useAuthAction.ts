import { useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession } from "@/lib/auth";
import toast from "react-hot-toast";

export function useAuthAction() {
  const [isVerifying, setIsVerifying] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const performAction = useCallback(async (action: () => void) => {
    setIsVerifying(true);
    try {
      const session = await checkSession();
      if (session) {
        action();
      } else {
        // User not logged in: Show pop-up and store destination
        toast.error("Secure Your Spot 🚀 | Please sign in to continue your enrollment. Redirecting to portal...", {
            duration: 3000,
            icon: '🔒'
        });

        // Store destination for redirect after login
        if (typeof window !== 'undefined') {
            localStorage.setItem('redirectAfterLogin', pathname);
        }
        
        setTimeout(() => {
            const loginUrl = `/dashboard/login?callbackUrl=${encodeURIComponent(pathname)}`;
            router.push(loginUrl);
        }, 2000);
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      toast.error("Authentication error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }, [pathname, router]);

  return {
    performAction,
    isVerifying,
    currentPath: pathname
  };
}
