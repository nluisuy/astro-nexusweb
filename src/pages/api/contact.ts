import type { APIRoute } from "astro";

export const prerender = false;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    intent: "contact" | "poc";
    poc?: string;
}

const MAX = { name: 120, email: 200, phone: 40, subject: 160, message: 5000, poc: 60 } as const;
const clip = (v: FormDataEntryValue | null, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

// User input goes into an HTML email: escape it.
const esc = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export const POST: APIRoute = async ({ request }) => {
    try {
        // Parse form data
        const formData = await request.formData();

        const data: ContactFormData = {
            name: clip(formData.get("name"), MAX.name),
            email: clip(formData.get("email"), MAX.email),
            phone: clip(formData.get("phone"), MAX.phone),
            subject: clip(formData.get("subject"), MAX.subject),
            message: clip(formData.get("message"), MAX.message),
            intent: formData.get("intent") === "poc" ? "poc" : "contact",
            poc: clip(formData.get("poc"), MAX.poc) || undefined,
        };
        const isPoc = data.intent === "poc";
        const kind = isPoc ? "POC request" : "Contact";

        // Validate required fields
        if (!data.name || !data.email || !data.subject || !data.message) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "All required fields must be filled out.",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // Validate email format
        if (!EMAIL_REGEX.test(data.email)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Please provide a valid email address.",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // Email provider: Resend (https://resend.com). The key must be a "sending only" key.
        const apiKey = (import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY || "").trim();
        if (!apiKey) {
            console.error("RESEND_API_KEY is not configured");
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Email service is not configured. Please contact support.",
                }),
                { status: 500, headers: { "Content-Type": "application/json" } },
            );
        }

        const fromEmail =
            import.meta.env.MAIL_FROM || process.env.MAIL_FROM || "Nexus Innovations <hello@nexusinnova.com>";
        const toEmail = import.meta.env.MAIL_TO || process.env.MAIL_TO || "hello@nexusinnova.com";

        // Create email content
        const textContent = `
New ${kind} from the website

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
${isPoc ? "POC requested" : "Service Interest"}: ${data.subject}${data.poc ? ` (${data.poc})` : ""}

Message:
${data.message}

---
Sent from Nexus Innovations Contact Form
    `.trim();

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background-color: #f9fafb;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
            padding: 32px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .header p {
            color: rgba(255, 255, 255, 0.9);
            margin: 8px 0 0;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }
        .content {
            padding: 32px;
        }
        .field {
            margin-bottom: 24px;
            padding-bottom: 24px;
            border-bottom: 1px solid #e5e7eb;
        }
        .field:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .field-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #64748b;
            margin-bottom: 8px;
        }
        .field-value {
            font-size: 16px;
            color: #1e293b;
            word-wrap: break-word;
        }
        .message-box {
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            padding: 16px;
            border-radius: 8px;
            margin-top: 12px;
            white-space: pre-wrap;
        }
        .footer {
            background-color: #f8fafc;
            padding: 24px 32px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 0;
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
        }
        .badge {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
            color: white;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${isPoc ? "New POC request" : "New Contact Inquiry"}</h1>
            <p>Nexus Innovations</p>
        </div>
        <div class="content">
            <div class="field">
                <div class="field-label">Full Name</div>
                <div class="field-value"><strong>${esc(data.name)}</strong></div>
            </div>
            <div class="field">
                <div class="field-label">Email Address</div>
                <div class="field-value"><a href="mailto:${esc(data.email)}" style="color: #3b82f6; text-decoration: none;">${esc(data.email)}</a></div>
            </div>
            ${
                data.phone
                    ? `
            <div class="field">
                <div class="field-label">Phone Number</div>
                <div class="field-value"><a href="tel:${esc(data.phone || "")}" style="color: #3b82f6; text-decoration: none;">${esc(data.phone || "")}</a></div>
            </div>
            `
                    : ""
            }
            <div class="field">
                <div class="field-label">${isPoc ? "POC requested" : "Service Interest"}</div>
                <div class="field-value">
                    <span class="badge">${esc(data.subject)}</span>
                </div>
            </div>
            <div class="field">
                <div class="field-label">Message</div>
                <div class="message-box">${esc(data.message)}</div>
            </div>
        </div>
        <div class="footer">
            <p>This message was sent from the Nexus Innovations contact form</p>
        </div>
    </div>
</body>
</html>
    `.trim();

        // Send email using Resend's REST API (no SDK needed)
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                from: fromEmail,
                to: [toEmail],
                reply_to: data.email,
                subject: `${isPoc ? "POC request" : "New Contact"}: ${data.subject} - ${data.name}`,
                text: textContent,
                html: htmlContent,
            }),
        });
        if (!res.ok) {
            throw new Error(`Resend ${res.status}: ${await res.text()}`);
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Thank you for contacting us! We will respond within 24 hours.",
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    } catch (error) {
        console.error("Error processing contact form:", error instanceof Error ? error.message : error);

        return new Response(
            JSON.stringify({
                success: false,
                message: "An error occurred while sending your message. Please try again later.",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
};
