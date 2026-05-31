import { NextResponse } from "next/server";
import { z } from "zod";
import { generatePresignedUrl } from "@/lib/s3";

const uploadRequestSchema = z.object({
  fileName: z.string().trim().min(1),
  fileType: z.string().trim().min(1),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const result = uploadRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors }, { status: 400 });
    }

    const { fileName, fileType } = result.data;
    const data = await generatePresignedUrl(fileName, fileType);
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
