---
name: Corporate Precision & Logistics Engine
colors:
  surface: '#f6fafe'
  surface-dim: '#d6dade'
  surface-bright: '#f6fafe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4f8'
  surface-container: '#eaeef2'
  surface-container-high: '#e4e9ed'
  surface-container-highest: '#dfe3e7'
  on-surface: '#171c1f'
  on-surface-variant: '#43474f'
  inverse-surface: '#2c3134'
  inverse-on-surface: '#edf1f5'
  outline: '#737780'
  outline-variant: '#c3c6d1'
  surface-tint: '#3a5f94'
  primary: '#001e40'
  on-primary: '#ffffff'
  primary-container: '#003366'
  on-primary-container: '#799dd6'
  inverse-primary: '#a7c8ff'
  secondary: '#845400'
  on-secondary: '#ffffff'
  secondary-container: '#ffaa1a'
  on-secondary-container: '#6a4300'
  tertiary: '#141f30'
  on-tertiary: '#ffffff'
  tertiary-container: '#293446'
  on-tertiary-container: '#919cb3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1f477b'
  secondary-fixed: '#ffddb5'
  secondary-fixed-dim: '#ffb958'
  on-secondary-fixed: '#2a1800'
  on-secondary-fixed-variant: '#643f00'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f6fafe'
  on-background: '#171c1f'
  surface-variant: '#dfe3e7'
typography:
  display:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: '1.15'
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: '1.25'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  title:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: '1.5'
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: '1.45'
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: '1.25'
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.03em
  code-stat:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system is engineered for industrial-grade financial calculation, order management, and operations tracking (LCPU - Labor Cost Per Unit). The visual personality conveys enterprise reliability, procedural exactness, and contemporary digital craftsmanship. It bridges heavy industrial calculation with modern, lightweight enterprise SaaS usability.

The target audience comprises operations managers, procurement analysts, logistics controllers, and plant supervisors who require high-density data legibility, low eye fatigue during prolonged shifts, and zero ambiguity during transaction execution.

The style fuses **Corporate / Modern** structure with **Minimalist high-contrast utility**:
- Deep navy establishes institutional authority, structural framing, and high-trust data contexts.
- High-vibrancy amber-gold acts as an active vector of attention, reserved for primary commitments, KPI highlights, critical system triggers, and active states.
- Clean neutral canvas cards and subdued slate borders create a calm, legible environment that eliminates visual noise and streamlines order entry pipelines.

## Colors

The color architecture is built around sharp semantic contrast between administrative authority, interactive triggers, and neutral reading planes:

- **Primary Deep Navy (`#003366`)**: Applied to foundational elements—main side navigation, headers, corporate signifiers, dense table headers, and primary structural containers.
- **Secondary Amber Glow (`#F29F05`)**: Reserved exclusively for focal actions, main conversion buttons ("Enviar Pedido"), calculated total badges, warning indicators, and active workflow anchors.
- **Tertiary Slate Ink (`#1E293B`)**: Used for high-contrast alphanumeric typography, critical metric labels, and high-emphasis interface headings.
- **Neutral Canvas (`#F0F4F8`)**: Provides a soft, glare-free background surface that separates crisp white cards (`#FFFFFF`) from structural boundaries (`#E2E8F0`).

### Semantic Extensions & Contrast Guardrails
- **Surface Elevation**: Ground background sits at `#F0F4F8`; elevated cards and active form sheets use pure `#FFFFFF`.
- **Borders & Dividers**: Subdued structural separation utilizes `#E2E8F0` on light containers and `rgba(255, 255, 255, 0.12)` over primary navy blocks.
- **Feedback Alerts**: Functional emerald (`#10B981`) for completed calculations/submissions, crimson (`#EF4444`) for validation errors/LCPU budget overruns, and sky slate (`#64748B`) for helper tags.

## Typography

The type hierarchy prioritizes technical legibility, numerical precision, and high scannability across dense calculation tables and forms.

- **Typeface Selection**: Inter is configured across all roles due to its neutral tall x-height, explicit distinction between disambiguated glyphs (`1`, `l`, `I`, `0`, `O`), and robust tabular figures for financial operations.
- **Numeric Alignment**: All pricing displays, LCPU breakdowns, and order volume counters must mandate OpenType tabular numbers (`font-feature-settings: "tnum" 1, "cv05" 1`) to guarantee perfect vertical alignment down tabular grids.
- **Labels & Input Fields**: Labels are rendered in medium-weight slate typography (`#475569` or `#1E293B`) directly above inputs to preserve scan-paths. Micro-labels, unit markers (e.g., `UN`, `BRL`, `KG`), and status tags adopt uppercase tracking (`letter-spacing: 0.03em`).

## Layout & Spacing

The layout is anchored on an 8-point structural system, maintaining disciplined vertical rhythm and fluid responsiveness for complex enterprise screens:

- **Grid Framework**: 12-column responsive fluid grid within desktop viewports (max-width container clamped at `1440px`), collapsing to a 4-column framework on mobile devices (`< 768px`) and 8 columns on tablets (`768px – 1024px`).
- **Form Layouts**: Data-entry modules utilize structured paired rows (two-column split on desktop: labels aligned above, items grouped contextually such as *Item/Modelo*, *Versão/Nome da Peça*, *GFPG/Quantidade*). Single-column stack applies automatically on handheld screens.
- **Density Controls**: Data tables support dense display modes where row padding drops from `space-md` (`16px`) to `space-sm` (`8px`) to allow operational users to view comprehensive order books without excessive scrolling.

## Elevation & Depth

Visual hierarchy is communicated via clean tonal layers and crisp, subtle ambient occlusion shadows, entirely avoiding murky drop-shadows.

- **Level 0 (Flat Ground)**: Base background `#F0F4F8` has no shadow. Used for global layout wrappers and inactive backdrop containers.
- **Level 1 (Card & Module Shells)**: Surfaces in pure `#FFFFFF` bounded by a fine border `1px solid #E2E8F0` and elevated with `0 1px 3px rgba(0, 51, 102, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)`.
- **Level 2 (Hover & Active Interactive Cards)**: Elevated inputs, active calculation summary modules, and interactive table rows transition on focus/hover to `0 4px 12px rgba(0, 51, 102, 0.08), 0 2px 4px rgba(0, 51, 102, 0.03)`.
- **Level 3 (Flyouts, Popovers & Context Menus)**: Overlays and select menus use `0 10px 25px -3px rgba(0, 51, 102, 0.12), 0 4px 6px -2px rgba(0, 51, 102, 0.04)` combined with a crisp `1px solid #CBD5E1` border.
- **Level 4 (Modals & Confirmation Drawers)**: Heavy dialogs introduce a backdrop scrim (`rgba(0, 51, 102, 0.45)` with `backdrop-filter: blur(4px)`) and a central card elevation `0 20px 40px -8px rgba(0, 30, 60, 0.24)`.

## Shapes

The geometric framework is calibrated to roundedness level `1` (Soft), creating an intentional balance between enterprise rigidity and contemporary tactile quality:

- **Base Elements (`rounded-sm` / 4px - 6px)**: Applied to text input fields, selects, number steppers, table wrappers, and form cells. This keeps complex enterprise forms sharp, aligned, and visually compact.
- **Containers & Cards (`rounded-lg` / 8px)**: Applied to calculation overview panels, dashboard metrics cards, and submission review blocks.
- **Action Triggers (`rounded-md` / 6px)**: Action buttons ("Enviar Pedido", "Calcular LCPU") share the 6px radius to unify interaction affordances.
- **Status Badges & Pills (`rounded-full` / 9999px)**: Reserved solely for categorical chips, status tokens (e.g., "Em Aberto", "Aprovado"), and numeric notifications.

## Components

### Buttons
- **Primary CTA ("Enviar Pedido" / "Calcular")**: Background `#F29F05`, text `#1E293B` (or `#002244` for enhanced AAA contrast), font weight 600, padding `10px 20px`, rounded 6px. Features a subtle bottom inset highlight and smooth transform transitions (`translate-y: -1px` on hover with shadow `0 4px 12px rgba(242, 159, 5, 0.35)`).
- **Secondary (Navy Structural)**: Background `#003366`, text `#FFFFFF`, hover `#00264D`.
- **Tertiary / Ghost**: Transparent background, border `1px solid #CBD5E1`, text `#1E293B`, hover background `#F8FAFC`.

### Form Fields & Inputs
- Replaces unstyled HTML input fields with high-polish enterprise controls.
- **Geometry**: Height 42px, padding horizontal 12px, border `1px solid #CBD5E1`, background `#FFFFFF`, border-radius 6px.
- **Typography**: Value text `#1E293B`, placeholder text `#94A3B8`.
- **Focus State**: Crisp outline transition with `border-color: #003366` and a multi-layer focus ring `box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.15)`.
- **Labels & Helpers**: Dedicated top labels in `#334155` font-weight 500, size `0.875rem`. Validation hints beneath input in red `#DC2626` or muted slate `#64748B`.

### Cards & Data Panels
- Background `#FFFFFF`, border `1px solid #E2E8F0`, border-radius 8px, padding `20px` to `24px`.
- Card headers feature a dedicated horizontal flex strip containing an icon (Lucide stroke 1.75px), uppercase module title, and optional badge or export utility.

### Data Tables (LCPU Breakdown & Order Logs)
- **Header Row**: Deep Navy `#003366` background with crisp white text (`#FFFFFF`) or light slate `#F8FAFC` background with bold navy text (`#003366`).
- **Body Rows**: Pure white `#FFFFFF` alternating with micro-zebra `#F8FAFC`, hover row background `#F1F5F9`. Cell border `1px solid #F1F5F9`.
- **Numeric Cells**: Tabular numbers right-aligned with monospace metrics fidelity.

### Chips & Badges
- Small 24px height tags, padding `2px 10px`, font-size `0.75rem`, font-weight 600.
- Variations: *Calculado* (Emerald tint), *Pendente* (Amber tint), *GFPG Ativo* (Navy light tint `#E6EDF5` with `#003366` text).

### Iconography Guidelines
- Powered by Lucide or Heroicons, outline set at consistent `1.75px` stroke width, standard size `18px` inside action buttons, `20px` in navigation, and `16px` for inline table indicators.