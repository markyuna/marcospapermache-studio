import { NextResponse } from "next/server";

type RequestBody = {
  prompt?: string;
  size?: "30x40" | "50x70" | "70x100";
  withFrame?: boolean;
};

function getImageSize(size?: RequestBody["size"]) {
  switch (size) {
    case "30x40":
      return "1024x1536";
    case "70x100":
      return "1024x1536";
    case "50x70":
    default:
      return "1024x1536";
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const prompt = body?.prompt?.trim();
    const imageSize = getImageSize(body?.size);
    const withFrame = Boolean(body?.withFrame);

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