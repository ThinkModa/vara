# Front-End Design Skill

## Design Philosophy

Build UI-only prototypes with a **modern, light, airy, and inspirational** aesthetic. Every screen should feel open, calm, and elevated — like a breath of fresh air. No backend, no database, no APIs. Pure front-end with mock data and static interactions.

**UI Inspiration: Flo Health App** — Our visual language draws from Flo's soft, feminine, wellness-oriented design. Key patterns to emulate:
- Soft pastel gradients that shift to reflect state/context (phase-aware color coding)
- Central circular/ring visualizations as hero elements on dashboards
- Conversational, progressive-disclosure onboarding (one question per screen)
- Card-based daily insights with gentle gradient backgrounds
- Bottom tab navigation with clean iconography
- Color-coded categories with tinted pill badges
- Generous whitespace with content that breathes
- Warm, encouraging microcopy throughout

---

## Visual Identity

### Color Palette

- **Primary Background:** `#FAFBFD` — near-white with a cool whisper
- **Secondary Background:** `#FFFFFF` — pure white for cards and surfaces
- **Accent Primary:** `#6366F1` — soft indigo for primary actions
- **Accent Secondary:** `#8B5CF6` — gentle violet for highlights and gradients
- **Accent Tertiary:** `#EC4899` — warm rose for emphasis moments
- **Accent Warm:** `#F472B6` — soft pink (Flo-inspired) for wellness/nurturing elements
- **Success:** `#10B981` — fresh mint green
- **Warning:** `#F59E0B` — warm amber
- **Error:** `#EF4444` — soft red
- **Info:** `#38BDF8` — calm sky blue
- **Text Primary:** `#1E293B` — deep slate, never pure black
- **Text Secondary:** `#64748B` — muted slate for supporting text
- **Text Tertiary:** `#94A3B8` — light slate for placeholders and hints
- **Border:** `#E2E8F0` — barely-there borders
- **Divider:** `#F1F5F9` — whisper-thin separators

### Phase/Category Color System (Flo-Inspired)

Use contextual color themes to represent different states, categories, or phases:
- **Phase 1 / Pink:** `#F9A8D4` bg, `#BE185D` text — nurturing, active
- **Phase 2 / Purple:** `#C4B5FD` bg, `#6D28D9` text — growth, insight
- **Phase 3 / Blue:** `#93C5FD` bg, `#1D4ED8` text — calm, clarity
- **Phase 4 / Green:** `#86EFAC` bg, `#166534` text — balance, renewal

### Gradients

- **Hero gradient:** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` — ethereal indigo-to-purple
- **Warm accent:** `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` — rose glow
- **Cool accent:** `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` — sky to cyan
- **Subtle surface:** `linear-gradient(180deg, #FAFBFD 0%, #F1F5F9 100%)` — barely-there depth
- **Glass overlay:** `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))`
- **Pink bloom (Flo):** `linear-gradient(135deg, #FDE8EF 0%, #F9A8D4 100%)` — soft pink wash
- **Violet mist (Flo):** `linear-gradient(135deg, #EDE9FE 0%, #C4B5FD 100%)` — gentle purple haze

### Typography

- **Font Family:** System default (San Francisco on iOS, Roboto on Android) via React Native defaults. For web previews: `'Inter', system-ui, -apple-system, sans-serif`
- **Headings:** Font weight 700 (bold) or 800 (extrabold). Tight letter spacing.
- **Subheadings:** Font weight 600 (semibold). Slightly looser tracking.
- **Body:** Font weight 400 (regular), line-height 1.5–1.6 for readability.
- **Captions/Labels:** Font weight 500 (medium), uppercase with wider letter-spacing when used as labels.
- **Scale:** 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60px.
- **Hierarchy rule:** Maximum 2 font sizes per section. Contrast through weight and color, not size chaos.
- **Hero numbers:** Extra-large (36–60px), bold weight, used for key stats like Flo's cycle day countdown.

---

## Spacing & Layout

### Spacing System

Use an 8px base grid: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`

- **Micro spacing** (4–8px): Between related inline elements, icon-to-label gaps.
- **Small spacing** (12–16px): Padding inside compact components (buttons, tags, inputs).
- **Medium spacing** (24–32px): Card padding, section gaps within a component.
- **Large spacing** (48–64px): Between major page sections.
- **XL spacing** (96–128px): Hero sections, page-level vertical rhythm.

### Layout Principles

- **Max content width:** 1280px, centered with auto margins.
- **Generous whitespace:** When in doubt, add more space. Let content breathe.
- **Card-based layouts:** Group related content in cards with consistent padding (24–32px).
- **Grid system:** Use CSS Grid or Flexbox. Prefer 12-column grid for complex layouts, auto-fit/auto-fill for card grids.
- **Responsive breakpoints:** 640 / 768 / 1024 / 1280px.

---

## Component Standards

### Cards

- Background: `#FFFFFF`
- Border-radius: `16px` (large) or `12px` (compact)
- Border: `1px solid #E2E8F0` or none with shadow
- Shadow: `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)` — barely visible
- Hover/press shadow: `0 10px 25px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.04)` — gentle lift
- Transition: `all 0.2s ease`
- Padding: `24px` standard, `32px` for feature cards
- **Insight cards (Flo-style):** Use a subtle gradient background from the phase/category color system. Include an icon, a short headline, and 1–2 lines of encouraging microcopy.

### Circular/Ring Visualization (Flo-Inspired Hero Element)

- Used as the centerpiece of dashboard/home screens
- Large ring (200–260px diameter) with gradient stroke matching current state
- Central content: large number or icon, supporting label beneath
- Surrounding arc segments can represent phases, progress, or categories
- Background: subtle radial gradient glow behind the ring for depth

### Buttons

- **Primary:** Background `#6366F1`, text white, border-radius `12px`, height `56px` (large) / `48px` (medium) / `40px` (small), padding `12px 24px`, font-weight 600.
- **Secondary:** Background `#F1F5F9`, text `#1E293B`, same radius/padding.
- **Ghost:** Background transparent, text `#6366F1`, border `1px solid #E2E8F0`.
- **Danger:** Background `#FEF2F2`, text `#EF4444`.
- **All buttons:** Pressed state: `opacity: 0.7`. Disabled state: `opacity: 0.4`. Focus ring: soft glow, not harsh outline.

### Inputs & Forms

- Background: `#FFFFFF`
- Border: `1px solid #E2E8F0`
- Border-radius: `12px`
- Padding: `12px 16px`
- Focus: border `#6366F1`, ring `0 0 0 3px rgba(99,102,241,0.1)`
- Placeholder color: `#94A3B8`
- Label: font-weight 500, color `#475569`, margin-bottom `6px`
- Helper text: font-size 13px, color `#94A3B8`

### Navigation

- **Bottom tab bar (primary, Flo-style):** Height 64–80px, background white, subtle top border or shadow. Active tab: colored icon + label. Inactive: muted gray icon. Max 5 tabs.
- **Top header:** Height 56–64px, background transparent or white. Title centered, optional back arrow left, action icon right.
- **Active state:** Soft accent color icon + text, font-weight 600.
- **Inactive state:** Gray icon + text (`#94A3B8`).

### Modals & Overlays

- Overlay: `rgba(15, 23, 42, 0.3)` with blur — soft, not oppressive.
- Modal: white background, border-radius `20px`, shadow `0 25px 50px rgba(0,0,0,0.12)`.
- Padding: `32px`.
- Animation: fade in + slight slide up.

### Tags & Badges

- Border-radius: `9999px` (pill shape)
- Padding: `4px 12px`
- Font-size: `13px`, font-weight 500
- Use soft, tinted backgrounds with matching text from the phase/category color system

### Onboarding Screens (Flo-Inspired)

- One question or concept per screen — never overwhelm
- Large, friendly illustration or icon at top (40% of screen)
- Clear headline question in bold
- Selection options as large, tappable cards (not small radio buttons)
- Progress indicator: thin bar at top, gentle accent color fill
- "Continue" CTA button pinned to bottom, full width with padding
- Supportive, warm microcopy: "Take your time" / "This helps us personalize..."

---

## Motion & Interaction

- **Transitions:** Default `0.2s ease` for most interactions. Use `0.15s` for micro-interactions (button press), `0.3s` for larger state changes (modals, panels).
- **Hover effects:** Subtle — slight shadow lift on cards, gentle background shifts on buttons. Never jarring.
- **Loading states:** Use skeleton screens with a gentle shimmer animation, not spinners. Shimmer gradient: `linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)`.
- **Page transitions:** Gentle fade-in with slight upward drift (8–12px translateY).
- **Scroll behavior:** `scroll-behavior: smooth`. Consider subtle parallax on hero sections.

---

## Iconography & Imagery

- **Icon library:** Lucide React or Heroicons. Stroke width 1.5–2px. Size: 20px standard, 16px compact, 24px prominent.
- **Illustrations:** Use soft, abstract shapes and gentle gradients as decorative accents. Keep them minimal.
- **Avatars:** Circular, border-radius `9999px`. Default to gradient placeholders with initials if no image.
- **Empty states:** Always include a friendly illustration or icon, a headline, a description, and a CTA button.

---

## Accessibility

- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text.
- All interactive elements must have visible focus indicators (soft ring style, not browser default).
- Inputs must have associated labels (visible or sr-only).
- Buttons must have descriptive text or aria-labels.
- Use semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`.
- Support `prefers-reduced-motion` — disable animations when set.
- Minimum tap target: 44x44px on mobile.

---

## Tech Stack Defaults

- **Framework:** React Native with Expo (Expo Go compatible)
- **Styling:** StyleSheet.create() — no external CSS-in-JS libraries
- **Icons:** @expo/vector-icons (Ionicons, MaterialIcons, Feather)
- **Fonts:** System defaults (SF Pro on iOS, Roboto on Android). Load custom fonts via expo-font if needed.
- **Prototyping data:** Hardcoded mock data in `src/data/` directory. Export named arrays and objects.
- **Routing:** Expo Router (file-based routing) or React Navigation
- **State:** React useState/useContext only — no external state libraries for prototypes.
- **Safe areas:** Always use SafeAreaView or useSafeAreaInsets from react-native-safe-area-context.
- **File structure:**
  ```
  src/
    components/    — Reusable UI components
    screens/       — Top-level screen views
    navigation/    — Navigation configuration
    data/          — Mock data files
    assets/        — Images, SVGs
    constants/     — Colors, spacing, typography tokens
    hooks/         — Custom React hooks
  ```

---

## Expo Screen Development Best Practices

### Core Principles
1. **Component Structure:** Build screens as functional components with TypeScript.
2. **Styling:** Use `StyleSheet.create()` for performance and type safety. Never inline styles.
3. **Responsive Design:** Use `Dimensions` API and percentage-based layouts.
4. **Safe Areas:** Always wrap screens with SafeAreaView or use `useSafeAreaInsets`.
5. **Performance:** Optimize images, memoize expensive computations, use `React.memo` for static components.

### Button Standards
- **Large:** height 56, fontSize 18, borderRadius 12
- **Medium:** height 48, fontSize 16, borderRadius 10
- **Small:** height 40, fontSize 14, borderRadius 8
- Always use `TouchableOpacity` or `Pressable` — never bare `View` for tappable elements.
- Pressed state: `opacity: 0.7`. Disabled state: `opacity: 0.4`.

### Layout Patterns
```typescript
// Standard screen container
container: { flex: 1, backgroundColor: '#FFFFFF' }
safeArea: { flex: 1 }
content: { flex: 1, paddingHorizontal: 16 }

// Standard card
card: {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 3,
}
```

### Component Checklist
- [ ] TypeScript types defined for props and state
- [ ] SafeAreaView or useSafeAreaInsets used
- [ ] Styles defined with StyleSheet.create()
- [ ] Responsive to different screen sizes
- [ ] Accessible (accessibilityLabel, accessibilityRole)
- [ ] Loading and error states handled
- [ ] TouchableOpacity/Pressable for interactive elements
- [ ] KeyboardAvoidingView for forms

### Performance Rules
1. Define styles outside render with `StyleSheet.create()`
2. Use `React.memo` for components that don't change often
3. Use `FlatList` for long lists, never `ScrollView` with many children
4. Debounce text inputs for search
5. Use `useNativeDriver: true` for animations

---

## Rules

1. **No backend calls.** All data is mock. All interactions are front-end only.
2. **White space is sacred.** Generous padding and margins. Never cramped.
3. **Consistency over cleverness.** Use the defined tokens. Don't invent new colors or spacing values ad hoc.
4. **Light over heavy.** Prefer soft shadows over hard borders. Prefer tinted backgrounds over solid fills. Prefer subtle over bold.
5. **Every screen tells a story.** Even a settings page should feel considered and intentional.
6. **Mobile-first.** Design for small screens first, enhance for larger ones.
7. **Skeleton before spinner.** Always use skeleton loading states.
8. **Empty states matter.** Never show a blank page. Always guide the user.
9. **Micro-interactions delight.** Small hover effects, smooth transitions, gentle feedback.
10. **Keep it real.** Use realistic mock data — real names, plausible numbers, actual copy. Never "Lorem ipsum."
