import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { authService } from '@/services/authService';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          // Enviar datos del usuario a nuestro backend
          const response = await authService.socialLogin({
            provider: account.provider,
            email: user.email!,
            name: user.name!,
            picture: user.image,
            providerId: user.id,
          });
          
          // Guardar el token de nuestro backend en el usuario
          user.backendToken = response.token;
          user.userData = response.user;
          
          return true;
        } catch (error) {
          console.error('Error en login social:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Agregar datos adicionales al token JWT
      if (user) {
        token.backendToken = (user as any).backendToken;
        token.userData = (user as any).userData;
      }
      return token;
    },
    async session({ session, token }) {
      // Agregar datos adicionales a la sesión
      if (token) {
        (session as any).backendToken = token.backendToken;
        (session as any).userData = token.userData;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirigir a nuestra página de callback personalizada
      return `${baseUrl}/auth/callback`;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
