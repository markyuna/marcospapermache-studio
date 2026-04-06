import Link from "next/link";
import type { Commande } from "@/types/commande";
import {
  getCommandeStatusClasses,
  getCommandeStatusLabel,
} from "@/lib/commandes-status";

type CommandesTableProps = {
  commandes: Commande[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function CommandesTable({ commandes }: CommandesTableProps) {
  if (!commandes.length) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-sm text-neutral-500">
        Aucune commande trouvée.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            <th className="px-4 py-4 font-medium">ID</th>
            <th className="px-4 py-4 font-medium">Client</th>
            <th className="px-4 py-4 font-medium">Projet</th>
            <th className="px-4 py-4 font-medium">Budget</th>
            <th className="px-4 py-4 font-medium">Date</th>
            <th className="px-4 py-4 font-medium">Statut</th>
            <th className="px-4 py-4 font-medium">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-neutral-200">
          {commandes.map((commande) => (
            <tr key={commande.id} className="hover:bg-neutral-50/70">
              <td className="px-4 py-4 font-medium text-neutral-900">
                #{commande.id}
              </td>

              <td className="px-4 py-4">
                <div className="flex flex-col">
                  <span className="font-medium text-neutral-900">
                    {commande.name}
                  </span>
                  <span className="text-neutral-500">{commande.email}</span>
                </div>
              </td>

              <td className="px-4 py-4 text-neutral-700">
                {commande.project_type || "—"}
              </td>

              <td className="px-4 py-4 text-neutral-700">
                {commande.budget || "—"}
              </td>

              <td className="px-4 py-4 text-neutral-700">
                {formatDate(commande.created_at)}
              </td>

              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getCommandeStatusClasses(
                    commande.status
                  )}`}
                >
                  {getCommandeStatusLabel(commande.status)}
                </span>
              </td>

              <td className="px-4 py-4">
                <Link
                  href={`/admin/commandes/${commande.id}`}
                  className="inline-flex rounded-xl border border-neutral-200 px-4 py-2 font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
                >
                  Voir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}