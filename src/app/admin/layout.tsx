export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="min-h-screen bg-muted/40">{children}</section>;
}
