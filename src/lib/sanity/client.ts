import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || "r3e9n3a3",
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  perspective: "published",
  apiVersion: "2024-03-08",
});
