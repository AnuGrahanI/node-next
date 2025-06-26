import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    idToken: string;
    user: {
      id: string;
      email: string;
      name?: string;
    } & DefaultSession["user"];
  }

  // interface User extends DefaultUser {
  //   id: string;
  // }
}
