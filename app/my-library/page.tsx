"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import VideoFeed from "../components/VideoFeed";
import { useNotification } from "../components/Notification";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MyLibrary() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      showNotification("Please sign in to view your library", "info");
      return;
    }

    const fetchVideos = async () => {
      try {
        setLoading(true);
        const userVideos = await apiClient.getUserVideos();
        setVideos(userVideos as IVideo[]);
      } catch (error) {
        showNotification("Failed to load videos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [session, status, router, showNotification]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                My Library
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                All your uploaded videos
              </p>
            </div>
            <Link
              href="/upload"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors"
            >
              Upload Video
            </Link>
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No videos in your library yet
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Upload Your First Video
            </Link>
          </div>
        ) : (
          <VideoFeed videos={videos} />
        )}
      </main>
    </div>
  );
}

