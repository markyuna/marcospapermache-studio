import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(to_bottom,#fffaf5,#fff7f1,#ffffff)] px-4 py-10 md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <section className="w-full max-w-xl rounded-[32px] border border-neutral-200 bg-white/90 p-8 shadow-sm backdrop-blur md:p-10">
          <div className="mx-auto mb-8 max-w-md text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">
              Administration
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-neutral-900 md:text-4xl">
              Connexion admin
            </h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Accède à la gestion des œuvres et des commandes.
            </p>
          </div>

          <AdminLoginForm />
        </section>
      </div>
    </main>
  );
}