"use client";

import { useState } from "react";

type Commande = {
  id: string;
  name: string;
  email: string;
  project_type: string | null;
  dimensions: string | null;
  budget: string | null;
  message: string;
  image_url: string | null;
  file_url: string | null;
  status: string;
  created_at: string;
};

export default function CommandeDetail({
  commande,
}: {
  commande: Commande;
}) {
  const [status, setStatus] = useState(commande.status);
  const [loading, setLoading] = useState(false);

  const previewImage = commande.file_url || commande.image_url;

  const updateStatus = async () => {
    setLoading(true);

    const res = await fetch("/api/admin/update-status", {
      method: "POST",
      body: JSON.stringify({
        id: commande.id,
        status,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Erreur mise à jour");
    } else {
      alert("Statut mis à jour");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold">
        Commande
      </h1>

      {/* Image */}
      {previewImage && (
        <img
          src={previewImage}
          className="w-full rounded-xl"
        />
      )}

      {/* Infos */}
      <div className="bg-white p-6 rounded-xl shadow">
        <p><strong>Client:</strong> {commande.name}</p>
        <p><strong>Email:</strong> {commande.email}</p>
        <p><strong>Projet:</strong> {commande.project_type}</p>
        <p><strong>Dimensions:</strong> {commande.dimensions}</p>
        <p><strong>Budget:</strong> {commande.budget}</p>
      </div>

      {/* Message */}
      <div className="bg-neutral-100 p-6 rounded-xl">
        <p>{commande.message}</p>
      </div>

      {/* Status */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-semibold">Statut</h2>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>

        <button
          onClick={updateStatus}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}