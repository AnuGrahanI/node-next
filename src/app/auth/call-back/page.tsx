"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // ✅ Notify the original window
      if (window.opener) {
        window.opener.postMessage("auth-success", window.origin);
        window.close(); // ✅ Close the new tab
      } else {
        router.push("/"); // fallback if opened directly
      }
    }
  }, [status]);

  return <p>Completing sign-in...</p>;
}
