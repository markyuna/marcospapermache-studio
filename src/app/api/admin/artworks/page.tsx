"use client";

import { useState } from "react";

export default function AdminArtworksPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/artworks", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMessage("✅ Œuvre ajoutée avec succès");
      e.currentTarget.reset();
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] p-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold mb-8">
          Ajouter une œuvre
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="title" placeholder="Titre" required className="w-full p-3 border rounded-xl" />

          <textarea name="description" placeholder="Description" className="w-full p-3 border rounded-xl" />

          <input name="category" placeholder="Catégorie" className="w-full p-3 border rounded-xl" />

          <input name="dimensions" placeholder="Dimensions" className="w-full p-3 border rounded-xl" />

          <input name="year" placeholder="Année" className="w-full p-3 border rounded-xl" />

          <input
            type="file"
            name="images"
            multiple
            required
            className="w-full"
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            {loading ? "Uploading..." : "Ajouter"}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-sm text-neutral-600">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}