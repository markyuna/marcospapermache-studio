export default function AdminProtectedLoading() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <div className="h-3 w-16 rounded-full bg-neutral-300" />
          <div className="h-8 w-48 rounded-xl bg-neutral-200" />
        </div>

        {/* Content blocks */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="mb-4 h-10 w-10 rounded-2xl bg-neutral-100" />
              <div className="h-3 w-20 rounded-full bg-neutral-200" />
              <div className="mt-2 h-8 w-16 rounded-lg bg-neutral-200" />
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="mb-5 h-5 w-40 rounded-full bg-neutral-200" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-neutral-100" />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
