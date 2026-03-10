import { treaty } from "@elysiajs/eden";
import type { App } from "../app/api/[[...slugs]]/route";

const envBaseUrl = process.env.NEXT_PUBLIC_APP_URL;
const browserBaseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : (envBaseUrl ?? "http://localhost:3000");

export const client = treaty<App>(browserBaseUrl).api;
