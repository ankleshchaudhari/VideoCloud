"use client";

import VideoUploadForm from "../components/VideoUploadForm";

export default function VideoUploadPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Upload New Reel</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Share your creativity with the world</p>
        </div>
        <VideoUploadForm />
      </div>
    </div>
  );
}