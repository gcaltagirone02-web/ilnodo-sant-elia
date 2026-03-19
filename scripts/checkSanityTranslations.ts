/**
 * Sanity Translation Audit Script
 *
 * Checks all menuItem and category documents for missing
 * English (nameEn) and French (nameFr) translations.
 *
 * Usage:
 *   npx tsx scripts/checkSanityTranslations.ts
 *
 * Reads PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET
 * from .env (falls back to hardcoded defaults).
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

// --------------- env ---------------
function loadEnv(): Record<string, string> {
  const vars: Record<string, string> = {};
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env"), "utf-8");
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.]+)\s*=\s*(.*)$/);
      if (match) vars[match[1]] = match[2].trim();
    }
  } catch {
    // .env not found — fall through to defaults
  }
  return vars;
}

const env = loadEnv();
const projectId =
  process.env.PUBLIC_SANITY_PROJECT_ID ??
  env.PUBLIC_SANITY_PROJECT_ID ??
  "r3e9n3a3";
const dataset =
  process.env.PUBLIC_SANITY_DATASET ??
  env.PUBLIC_SANITY_DATASET ??
  "production";

const client = createClient({
  projectId,
  dataset,
  useCdn: false, // fresh data for audit
  apiVersion: "2024-03-08",
});

// --------------- queries ---------------
interface CountReport {
  total: number;
  missingNameEn: number;
  missingNameFr: number;
  missingDescEn: number;
  missingDescFr: number;
  missingIngrEn: number;
  missingIngrFr: number;
  catTotal: number;
  catMissingEn: number;
  catMissingFr: number;
}

const SUMMARY_QUERY = `{
  "total":          count(*[_type == "menuItem"]),
  "missingNameEn":  count(*[_type == "menuItem" && (!defined(nameEn) || nameEn == "")]),
  "missingNameFr":  count(*[_type == "menuItem" && (!defined(nameFr) || nameFr == "")]),
  "missingDescEn":  count(*[_type == "menuItem" && defined(description) && description != "" && (!defined(descriptionEn) || descriptionEn == "")]),
  "missingDescFr":  count(*[_type == "menuItem" && defined(description) && description != "" && (!defined(descriptionFr) || descriptionFr == "")]),
  "missingIngrEn":  count(*[_type == "menuItem" && defined(ingredients) && count(ingredients) > 0 && (!defined(ingredientsEn) || count(ingredientsEn) == 0)]),
  "missingIngrFr":  count(*[_type == "menuItem" && defined(ingredients) && count(ingredients) > 0 && (!defined(ingredientsFr) || count(ingredientsFr) == 0)]),
  "catTotal":       count(*[_type == "category"]),
  "catMissingEn":   count(*[_type == "category" && (!defined(titleEn) || titleEn == "")]),
  "catMissingFr":   count(*[_type == "category" && (!defined(titleFr) || titleFr == "")])
}`;

interface MissingItem {
  name: string;
  nameEn?: string;
  nameFr?: string;
  category?: string;
}

const MISSING_EN_QUERY = `*[_type == "menuItem" && (!defined(nameEn) || nameEn == "")] | order(name asc) {
  name, nameEn, nameFr, "category": category->slug.current
}`;

const MISSING_FR_QUERY = `*[_type == "menuItem" && (!defined(nameFr) || nameFr == "")] | order(name asc) {
  name, nameEn, nameFr, "category": category->slug.current
}`;

const MISSING_INGR_EN_QUERY = `*[_type == "menuItem" && defined(ingredients) && count(ingredients) > 0 && (!defined(ingredientsEn) || count(ingredientsEn) == 0)] | order(name asc) {
  name, "category": category->slug.current
}`;

const MISSING_INGR_FR_QUERY = `*[_type == "menuItem" && defined(ingredients) && count(ingredients) > 0 && (!defined(ingredientsFr) || count(ingredientsFr) == 0)] | order(name asc) {
  name, "category": category->slug.current
}`;

// --------------- main ---------------
async function main() {
  console.log(`\nSanity Translation Audit`);
  console.log(`Project: ${projectId} / ${dataset}\n`);
  console.log("Fetching data...\n");

  const [summary, missingEn, missingFr, missingIngrEn, missingIngrFr] =
    await Promise.all([
      client.fetch<CountReport>(SUMMARY_QUERY),
      client.fetch<MissingItem[]>(MISSING_EN_QUERY),
      client.fetch<MissingItem[]>(MISSING_FR_QUERY),
      client.fetch<MissingItem[]>(MISSING_INGR_EN_QUERY),
      client.fetch<MissingItem[]>(MISSING_INGR_FR_QUERY),
    ]);

  // ---- Summary table ----
  console.log("==================================");
  console.log("         SUMMARY REPORT           ");
  console.log("==================================");
  console.log(`Menu items total:          ${summary.total}`);
  console.log(`Categories total:          ${summary.catTotal}`);
  console.log("");
  console.log("--- Names ---");
  console.log(
    `  Missing nameEn:          ${summary.missingNameEn} / ${summary.total}`,
  );
  console.log(
    `  Missing nameFr:          ${summary.missingNameFr} / ${summary.total}`,
  );
  console.log("");
  console.log("--- Descriptions (only where IT exists) ---");
  console.log(`  Missing descriptionEn:   ${summary.missingDescEn}`);
  console.log(`  Missing descriptionFr:   ${summary.missingDescFr}`);
  console.log("");
  console.log("--- Ingredients (only where IT exists) ---");
  console.log(`  Missing ingredientsEn:   ${summary.missingIngrEn}`);
  console.log(`  Missing ingredientsFr:   ${summary.missingIngrFr}`);
  console.log("");
  console.log("--- Categories ---");
  console.log(
    `  Missing titleEn:         ${summary.catMissingEn} / ${summary.catTotal}`,
  );
  console.log(
    `  Missing titleFr:         ${summary.catMissingFr} / ${summary.catTotal}`,
  );
  console.log("");

  const allGood =
    summary.missingNameEn === 0 &&
    summary.missingNameFr === 0 &&
    summary.missingDescEn === 0 &&
    summary.missingDescFr === 0 &&
    summary.missingIngrEn === 0 &&
    summary.missingIngrFr === 0 &&
    summary.catMissingEn === 0 &&
    summary.catMissingFr === 0;

  if (allGood) {
    console.log("ALL TRANSLATIONS COMPLETE!\n");
    return;
  }

  // ---- Detail lists ----
  if (missingEn.length > 0) {
    console.log("----------------------------------");
    console.log(`Items missing nameEn (${missingEn.length}):`);
    console.log("----------------------------------");
    for (const item of missingEn) {
      console.log(`  - ${item.name}  [${item.category}]`);
    }
    console.log("");
  }

  if (missingFr.length > 0) {
    console.log("----------------------------------");
    console.log(`Items missing nameFr (${missingFr.length}):`);
    console.log("----------------------------------");
    for (const item of missingFr) {
      console.log(`  - ${item.name}  [${item.category}]`);
    }
    console.log("");
  }

  if (missingIngrEn.length > 0) {
    console.log("----------------------------------");
    console.log(`Items missing ingredientsEn (${missingIngrEn.length}):`);
    console.log("----------------------------------");
    for (const item of missingIngrEn) {
      console.log(`  - ${item.name}  [${item.category}]`);
    }
    console.log("");
  }

  if (missingIngrFr.length > 0) {
    console.log("----------------------------------");
    console.log(`Items missing ingredientsFr (${missingIngrFr.length}):`);
    console.log("----------------------------------");
    for (const item of missingIngrFr) {
      console.log(`  - ${item.name}  [${item.category}]`);
    }
    console.log("");
  }
}

main().catch((err) => {
  console.error("Audit failed:", err.message);
  process.exit(1);
});
