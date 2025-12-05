"use client";

import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2, UploadCloud, CheckCircle, AlertCircle, FileVideo } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [fileData, setFileData] = useState<{ filePath: string; url: string; thumbnailUrl: string } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  const onError = (err: any) => {
    console.log("Error", err);
    setError(err.message || "Upload failed");
    setUploading(false);
  };

  const onSuccess = (res: any) => {
    console.log("Success", res);
    setFileData({
      filePath: res.filePath,
      url: res.url,
      thumbnailUrl: res.thumbnailUrl || res.url, // Fallback to url if thumbnail not present
    });
    setUploading(false);
    setError("");
  };

  const onUploadProgress = (progress: ProgressEvent) => {
    if (progress.lengthComputable) {
      const percent = Math.round((progress.loaded / progress.total) * 100);
      setProgress(percent);
    }
  };

  const onUploadStart = () => {
    setUploading(true);
    setError("");
    setProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileData) {
      setError("Please upload a video first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          videoUrl: fileData.url,
          thumbnailUrl: fileData.thumbnailUrl,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to publish video");
      }

      router.push("/"); // Redirect to home or dashboard
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 glass p-8 rounded-2xl border border-gray-700/50">

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-400 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Video Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="block w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          placeholder="Enter a catchy title"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="block w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
          placeholder="What is this video about?"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Upload Video</label>
        <div className="relative border-2 border-dashed border-gray-700 rounded-xl p-6 hover:border-indigo-500/50 transition-colors bg-gray-800/30">
          {!fileData ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              {uploading ? (
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  <span className="text-sm text-gray-400">Uploading... {progress}%</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">MP4, WebM, Ogg (Max 100MB)</p>
                  </div>
                  <IKUpload
                    fileName="video-upload"
                    onError={onError}
                    onSuccess={onSuccess}
                    onUploadStart={onUploadStart}
                    onUploadProgress={onUploadProgress}
                    accept="video/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    validateFile={(file) => file.size < 100 * 1024 * 1024} // 100MB limit
                  />
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center space-x-3">
                <FileVideo className="w-8 h-8 text-indigo-500" />
                <div className="text-sm">
                  <p className="font-medium text-gray-200">Upload Complete</p>
                  <p className="text-gray-500 truncate max-w-[200px]">{fileData.filePath}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFileData(null)}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || uploading || !fileData}
        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-600/20"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Publish Video"
        )}
      </button>
    </form>
  );
}