# Gurvista Design System

> **Gurvista** — A marketplace connecting Muzaffarnagar's jaggery and sugarcane bagasse producers directly with retail, wholesale and industrial buyers.

---

## Brand Identity

Premium, earthy, and authentic. Editorial-style compositions that honour the agricultural heritage of Western Uttar Pradesh. Every design decision should feel like it belongs in a high-quality print publication — not a typical SaaS or e-commerce template.

---

## Colour System

Strict 60-30-10 rule. No additional decorative colours. Neutral shades (white, off-white, greys) are permitted only for functional UI elements.

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| **60% — Dominant** | Warm Ivory | `#F8F4E9` | Page backgrounds, large surface areas |
| **30% — Secondary** | Sugarcane Green | `#293E2D` | Navigation, headers, section backgrounds, body text |
| **10% — Accent** | Jaggery Brown | `#A66A32` | CTAs, links, highlights, price tags, borders |

### CSS Variables
```css
--color-ivory:   #F8F4E9;
--color-green:   #293E2D;
--color-brown:   #A66A32;

/* Functional neutrals */
--color-white:        #FFFFFF;
--color-grey-light:   #EDE9DC;
--color-grey-mid:     #9C9480;
--color-grey-dark:    #3D3A32;
--color-black:        #1A1916;
```

---

## Typography

| Element | Typeface | Size | Weight |
|---------|----------|------|--------|
| Headings (H1–H3) | Fraunces | varies | 400–600 |
| Body, UI text | Manrope | varies | 400–600 |
| Hero H1 | Fraunces | 56–64px | 500 |
| Section H2 | Fraunces | 36–44px | 500 |
| Sub-heading H3 | Fraunces | 24–28px | 500 |
| Body copy | Manrope | 17–19px | 400 |
| Navigation | Manrope | 16–18px | 500 |
| Buttons | Manrope | 16–18px | 600 |
| Labels & captions | Manrope | 13–15px | 500 |

Both fonts are loaded from Google Fonts.

---

## Spacing

Base unit: `8px`. All padding and margins use multiples of this unit.

| Token | Value |
|-------|-------|
| `--space-xs`  | 4px  |
| `--space-sm`  | 8px  |
| `--space-md`  | 16px |
| `--space-lg`  | 24px |
| `--space-xl`  | 40px |
| `--space-2xl` | 64px |
| `--space-3xl` | 96px |

---

## Border Radius

- **Standard containers:** max 8px
- **Pill buttons / tags:** 100px
- **Avatar / circular elements:** 50%
- No excessive rounding on cards or sections.

---

## Shadows

Minimal. Only use for critical elevation (dropdowns, modals). No decorative shadow effects.

```css
--shadow-sm: 0 1px 3px rgba(26, 25, 22, 0.08);
--shadow-md: 0 4px 12px rgba(26, 25, 22, 0.10);
```

---

## Component Rules

### Buttons
- **Primary:** Jaggery Brown background (`#A66A32`), Warm Ivory text
- **Secondary:** Sugarcane Green background (`#293E2D`), Warm Ivory text
- **Ghost:** Transparent background, Green or Brown border and text
- No glowing effects, no gradient fills, no box-shadow on hover.
- Hover: subtle background darkening (10%) or border-weight change.

### Cards
- Max 8px radius.
- Use border (`1px solid var(--color-grey-light)`) instead of shadows where possible.
- No glassmorphism, no frosted effects.

### Navigation
- Clean horizontal nav on desktop, hamburger on mobile.
- Text links, no icon-heavy menus.

### Images
- Realistic agricultural photography only.
- Full-bleed editorial photos in hero sections.
- No generic stock illustrations, no AI-generated clip art.

---

## Layout Principles

- **Mobile-first** responsive design.
- Max content width: `1280px` with `auto` horizontal margins.
- Avoid repetitive 3-column card grids — prefer asymmetric or editorial layouts.
- Use CSS Grid and Flexbox; no layout libraries.
- Sections alternate between Ivory and Green backgrounds for rhythm.

---

## Strictly Avoid

- Purple and blue gradients
- Glassmorphism
- Glowing buttons or glowing borders
- Random floating decorative shapes
- Excessive card rounding
- Repetitive 3-column layouts
- Excessive animations or transitions > 200ms
- Oversized headings that break composition
- Unnecessary whitespace / hero padding waste
- Generic AI illustrations
- Unnecessary icon clutter
- Typical AI-generated landing page layouts (hero + 3 features + pricing)

---

## Page Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | `Home` | Editorial landing — story, featured products, trust |
| `/products` | `Products` | Marketplace browse — jaggery & bagasse listings |
| `/producers` | `Producers` | Producer profiles from Muzaffarnagar |
| `/about` | `About` | Brand story, mission, region heritage |
| `/contact` | `Contact` | Inquiry form for buyers |

---

## File Structure

```
src/
├── assets/            # Images, fonts
├── components/        # Reusable UI components
│   ├── layout/        # Navbar, Footer, Layout wrapper
│   └── ui/            # Button, Badge, Tag, SectionHeader, ProductCard
├── pages/             # Route-level page components
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── Producers.jsx
│   ├── About.jsx
│   └── Contact.jsx
├── styles/            # Global CSS
│   ├── global.css     # CSS variables, reset, base typography
│   └── utilities.css  # Helper classes
├── App.jsx            # Router setup
└── main.jsx           # Entry point
```
