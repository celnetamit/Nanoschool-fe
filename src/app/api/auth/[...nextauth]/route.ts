import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getEnrollmentsByEmail } from "@/lib/wordpress";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        return true; 
      }
      return false;
    },
    async jwt({ token, user, profile }) {
      if (user) {
        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
        token.role = adminEmails.includes(user.email!) ? "admin" : "user";
      }
      if (profile) {
        token.name = (profile as any).name;
        token.picture = (profile as any).picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).email = token.email;
        (session.user as any).name = token.name;
        (session.user as any).image = token.picture;
      }
      return session;
    },
  },
  pages: {
    signIn: "/dashboard/login",
    error: "/dashboard/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
