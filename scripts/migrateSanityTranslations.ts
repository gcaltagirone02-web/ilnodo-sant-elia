/**
 * Sanity Translation Migration Script
 *
 * Populates nameEn, nameFr, descriptionEn, descriptionFr,
 * ingredientsEn, ingredientsFr on Sanity menuItem documents
 * using the translations already present in menuFallback.ts.
 *
 * Usage:
 *   npx tsx scripts/migrateSanityTranslations.ts              # dry-run
 *   npx tsx scripts/migrateSanityTranslations.ts --execute     # apply patches
 *   npx tsx scripts/migrateSanityTranslations.ts --verify      # post-migration audit
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";
import { menuFallbackData } from "../src/data/menuFallback";

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
    // .env not found
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
  useCdn: false,
  apiVersion: "2024-03-08",
  token: process.env.SANITY_WRITE_TOKEN ?? env.SANITY_WRITE_TOKEN,
});

// --------------- types ---------------
interface SanityMenuItem {
  _id: string;
  name: string;
  nameEn?: string;
  nameFr?: string;
  description?: string;
  descriptionEn?: string;
  descriptionFr?: string;
  ingredients?: string[];
  ingredientsEn?: string[];
  ingredientsFr?: string[];
  categorySlug?: string;
}

interface PatchFields {
  nameEn?: string;
  nameFr?: string;
  descriptionEn?: string;
  descriptionFr?: string;
  ingredientsEn?: string[];
  ingredientsFr?: string[];
}

// --------------- helpers ---------------
const isEmpty = (v: unknown): boolean => {
  if (v === undefined || v === null || v === "") return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
};

// --------------- verify mode ---------------
async function runVerify() {
  console.log("\n=== POST-MIGRATION VERIFICATION ===\n");
  console.log(`Project: ${projectId} / ${dataset}\n`);

  const summary = await client.fetch<Record<string, number>>(`{
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
  }`);

  console.log(`Menu items total:        ${summary.total}`);
  console.log(`Missing nameEn:          ${summary.missingNameEn} / ${summary.total}`);
  console.log(`Missing nameFr:          ${summary.missingNameFr} / ${summary.total}`);
  console.log(`Missing descriptionEn:   ${summary.missingDescEn}`);
  console.log(`Missing descriptionFr:   ${summary.missingDescFr}`);
  console.log(`Missing ingredientsEn:   ${summary.missingIngrEn}`);
  console.log(`Missing ingredientsFr:   ${summary.missingIngrFr}`);
  console.log(`Categories total:        ${summary.catTotal}`);
  console.log(`Cat missing titleEn:     ${summary.catMissingEn} / ${summary.catTotal}`);
  console.log(`Cat missing titleFr:     ${summary.catMissingFr} / ${summary.catTotal}`);
  console.log("");

  const allGood =
    summary.missingNameEn === 0 &&
    summary.missingNameFr === 0 &&
    summary.missingDescEn === 0 &&
    summary.missingDescFr === 0 &&
    summary.missingIngrEn === 0 &&
    summary.missingIngrFr === 0;

  if (allGood) {
    console.log("ALL MENU ITEM TRANSLATIONS COMPLETE!");
  } else {
    console.log("SOME TRANSLATIONS STILL MISSING — review above.");
  }

  if (summary.catMissingEn > 0 || summary.catMissingFr > 0) {
    console.log(
      "\nNote: Category translations (titleEn/titleFr) are NOT handled by this script.",
    );
    console.log(
      "They are resolved via ui.ts translation keys in the page components.",
    );
  }

  console.log("");
}

// --------------- main migration ---------------
async function runMigration(execute: boolean) {
  const mode = execute ? "EXECUTE" : "DRY-RUN";
  console.log(`\n=== SANITY TRANSLATION MIGRATION (${mode}) ===\n`);
  console.log(`Project: ${projectId} / ${dataset}`);

  if (execute && !client.config().token) {
    console.error(
      "\nERROR: --execute requires SANITY_WRITE_TOKEN in .env or environment.\n" +
        "Generate a token at: https://www.sanity.io/manage → API → Tokens\n" +
        "Then add to .env:  SANITY_WRITE_TOKEN=sk...\n",
    );
    process.exit(1);
  }

  // 1. Fetch all Sanity menuItems
  console.log("\nFetching Sanity documents...");
  const sanityDocs = await client.fetch<SanityMenuItem[]>(
    `*[_type == "menuItem"] | order(name asc) {
      _id, name, nameEn, nameFr,
      description, descriptionEn, descriptionFr,
      ingredients, ingredientsEn, ingredientsFr,
      "categorySlug": category->slug.current
    }`,
  );
  console.log(`  Found ${sanityDocs.length} documents on Sanity.\n`);

  // 2. Build lookup: name → SanityMenuItem[]
  const sanityByName = new Map<string, SanityMenuItem[]>();
  for (const doc of sanityDocs) {
    const key = doc.name.trim();
    const existing = sanityByName.get(key) ?? [];
    existing.push(doc);
    sanityByName.set(key, existing);
  }

  // 3. Build translation map from fallback data (lookup by nameIt, not index)
  const itData = menuFallbackData.it;
  const enData = menuFallbackData.en;
  const frData = menuFallbackData.fr;

  interface TranslationEntry {
    itName: string;
    enName?: string;
    frName?: string;
    enDescription?: string;
    frDescription?: string;
    enIngredients?: string[];
    frIngredients?: string[];
    category: string;
  }

  const translations: TranslationEntry[] = [];
  const lookupWarnings: string[] = [];

  for (const cat of Object.keys(itData)) {
    const itItems = itData[cat];
    const enItems = enData[cat] ?? [];
    const frItems = frData[cat] ?? [];

    if (enItems.length === 0 || frItems.length === 0) {
      console.warn(`  WARNING: category "${cat}" missing in EN or FR fallback`);
    }

    // Build nameIt → item lookup maps for EN and FR
    const enByNameIt = new Map<string, (typeof enItems)[0]>();
    for (const item of enItems) {
      const key = (item.nameIt ?? item.name).trim();
      enByNameIt.set(key, item);
    }

    const frByNameIt = new Map<string, (typeof frItems)[0]>();
    for (const item of frItems) {
      const key = (item.nameIt ?? item.name).trim();
      frByNameIt.set(key, item);
    }

    for (const itItem of itItems) {
      const itName = itItem.name.trim();
      const enItem = enByNameIt.get(itName);
      const frItem = frByNameIt.get(itName);

      if (!enItem) {
        lookupWarnings.push(`  ${cat}: "${itName}" → no EN match (nameIt lookup)`);
      }
      if (!frItem) {
        lookupWarnings.push(`  ${cat}: "${itName}" → no FR match (nameIt lookup)`);
      }

      translations.push({
        itName,
        enName: enItem?.name,
        frName: frItem?.name,
        enDescription: enItem?.description,
        frDescription: frItem?.description,
        enIngredients: enItem?.ingredients,
        frIngredients: frItem?.ingredients,
        category: cat,
      });
    }
  }

  if (lookupWarnings.length > 0) {
    console.warn(`\nLookup warnings (${lookupWarnings.length}):`);
    for (const w of lookupWarnings) console.warn(w);
    console.warn("");
  } else {
    console.log("  All fallback items matched by nameIt lookup — no warnings.\n");
  }

  // 4. Match and build patches
  let updated = 0;
  let skipped = 0;
  let missing = 0;
  const missingNames: string[] = [];
  const patches: Array<{ id: string; name: string; fields: PatchFields }> = [];

  for (const t of translations) {
    const docs = sanityByName.get(t.itName);

    if (!docs || docs.length === 0) {
      console.log(`  [MISS] "${t.itName}"  [${t.category}]`);
      missingNames.push(t.itName);
      missing++;
      continue;
    }

    for (const doc of docs) {
      const fields: PatchFields = {};

      if (t.enName && isEmpty(doc.nameEn)) fields.nameEn = t.enName;
      if (t.frName && isEmpty(doc.nameFr)) fields.nameFr = t.frName;
      if (t.enDescription && isEmpty(doc.descriptionEn))
        fields.descriptionEn = t.enDescription;
      if (t.frDescription && isEmpty(doc.descriptionFr))
        fields.descriptionFr = t.frDescription;
      if (t.enIngredients && t.enIngredients.length > 0 && isEmpty(doc.ingredientsEn))
        fields.ingredientsEn = t.enIngredients;
      if (t.frIngredients && t.frIngredients.length > 0 && isEmpty(doc.ingredientsFr))
        fields.ingredientsFr = t.frIngredients;

      const fieldNames = Object.keys(fields);
      if (fieldNames.length === 0) {
        console.log(`  [SKIP] "${doc.name}" → all fields already populated`);
        skipped++;
        continue;
      }

      console.log(
        `  [OK]   "${doc.name}" → ${fieldNames.join(", ")}`,
      );
      patches.push({ id: doc._id, name: doc.name, fields });
      updated++;
    }
  }

  // 5. Mismatch safety check
  if (missing > 5) {
    console.error(
      `\nABORT: ${missing} items not found on Sanity (threshold: 5).`,
    );
    console.error("Mismatched names:");
    for (const n of missingNames) console.error(`  - ${n}`);
    console.error("\nFix the name mismatches in menuFallback.ts before retrying.\n");
    process.exit(1);
  }

  // 6. Summary
  console.log("\n==================================");
  console.log("           SUMMARY");
  console.log("==================================");
  console.log(`  Updated:  ${updated}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Missing:  ${missing}`);
  console.log(`  Total:    ${updated + skipped + missing}`);
  console.log("");

  if (!execute) {
    console.log("DRY-RUN complete. No changes written to Sanity.");
    console.log("To apply, re-run with:  npx tsx scripts/migrateSanityTranslations.ts --execute\n");
    return;
  }

  // 7. Execute patches
  console.log(`Applying ${patches.length} patches to Sanity...\n`);

  let success = 0;
  let failed = 0;

  for (const p of patches) {
    try {
      await client.patch(p.id).set(p.fields).commit();
      success++;
    } catch (err: any) {
      console.error(`  FAILED: "${p.name}" (${p.id}): ${err.message}`);
      failed++;
    }
  }

  console.log(`\nPatching complete: ${success} succeeded, ${failed} failed.`);
  if (failed === 0) {
    console.log(
      "\nRun verification:  npx tsx scripts/migrateSanityTranslations.ts --verify\n",
    );
  }
}

// --------------- CLI ---------------
const args = process.argv.slice(2);
const flag = args[0] ?? "";

if (flag === "--verify") {
  runVerify().catch((err) => {
    console.error("Verification failed:", err.message);
    process.exit(1);
  });
} else if (flag === "--execute") {
  runMigration(true).catch((err) => {
    console.error("Migration failed:", err.message);
    process.exit(1);
  });
} else {
  runMigration(false).catch((err) => {
    console.error("Migration failed:", err.message);
    process.exit(1);
  });
}
