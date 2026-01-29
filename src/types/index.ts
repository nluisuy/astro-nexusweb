export interface ServiceItem {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}

export interface ProjectItem {
    id: string;
    category: string;
    title: string;
    description: string;
    imageUrl: string;
    colorClass: string;
}

export interface RoadmapStep {
    title: string;
    description: string;
    techStack: string[];
    estimatedTimeline: string;
}

export interface RoadmapResponse {
    projectName: string;
    executiveSummary: string;
    steps: RoadmapStep[];
}
