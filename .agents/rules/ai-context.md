---
trigger: manual
---

# Astro + Tailwind + Sanity + Cloudflare Pages

# Linee Guida di Riferimento per l'Assistente AI (antigravity)

Questo file contiene il contesto tecnico essenziale da utilizzare come riferimento ("System Prompt" o "Custom Instructions") per tutti i progetti web sviluppati per PMI.
**LEGGERE SEMPRE PRIMA DI AVVIARE LO SVILUPPO.**

---

## 🏗️ 1. Architettura, Filosofia (Core) e Handoff

- **Framework Principale:** Astro (SSG - Static Site Generation).
- **Hosting Target:** Cloudflare Pages.
- **Data Source & CMS:** Sanity. Gli schema vengono creati ad-hoc ogni volta in base alle specifiche necessità del cliente (menu, info, servizi).
- **Handoff del Design:** L'input visivo arriverà tramite screenshot e descrizioni testuali del mood.
- **Obiettivo Performance:** Siti velocissimi (99+ Core Web Vitals su Lighthouse Mobile), accessibili e visivamente "Premium".
- **Regola d'Oro sui Componenti:** Usare sempre componenti Astro nativi + Tailwind puro. Zero React. Niente React Islands, salvo casi con stato eccezionalmente complesso (es. form multistep, tabs con stato molto intricato).
  - _Riferimento UI:_ **Starwind UI** o **Basecoat UI** (componenti shadcn-style in Tailwind v4 nativo per Astro).

## 🎨 2. Styling e UI Design ("Wow Effect")

- **Motore CSS:** Tailwind CSS (Puro, no astrazioni inutili).
- **Estetica:** L'estetica deve avere un approccio moderno e da agenzia: usare dark modes, glassmorphism, gradienti ben calibrati, proporzioni e spazi (Whitespace) generosi. EVITARE colori default piatti o banali.
- **Uso di Tailwind:** Usa le utility class di Tailwind per comporre il design. Crea file `global.css` con direttive `@apply` SOLO per le basi tipografiche e i layer core.
- **Animazioni:**
  - Usa in tutte le pagine la direttiva di Astro `<ViewTransitions />`.
  - **Scroll Reveal / In-View:** Usare `IntersectionObserver` nativo + CSS transitions per il 90% dei casi. Utilizzare `GSAP` solo se serve estrema complessità.

## 🗺️ 3. SEO Locale, Compliance e Markup (Cruciale per le PMI)

- **Gestione SEO Base:** Usare `astro-seo-plugin` come componente globale nel layout base. Ogni pagina deve passare `title`, `description` e `og:image` al componente `<SEO />` dal layout base.
- **Dati Strutturati (Markup):** Il markup JSON-LD `LocalBusiness` va incluso di default in _tutti_ i siti PMI. Generare uno script `<script type="application/ld+json">` contenente NAP (Name, Address, Phone), URL e orari d'apertura. Aiuta Google a capire l'attività e favorisce i rich snippet.
- **Compliance (Cookie & Privacy):** Ogni sito PMI deve includere **CookieYes** (script banner nell'header/body + link alla policy nel footer) per gestire Privacy Policy e Cookie Banner sincronizzati in modo automatico.
- **Tag HTML Semantici:** Title tag (`<title>`) ed Headings (`<h1>...<h6>`) devono seguire una chiara gerarchia. L'`<h1>` della Homepage DEVE contenere il Servizio + il Luogo della PMI.

## ✍️ 4. Marketing Context e Workflow CRO PROATTIVO (Le Due Regole d'Oro)

Queste regole trasformano l'AI in un _conversion partner_ e non solo in un esecutore di codice. Affinché i siti delle PMI generino reali lead, applica rigidamente le seguenti routine:

1.  **Product Marketing Context Tassativo:** Prima di generare qualsiasi copy (headline, CTA, descrizione servizi, testi hero, ecc.), l'AI DEVE leggere `/product-marketing-context.md` per allinearsi al tone of voice, al cliente target e alla proposta di valore del progetto.
2.  **CRO Proattivo:** Durante lo sviluppo dei _componenti_, l'AI deve segnalare proattivamente al web designer:
    - Posizione e testo delle CTA (affinché siano efficaci, mai compiacenti).
    - Presenza di elementi di social proof posizionati _sopra_ la piega (above the fold).
    - Chiarezza e impatto della proposta di valore nella sezione Hero.
    - Presenza di un'opzione di contatto rapido (es. bottone WhatsApp) visibile in _ogni_ sezione rilevante.

## ⚙️ 5. Regole per Scrivere o Modificare il Codice (Per l'AI)

1.  **Isolamento Script:** Usa blocchi script nei file `.astro` sfruttando la direttiva nativa (i tag `<script>` in Astro sono _bundled_, isolati e performanti di default).
2.  **Immagini:** Fai largo uso del componente `<Image>` o `<Picture>` nativo di `astro:assets` per garantire il formato webP/AVIF e la corretta generazione delle dimensioni.
3.  **Pulizia Tailwind:** Raggruppa coerentemente le stringhe Tailwind (layout -> spazi -> tipografia -> colori). Un plugin Prettier apposito è suggerito.
4.  **DOM Pulito:** Tendi a semplificare l'albero DOM. Evita `<div>` inutili annidati se flex/grid di Tailwind sul parent sono sufficienti.

---

Questo documento è il tuo faro. Riferisciti ad esso per ogni decisione architetturale, di design, di copy e SEO.
