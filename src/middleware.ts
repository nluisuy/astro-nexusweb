import { defineMiddleware } from "astro:middleware";

// Countries that speak Spanish in LATAM + Spain
const SPANISH_COUNTRIES = [
    "AR", "BO", "CL", "CO", "CR", "CU", "DO",
    "EC", "SV", "GT", "HN", "MX", "NI", "PA",
    "PY", "PE", "PR", "UY", "VE", "ES", "GQ"
];

// Crawlers never get redirected: "/" stays indexable as English and hreflang
// points them to /es/ (a redirect here would hide one language from the index).
const BOT_UA = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|pinterest|lighthouse|pagespeed|headless/i;

export const onRequest = defineMiddleware((context, next) => {
    // Only intercept requests for the root domain or our target pages
    const url = new URL(context.request.url);

    // We only care about page navigations, skip assets and api
    if (url.pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|ico)$/i)) {
        return next();
    }

    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_astro')) {
        return next();
    }

    // Check for explicit language override via cookie (set by the navbar switcher)
    const langCookie = context.cookies.get("nx_lang")?.value;

    // If the path is strictly the root `/`: pick the language once, by region.
    // Any other URL (/es/..., /blog, ...) is explicit and is never redirected.
    if (url.pathname === '/') {
        if (BOT_UA.test(context.request.headers.get("user-agent") || "")) {
            return next();
        }

        let shouldBeEs = false;

        if (langCookie === 'es') {
            shouldBeEs = true;
        } else if (!langCookie) {
            // 1) Vercel's Edge Geo-IP header: LATAM + Spain → Spanish, USA/rest → English
            const countryCode = context.request.headers.get("x-vercel-ip-country");
            if (countryCode) {
                shouldBeEs = SPANISH_COUNTRIES.includes(countryCode.toUpperCase());
            } else {
                // 2) No geo header (local dev, previews, other hosts): browser language
                shouldBeEs = context.preferredLocale === 'es';
            }
        }

        if (shouldBeEs) {
            return context.redirect('/es/', 302);
        }
    }

    return next();
});
