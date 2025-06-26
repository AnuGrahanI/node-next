import * as React from 'react';

import { AuthContext } from '@/context/auth/auth-context';
import { AuthContextValue } from '@/context/auth/auth-context';

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
