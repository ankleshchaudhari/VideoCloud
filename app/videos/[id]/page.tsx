"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { IKVideo } from "imagekitio-next";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VideoPage() {
    const params = useParams();
    const router = useRouter();
    const [video, setVideo] = useState<IVideo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const videoId = params.id as string;
                const data = await apiClient.getVideo(videoId);
                setVideo(data);
            } catch (err) {
                setError("Failed to load video");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchVideo();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
                <p className="text-xl text-red-500">{error || "Video not found"}</p>
                <Link href="/" className="text-indigo-600 hover:underline">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>

                    <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video mb-8 relative">
                        <IKVideo
                            src={video.videoUrl}
                            controls={true}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {video.title}
                        </h1>

                        <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Description</h3>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {video.description}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
