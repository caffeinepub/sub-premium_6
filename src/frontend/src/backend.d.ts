import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: string;
    status: string;
    title: string;
    videoBlobId: ExternalBlob;
    views: bigint;
    thumbnailBlobId: ExternalBlob;
    creatorId: string;
    captionVtt: string;
    creatorName: string;
    uploadTime: Time;
}
export type Time = bigint;
export interface UserSettings {
    language: string;
    darkMode: boolean;
}
export interface VideoView {
    timestamp: Time;
    videoId: string;
}
export interface CaptionTrack {
    vtt: string;
    captionLabel: string;
    language: string;
}
export interface UserProfile {
    bio: string;
    username: string;
    displayName: string;
    avatarBlobId: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteVideo(videoId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCaptionTracks(videoId: string): Promise<Array<CaptionTrack>>;
    getSettings(): Promise<UserSettings | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideoCaption(videoId: string): Promise<string>;
    getWatchHistory(): Promise<Array<VideoView>>;
    incrementViews(videoId: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listReadyVideos(): Promise<Array<Video>>;
    removeCaptionTrack(videoId: string, language: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchVideos(searchTerm: string): Promise<Array<Video>>;
    setCaptionTrack(videoId: string, language: string, captionLabel: string, vtt: string): Promise<void>;
    updateSettings(settings: UserSettings): Promise<void>;
    updateVideoCaption(videoId: string, vtt: string): Promise<void>;
    updateVideoStatus(videoId: string, status: string): Promise<void>;
    updateWatchHistory(videoId: string): Promise<void>;
    uploadVideo(id: string, title: string, videoBlob: ExternalBlob, thumbnailBlob: ExternalBlob): Promise<string>;
}
