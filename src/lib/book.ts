// One entry point for every "book a call" / "start the free POC" CTA.
//
// - data-mode="poc" (optionally data-poc="<key>"): opens the "Start your POC" form with
//   that POC preselected. Always the form, never the booking page.
// - otherwise: with PUBLIC_BOOKING_URL set (Calendly, cal.com, Google appointment page)
//   opens the agenda in a new tab; without it, opens the contact form in place.
const BOOKING_URL = (import.meta.env.PUBLIC_BOOKING_URL as string | undefined)?.trim();

export function bookingHref(prefix = ""): string {
    return BOOKING_URL || `${prefix}/#contact`;
}

export function openForm(mode: "contact" | "poc", poc?: string) {
    window.dispatchEvent(new CustomEvent("openContactModal", { detail: { mode, poc } }));
    document.getElementById("mobile-menu")?.classList.add("hidden");
}

export function book(e?: Event) {
    const el = (e?.currentTarget as HTMLElement | null) ?? null;
    const mode = el?.dataset.mode === "poc" ? "poc" : "contact";
    if (mode === "poc") {
        e?.preventDefault();
        openForm("poc", el?.dataset.poc);
        return;
    }
    if (BOOKING_URL) {
        e?.preventDefault();
        window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
        return;
    }
    e?.preventDefault();
    openForm("contact");
}

// Wire every element matching `selector` to the booking action.
export function wireBooking(selector = ".js-book") {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        if (el.dataset.bookWired) return;
        el.dataset.bookWired = "1";
        el.addEventListener("click", book);
    });
}
