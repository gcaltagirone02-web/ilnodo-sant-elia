// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sanity from "@sanity/astro";
import sitemap from "@astrojs/sitemap";
import cookieconsent from "@jop-software/astro-cookieconsent";

// https://astro.build/config
export default defineConfig({
// Cloudflare Pages deployment (static output)
output: "static",
site: "https://ilnodosantelia.it",

  i18n: {
    defaultLocale: "it",
    locales: ["it", "en", "fr"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
	sitemap(),
	sanity({
      projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || "your-project-id",
      dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
      useCdn: true,
    }),
    cookieconsent({
      revision: 1,
      cookie: {
        expiresAfterDays: 182,
      },
      guiOptions: {
        consentModal: {
          layout: "cloud",
          position: "bottom center",
          equalWeightButtons: true,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        maps: {
          enabled: false,
          readOnly: false,
        },
      },
      language: {
        default: "it",
        translations: {
          it: {
            consentModal: {
              title: "Questo sito usa cookie",
              description:
                "Utilizziamo cookie di terze parti solo per mostrarti la mappa di Google Maps. Puoi accettare o rifiutare.",
              acceptAllBtn: "Accetta",
              acceptNecessaryBtn: "Rifiuta",
              showPreferencesBtn: "Gestisci",
              footer: `
                <a href="/privacy-policy" target="_blank">Privacy Policy</a>
                <a href="/cookie-policy" target="_blank">Cookie Policy</a>
              `,
            },
            preferencesModal: {
              title: "Preferenze cookie",
              savePreferencesBtn: "Salva preferenze",
              acceptAllBtn: "Accetta tutti",
              acceptNecessaryBtn: "Rifiuta tutti",
              closeIconLabel: "Chiudi",
              sections: [
                {
                  title: "Cookie necessari",
                  description: "Essenziali per il funzionamento del sito. Non possono essere disattivati.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Google Maps",
                  description: "Permette di visualizzare la mappa interattiva con la nostra posizione.",
                  linkedCategory: "maps",
                },
              ],
            },
          },
          fr: {
            consentModal: {
              title: "Ce site utilise des cookies",
              description:
                "Nous utilisons des cookies tiers uniquement pour vous montrer la carte Google Maps. Vous pouvez accepter ou refuser.",
              acceptAllBtn: "Accepter",
              acceptNecessaryBtn: "Refuser",
              showPreferencesBtn: "Gérer",
              footer: `
                <a href="/fr/privacy-policy" target="_blank">Politique de confidentialité</a>
                <a href="/fr/cookie-policy" target="_blank">Politique relative aux cookies</a>
              `,
            },
            preferencesModal: {
              title: "Préférences de cookies",
              savePreferencesBtn: "Enregistrer",
              acceptAllBtn: "Tout accepter",
              acceptNecessaryBtn: "Tout refuser",
              closeIconLabel: "Fermer",
              sections: [
                {
                  title: "Cookies nécessaires",
                  description: "Essentiels au fonctionnement del site.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Google Maps",
                  description: "Permet d'afficher la carte interactive avec notre position.",
                  linkedCategory: "maps",
                },
              ],
            },
          },
        },
      },
      onConsent: () => {
        window.dispatchEvent(new CustomEvent('cc:onConsent'));
      },
      onChange: () => {
        window.dispatchEvent(new CustomEvent('cc:onChange'));
      },
    }),
  ],

 vite: {
 	plugins: [tailwindcss()],
 	build: {
 		rollupOptions: {
 			output: {
 				manualChunks: {
 					vendor: ['astro'],
 				},
 			},
 		},
 	},
 },
 

  // Image optimization — WebP/AVIF auto-generation
  image: {
    domains: ["cdn.sanity.io"],
    remotePatterns: [{ protocol: "https" }],
    layout: "constrained",
  },
});
