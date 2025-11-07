import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal',
};

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
