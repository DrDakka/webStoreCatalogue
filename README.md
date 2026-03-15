# webStoreCatalogue

A fully-featured e-commerce product catalogue built with React 18 and TypeScript. Includes a product listing with filtering/sorting/pagination, a detailed product page, favourites, a shopping cart, and a multi-step checkout form — all without any UI component library.

**[Live Demo](https://drdakka.github.io/webStoreCatalogue/)** · **[GitHub](https://github.com/drdakka/webstorecatalogue)** · Built by [Tymofii Bespalov](https://github.com/drdakka)

---

## Tech Stack
UI: React 18, TypeScript;
Routing: React Router v6;
Styling: SCSS Modules, custom mixins;
Build: Vite 5;
Testing: Vitest, Testing Library.

---

## Why This Project

A few things that go beyond a typical todo-app or template clone:

- **No UI library.** Every component — buttons, modals, sliders, form inputs — is written from scratch with SCSS Modules.
- **Custom carousel, zero dependencies.** The slider is a composable hook suite (`useSliderCore` / `useAnimation` / `useAutoplay` / `useInfinite`). Two independent instances run on the same page without interfering.
- **Fully typed mock API.** There is no real backend, but every request and response is typed end-to-end using discriminated unions — including validation, error responses, and pagination. The data layer has no `any`.
- **URL-driven state.** Filters, sort order, and pagination live in the URL query string via a custom `useUrlReducer`. The browser Back button works, and any filtered view is bookmarkable.
- **Compound Components checkout.** The multi-step form uses the Compound Components pattern — each `<Steps.Step>` is completely decoupled from its siblings and knows nothing about the surrounding form.
- **FSD architecture.** The entire codebase follows Feature-Sliced Design with strict layer boundaries enforced by ESLint import rules.

---

## Architecture — Feature-Sliced Design

The project follows [Feature-Sliced Design](https://feature-sliced.design/) — a layered architecture where each layer may only import from layers below it:

```
src/
├── app/          # App entry, router, global styles
├── pages/        # Route-level pages (lazy loaded)
├── widgets/      # Composite UI blocks (Header, Footer, Modals)
├── features/     # User-facing interactions (cart controls, filters, search)
├── entities/     # Domain objects (product card, cart item)
└── shared/       # Reusable primitives (UI kit, hooks, API, styles)
```

This makes the codebase predictable: you always know where to add a feature and what it's allowed to depend on.

---

## Key Technical Highlights

### Custom Carousel Slider (zero dependencies)

The slider is built from scratch with a composable hook architecture:

- **`useSliderCore`** — manages slide index, direction, and a context with a stable `rerender` callback (functional `setState` to avoid stale closures)
- **`useAnimation`** — drives CSS transitions by applying class names on a timed schedule
- **`useAutoplay`** — handles play/pause/resume, clears timers on unmount
- **`useInfinite`** — clones the first/last slides and seamlessly resets position mid-animation

The slider renders two independent instances simultaneously (hero banner + "You may also like") with no interference between them.

### Compound Components — Multi-Step Checkout Form

The checkout modal uses the Compound Components pattern:

```tsx
<Steps>
  <Steps.Step title="Personal info">
    <PersonalInfoStep />
  </Steps.Step>
  <Steps.Step title="Delivery">
    <DeliveryStep />
  </Steps.Step>
  <Steps.Step title="Payment">
    <PaymentStep />
  </Steps.Step>
</Steps>
```

`<Steps>` owns the active-step state via Context and exposes navigation through a shared context — child steps are completely decoupled from each other. A progress indicator updates automatically.

### Type-Safe API Layer

All server communication goes through a typed `request<T>()` helper with `AbortController` for cleanup on component unmount. Each entity has its own module (`getProducts`, `getProduct`, `getCart`) typed against a shared `Product` / `CartItem` interface. There are no `any` casts in the data layer.

### URL State Management

Filters, sort order, and pagination are serialized to the URL query string via a custom `useUrlReducer` hook — a reducer-style API that reads from and writes to `URLSearchParams`. This means the full application state is bookmarkable and shareable, and the browser Back button works correctly.

### Error Boundary + Code Splitting

Every route is wrapped in `React.lazy` / `Suspense` for automatic chunk splitting, and the entire routing tree is wrapped in an `ErrorBoundary` that catches render errors and renders a graceful fallback instead of a blank screen.

### Scroll Lock Hook

Opening the cart or checkout modal locks body scroll via a `useScrollLock` hook that toggles a `.scroll-lock` CSS class — no direct DOM style mutation, no leaked overflow state.

### Accessibility

- All interactive elements are keyboard-navigable
- Form fields have associated `<label>` elements (enforced by eslint-plugin-jsx-a11y)
- `:user-invalid` CSS pseudo-class provides native form validation feedback without JavaScript
- Colour contrast meets WCAG AA

---

## Getting Started

```bash
npm install
npm start        # dev server at http://localhost:5173
npm run build    # production build
npm run lint     # ESLint + Stylelint
npm test         # unit tests (Vitest)
```

---

## Project Structure (abbreviated)

```
src/
├── app/
│   ├── App.tsx              # ErrorBoundary + Suspense + Outlet
│   ├── routes/Routes.tsx    # lazy-loaded route definitions
│   └── styles/              # global reset, variables, typography
├── pages/
│   ├── homePage/            # Hero slider + category grid + promo sections
│   ├── categoriesPage/      # Product list with URL-driven filters
│   ├── productPage/         # Detail view with image gallery
│   ├── cartPage/            # Cart summary + checkout modal trigger
│   └── favouritesPage/      # Saved products
├── widgets/
│   ├── header/              # Navigation + search + cart/favourites badge
│   ├── footer/
│   └── modalCheckout/       # Compound-component stepper form
├── features/
│   ├── addToCart/
│   ├── addToFavourites/
│   └── productFilters/      # Sort + items-per-page + pagination
├── entities/
│   └── prodCard/            # Product card with hover actions
└── shared/
    ├── api/                 # Typed request helper
    ├── lib/
    │   ├── useSlider/       # Carousel hook suite
    │   ├── useUrlReducer/   # URL <-> state bridge
    │   └── useScrollLock/
    └── ui/
        ├── errorBoundary/
        ├── loaderSpinner/
        └── pagination/
```
