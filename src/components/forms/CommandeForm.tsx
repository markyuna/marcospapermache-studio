"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function CommandeForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/commandes", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Réponse non JSON:", text);
        throw new Error("Le serveur a retourné une réponse invalide.");
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Une erreur est survenue.");
      }

      form.reset();
      setImagePreview(null);
      setSuccess(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  function handleRemoveImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);

    const input = document.querySelector(
      'input[name="image"]'
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  if (success) {
    return (
      <div className="rounded-[2rem] border border-black/5 bg-white/70 p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-sm">
        <h3 className="text-2xl font-medium text-[#181512]">
          Demande envoyée ✨
        </h3>
        <p className="mt-4 text-[#5f5348]">
          Merci. Je vous répondrai rapidement pour discuter de votre projet.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-sm"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <input
          name="name"
          placeholder="Nom"
          required
          className="rounded-xl border border-[#e7d5c5] bg-white px-4 py-3 text-sm text-[#181512] outline-none transition focus:border-[#ff6a00]"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded-xl border border-[#e7d5c5] bg-white px-4 py-3 text-sm text-[#181512] outline-none transition focus:border-[#ff6a00]"
        />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <input
          name="projectType"
          placeholder="Type de projet (murale, objet, etc.)"
          className="rounded-xl border border-[#e7d5c5] bg-white px-4 py-3 text-sm text-[#181512] outline-none transition focus:border-[#ff6a00]"
        />

        <input
          name="dimensions"
          placeholder="Dimensions souhaitées"
          className="rounded-xl border border-[#e7d5c5] bg-white px-4 py-3 text-sm text-[#181512] outline-none transition focus:border-[#ff6a00]"
        />
      </div>

      <div className="mt-6">
        <input
          name="budget"
          placeholder="Budget estimé (€)"
          className="w-full rounded-xl border border-[#e7d5c5] bg-white px-4 py-3 text-sm text-[#181512] outline-none transition focus:border-[#ff6a00]"
        />
      </div>

      <div className="mt-6">
        <textarea
          name="message"
          placeholder="Décrivez votre idée..."
          rows={5}
          required
          className="w-full rounded-xl border border-[#e7d5c5] bg-white px-4 py-3 text-sm text-[#181512] outline-none transition focus:border-[#ff6a00]"
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-[#5f5348]">
          Image de référence
        </label>

        <input
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          className="block w-full rounded-xl border border-[#e7d5c5] bg-white px-4 py-3 text-sm text-[#5f5348] file:mr-4 file:rounded-full file:border-0 file:bg-[#181512] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />

        {imagePreview && (
          <div className="relative mt-4 overflow-hidden rounded-xl border border-[#e7d5c5] bg-white">
            <div className="relative h-64 w-full">
              <Image
                src={imagePreview}
                alt="Aperçu de l’image"
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur-md transition hover:bg-black/80"
            >
              Supprimer
            </button>
          </div>
        )}

        <p className="mt-2 text-xs text-[#8a7667]">
          JPG, PNG ou WEBP — max 5 MB
        </p>
      </div>

      {errorMessage && (
        <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full rounded-full bg-[#181512] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2a241f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Envoi..." : "Envoyer la demande"}
      </button>
    </form>
  );
}