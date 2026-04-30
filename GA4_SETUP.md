# Google Analytics 4 (GA4) — Activation Guide

The GA4 integration is **already installed in code**. The site loads
the GA4 library and tracks SPA route changes whenever the
`NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable is set. Until you
set that variable, the integration is a no-op (zero bytes shipped to
the browser, zero requests fired).

This document covers the three-step activation flow:

1. Get a GA4 Measurement ID from analytics.google.com
2. Add the ID to Vercel environment variables and redeploy
3. Link Search Console to GA4 to enrich reports with search-query data

---

## 1. Get your GA4 Measurement ID

1. Go to **https://analytics.google.com**
2. Click the **gear icon** at the bottom-left (Admin)
3. Click **Create** → **Property**
4. Property name: `Alex Nwoko Portfolio`. Timezone: West Africa Time
   (or wherever you do most of your work). Currency: USD.
5. Click **Next**, fill in business details, click **Create**
6. On the **Data Streams** screen, choose **Web**
7. Stream URL: `https://alexnwoko.com`. Stream name: `Production`.
8. Click **Create stream**
9. You will land on the stream details page. Copy the **Measurement
   ID** at the top right. It looks like `G-XXXXXXXXXX`.

---

## 2. Wire the Measurement ID into Vercel and redeploy

1. Go to **https://vercel.com/vendoh/alex-nwoko-portfolio/settings/environment-variables**
2. Add a new variable:
   - Key: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Value: paste the `G-XXXXXXXXXX` ID from step 1
   - Environments: tick **Production**, **Preview**, and **Development**
3. Click **Save**
4. Trigger a new deployment so the value is baked into the client
   bundle. Two ways:
   - In Vercel dashboard, go to **Deployments** tab → click the three
     dots on the latest production deployment → **Redeploy**.
   - Or push any small change to git (the GitHub integration will
     auto-deploy).
5. Wait ~2 minutes for the build to finish, then visit
   https://alexnwoko.com.

---

## 3. Verify GA4 is firing

Two ways to confirm.

**Browser DevTools (fastest).** Open https://alexnwoko.com in Chrome.
Open DevTools → Network tab → filter by `googletagmanager`. You should
see a request to `https://www.googletagmanager.com/gtag/js?id=G-XXXX...`
load with status 200. Navigate to a different page (e.g. /blog). A
new `collect?...` request should fire. That is GA4 receiving the
page_view event.

**GA4 DebugView.** In GA4 → Admin → Property → DebugView. With the
Chrome Google Analytics Debugger extension installed, every event
you trigger on the site appears in DebugView in real time. Useful
for confirming that page_view events fire on Next.js SPA navigation
(homepage → blog → individual post should produce 3 events).

---

## 4. Link GA4 to Search Console

This makes Search Console query data appear inside GA4 reports — so
you can see which Google searches brought traffic to which pages,
without leaving GA4.

1. In GA4 → **Admin** (gear icon)
2. Under **Property**, click **Search Console links**
3. Click **Link**
4. Pick the **alexnwoko.com** Search Console property
5. Pick the **Production** Web data stream
6. Confirm

Within 24 hours, search-query data starts appearing in GA4 reports
under **Reports** → **Acquisition** → **Search Console**.

---

## What this integration does and does not do

**Does:**

- Loads gtag.js after page is interactive (does not block first paint)
- Sends `page_view` events on initial load and on every Next.js
  client-side navigation (App Router pathname / search-param changes)
- Anonymises visitor IP at collection (`anonymize_ip: true`)
- Disables the default automatic page_view that would otherwise
  double-fire alongside our manual SPA tracker

**Does not:**

- Show a cookie banner. If you want a consent banner (GDPR-strict),
  that is a separate feature to add. The current setup is the EU's
  "soft default" of anonymised analytics, which most regulators
  accept without explicit consent for legitimate-interest analytics.
- Track outbound link clicks, file downloads, or scroll depth.
  GA4's enhanced measurement covers these — turn them on in
  GA4 → Admin → Data Streams → Production → Enhanced measurement.

---

## Code references

- Component: `src/components/Analytics.tsx`
- Mounted in: `src/app/layout.tsx` (inside `<body>`, just after Footer)
- Env var: `NEXT_PUBLIC_GA_MEASUREMENT_ID`

To temporarily disable GA4 site-wide, unset the env var in Vercel and
redeploy. No code change needed.
