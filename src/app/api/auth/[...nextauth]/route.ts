import { authOptions } from "@/lib/utils/authproviders";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
