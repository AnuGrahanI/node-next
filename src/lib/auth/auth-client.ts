'use client';

import axios from "axios";
import type { User } from '@/types/user';
import { logOut } from './actions';

export interface SignUpParams {
  token: string;
  image?: string
}

class AuthClient {

  async signUp({ token , image}: SignUpParams, checkUserSession?: () => Promise<void>): Promise<{ error?: string, token?: string, user?: User,image?:string }> {
    try {
      const res = await axios.post('/api/auth/token', { token, image });

      const { accessToken, refreshToken, user } = res.data;

      if (!accessToken) return { error: "No access token received from server" };

      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);

      if (checkUserSession) {
        await checkUserSession();
      }

      return { token: accessToken, user };
    } catch (err: any) {
      console.error("Signup error:", err);
      return {
        error:
          err?.response?.data?.message ||
          err.message ||
          "Unknown error during sign up",
      };
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const storedUser = sessionStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }

  async getToken(): Promise<{ error?: string; token?: string | null; isLoading: boolean }> {
    let token = sessionStorage.getItem("accessToken");
    let isLoading = true;

    try {
      const res = await axios.get("/api/auth/session");
      const session = res.data;
      console.log('session',session);
      
      if (session && !token &&  (session.idToken || session.accessToken)) {
        const result = await this.signUp({ token: session.idToken || session.accessToken, image: session?.user?.image ||session?.user?.picture });
        token = result.token || null;
      }

      isLoading = false;
      return { token, isLoading };
    } catch (err: any) {
      return {
        error: "Failed to fetch session: " + (err?.message || "Unknown error"),
        token: null,
        isLoading: false,
      };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      sessionStorage.clear();
      await logOut({ callbackUrl: `${window.location.origin}` });
      return {};
    } catch (err: any) {
      return { error: err?.message || "Logout failed" };
    }
  }
}

export const authClient = new AuthClient();
