import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { categoryType } from "./src/sanity/schemaTypes/category";
import { menuItemType } from "./src/sanity/schemaTypes/menuItem";
import { operationsType } from "./src/sanity/schemaTypes/operations";

export default defineConfig({
  name: "il-nodo",
  title: "Il Nodo Content Management",

  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || "r3e9n3a3",
  dataset: process.env.PUBLIC_SANITY_DATASET || "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Il Nodo 2.0 - Pannello")
          .items([
            // Sezione Proprietari: Alain & Alida
            S.listItem()
              .title("Gestione Menù")
              .icon(() => "🍴")
              .child(
                S.list()
                  .title("Menù")
                  .items([
                    S.documentTypeListItem("menuItem").title("Voci Menù"),
                    S.documentTypeListItem("category").title("Categorie"),
                  ])
              ),
            
            S.divider(),

            // Sezione Developer/Gestione Tecnica
            S.listItem()
              .title("Impostazioni Tecniche")
              .icon(operationsType.icon)
              .child(
                S.list()
                  .title("Configurazione")
                  .items([
                    S.listItem()
                      .title("Impostazioni Sito & Orari")
                      .id("operations")
                      .icon(operationsType.icon)
                      .child(
                        S.document()
                          .schemaType("operations")
                          .documentId("operations")
                          .title("Impostazioni Sito & Orari")
                      ),
                  ])
              ),
          ]),
    }),
  ],

  schema: {
    types: [categoryType, menuItemType, operationsType],
  },
});
