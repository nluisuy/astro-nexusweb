import { defineMiddleware } from "astro:middleware";

// Countries that speak Spanish in LATAM + Spain
const SPANISH_COUNTRIES = [
    "AR", "BO", "CL", "CO", "CR", "CU", "DO", 
    "EC", "SV", "GT", "HN", "MX", "NI", "PA", 
    "PY", "PE", "PR", "UY", "VE", "ES", "GQ"
];

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

    // Check for explicit language override via cookie
    const langCookie = context.cookies.get("nx_lang")?.value;
    
    // If the path is strictly the root `/`
    if (url.pathname === '/') {
        let shouldBeEs = false;

        if (langCookie === 'es') {
            shouldBeEs = true;
        } else if (!langCookie) {
            // Check Vercel's Edge Geo-IP header
            const countryCode = context.request.headers.get("x-vercel-ip-country");
            if (countryCode && SPANISH_COUNTRIES.includes(countryCode.toUpperCase())) {
                shouldBeEs = true;
            }
        }

        if (shouldBeEs) {
            return context.redirect('/es/');
        }
    }

    return next();
});
