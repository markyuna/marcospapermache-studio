// src/app/admin/(protected)/loading.tsx
export default function AdminProtectedLoading() {
    return (
      <main className="min-h-screen bg-[linear-gradient(to_bottom,#fffaf5,#fff7f1,#ffffff)] px-4 py-8 md:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <section className="space-y-3">
            <div className="h-4 w-40 rounded-full bg-neutral-200" />
            <div className="h-12 w-80 max-w-full rounded-2xl bg-neutral-200" />
            <div className="h-5 w-[36rem] max-w-full rounded-full bg-neutral-200" />
          </section>
  
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 h-4 w-24 rounded-full bg-neutral-200" />
                <div className="mb-3 h-10 w-20 rounded-2xl bg-neutral-200" />
                <div className="h-4 w-32 rounded-full bg-neutral-200" />
              </div>
            ))}
          </section>
  
          <section className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <div className="h-5 w-40 rounded-full bg-neutral-200" />
                <div className="h-4 w-72 max-w-full rounded-full bg-neutral-200" />
              </div>
              <div className="h-11 w-40 rounded-2xl bg-neutral-200" />
            </div>
  
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="grid gap-4 rounded-[24px] border border-neutral-100 p-4 md:grid-cols-[1.2fr_0.8fr_0.6fr_0.5fr]"
                >
                  <div className="space-y-3">
                    <div className="h-4 w-48 rounded-full bg-neutral-200" />
                    <div className="h-4 w-32 rounded-full bg-neutral-100" />
                  </div>
                  <div className="h-4 w-40 rounded-full bg-neutral-200" />
                  <div className="h-10 w-28 rounded-2xl bg-neutral-200" />
                  <div className="h-10 w-24 rounded-2xl bg-neutral-200" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }