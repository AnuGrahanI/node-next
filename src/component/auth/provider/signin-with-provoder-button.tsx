"use client";

// React
import { useState } from "react";

// MUI Components
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

// MUI Icons
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";

// import { signIn } from "@/lib/auth/actions";

const providersConfig:any = {
  github: {
    label: "Sign in with GitHub",
    icon: <GitHubIcon />,
  },
  google: {
    label: "Sign in with Google",
    icon: <GoogleIcon />,
  },
  microsoft: {
    label: "Sign in with Microsoft",
    icon: <MicrosoftIcon />,
  },
};

interface SignInButtonWithProviderProps {
  provider: "google" | "github" | "gitlab" | "email" | "microsoft";
  disabled?: boolean;
  // params?: { email: string };
}

export const SignInButtonWithProvider = ({
  provider,
  disabled = false,
  // params,
}: SignInButtonWithProviderProps) => {
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setLoading(true);

  const callbackUrl = `${window.location.origin}/auth-callback`; 
    const authUrl = `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`;

     window.open(authUrl, "_blank");

    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data === "auth-success") {
        setLoading(false);
        window.removeEventListener("message", messageListener);
        window.location.reload(); 
      }
    };

    window.addEventListener("message", messageListener);
  };

  return (
    <Button
      variant="outlined"
      color="secondary"
      disabled={loading || disabled}
      sx={{ mt: 2 }}
      onClick={onSubmit}
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          providersConfig[provider].icon
        )
      }
      
    >
      {providersConfig[provider].label}
    </Button>
  );
};