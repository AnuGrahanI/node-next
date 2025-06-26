

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import { useSession } from 'next-auth/react';
import { paths } from '@/paths';
import { useAuth } from '@/hooks/use-auth';

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { token, error, isLoading } = useAuth();
  const { status } = useSession();
  const [hasChecked, setHasChecked] = React.useState(false);

  React.useEffect(() => {
    const runCheck = () => {
      if (status === 'authenticated' && token) {
        router.replace(paths.page.overview);
        return;
      }

      setHasChecked(true);
    };

    runCheck();
  }, [status, isLoading, router]);

  if (!hasChecked || status === 'loading' || isLoading) {
    return null;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return <>{children}</>;
}
