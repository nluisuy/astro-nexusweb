import React, { useState, useEffect } from "react";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
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

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    // Use the provided onClose or fallback to global closeContactModal
    const handleClose = () => {
        if (onClose) {
            onClose();
        } else if (typeof window !== "undefined" && (window as any).closeContactModal) {
            (window as any).closeContactModal();
        }
    };

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: "success" | "error" | null;
        message: string;
    }>({ type: null, message: "" });

    // Handle Escape key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "General Inquiry",
                    message: "",
                });
                setErrors({});
                setSubmitStatus({ type: null, message: "" });
            }, 300);
        }
    }, [isOpen]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Full name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit: React.ComponentProps<"form">["onSubmit"] = async (e) => {
        e.preventDefault();
        setSubmitStatus({ type: null, message: "" });

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("phone", formData.phone);
            formDataToSend.append("subject", formData.subject);
            formDataToSend.append("message", formData.message);

            const response = await fetch("/api/contact", {
                method: "POST",
                body: formDataToSend,
            });

            const result = await response.json();

            if (result.success) {
                setSubmitStatus({
                    type: "success",
                    message: result.message,
                });

                // Close modal after 3 seconds on success
                setTimeout(() => {
                    handleClose();
                }, 3000);
            } else {
                setSubmitStatus({
                    type: "error",
                    message: result.message,
                });
            }
        } catch (error) {
            setSubmitStatus({
                type: "error",
                message: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-end"
            onClick={handleClose}
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(4px)",
            }}
        >
            <div
                className="h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-xl">
                                mail
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-bold text-slate-900">
                                Contact Us
                            </h2>
                            <p className="text-[0.6rem] text-slate-400 uppercase tracking-widest font-bold">
                                Let's Transform Together
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
                        aria-label="Close modal"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="inline-block px-3 py-1 bg-nexus-blue/5 text-nexus-blue text-[0.65rem] font-bold uppercase tracking-widest rounded-full mb-6">
                                Get In Touch
                            </span>
                            <h3 className="text-3xl font-display font-bold text-slate-900 mb-4">
                                Start Your Digital Transformation
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-light">
                                Share your vision with us, and our enterprise architects will
                                connect with you within 24 hours to discuss your strategic
                                objectives.
                            </p>
                        </div>

                        {submitStatus.type && (
                            <div
                                className={`mb-8 p-6 rounded-2xl text-center text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
                                    submitStatus.type === "success"
                                        ? "bg-nexus-green/10 text-nexus-green border border-nexus-green/20"
                                        : "bg-nexus-red/10 text-nexus-red border border-nexus-red/20"
                                }`}
                            >
                                <span className="material-symbols-outlined inline-block mr-2 align-middle">
                                    {submitStatus.type === "success" ? "check_circle" : "error"}
                                </span>
                                {submitStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 mb-3"
                                >
                                    Full Name <span className="text-nexus-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`w-full px-6 py-4 rounded-2xl border ${
                                        errors.name
                                            ? "border-nexus-red focus:ring-nexus-red"
                                            : "border-slate-200 focus:ring-nexus-blue"
                                    } focus:ring-2 focus:border-transparent resize-none text-slate-700 bg-slate-50 focus:bg-white transition-all outline-none text-sm`}
                                    placeholder="John Smith"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-xs text-nexus-red font-medium">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 mb-3"
                                >
                                    Email Address <span className="text-nexus-red">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`w-full px-6 py-4 rounded-2xl border ${
                                        errors.email
                                            ? "border-nexus-red focus:ring-nexus-red"
                                            : "border-slate-200 focus:ring-nexus-blue"
                                    } focus:ring-2 focus:border-transparent resize-none text-slate-700 bg-slate-50 focus:bg-white transition-all outline-none text-sm`}
                                    placeholder="john.smith@company.com"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-xs text-nexus-red font-medium">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Phone (Optional) */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 mb-3"
                                >
                                    Phone Number <span className="text-slate-300">(Optional)</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-nexus-blue focus:border-transparent resize-none text-slate-700 bg-slate-50 focus:bg-white transition-all outline-none text-sm"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>

                            {/* Service Interest */}
                            <div>
                                <label
                                    htmlFor="subject"
                                    className="block text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 mb-3"
                                >
                                    Service Interest
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-nexus-blue focus:border-transparent text-slate-700 bg-slate-50 focus:bg-white transition-all outline-none text-sm"
                                >
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="Cloud Architecture">Cloud Architecture</option>
                                    <option value="AI Solutions">AI Solutions</option>
                                    <option value="Cybersecurity">Cybersecurity</option>
                                    <option value="Digital Transformation">
                                        Digital Transformation
                                    </option>
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 mb-3"
                                >
                                    Message <span className="text-nexus-red">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    disabled={loading}
                                    rows={6}
                                    className={`w-full px-6 py-4 rounded-2xl border ${
                                        errors.message
                                            ? "border-nexus-red focus:ring-nexus-red"
                                            : "border-slate-200 focus:ring-nexus-blue"
                                    } focus:ring-2 focus:border-transparent resize-none text-slate-700 bg-slate-50 focus:bg-white transition-all outline-none text-sm leading-relaxed`}
                                    placeholder="Tell us about your project goals and challenges..."
                                />
                                {errors.message && (
                                    <p className="mt-2 text-xs text-nexus-red font-medium">
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                        Sending Message...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <span className="material-symbols-outlined text-sm">
                                            send
                                        </span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Additional Info */}
                        <div className="mt-12 pt-8 border-t border-slate-100">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="material-symbols-outlined text-nexus-blue text-2xl">
                                        schedule
                                    </span>
                                    <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400">
                                        24h Response
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <span className="material-symbols-outlined text-nexus-green text-2xl">
                                        verified
                                    </span>
                                    <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400">
                                        No Commitment
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <span className="material-symbols-outlined text-nexus-purple text-2xl">
                                        security
                                    </span>
                                    <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400">
                                        Secure & Private
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                    <div className="flex justify-between items-center opacity-40">
                        <p className="text-[0.6rem] text-slate-500 uppercase tracking-widest font-bold">
                            Encrypted Connection
                        </p>
                        <p className="text-[0.6rem] text-slate-500 uppercase tracking-widest font-bold">
                            © 2024 Nexus Innovations
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
