import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "us-east-1",
});

export const uploadRoutes = new Elysia({ prefix: "/upload" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET || "default_secret" }))
  .derive(async ({ headers, jwt }) => {
    const authHeader = headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) return { userId: null };
    const token = authHeader.split(" ")[1];
    const payload = await jwt.verify(token);
    return { userId: payload ? (payload.sub as string || payload.id as string) : null };
  })
  .onBeforeHandle(({ userId, set }) => {
    if (!userId) { set.status = 401; return { status: "error", message: "Unauthorized" }; }
  })
  .get("/presigned-url", async ({ query, set }) => {
    try {
      const fileName = `uploads/${Date.now()}-${query.filename}`;
      const command = new PutObjectCommand({
        Bucket: "www.ppwl-a1.store",
        Key: fileName,
        ContentType: query.contentType,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 300 });
      return {
        status: "success",
        data: {
          uploadUrl: url,
          fileUrl: `https://s3.us-east-1.amazonaws.com/www.ppwl-a1.store/${fileName}`,
        },
      };
    } catch (error: any) {
      set.status = 500;
      return { status: "error", message: error.message };
    }
  });