# Design System Specification: The Silent Steward

## 1. Overview & Creative North Star
The objective of this design system is to move beyond the cold, bureaucratic aesthetic typically associated with government software. For a cemetery management platform, the interface must embody **The Silent Steward**: a presence that is authoritative yet empathetic, modern yet timeless. 

We are departing from the "grid of boxes" layout. Instead, we embrace a **High-End Editorial** approach. This means utilizing expansive white space, intentional asymmetry, and a "layered paper" philosophy. The UI should feel like a well-organized archive in a sunlit room—organized, respectful, and profoundly clear. We break the template look by allowing typography to breathe and using tonal shifts rather than rigid lines to define space.

---

## 2. Colors
Our palette is rooted in the dignity of the earth and the clarity of the sky. We avoid harsh blacks and stark whites in favor of sophisticated, nuanced tones.

### The "No-Line" Rule
To achieve a premium SaaS feel, **1px solid borders for sectioning are prohibited.** Boundaries must be defined solely through background color shifts. For example, a sidebar using `surface_container_low` (#f0f4f8) should sit against a `surface` (#f6fafe) main content area. The eye should perceive the edge through the change in value, not a drawn line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
- **Base Layer:** `surface` (#f6fafe)
- **Secondary Containers:** `surface_container` (#eaeef2)
- **High-Importance Cards:** `surface_container_lowest` (#ffffff) to create a "lifted" effect.

### The "Glass & Gradient" Rule
To prevent the light theme from feeling "flat," use Glassmorphism for floating elements (like navigation bars or hovering action menus). Use `surface_container_lowest` (#ffffff) at 80% opacity with a `backdrop-filter: blur(12px)`.

### Signature Textures
For primary CTAs and hero headers, utilize a subtle linear gradient (135deg) transitioning from `primary` (#162839) to `primary_container` (#2c3e50). This adds a "weighted" professional polish that solid colors lack.

---

## 3. Typography
We utilize **Public Sans** for its clear, authoritative, yet approachable letterforms. The hierarchy is designed to feel like a high-end broadsheet.

- **Display Scales (sm/md/lg):** Use these for dashboard overviews (e.g., total capacity or search headers). Use `primary` (#162839) for high contrast and weight.
- **Headline & Title Scales:** These are the anchors of our pages. Use `headline-sm` (1.5rem) for section headers to convey importance without shouting.
- **Body & Labels:** Use `body-md` (0.875rem) for most data entry and administrative tasks. Labels should use `on_surface_variant` (#43474c) in `label-md` to maintain a clear distinction between metadata and user data.

Typography is our primary tool for hierarchy. A `headline-lg` element should often stand alone with significant padding-bottom (e.g., 2rem) to create an editorial "breathing room" effect.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** rather than traditional drop shadows.

### The Layering Principle
Stacking surface tokens creates natural depth. 
- A table header using `surface_container_high` (#e4e9ed).
- Sitting on a table body using `surface_container_lowest` (#ffffff).
- Sitting on a page background of `surface` (#f6fafe).

### Ambient Shadows
When an element must float (e.g., a modal or a floating action button), use an extra-diffused shadow:
- `box-shadow: 0 12px 40px rgba(23, 28, 31, 0.06);`
This mimics natural light and prevents the UI from looking "heavy."

### The "Ghost Border" Fallback
If a boundary is required for accessibility (e.g., input fields), use a **Ghost Border**. Apply `outline_variant` (#c4c6cd) at 20% opacity. Never use 100% opaque outlines.

---

## 5. Components

### Buttons
- **Primary:** Gradient background (`primary` to `primary_container`), `on_primary` (#ffffff) text. Use `md` (0.375rem) corner radius.
- **Secondary:** `secondary_container` (#cbe7f5) background with `on_secondary_fixed` (#021f29) text.
- **Tertiary:** No background. Use `primary` text. These must be used for low-emphasis actions to keep the interface clean.

### Input Fields
Avoid the "boxed" look. Use `surface_container_low` (#f0f4f8) as the fill color with a Ghost Border. When focused, transition the border to `primary` (#162839) at 40% opacity.

### Cards & Lists
**Strict Rule: No divider lines.**
To separate records (e.g., deceased records or plot listings), use vertical white space (16px or 24px) or alternating subtle background tints between `surface_container_lowest` and `surface_container_low`. 

### Search & Filtering (The "Curator" Bar)
The search experience should be a signature element. Use a large, semi-transparent `surface_container_lowest` bar with a subtle `primary_fixed` (#d1e4fb) inner glow to make the primary action of the platform feel premium.

### Map Elements (GIS Integration)
Since this is for cemetery management, map interfaces are crucial. Use a custom map style that desaturates greens and browns to match our `secondary` (#48626e) and `tertiary_container` (#4e381c) tones, ensuring the UI and the data feel like one cohesive unit.

---

## 6. Do's and Don'ts

### Do
- **Do** use asymmetrical margins (e.g., 8% left margin, 12% right margin) for long-form content to create an editorial feel.
- **Do** prioritize `on_surface_variant` (#43474c) for helper text to reduce visual noise.
- **Do** use `full` (9999px) rounding for status chips (e.g., "Occupied," "Available") to provide a friendly, modern contrast to the structured typography.

### Don't
- **Don't** use 100% black (#000000). Use `on_surface` (#171c1f) to maintain visual softness.
- **Don't** use traditional "alert" colors for non-critical errors. Use the `tertiary` (#362308) palette for warnings that require attention but aren't system failures.
- **Don't** crowd the interface. If a screen feels "busy," increase the `surface` padding rather than adding more containers.