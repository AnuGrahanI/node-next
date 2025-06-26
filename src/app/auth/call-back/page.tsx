'use client';

import { useEffect } from "react";

export default function AuthCallback() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage("auth-success", window.origin);
      window.close(); // close popup
    }
  }, []);

  return <p>Signing in...</p>;
}
