import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async authorize(credentials) {
        if (credentials.email !== process.env.ADMIN_EMAIL) {
          throw new Error('Access denied');
        }
        return { email: credentials.email };
      },
    }),
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { email: credentials.email };
        }
        throw new Error('Invalid email or password');
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === 'google' && user.email !== process.env.ADMIN_EMAIL) {
        return false;
      }
      return true;
    },

    async session({ session, token, user }) {
      session.user = user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };