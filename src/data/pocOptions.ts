// Options for the "Start your POC" form: the three vertical offers + every AI product.
// Keys match data-poc attributes on CTAs so the form can preselect the right one.
import { products } from "./aiPortfolio";

export interface PocOption {
    key: string;
    en: string;
    es: string;
}

export const pocOptions: PocOption[] = [
    { key: "undecided", en: "Not sure yet — help me choose", es: "Todavía no lo sé — ayúdenme a elegir" },
    { key: "infra", en: "Infra · capacity POC", es: "Infra · POC de capacidad" },
    { key: "security", en: "Security · resilience assessment", es: "Seguridad · assessment de resiliencia" },
    { key: "pod", en: "AI Innovation Pod · build POC", es: "AI Innovation Pod · POC de construcción" },
    ...products.map((p) => ({ key: p.key, en: p.name, es: p.name })),
    { key: "other", en: "Something else (tell us in the message)", es: "Otra cosa (contanos en el mensaje)" },
];
