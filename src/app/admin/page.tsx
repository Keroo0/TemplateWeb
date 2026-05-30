export default function AdminPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold">Dashboard Mauapalau</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Area admin akan diproteksi dengan Supabase Auth dan whitelist email.
        </p>
      </div>
    </main>
  );
}
