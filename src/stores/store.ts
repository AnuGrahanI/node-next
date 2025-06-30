import { configureStore } from '@reduxjs/toolkit';
import snackbarReducer from './snackbar/snackbar-slice';
import registerReducer from './auth/register/register-slice';
import userReducer from './user/profile/profile-slice';
import forgotpasswordReducer from './auth/forgot-password/forgot-password-slice';
import peoplesReducer from './people/peoples/peoples-slice';
import requestReducer from './people/requests/requests-slice';
import friendsReducer from './people/friends/friends-slice';
import chatReducer from './chat/chat-list/chat-list-slice';

import snackbarMiddleware from './snackbar.middleware';
export const makeStore = () => {
  return configureStore({
    reducer: {
      snackbar: snackbarReducer,
      register:registerReducer,
      user: userReducer,
      forgotpassword:forgotpasswordReducer,
      peoples: peoplesReducer,
      requests: requestReducer,
      friends: friendsReducer,
      chatlist: chatReducer




    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(snackbarMiddleware),
  
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']