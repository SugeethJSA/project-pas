import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
});

export async function generatePresignedUrl(fileName, fileType) {
  if (!R2_ACCOUNT_ID || !R2_BUCKET_NAME) {
    throw new Error("Cloudflare R2 is not configured");
  }

  // Generate a unique object key
  const uniqueId = Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9);
  const objectKey = `papers/${uniqueId}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: objectKey,
    ContentType: fileType,
  });

  // Pre-signed URL expires in 1 hour (3600 seconds)
  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });

  const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || `https://pub-${Math.random().toString(36).substring(2)}.r2.dev`;
  
  return {
    uploadUrl,
    fileUrl: `${publicDomain}/${objectKey}`,
    objectKey
  };
}
