import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/sign-in',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          const existingUser = await prisma.user.findUnique({
            where: {
              username: credentials.username,
            },
          });
          if (!existingUser) {
            return null;
          }

          const passwordMatch = await compare(
            credentials.password,
            existingUser.password
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: existingUser.id,
            username: existingUser.username,
          };
        } catch (error) {
          console.error(error);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.sub;
      const username = await prisma.user.findUnique({
        where: {
          id: token.sub,
        },
        select: {
          username: true,
        },
      });
      session.user.name = username.username;

      return session;
    },
  },
};
