# Lời Nhắn Nhỏ Store 💌

A handmade keychain order form web app built for a small Vietnamese gift shop. Customers can browse the collection and place orders directly through a Google Form integration.

## Features

- Product gallery with customizable image/emoji slots
- Order form with Vietnamese phone number validation
- Google Forms backend (no server required)
- Toast notifications for submission feedback
- Responsive design with Tailwind CSS v4
- Deployed to GitHub Pages

## Tech Stack

- **React 19** with React Compiler enabled
- **TypeScript**
- **Vite 8**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **gh-pages** for deployment

## Getting Started

```bash
yarn install
yarn dev
```

## Deployment

```bash
yarn deploy
```

Deploys the `dist/` folder to GitHub Pages via the `gh-pages` package.

## Customization

### Gallery Images

Edit the `GALLERY_IMAGES` array at the top of [src/App.tsx](src/App.tsx):

```ts
const GALLERY_IMAGES = [
  { src: '/path/to/image.jpg', emoji: '🌸', alt: 'Description' },
  { emoji: '🐰', alt: 'Placeholder (no src)' },
];
```

When `src` is provided, the image is rendered. Otherwise the emoji is shown as a placeholder.

### Google Form

Update `GOOGLE_FORM_URL` and `FORM_ENTRIES` in [src/App.tsx](src/App.tsx) with your own Google Form ID and entry IDs.
