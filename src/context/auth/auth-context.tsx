'use client';

import { authClient } from '@/lib/auth/auth-client';
import * as React from 'react';

export interface AuthContextValue {
  token: string | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
  user ?: any | null
}   

export const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{ token: string | null;  error: string | null; isLoading: boolean, user ?: any | null }>({
    token: null,
    error: null,
    isLoading: true,
    user: null
  });

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const { token: data,user } = await authClient.getToken();
      setState((prev) => ({ ...prev, token: data ?? null, error: null, isLoading: false, user }));
    } catch (err) {
      console.log(err);
      setState((prev) => ({ ...prev, token: null, error: 'Something went wrong2', isLoading: false, user: null }));
    }
  }, []);

  React.useEffect(() => {
    checkSession().catch((err) => {
      console.log('Error checking session:', err);
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [state.token]);

  return <AuthContext.Provider value={{ ...state, checkSession }}>{children}</AuthContext.Provider>;
}

export const UserConsumer = AuthContext.Consumer;
