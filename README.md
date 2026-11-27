# GeoRank Frontend

GeoRank is a product for exploring brand visibility across AI-powered search platforms. This repository contains the public website, the account-entry screens, and Next.js server actions that communicate with the GeoRank API. The signed-in dashboard lives in a separate React application.

## Run the preview

Use Node.js 22 or 24 and npm.

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). The landing page, pricing, public feature pages, language switching, and interactive preview cards run without credentials. The landing-page preview and chart values are illustrative. Authentication, invitations, and account actions require the separate GeoRank API. Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_DASHBOARD_URL` for a local development stack using `.env.example` as a starting point.

## Where to review the code

| Area | Entry points |
| --- | --- |
| Responsive landing page and product previews | `app/(public)/page.tsx`, `components/landing/dashboard-preview.tsx` |
| Accessible forms and authentication handoff | `app/(public)/login/page.tsx`, `app/(public)/signup/page.tsx`, `lib/utils/login-destination.ts` |
| Authentication and private API requests | `app/actions/auth.ts`, `lib/api/client.ts`, `proxy.ts` |
| Localization | `i18n/request.ts`, `app/actions/locale.ts`, `dictionaries/` |

Next.js App Router renders the public routes. Client components handle interactive sections and form state. Forms use React Hook Form and Zod, while API authorization remains the responsibility of the backend. The frontend separates cacheable public requests from account-specific requests, and the login callback accepts only local paths. Analytics and support integrations require their own configuration. The Inter font is installed with the project so builds can run without fetching font files.

## Checks

```bash
npm run check
npm run build
```

`npm run check` runs ESLint, TypeScript, and Vitest unit tests. After building, `npx playwright install chromium` and `npm run test:preview` verify the public site without the API. The account-level integration and Playwright suites exercise a separately provisioned development stack. Run them with `npm run test:integration` and `npm run test:e2e` only against disposable services. The Playwright config expects the Go API checkout at `../backend` and does not provision the database or configure email verification.

`npm start` serves the production build locally. The Dockerfile runs the same lockfile-based build and starts its standalone Node.js output.
