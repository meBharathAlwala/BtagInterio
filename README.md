# Btag Interio

Angular 22 standalone website and admin workspace for Btag Interio. The project includes a public marketing site, a contact flow backed by EmailJS, and a client-side admin area for quotations, measurements, material estimates, revised quotations, and estimate charts.

## Current scope

### Public website

- Home page with hero section, featured work cards, and embedded contact modal.
- Portfolio page with project gallery entries from the `public/` folder and remote showcase images.
- Services page covering modular kitchen, wardrobe, and TV unit offerings.
- About page driven by reusable business configuration.
- Contact page with business contact details and reusable contact form.

### Admin area

- Admin login at `/admin/login`.
- Protected dashboard at `/admin` using a route guard and session storage auth state.
- Quotation tool with line items, saved quotations, PDF export, current quotation CSV export, and all-quotations CSV export.
- Measurements tool for room dimensions, square-foot calculations, and PDF export.
- Material Estimate tool with room-wise costing, PDF export, Excel export, and Excel import.
- Revised Quotation tab generated from material estimate data.
- Estimate Charts tab with section-wise and material-wise cost breakdowns plus PDF export.
- Shared measurement converter and area calculator in the dashboard.

## Routes implemented

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/portfolio` | Portfolio gallery |
| `/services` | Services overview |
| `/contact` | Contact details and enquiry form |
| `/about` | Company profile |
| `/admin/login` | Admin authentication |
| `/admin` | Admin dashboard |

Unknown routes redirect back to `/`.

## Tech stack

- Angular 22 standalone components
- Angular SSR (`@angular/ssr`)
- Express server for SSR output
- EmailJS for contact form submission
- jsPDF and `jspdf-autotable` for PDF generation
- `xlsx` for estimate Excel import/export
- Vitest through Angular's test integration

## Project structure

### Core app

- `src/app/app.routes.ts`: public and admin route definitions
- `src/app/app.routes.server.ts`: SSR route behavior
- `src/app/client.config.ts`: central business configuration and branding

### Public pages

- `src/app/home/`
- `src/app/portfolio/`
- `src/app/services/`
- `src/app/about/`
- `src/app/contact/`
- `src/app/contact-form/`

### Admin modules

- `src/app/admin/admin-login/`
- `src/app/admin/admin-dashboard/`
- `src/app/admin/quotation/`
- `src/app/admin/measurements/`
- `src/app/admin/material-estimate/`
- `src/app/admin/revised-quotation/`
- `src/app/admin/estimate-charts/`
- `src/app/admin/admin-auth.service.ts`
- `src/app/admin/admin.guard.ts`
- `src/app/admin/revised-quotation.service.ts`

## Functional documentation

### 1. Business configuration

All business-specific values are centralized in `src/app/client.config.ts`.

This file currently controls:

- Brand name, short name, and browser tab title
- Logo path
- Phone, WhatsApp, email, and location
- Instagram and YouTube URLs
- EmailJS service identifiers
- Admin login credentials

This design allows basic rebranding without changing the rest of the application.

### 2. Public enquiry flow

The contact form is reused on both the home page modal and the contact page.

Current behavior:

- Collects user input through a standard HTML form
- Sends the form through EmailJS using credentials from `client.config.ts`
- Shows simple success and error states in the UI

### 3. Admin authentication

Authentication is currently client-side only.

Current behavior:

- Credentials are validated against values stored in `client.config.ts`
- Successful login stores a session flag in `sessionStorage`
- `adminGuard` blocks access to `/admin` unless that flag exists
- Logout clears the session flag and returns the user to `/admin/login`

### 4. Quotation workflow

The quotation module supports quick quote preparation for interior work.

Implemented features:

- Customer name, phone, and project location fields
- Dynamic line items with quantity and rate
- Suggested item shortcuts such as TV Unit and Modular Kitchen
- Total calculation in the UI
- Save quotation locally in browser storage
- Delete saved quotations
- Export current quotation to PDF
- Export current quotation to CSV for Excel
- Export all saved quotations to a single CSV file

Storage details:

- Quotations are stored in browser `localStorage`
- Storage key: `btag_admin_quotations`

### 5. Measurements workflow

The measurements module is intended for site dimension capture.

Implemented features:

- Client and project metadata
- Multiple room or area rows
- Length and width entry with selectable units
- Automatic square-foot conversion
- Running total of all measured areas
- Suggested room names
- PDF export for site measurements

### 6. Material estimate workflow

This is currently the most detailed costing module in the admin area.

Implemented features:

- Client and project metadata
- Room-wise estimate entries
- Material categories including plywood, laminate, hardware, electrical work, and others
- Context-sensitive thickness or subtype options depending on material selected
- Quantity, rate, and total calculations
- Room section grouping and room totals
- Estimate reset flow
- PDF export
- Excel export with separate metadata and item sheets
- Excel import for previously prepared estimate files
- Background preload of the `xlsx` module in the browser

Special behavior:

- If the user clicks Generate Revised Quotation while an Excel import is still in progress, the action is queued and the revised quotation tab opens automatically once import completes.

### 7. Revised quotation workflow

The revised quotation module derives a cleaner summary from the material estimate.

Implemented features:

- Receives live snapshot data from the material estimate module
- Groups costs by room or section
- Shows a summarized final quotation
- PDF export of the revised quotation

### 8. Estimate charts

The estimate charts module visualizes estimate data from the same shared snapshot.

Implemented features:

- Section-wise cost breakdown
- Material-wise cost breakdown
- Relative-width bar chart presentation in the UI
- PDF export of the chart summary

### 9. Shared admin utilities

The admin dashboard includes a popup utility for quick conversions.

Implemented features:

- Unit conversion between `mm`, `cm`, `inch`, and `feet`
- Area calculator converting entered dimensions to square feet

## Data and state model

Current persistence is browser-side only.

- Admin auth state uses `sessionStorage`
- Saved quotations use `localStorage`
- Measurements, material estimates, revised quotations, and charts are runtime UI state unless exported
- There is no backend API or database in the current implementation

## SSR behavior

The project uses Angular SSR, but admin routes are explicitly set to client render mode:

- `/admin`
- `/admin/login`

Reason:

- Admin authentication and storage flows depend on browser-only APIs such as `sessionStorage` and `localStorage`

All other routes are configured for prerendering.

## Running the project

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm start
```

Default local URL:

```text
http://localhost:4200/
```

### Build

```bash
npm run build
```

### Run tests

```bash
npm test
```

### Run SSR output after build

```bash
npm run serve:ssr:btag
```

## Important implementation notes

- The admin area is not secure enough for production because credentials live in frontend code and auth is client-side only.
- Contact form delivery depends on valid EmailJS configuration in `src/app/client.config.ts`.
- Export features rely on browser APIs and do not run during server rendering.
- Several generated PDFs still use hard-coded accent colors in their tables.

## Known gaps and recommended next work

### Current gaps

- No backend or persistent server-side storage
- No role-based access control
- No API-based authentication
- No admin audit history
- No centralized storage for measurements or estimates
- No automated end-to-end coverage for the public or admin flows

### Recommended next steps

1. Move admin authentication to a backend service and remove credentials from frontend configuration.
2. Add database-backed storage for quotations, measurements, and estimates.
3. Add import/export validation and user-facing error reporting around Excel uploads.
4. Add route-level and component-level tests for admin workflows.
5. Move business secrets such as EmailJS identifiers to environment-specific configuration.

## Summary

So far, the project has moved beyond a starter Angular site into a usable business website plus a client-side operations dashboard for interior quotation and estimation work. The public experience is in place, the admin toolset is functional for browser-based use, and the main remaining work is production hardening around authentication, persistence, and testing.
