import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: "2024-03-08", // Set to a recent date
});
