import { NextResponse } from "next/server";

type RequestBody = {
  prompt?: string;
  creationType?: "wall" | "object" | "light";
  withFrame?: boolean;
};

export async function POST(request: Request) {
  try {
    // Basic origin guard — prevents direct API abuse from other domains
    const origin = request.headers.get("origin") ?? "";
    const referer = request.headers.get("referer") ?? "";
    if (
      process.env.NODE_ENV === "production" &&
      !origin.includes("marcospapermache.com") &&
      !referer.includes("marcospapermache.com")
    ) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const body = (await request.json()) as RequestBody;
    const prompt = body?.prompt?.trim();
    const creationType = body?.creationType ?? "wall";
    const withFrame = Boolean(body?.withFrame);
    const imageSize = creationType === "wall" ? "1024x1536" : "1024x1024";

    if (!prompt) {
      return NextResponse.json({ error: "Prompt manquant." }, { status: 400 });
    }

    const reinforcedPrompt = withFrame
      ? `${prompt}, zoomed out composition, the full outer frame must be completely visible with comfortable margin on every side, no cropped frame, no cut edges, no partial artwork, the artwork must fit naturally inside the image`
      : `${prompt}, centered composition, complete artwork fully visible, no cropped edges`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: reinforcedPrompt,
        size: imageSize,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Erreur OpenAI." },
        { status: response.status },
      );
    }

    const imageBase64 = data?.data?.[0]?.b64_json;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Aucune image générée." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      image: `data:image/png;base64,${imageBase64}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur pendant la génération." },
      { status: 500 },
    );
  }
}