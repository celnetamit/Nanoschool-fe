import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1. Search for the user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // 2. If user exists and has a password (manual account)
        if (user && user.password) {
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (isPasswordCorrect) {
            return user;
          }
        }

        // 3. Fallback: Automatic Admin Provisioning (if DB is empty or first run)
        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
        const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

        if (adminEmails.includes(credentials.email) && credentials.password === adminPassword) {
            const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
            const adminUser = await prisma.user.upsert({
                where: { email: credentials.email },
                update: { password: hashedAdminPassword, role: "admin" },
                create: { 
                    email: credentials.email, 
                    password: hashedAdminPassword, 
                    role: "admin",
                    name: "Administrator"
                }
            });
            return adminUser;
        }
        
        return null;
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user.email) {
        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
        if (adminEmails.includes(user.email)) {
          // Auto-promote to admin if email is in the allowed list
          await prisma.user.update({
            where: { email: user.email },
            data: { role: "admin" }
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "user";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
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
