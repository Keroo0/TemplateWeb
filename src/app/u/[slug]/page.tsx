type DeliveryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DeliveryPage({ params }: DeliveryPageProps) {
  const { slug } = await params;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Delivery</p>
        <h1 className="mt-2 text-3xl font-semibold">Template {slug}</h1>
        <p className="mt-4 text-muted-foreground">
          Renderer template hosted akan mengambil data order berdasarkan slug
          saat fitur delivery dibuat.
        </p>
      </div>
    </main>
  );
}
