# Menu Category Grid Navigation - Modification Plan

## Overview

Replace the horizontal tabs navigation in [`menu.astro`](src/pages/menu.astro) with a 3-column grid of category cards, using all 9 categories from [`menu-inventory.md`](docs/menu-inventory.md).

---

## Categories to Display

| #   | Category                  | Slug                   | Image File                    |
| --- | ------------------------- | ---------------------- | ----------------------------- |
| 1   | Cocktails Alcolici        | `cocktails-alcolici`   | `cocktails.webp`              |
| 2   | Cocktails Analcolici      | `cocktails-analcolici` | `analcolici.webp`             |
| 3   | Birre                     | `birre`                | `birre.webp`                  |
| 4   | Vini                      | `vini`                 | `vini.webp`                   |
| 5   | Soft Drinks & Caffetteria | `soft-drinks`          | `softdrinks.webp`             |
| 6   | Amari & Spirits           | `amari-spirits`        | `amari.webp`                  |
| 7   | Stuzzichini               | `stuzzichini`          | `stuzzichini-e-taglieri.webp` |
| 8   | Insalate                  | `insalate`             | `insalate.webp`               |
| 9   | Panini                    | `panini`               | `panini.webp`                 |

---

## File Modifications

### 1. [`src/pages/menu.astro`](src/pages/menu.astro)

#### A. Update Categories Array (Line ~42)

```astro
// OLD
const categories = ["Cocktails", "Senza Alcol", "Beverages", "Food"];

// NEW - Categories with metadata for grid cards
import cocktailsImg from "../assets/images/cocktails.webp";
import analcoliciImg from "../assets/images/analcolici.webp";
import birreImg from "../assets/images/birre.webp";
import viniImg from "../assets/images/vini.webp";
import softdrinksImg from "../assets/images/softdrinks.webp";
import amariImg from "../assets/images/amari.webp";
import stuzzichiniImg from "../assets/images/stuzzichini-e-taglieri.webp";
import insalateImg from "../assets/images/insalate.webp";
import paniniImg from "../assets/images/panini.webp";

const categories = [
  { name: "Cocktails Alcolici", slug: "cocktails-alcolici", image: cocktailsImg },
  { name: "Cocktails Analcolici", slug: "cocktails-analcolici", image: analcoliciImg },
  { name: "Birre", slug: "birre", image: birreImg },
  { name: "Vini", slug: "vini", image: viniImg },
  { name: "Soft Drinks & Caffetteria", slug: "soft-drinks", image: softdrinksImg },
  { name: "Amari & Spirits", slug: "amari-spirits", image: amariImg },
  { name: "Stuzzichini", slug: "stuzzichini", image: stuzzichiniImg },
  { name: "Insalate", slug: "insalate", image: insalateImg },
  { name: "Panini", slug: "panini", image: paniniImg },
];
```

#### B. Restructure Fallback Data

The fallback data needs to be reorganized from 4 groups to 9 categories. This involves:

- Splitting "Cocktails" into "Cocktails Alcolici" and "Cocktails Analcolici"
- Splitting "Beverages" into "Birre", "Vini", "Soft Drinks & Caffetteria", "Amari & Spirits"
- Splitting "Food" into "Stuzzichini", "Insalate", "Panini"

#### C. Replace `<nav class="tabs-nav">` with Category Grid (Lines 995-1014)

Replace the horizontal tabs with a 3-column grid:

```astro
---
import { Image } from "astro:assets";
---

<nav class="category-grid" id="menu-categories">
  {
    categories.map((cat, index) => (
      <a
        href={`#${cat.slug}`}
        class="category-card"
        data-category={cat.slug}
      >
        <Image
          src={cat.image}
          alt={cat.name}
          class="category-card__image"
          width={64}
          height={64}
          format="webp"
        />
        <span class="category-card__name">{cat.name}</span>
      </a>
    ))
  }
</nav>
```

#### D. Update Content Sections

Change from tab-based show/hide to scrollable sections with IDs:

```astro
{
  categories.map((cat) => (
    <section id={cat.slug} class="menu-section">
      <h2 class="menu-section__title">{cat.name}</h2>
      <MenuGrid>
        {displayData[cat.name]?.map((item) => (
          <MenuCard
            name={item.name}
            price={item.price}
            description={item.description}
            ingredients={item.ingredients}
            isHighlight={item.isHighlight}
          />
        ))}
      </MenuGrid>
    </section>
  ))
}
```

#### E. Add New CSS Styles

Replace the tabs CSS with grid styles using existing design tokens:

```css
/* Category Grid Navigation */
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 0 0.5rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 0.75rem;
  background-color: var(--color-bg-surface);
  border-radius: 1rem;
  border: 2px solid transparent;
  text-decoration: none;
  transition:
    border-color var(--duration-fast) var(--ease-smooth),
    transform var(--duration-fast) var(--ease-smooth),
    box-shadow var(--duration-fast) var(--ease-smooth);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.category-card:hover {
  border-color: var(--color-accent-amber);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.category-card:active {
  transform: translateY(0);
}

.category-card__image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.category-card__name {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-align: center;
  line-height: 1.2;
}

/* Menu Section */
.menu-section {
  scroll-margin-top: 6rem; /* Account for sticky navbar */
  margin-bottom: 3rem;
}

.menu-section__title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-bg-elevated);
}

/* Desktop adjustments */
@media (min-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 1.25rem;
  }

  .category-card {
    padding: 1.5rem 1rem;
  }

  .category-card__image {
    width: 64px;
    height: 64px;
  }

  .category-card__name {
    font-size: 0.875rem;
  }
}

@media (min-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(9, 1fr);
    gap: 1.5rem;
  }
}
```

#### F. Remove Obsolete CSS

Remove the following CSS sections:

- `.tab-input` styles
- `.tabs-nav` and `.tabs-nav__container` styles
- `.tab-label` styles
- `.tabs-nav__indicator` styles
- `.tab-pane` and animation styles
- All `#tab-*:checked` selector rules

---

## Design Token Mapping

| Element                    | CSS Property           | Value                        |
| -------------------------- | ---------------------- | ---------------------------- |
| Card background            | `--color-bg-surface`   | #FFFFFF                      |
| Card border (hover/active) | `--color-accent-amber` | #CA8A04                      |
| Card text                  | `--color-text-primary` | #1C1917                      |
| Section title              | `--color-text-primary` | #1C1917                      |
| Border separator           | `--color-bg-elevated`  | #F1F5F9                      |
| Transition duration        | `--duration-fast`      | 150ms                        |
| Transition easing          | `--ease-smooth`        | cubic-bezier(0.4, 0, 0.2, 1) |

---

## Behavior

1. **Click on category card** → Smooth scroll to section with matching ID
2. **Hover state** → Amber border + subtle lift
3. **Active/selected state** → Optional: Add `.active` class via JavaScript for persistent highlight
4. **Mobile-first** → 3 columns on mobile, 5 on tablet, 9 on desktop

---

## Implementation Notes

1. **No JavaScript required** for basic functionality (CSS `scroll-behavior: smooth` already set in base)
2. **Optional enhancement**: Add IntersectionObserver to highlight active category while scrolling
3. **Fallback data reorganization** is the most extensive change - requires careful mapping of items to new categories
4. **Image Assets**: All category images are in `src/assets/images/` as `.webp` files. Import them at the top of the Astro file using the `Image` component from `astro:assets` for automatic optimization
5. **Image Mapping**:
   - `cocktails.webp` → Cocktails Alcolici
   - `analcolici.webp` → Cocktails Analcolici
   - `birre.webp` → Birre
   - `vini.webp` → Vini
   - `softdrinks.webp` → Soft Drinks & Caffetteria
   - `amari.webp` → Amari & Spirits
   - `stuzzichini-e-taglieri.webp` → Stuzzichini
   - `insalate.webp` → Insalate
   - `panini.webp` → Panini

---

## Files to Modify

| File                                           | Changes                                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [`src/pages/menu.astro`](src/pages/menu.astro) | Update categories array, restructure fallback data, replace tabs-nav with grid, update CSS |

---

## Next Steps

1. Switch to **Code mode** to implement the changes
2. Test the grid layout on mobile, tablet, and desktop viewports
3. Verify smooth scrolling behavior
4. Ensure all menu items are correctly categorized in the new 9-category structure
