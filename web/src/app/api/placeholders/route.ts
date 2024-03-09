import { NextRequest } from "next/server";
import { getPlaiceholder } from "plaiceholder";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let src = searchParams.get("src");
  if (!src) {
    return Response.json(
      {
        message: "bad request",
        errors: "query parameter 'src' is required",
      },
      { status: 400 },
    );
  }

  if (src.startsWith('"')) {
    src = src.slice(1);
  }
  if (src.endsWith('"')) {
    src = src.slice(0, -1);
  }

  try {
    new URL(src);
  } catch (e) {
    return Response.json(
      {
        message: "bad request",
        errors: `invalid 'src' url '${src}'`,
      },
      { status: 400 },
    );
  }

  try {
    const { base64 } = await generateBlurPlaceholder(src);
    return Response.json({ data: { base64 } });
  } catch (e) {
    // TODO: structured logging
    return Response.json(
      {
        message: "internal server error",
      },
      { status: 500 },
    );
  }
}

async function generateBlurPlaceholder(src: string) {
  const buffer = await fetch(src).then(async function getImageData(res) {
    return Buffer.from(await res.arrayBuffer());
  });

  return await getPlaiceholder(buffer);
}
