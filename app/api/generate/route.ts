import { NextRequest } from "next/server";
import sharp from "sharp";
import { buildDoodleSvg } from "@/lib/doodle";
import { StyleKey } from "@/lib/styles";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const image = form.get("image") as File | null;
    const style = (form.get("style") as StyleKey) || "cute";
    const customText = (form.get("customText") as string) || "";

    if (!image) {
      return new Response("未上传图片", { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    const base = sharp(inputBuffer).rotate();
    const metadata = await base.metadata();

    const width = metadata.width || 1080;
    const height = metadata.height || 1440;

    const svg = buildDoodleSvg(width, height, style, customText);

    const output = await base
      .composite([
        {
          input: Buffer.from(svg),
          top: 0,
          left: 0
        }
      ])
      .png()
      .toBuffer();

    const body = new Uint8Array(output);

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="photo-doodle-result.png"',
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("generate error:", error);
    return new Response("生成失败", { status: 500 });
  }
}