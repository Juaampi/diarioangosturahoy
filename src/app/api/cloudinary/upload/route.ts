import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

function configureCloudinary() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return false;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return true;
}

export async function POST(request: Request) {
  if (!configureCloudinary()) {
    return NextResponse.json(
      {
        error:
          "Cloudinary no esta configurado. Puedes usar URL externa o completar CLOUDINARY_*.",
      },
      { status: 400 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo invalido." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const uploaded = await cloudinary.uploader.upload(base64, {
    folder: "diario-angostura-hoy",
  });

  return NextResponse.json({ url: uploaded.secure_url });
}
