import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/admin-auth";
import {
  getUserProfile,
  upsertUserProfile,
  type ProfileFields,
} from "@/lib/user-profile";

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const profile = await getUserProfile(user.id);

  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = (await request.json()) as ProfileFields;

  const fields: ProfileFields = {
    fullName: body.fullName?.trim() || null,
    address: body.address?.trim() || null,
    city: body.city?.trim() || null,
    postalCode: body.postalCode?.trim() || null,
    country: body.country?.trim() || null,
    phone: body.phone?.trim() || null,
  };

  try {
    const profile = await upsertUserProfile(user.id, fields);
    return NextResponse.json({ profile });
  } catch (err) {
    console.error("/api/user/profile PUT failed:", err);
    return NextResponse.json(
      { error: "Impossible d'enregistrer les modifications." },
      { status: 500 },
    );
  }
}
