"use client";

import Link from "next/link";
import { Video, UserPlus, LogIn, Sparkles, Share2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import VideoFeed from "./components/VideoFeed";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 animate-gradient-x">
            Share Your Moments
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            A premium platform to upload, share, and discover amazing videos.
            Join our community of creators today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link href="/upload" className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full font-semibold text-lg text-white transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-1 flex items-center gap-2">
              <Video className="w-5 h-5" />
              Upload Reel
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-6xl">
          {[
            {
              title: "High Quality",
              description: "Upload videos in stunning 4K quality with optimized playback.",
              icon: <Sparkles className="w-10 h-10 text-indigo-500" />,
              href: "/quality"
            },
            {
              title: "Instant Sharing",
              description: "Share your content instantly with our global community.",
              icon: <Share2 className="w-10 h-10 text-purple-500" />,
              href: "/sharing"
            },
            {
              title: "Secure Platform",
              description: "Your content is safe with our enterprise-grade security.",
              icon: <ShieldCheck className="w-10 h-10 text-pink-500" />,
              href: "/instant"
            }
          ].map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="glass p-8 rounded-2xl border !border-gray-300 dark:!border-gray-700/50 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300 hover:-translate-y-1 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-xl cursor-pointer group block flex flex-col items-center text-center"
            >
              <div className="mb-4 p-3 rounded-xl w-fit group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Recent Videos Section */}
        <div className="mt-24 w-full max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Recent Uploads</h2>
          <VideoFeed videos={videos} />
        </div>
      </main>
    </div>
  );
}