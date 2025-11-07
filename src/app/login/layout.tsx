import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server component layout para la ruta /login
  return <>{children}</>;
}
