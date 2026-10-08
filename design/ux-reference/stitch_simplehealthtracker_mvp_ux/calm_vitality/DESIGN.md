---
name: Calm Vitality
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#414844'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#012d1d'
  on-primary: '#ffffff'
  primary-container: '#1b4332'
  on-primary-container: '#86af99'
  inverse-primary: '#a5d0b9'
  secondary: '#9b4500'
  on-secondary: '#ffffff'
  secondary-container: '#fd8a42'
  on-secondary-container: '#682c00'
  tertiary: '#540014'
  on-tertiary: '#ffffff'
  tertiary-container: '#7d0022'
  on-tertiary-container: '#ff7f8a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecd4'
  primary-fixed-dim: '#a5d0b9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3d'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68e'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#763300'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#920029'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.03em
  code-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xxs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system is crafted for effortless daily logging, prioritizing mental clarity, psychological safety, and radical simplicity. Its primary audience comprises individuals seeking frictionless tracking of their dietary habits and health markers without clinical coldness, gamification guilt, or overwhelming data density.

The aesthetic blends **Modern Minimalist Utility** with **Tactile Softness**:
- **Clarity over decorative flourish:** UI elements defer completely to the user's data and current task context.
- **Supportive emotional resonance:** Logging non-adherent meals or missed habits must never feel punitive; feedback states remain supportive, neutral, and clear.
- **Instantaneous feedback:** Ambient indicators, micro-transitions, and unobtrusive confirmation cues provide continuous reassurance of state persistence without obstructing the logging flow.

## Colors

The palette balances soft, glare-reducing canvas foundations with deep, high-contrast typography and WCAG AAA/AA compliant semantic tokens.

### Core Canvas & Neutrals
- **Background Base:** `#F8FAFC` (Slate-50 with a gentle warm cast to reduce eye fatigue during dawn or evening logging).
- **Surface Elevation 1 (Cards):** `#FFFFFF` (Pure crisp white to separate entries cleanly against the canvas).
- **Surface Subdued / Input Fill:** `#F1F5F9` (Slate-100).
- **Border Subtle:** `#E2E8F0` (Slate-200) for unselected containers and structural divisions.
- **Text Primary:** `#0F172A` (Slate-900) ensuring an ultra-crisp 15.5:1 contrast against pure white cards.
- **Text Secondary:** `#475569` (Slate-600) for auxiliary labels, timestamps, and metadata (7:1 contrast).
- **Text Muted:** `#64748B` (Slate-500) strictly for non-critical placeholders.

### Semantic Dietary Status Tokens
Dietary tracking relies on explicit, accessible status triples that pair color with persistent typography and iconography to support users with color-vision deficiencies:
- **Strict Adherence (`Sigue la dieta`):**
  - Text & Icon: `#1B4332` (Forest Emerald, 8.4:1 contrast on tinted fill)
  - Surface Tint: `#ECFDF5` (Mint-50)
  - Border Ring: `#A7F3D0` (Mint-200)
- **Partial Adherence (`Parcial`):**
  - Text & Icon: `#854D0E` (Deep Amber, 6.2:1 contrast on tinted fill)
  - Surface Tint: `#FFFBEB` (Amber-50)
  - Border Ring: `#FDE68A` (Amber-200)
- **Non-Adherence (`Fuera de dieta`):**
  - Text & Icon: `#9F1239` (Deep Crimson Coral, 7.5:1 contrast on tinted fill)
  - Surface Tint: `#FFF1F2` (Rose-50)
  - Border Ring: `#FECDD3` (Rose-200)

### System State Indicators
- **Save Status Accent:** `#059669` (Subtle Emerald) for momentary auto-save checkmark confirmations.
- **Active Focus Rings:** `#0F172A` with a 2px offset for unambiguous keyboard and touch navigation.

## Typography

The typography uses Inter across all viewports to provide supreme legibility on mobile screens, precise tabular alignments, and a neutral, undistracting interface envelope.

### Hierarchy & Scale Rules
- **Display & Headline Levels:** Reserved for date context switches (e.g., "Today, Oct 24"), routine summaries, and screen headers. Tighter negative letter spacing on headlines creates an intentional, cohesive editorial lockup.
- **Body Text:** Normalized to a 1.5 line-height ratio to guarantee ease of reading when reviewing meal descriptions, daily notes, or ingredient breakdowns.
- **Labels & Tags:** Set with slightly expanded tracking (`0.01em` to `0.03em`) and medium/semibold weights to ensure fast visual parsing on badges, macro indicators, and status tags.
- **Tabular Figures:** All numeric metrics (calories, timestamps, weight tracking, macronutrient grams) must employ `font-variant-numeric: tabular-nums` to eliminate jitter during rapid counter adjustments or live editing.

## Layout & Spacing

The layout is built around a single-column, touch-first mobile container that comfortably scales to a focused center-aligned card feed on tablet and desktop viewports.

### Viewport Targets
- **Mobile (< 640px):** Single-column stream max-width 100%. Gutters are `0.75rem` (`12px`) and margins are `1rem` (`16px`). Touch targets never fall below `44px` in height.
- **Tablet (640px – 1024px):** Single centered feed constrained to `540px` max-width. Margins adapt dynamically to auto-center.
- **Desktop (> 1024px):** Dual-column layout constrained to `880px` max-width (primary daily timeline spans `540px`, secondary persistent daily summary and adherence metrics span `320px` with a `1.5rem` gutter).

### Rhythmic Discipline
- Spacing follows an absolute `4px` base step.
- Internal component density is compact (`space-sm` / `8px` between text lines and micro-meta; `space-md` / `12px` between form elements).
- Card module separation leverages `space-base` (`16px`) on mobile and `space-lg` (`24px`) on desktop to maintain distinct tap boundaries.

## Elevation & Depth

To preserve an airy, calming environment, elevation relies strictly on **low-contrast micro-borders** combined with **subtle ambient diffusion** rather than heavy drop shadows.

### Elevation Hierarchy
- **Level 0 (App Canvas):** Flat `#F8FAFC`. Zero elevation, non-interactive.
- **Level 1 (Default Cards & Input Fields):** `#FFFFFF` fill bounded by a crisp `1px` border of `#E2E8F0`. Soft ambient shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Active/Pressed Card & Flyouts):** Used for expanded meal edit trays or active touch items. Border lightens to `#CBD5E1` with ambient lift: `0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)`.
- **Level 3 (Modals & Quick Add Sheet):** Mobile bottom drawers and popovers. Ambient shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)` over a soft backdrop scrim (`rgba(15, 23, 42, 0.25)` with `backdrop-filter: blur(4px)`).

## Shapes

The design uses generous, organic corner radii to convey approachability, domestic warmth, and ease of interaction.

### Radius Distribution
- **Cards & Primary Modules:** `16px` (`rounded-xl` / `1rem`) on desktop; scaled to `14px` on compact mobile viewports to preserve horizontal text scanning space.
- **Inputs & Status Selector Badges:** `10px` (`0.625rem`) for intuitive finger targets.
- **Tags, Chips & Quick Log Actions:** `9999px` (Pill-shaped) to distinguish transient selection tokens from permanent content cards.
- **Micro-Indicators (Save Dots, Badges):** Fully circular (`border-radius: 50%`).

## Components

### Buttons & Interactive Controls
- **Primary Action (e.g., "+ Agregar Comida"):** Solid `#0F172A` background with `#FFFFFF` text. Height `44px` on mobile, `40px` on desktop. Corner radius `10px`. Transitions use a gentle scale dampener (`scale(0.98)` on active press).
- **Secondary / Ghost Action:** `#FFFFFF` fill with `1px` `#E2E8F0` border and `#0F172A` text. Hover transitions to `#F1F5F9`.
- **Segmented Meal Adherence Toggle:** A persistent 3-segment pill control. Segment states transition seamlessly between:
  - Green segment: `#ECFDF5` background, `#1B4332` label, `#A7F3D0` border.
  - Amber segment: `#FFFBEB` background, `#854D0E` label, `#FDE68A` border.
  - Coral segment: `#FFF1F2` background, `#9F1239` label, `#FECDD3` border.

### Chips & Status Tags
- Height: `26px`. Padding: `0 10px`.
- Composed of an icon (`14x14px`), semibold `12px` text label, and subtle border stroke matching the semantic tone.
- Tags must **always** contain text alongside color (never color alone) to fulfill universal accessibility standards.

### Checkboxes, Radios & Quick Toggles
- Custom `20x20px` checkboxes with `6px` radius. Unchecked: `1.5px` border `#CBD5E1` on pure white. Checked: `#0F172A` fill with a white checkmark SVG.
- Interactive tap zones are enforced at a minimum bounding size of `44x44px` via transparent padding.

### Input Fields & Notes Area
- Border: `1px solid #E2E8F0`, transitioning to `1.5px solid #0F172A` on focus without glowing halos.
- Fill: `#F8FAFC` at rest, switching to `#FFFFFF` on active editing.
- Dynamic auto-expanding text areas for meal logs with zero scrollbar friction.

### Cards & Log Entry Modules
- White canvas surface, `1px solid #E2E8F0`, padding of `14px` (mobile) to `18px` (desktop).
- Header row hosts the meal identifier ("Desayuno", "Almuerzo", "Snack"), timestamp, adherence badge, and the inline autosave pulse indicator.

### Inline Auto-Save Feedback Indicators
- **Saving State:** A gentle `8px` pulse dot in `#64748B` accompanied by `12px` text "Guardando...".
- **Saved State:** Immediate transformation to a crisp micro-checkmark in `#059669` and "Guardado", fading out softly after `2400ms` to leave a quiet, uncluttered canvas.
- **Error / Offline State:** Unobtrusive `#BE123C` indicator "Guardado localmente (sin conexión)" with retry action trigger.