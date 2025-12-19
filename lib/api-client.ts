import { IVideo } from "@/models/Video";
import { IUser } from "@/models/User";

export type VideoFormData = Omit<IVideo, "_id">;

export type UserProfile = Omit<IUser, "password">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getVideos() {
    return this.fetch("/videos");
  }

  async createVideo(videoData: VideoFormData) {
    return this.fetch("/videos", {
      method: "POST",
      body: videoData,
    });
  }

  async getUserProfile() {
    return this.fetch<UserProfile>("/user/profile");
  }

  async updateUserProfile(profileData: { name?: string; profilePhoto?: string }) {
    return this.fetch<UserProfile>("/user/profile", {
      method: "PUT",
      body: profileData,
    });
  }

  async getUserVideos() {
    return this.fetch<IVideo[]>("/user/videos");
  }
}

export const apiClient = new ApiClient();