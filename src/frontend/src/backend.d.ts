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
    views: bigint;
    creatorId: string;
    captionVtt: string;
    description: string;
    videoBlob: ExternalBlob;
    creatorName: string;
    qualityLevel: string;
    thumbnailBlob: ExternalBlob;
    uploadTime: Time;
}
export interface UploadPermission {
    dailyCount: bigint;
    cooldownRemaining: bigint;
    allowed: boolean;
    dailyLimit: bigint;
    storageUsedBytes: bigint;
    tempBlockRemaining: bigint;
    reason: string;
}
export type Time = bigint;
export interface CreatorStats {
    dailyCount: bigint;
    tier: CreatorTier;
    lastUploadTime: Time;
    dailyLimit: bigint;
    totalUploads: bigint;
}
export interface VideoView {
    timestamp: Time;
    videoId: string;
}
export interface UserSettings {
    language: string;
    darkMode: boolean;
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
export enum CreatorTier {
    verified = "verified",
    active = "active",
    new_user = "new_user"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addStorageUsage(bytes: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkUploadPermission(): Promise<UploadPermission>;
    deleteVideo(videoId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCaptionTracks(videoId: string): Promise<Array<CaptionTrack>>;
    getCreatorStats(): Promise<CreatorStats>;
    getCreatorTier(user: Principal): Promise<CreatorTier>;
    getSettings(): Promise<UserSettings | null>;
    getUploadStats(): Promise<UploadPermission>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideoCaption(videoId: string): Promise<string>;
    getWatchHistory(): Promise<Array<VideoView>>;
    incrementViews(videoId: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listAllVideos(): Promise<Array<Video>>;
    listReadyVideos(): Promise<Array<Video>>;
    removeCaptionTrack(videoId: string, language: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchVideos(searchTerm: string): Promise<Array<Video>>;
    setCaptionTrack(videoId: string, language: string, captionLabel: string, vtt: string): Promise<void>;
    updateSettings(settings: UserSettings): Promise<void>;
    updateVideoCaption(videoId: string, vtt: string): Promise<void>;
    updateVideoQuality(videoId: string, quality: string): Promise<void>;
    updateVideoStatus(videoId: string, status: string): Promise<void>;
    updateWatchHistory(videoId: string): Promise<void>;
    uploadVideo(id: string, title: string, videoBlob: ExternalBlob, thumbnailBlob: ExternalBlob, description: string): Promise<string>;
    verifyCreator(user: Principal): Promise<void>;
}
