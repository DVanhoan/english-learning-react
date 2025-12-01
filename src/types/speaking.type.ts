import type { UserSummary } from "./user.type";

export interface SpeakingTopic {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    level: string;
}

export interface SpeakingTopicRequest {
    title: string;
    description: string;
    level: string;
}

export interface SpeakingRoom {
    id: number;
    roomName: string;
    isActive: boolean;
    host: UserSummary;
    topic: SpeakingTopic;
    currentParticipants: number;
}