# Lời Nhắn Nhỏ Store 💌

A handmade keychain order form web app for a small Vietnamese gift shop — **Hương Loan · Lời Nhắn Nhỏ Store**. Customers can browse the collection and place orders directly through a Google Form integration, with no backend server required.

**Live site:** [loinhannho.store](https://loinhannho.store)

---

## Features

- **Product gallery** — fetches items dynamically from Google Sheets via a Google Apps Script API, with a fallback to hardcoded products
- **Order form** — collects name, personalization text, product style, address, and phone number
- **Vietnamese phone validation** — regex validates VN mobile numbers (`03x`, `05x`, `07x`, `08x`, `09x`)
- **Google Forms backend** — form submissions POST directly to Google Forms (no-CORS), no server required
- **Toast notifications** — slide-in feedback on submit success or error, auto-dismissed after 3.5 s
- **Social links** — footer with Facebook, TikTok, Shopee, Threads icons
- **Responsive, mobile-first design** — pink/rose theme, custom fonts (Quicksand + Pacifico), Tailwind CSS v4
- **SEO & analytics** — Open Graph tags, Twitter Card metadata, Google Tag Manager

---

## Tech Stack

| Layer | Tool |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Compiler | React Compiler (`babel-plugin-react-compiler`) |
| Deployment | GitHub Pages via `gh-pages` |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn (or npm)

### Install & run locally

```bash
yarn install
yarn dev
# → http://localhost:5173
```

### Build for production

```bash
yarn build        # type-check + Vite production build → dist/
yarn preview      # serve dist/ locally to verify
```

### Lint

```bash
yarn lint
```

### Deploy to GitHub Pages

```bash
yarn deploy       # runs `yarn build` then gh-pages -d dist
```

The `CNAME` file in `public/` points to `loinhannho.store` — update it if you host on a different domain.

---

## Project Structure

```
src/
├── App.tsx                     # Main page: gallery + order form
├── main.tsx                    # React entry point
├── index.css                   # Global styles, animations
├── hooks/
│   └── useGoogleSheetProducts.ts  # Fetches products from Google Sheets API
└── icons/
    ├── FacebookIcon.tsx
    ├── ShopeeIcon.tsx
    ├── ThreadsIcon.tsx
    └── TikTokIcon.tsx
public/
├── cover.jpg                   # Hero image
├── favicon.svg
└── CNAME                       # Custom domain for GitHub Pages
```

---

## Customization

### Product gallery

Products are loaded from a **Google Apps Script** endpoint defined in `src/hooks/useGoogleSheetProducts.ts`. Update the `APPS_SCRIPT_URL` constant to point to your own deployed script.

If the API is unavailable, the app falls back to a hardcoded list. To change the fallback products, edit the `FALLBACK_PRODUCTS` array in the same file.

### Order form (Google Forms)

In `src/App.tsx`, update two constants with your own Google Form details:

```ts
const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/<YOUR_FORM_ID>/formResponse';

const FORM_ENTRIES = {
  fullName:        'entry.XXXXXXXXX',
  keychainContent: 'entry.XXXXXXXXX',
  productStyle:    'entry.XXXXXXXXX',
  address:         'entry.XXXXXXXXX',
  phone:           'entry.XXXXXXXXX',
  note:            'entry.XXXXXXXXX',
};
```

To find the entry IDs for your form, open the form's source HTML and look for `entry.` field names, or use the network tab while submitting a test response.

### Analytics

The Google Tag Manager container ID (`GTM-K82DNXZQ`) is set in `index.html`. Replace it with your own GTM container ID or remove the GTM snippet entirely.

---

## License

This project is for the exclusive use of **Lời Nhắn Nhỏ Store**. No open-source license is granted.
