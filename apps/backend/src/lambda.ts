import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./routes/auth.route";
import { postRoutes } from "./routes/post.route";
import { notificationRoutes } from "./routes/notification.route";
import { userRoutes } from "./routes/user.route";
import { uploadRoutes } from "./routes/upload.route";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://ppwl-a1.store",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const app = new Elysia()
  .get("/", () => ({ service: "PPWL Social Media API", status: "ready", message: "API siap dikembangkan." }))
  .use(cors({
    origin: [
      "https://ppwl-a1.store",
      "https://www.ppwl-a1.store",
      "http://ppwl-a1.store.s3-website-us-east-1.amazonaws.com",
      "http://www.ppwl-a1.store.s3-website-us-east-1.amazonaws.com",
    ],
    credentials: true,
  }))
  .use(authRoutes)
  .group("/api", (app) => app
    .use(postRoutes)
    .use(notificationRoutes)
    .use(userRoutes)
    .use(uploadRoutes)
  );

export const handler = async (event: any, context: any) => {
  if (event.requestContext.http.method === "OPTIONS") {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: "",
    };
  }

  const url = `https://${event.requestContext.domainName}${event.rawPath}${event.rawQueryString ? '?' + event.rawQueryString : ''}`;

  const request = new Request(url, {
    method: event.requestContext.http.method,
    headers: event.headers,
    body: ["GET", "HEAD"].includes(event.requestContext.http.method)
      ? undefined
      : event.body
        ? (event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body)
        : undefined,
  });

  const response = await app.handle(request);

  const responseBody = await response.text();
  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  if (responseBody.length > 5000000) {
    return {
      statusCode: 413,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Response too large" }),
    };
  }

  return {
    statusCode: response.status,
    headers: {
      ...responseHeaders,
      ...CORS_HEADERS,
    },
    body: responseBody,
    isBase64Encoded: false,
  };
};