export declare const colleges: ({
    name: string;
    city: string;
    state: string;
    country: string;
    website: string;
} | {
    name: string;
    city: string;
    country: string;
    website: string;
    state?: undefined;
})[];
export declare const trainers: {
    name: string;
    email: string;
    skills: string[];
    hourlyRate: number;
    location: string;
    bio: string;
}[];
export declare const requirements: {
    title: string;
    description: string;
    tags: string[];
    budgetMin: number;
    budgetMax: number;
    startDate: Date;
    endDate: Date;
    status: string;
}[];
export declare const sessions: {
    title: string;
    status: string;
    startTime: Date;
    endTime: Date;
    location: string;
}[];
export declare const documents: {
    title: string;
    type: string;
    folder: string;
}[];
