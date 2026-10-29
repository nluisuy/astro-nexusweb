import React, { useEffect, useState } from "react";
import { pocOptions } from "../data/pocOptions";

type Lang = "en" | "es";
type Intent = "contact" | "poc";

interface ContactModalProps {
    lang?: Lang;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
}

// Detail of the `openContactModal` event (see lib/book.ts)
export interface OpenDetail {
    mode?: Intent;
    poc?: string;
}

const T = {
    en: {
        contactTitle: "Start your digital transformation",
        contactSub: "Reply within 24h · no commitment",
        pocTitle: "Start your free POC",
        pocSub: "Free · on your stack · you own the code",
        name: "Full Name",
        email: "Email Address",
        phone: "Phone",
        optional: "(Optional)",
        service: "Service Interest",
        which: "Which POC?",
        message: "Message",
        messagePh: "Tell us about your project goals and challenges...",
        pocMessagePh: "What would you like the POC to prove? Context, systems involved, success criteria...",
        send: "Send Message",
        sendPoc: "Request my POC",
        sending: "Sending...",
        errName: "Full name is required",
        errEmail: "Email is required",
        errEmailFmt: "Please enter a valid email address",
        errMessage: "Message is required",
        errGeneric: "An unexpected error occurred. Please try again.",
        trust: ["24h response", "No commitment", "Secure & private"],
        contactOptions: ["General Inquiry", "Cloud Architecture", "AI Solutions", "Cybersecurity", "Digital Transformation"],
    },
    es: {
        contactTitle: "Inicia tu transformación digital",
        contactSub: "Respuesta en 24h · sin compromiso",
        pocTitle: "Inicia tu POC gratis",
        pocSub: "Gratis · en tu stack · el código es tuyo",
        name: "Nombre completo",
        email: "Email",
        phone: "Teléfono",
        optional: "(Opcional)",
        service: "Área de interés",
        which: "¿Qué POC?",
        message: "Mensaje",
        messagePh: "Contanos sobre los objetivos y desafíos de tu proyecto...",
        pocMessagePh: "¿Qué querés que demuestre el POC? Contexto, sistemas involucrados, criterios de éxito...",
        send: "Enviar mensaje",
        sendPoc: "Pedir mi POC",
        sending: "Enviando...",
        errName: "El nombre es obligatorio",
        errEmail: "El email es obligatorio",
        errEmailFmt: "Ingresá un email válido",
        errMessage: "El mensaje es obligatorio",
        errGeneric: "Ocurrió un error inesperado. Intentá de nuevo.",
        trust: ["Respuesta en 24h", "Sin compromiso", "Seguro y privado"],
        contactOptions: ["Consulta general", "Arquitectura cloud", "Soluciones de IA", "Ciberseguridad", "Transformación digital"],
    },
} as const;

// The Nexus X (same mark as the wordmark)
const NexusX = () => (
    <svg viewBox="0 0 100 100" className="w-7 h-7" aria-hidden="true">
        <defs>
            <linearGradient id="cm-xg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#a99bff" />
                <stop offset="0.55" stopColor="#6366f1" />
                <stop offset="1" stopColor="#f59e42" />
            </linearGradient>
        </defs>
        <line x1="18" y1="18" x2="82" y2="82" stroke="url(#cm-xg)" strokeWidth="14" strokeLinecap="round" />
        <line x1="82" y1="18" x2="18" y2="82" stroke="url(#cm-xg)" strokeWidth="14" strokeLinecap="round" />
        <circle cx="50" cy="50" r="14" fill="#fff" opacity="0.25" />
        <circle cx="50" cy="50" r="7.5" fill="#fff" />
    </svg>
);

const INPUT =
    "w-full px-4 py-3 rounded-xl border focus:ring-2 focus:border-transparent text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-sm";
const OK = "border-slate-200 dark:border-slate-700 focus:ring-nexus-blue";
const BAD = "border-nexus-red focus:ring-nexus-red";
const LABEL = "block text-[0.62rem] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5";

const ContactModal = ({ lang = "en" }: ContactModalProps) => {
    const t = T[lang];
    const [intent, setIntent] = useState<Intent>("contact");
    const [formData, setFormData] = useState<FormData>({ name: "", email: "", phone: "", subject: "", message: "" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({
        type: null,
        message: "",
    });

    const handleClose = () => {
        if (typeof window !== "undefined" && (window as any).closeContactModal) (window as any).closeContactModal();
    };

    const reset = () => {
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setErrors({});
        setSubmitStatus({ type: null, message: "" });
    };

    // Opened by lib/book.ts: pick the mode and preselect the POC the CTA referred to.
    useEffect(() => {
        const onOpen = (e: Event) => {
            const d = ((e as CustomEvent<OpenDetail>).detail || {}) as OpenDetail;
            const mode: Intent = d.mode === "poc" ? "poc" : "contact";
            setIntent(mode);
            setErrors({});
            setSubmitStatus({ type: null, message: "" });
            setFormData((prev) => ({
                ...prev,
                subject:
                    mode === "poc"
                        ? pocOptions.some((o) => o.key === d.poc)
                            ? (d.poc as string)
                            : "undecided"
                        : t.contactOptions[0],
            }));
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        const onClosed = () => setTimeout(reset, 300);
        window.addEventListener("openContactModal", onOpen);
        window.addEventListener("contactModalClosed", onClosed);
        document.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("openContactModal", onOpen);
            window.removeEventListener("contactModalClosed", onClosed);
            document.removeEventListener("keydown", onKey);
        };
    }, [lang]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = t.errName;
        if (!formData.email.trim()) newErrors.email = t.errEmail;
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t.errEmailFmt;
        if (!formData.message.trim()) newErrors.message = t.errMessage;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit: React.ComponentProps<"form">["onSubmit"] = async (e) => {
        e.preventDefault();
        setSubmitStatus({ type: null, message: "" });
        if (!validateForm()) return;
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("name", formData.name);
            fd.append("email", formData.email);
            fd.append("phone", formData.phone);
            fd.append("intent", intent);
            if (intent === "poc") {
                const opt = pocOptions.find((o) => o.key === formData.subject);
                fd.append("subject", opt ? opt.en : formData.subject);
                fd.append("poc", formData.subject);
            } else {
                fd.append("subject", formData.subject || t.contactOptions[0]);
            }
            fd.append("message", formData.message);
            fd.append("lang", lang);

            const response = await fetch("/api/contact", { method: "POST", body: fd });
            const result = await response.json();
            if (result.success) {
                setSubmitStatus({ type: "success", message: result.message });
                setTimeout(handleClose, 3000);
            } else {
                setSubmitStatus({ type: "error", message: result.message });
            }
        } catch {
            setSubmitStatus({ type: "error", message: t.errGeneric });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const isPoc = intent === "poc";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-colors"
            onClick={handleClose}
            style={{ backgroundColor: "rgba(2, 6, 23, 0.45)", backdropFilter: "blur(4px)" }}
        >
            <div
                className="w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/30 border border-slate-200/70 dark:border-slate-700/60 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-modal-title"
            >
                {/* Header */}
                <div className="px-5 py-4 sm:px-7 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-20 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 shrink-0 bg-slate-900 dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-[0_0_18px_rgba(99,102,241,0.35)]">
                            <NexusX />
                        </div>
                        <div className="min-w-0">
                            <h2
                                id="contact-modal-title"
                                className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white transition-colors leading-tight"
                            >
                                {isPoc ? t.pocTitle : t.contactTitle}
                            </h2>
                            <p className="text-[0.6rem] text-slate-400 uppercase tracking-widest font-bold truncate">
                                {isPoc ? t.pocSub : t.contactSub}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        aria-label="Close"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form — sized to fit the viewport; scroll only as a fallback */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-7">
                    <div className="max-w-xl mx-auto">
                        {submitStatus.type && (
                            <div
                                className={`mb-4 px-4 py-3 rounded-xl text-center text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
                                    submitStatus.type === "success"
                                        ? "bg-nexus-green/10 text-nexus-green border border-nexus-green/20"
                                        : "bg-nexus-red/10 text-nexus-red border border-nexus-red/20"
                                }`}
                            >
                                <span className="material-symbols-outlined inline-block mr-2 align-middle text-base">
                                    {submitStatus.type === "success" ? "check_circle" : "error"}
                                </span>
                                {submitStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className={LABEL}>
                                        {t.name} <span className="text-nexus-red">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className={`${INPUT} ${errors.name ? BAD : OK}`}
                                        placeholder="John Smith"
                                        autoComplete="name"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-nexus-red font-medium">{errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className={LABEL}>
                                        {t.email} <span className="text-nexus-red">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className={`${INPUT} ${errors.email ? BAD : OK}`}
                                        placeholder="john.smith@company.com"
                                        autoComplete="email"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-nexus-red font-medium">{errors.email}</p>}
                                </div>
                            </div>

                            <div className={`grid gap-4 ${isPoc ? "grid-cols-1 min-[480px]:grid-cols-[0.8fr_1.2fr]" : "grid-cols-2"}`}>
                                <div>
                                    <label htmlFor="phone" className={LABEL}>
                                        {t.phone} <span className="text-slate-300 dark:text-slate-600">{t.optional}</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className={`${INPUT} ${OK}`}
                                        placeholder="+1 (555) 123-4567"
                                        autoComplete="tel"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className={LABEL}>
                                        {isPoc ? t.which : t.service}
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            disabled={loading}
                                            className={`${INPUT} ${OK} appearance-none pr-9`}
                                        >
                                            {isPoc
                                                ? pocOptions.map((o) => (
                                                      <option key={o.key} value={o.key}>
                                                          {o[lang]}
                                                      </option>
                                                  ))
                                                : t.contactOptions.map((o) => (
                                                      <option key={o} value={o}>
                                                          {o}
                                                      </option>
                                                  ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                            <span className="material-symbols-outlined text-sm">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className={LABEL}>
                                    {t.message} <span className="text-nexus-red">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`${INPUT} ${errors.message ? BAD : OK} h-24 sm:h-28 resize-none leading-relaxed`}
                                    placeholder={isPoc ? t.pocMessagePh : t.messagePh}
                                />
                                {errors.message && <p className="mt-1 text-xs text-nexus-red font-medium">{errors.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm uppercase tracking-[0.18em] hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200 dark:shadow-none active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/20 dark:border-slate-900/20 border-t-white dark:border-t-slate-900 rounded-full animate-spin"></span>
                                        {t.sending}
                                    </>
                                ) : (
                                    <>
                                        {isPoc ? t.sendPoc : t.send}
                                        <span className="material-symbols-outlined text-sm">{isPoc ? "bolt" : "send"}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 sm:px-7 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-1 opacity-50 text-[0.58rem] sm:text-[0.6rem] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
                        <p className="hidden sm:flex items-center gap-3">
                            <span>{t.trust[0]}</span>
                            <span aria-hidden="true">·</span>
                            <span>{t.trust[1]}</span>
                            <span aria-hidden="true">·</span>
                            <span>{t.trust[2]}</span>
                        </p>
                        <p>© {new Date().getFullYear()} Nexus Innovations</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
