import { NextAuthOptions } from "next-auth";

//Providers
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import GitlabProvider from "next-auth/providers/gitlab";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";




export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
        const res = await fetch(`https://node-next-olive.vercel.app/api/auth/login`, {

          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const result = await res.json();
        const user = result?.data?.user;
        const accessToken = result?.data?.accessToken;
        const refreshToken = result?.data?.refreshToken;

        if (!res.ok || !result.success || !user) {
          console.log("Login failed:", result.message);
          return null;
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          accessToken,
          refreshToken,
        };
      }
            
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GitlabProvider({
      clientId: process.env.GITLAB_CLIENT_ID!,
      clientSecret: process.env.GITLAB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
     AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID!,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
        tenantId: process.env.AZURE_AD_TENANT_ID!,
        authorization: { params: { scope: "email openid profile User.Read", prompt: "select_account" } },
      }),
  ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    callbacks: {
  async jwt({ token, account, user }: any) {
  if (account?.provider === "credentials" && user) {
    token.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    token.accessToken = user.accessToken;
    token.refreshToken = user.refreshToken;
  }

  if (account?.id_token) {
    token.idToken = account.id_token;
  }

  return token;
}
,
  async session({ session, token }: any) {
    
  if (token) {
    // session.user = token.user as typeof session.user;
    session.user.id = token.sub ?? "";
    session.idToken = token.idToken as string;
    session.accessToken = token.accessToken as string;
  }
  return session; 
}
},

} satisfies NextAuthOptions;
