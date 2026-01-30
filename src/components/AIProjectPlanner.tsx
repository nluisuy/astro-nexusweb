import { useState } from "react";
import type { RoadmapResponse } from "../types";

interface AIProjectPlannerProps {
    onClose?: () => void;
    isOpen?: boolean;
}

const AIProjectPlanner = ({ onClose, isOpen = false }: AIProjectPlannerProps) => {
    // If modal is not open, don't render anything
    if (!isOpen) return null;

    // Use the provided onClose or fallback to global closePlanner
    const handleClose = () => {
        if (onClose) {
            onClose();
        } else if (typeof window !== "undefined" && (window as any).closePlanner) {
            (window as any).closePlanner();
        }
    };
    const [goal, setGoal] = useState("");
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (!goal.trim()) return;

        setLoading(true);
        setError(null);

        setTimeout(() => {
            const mockRoadmap: RoadmapResponse = {
                projectName: "Innovative Digital Platform",
                executiveSummary:
                    "A comprehensive solution leveraging cloud-native architecture, AI capabilities, and enterprise-grade security to transform digital operations.",
                steps: [
                    {
                        title: "Foundation & Architecture",
                        description:
                            "Establish core infrastructure with scalable cloud architecture and security frameworks.",
                        techStack: ["AWS", "Kubernetes", "Terraform", "PostgreSQL"],
                        estimatedTimeline: "4-6 weeks",
                    },
                    {
                        title: "AI Integration",
                        description:
                            "Implement AI/ML models for automation and intelligent decision-making.",
                        techStack: ["Python", "TensorFlow", "OpenAI API", "LangChain"],
                        estimatedTimeline: "6-8 weeks",
                    },
                    {
                        title: "Security & Compliance",
                        description:
                            "Deploy comprehensive security measures and achieve compliance certifications.",
                        techStack: ["AWS GuardDuty", "Vault", "SIEM", "SOC 2"],
                        estimatedTimeline: "8-10 weeks",
                    },
                ],
            };

            setRoadmap(mockRoadmap);
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-20 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-white dark:text-slate-900 text-xl transition-colors">
                            architecture
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white transition-colors">
                            Nexus Architect AI
                        </h2>
                        <p className="text-[0.6rem] text-slate-400 uppercase tracking-widest font-bold">
                            Innovation Engine v3.1
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {!roadmap ? (
                    <div className="max-w-md mx-auto py-12">
                        <div className="text-center mb-12">
                            <span className="inline-block px-3 py-1 bg-nexus-blue/5 text-nexus-blue text-[0.65rem] font-bold uppercase tracking-widest rounded-full mb-6">
                                Strategic Input Required
                            </span>
                            <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4 transition-colors">
                                Define Your Objective
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-light transition-colors">
                                Briefly outline your technical vision. Our engine will generate a
                                comprehensive architecture roadmap and tech stack recommendation.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="relative group">
                                <textarea
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    placeholder="Example: We need a secure, HIPAA-compliant patient portal that uses AI for symptom triaging..."
                                    className="w-full h-48 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-nexus-blue focus:border-transparent resize-none text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-sm leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    disabled={loading}
                                />
                                <div className="absolute bottom-4 right-4 text-[0.6rem] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-widest">
                                    AI Context Engine
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !goal.trim()}
                                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200 dark:shadow-none active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/20 dark:border-slate-900/20 border-t-white dark:border-t-slate-900 rounded-full animate-spin"></span>
                                        Synthesizing Roadmap...
                                    </>
                                ) : (
                                    <>
                                        Generate Technical Roadmap
                                        <span className="material-symbols-outlined text-sm">
                                            bolt
                                        </span>
                                    </>
                                )}
                            </button>
                        </form>
                        {error && (
                            <div className="mt-6 p-4 bg-red-50 text-nexus-red rounded-2xl text-center text-xs font-bold uppercase tracking-widest">
                                {error}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden group border border-slate-800">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-nexus-blue/10 blur-[100px] group-hover:bg-nexus-blue/20 transition-all duration-1000"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-1.5 h-1.5 rounded-full bg-nexus-blue animate-pulse"></span>
                                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400">
                                        Blueprint Identity
                                    </span>
                                </div>
                                <h3 className="text-3xl font-display font-bold mb-6 tracking-tight">
                                    {roadmap.projectName}
                                </h3>
                                <p className="text-slate-400 text-base leading-relaxed font-light italic">
                                    "{roadmap.executiveSummary}"
                                </p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.4em] text-slate-400 flex items-center gap-4">
                                Strategic Phases
                                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
                            </h4>
                            <div className="space-y-1">
                                {roadmap.steps.map((step, idx) => (
                                    <div key={idx} className="relative pl-12 pb-12 last:pb-0 group">
                                        {idx !== roadmap.steps.length - 1 && (
                                            <div className="absolute left-[7px] top-6 w-[2px] h-full bg-slate-100 dark:bg-slate-800 group-hover:bg-nexus-blue/20 transition-colors"></div>
                                        )}

                                        <div className="absolute left-0 top-0 w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 group-hover:border-nexus-blue transition-colors flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-nexus-blue transition-all"></div>
                                        </div>

                                        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl -mt-2 transition-all group-hover:translate-x-1 border border-transparent dark:border-slate-800">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <h5 className="text-xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">
                                                        {step.title}
                                                    </h5>
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[10px] text-slate-300">
                                                            timer
                                                        </span>
                                                        <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest">
                                                            {step.estimatedTimeline}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed mb-6 transition-colors">
                                                {step.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {step.techStack.map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="text-[0.55rem] font-bold text-nexus-blue bg-nexus-blue/5 border border-nexus-blue/10 px-3 py-1.5 rounded-full uppercase tracking-widest"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 sticky bottom-0 bg-white dark:bg-slate-900 pb-4 transition-colors">
                            <button
                                onClick={() => setRoadmap(null)}
                                className="flex-1 py-5 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                            >
                                Start Over
                            </button>
                            <button
                                className="flex-1 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xl shadow-slate-200 dark:shadow-none active:scale-95 flex items-center justify-center gap-3"
                                onClick={handleClose}
                            >
                                Contact Architect
                                <span className="material-symbols-outlined text-sm">mail</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-8 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex justify-between items-center opacity-40">
                    <p className="text-[0.6rem] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
                        Encrypted Session
                    </p>
                    <p className="text-[0.6rem] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
                        © 2024 Nexus AI
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AIProjectPlanner;
