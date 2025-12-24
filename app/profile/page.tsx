"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiClient, UserProfile } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { useNotification } from "@/app/components/Notification";
import { User as UserIcon, Library, Upload, Loader2, ArrowLeft, Edit2, Check, X } from "lucide-react";
import { upload } from "@imagekit/next";
import { IKVideo } from "imagekitio-next";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      showNotification("Please sign in to view your profile", "info");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await apiClient.getUserProfile();
        setProfile(userProfile);
        const userVideos = await apiClient.getUserVideos();
        setVideos(userVideos);
        setNewName(userProfile?.name || session.user?.name || "");
      } catch (error) {
        showNotification("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, status, router, showNotification]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("Please upload a valid image file", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showNotification("Image size must be less than 10MB", "error");
      return;
    }

    setUploadingPhoto(true);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      const signature = auth.authenticationParameters?.signature || auth.signature;
      const expire = auth.authenticationParameters?.expire || auth.expire;
      const token = auth.authenticationParameters?.token || auth.token;

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        signature,
        expire,
        token,
      });

      const updatedProfile = await apiClient.updateUserProfile({
        profilePhoto: res.url,
      });

      setProfile(updatedProfile);
      showNotification("Profile photo updated successfully", "success");
    } catch (error) {
      showNotification("Failed to upload profile photo", "error");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleNameSave = async () => {
    if (!newName.trim()) {
      showNotification("Name cannot be empty", "error");
      return;
    }

    try {
      const updatedProfile = await apiClient.updateUserProfile({
        name: newName,
      });
      setProfile(updatedProfile);
      setIsEditingName(false);
      showNotification("Display name updated successfully", "success");
    } catch (error) {
      showNotification("Failed to update display name", "error");
    }
  };

  const handleMyLibrary = () => {
    router.push("/my-library");
  };

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
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-20">
          {/* Left Column: Profile Sidebar (Matches GitHub style) */}
          <div className="md:col-span-4 lg:col-span-3 space-y-6">
            <div className="flex flex-col items-start">
              {/* Profile Picture */}
              <div className="relative group w-full max-w-[296px] aspect-square mb-4 ml-5 md:ml-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="profile-photo-upload"
                />
                <label
                  htmlFor="profile-photo-upload"
                  className="cursor-pointer block w-full h-full relative rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  {profile?.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-6xl font-medium text-gray-400">
                        {(profile?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="text-white flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8" />
                      <span className="text-sm font-medium">Change photo</span>
                    </div>
                  </div>

                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                    </div>
                  )}
                </label>
              </div>

              {/* Name and Username */}
              <div className="w-full mb-6 ml-5 md:ml-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {profile?.name || session.user?.email?.split("@")[0] || "User"}
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 font-light">
                  {profile?.username || (session.user as any)?.username || session.user?.email?.split("@")[0] || "username"}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleMyLibrary}
                className="w-full py-1.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-md font-medium border border-gray-300 dark:border-gray-600 transition-colors text-sm mb-6"
              >
                My Library
              </button>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            {/* Account Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-indigo-500" />
                Account Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Display Name with Edit Functionality */}
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 transition-colors hover:border-indigo-200 dark:hover:border-indigo-500/30 group relative">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Display Name
                    </p>
                    {!isEditingName && (
                      <button
                        onClick={() => {
                          setNewName(profile?.name || "");
                          setIsEditingName(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                        title="Edit Display Name"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isEditingName ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                      />
                      <button
                        onClick={handleNameSave}
                        className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {profile?.name || session.user?.email?.split("@")[0] || "User"}
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 transition-colors hover:border-indigo-200 dark:hover:border-indigo-500/30">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Email Address
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white break-all">
                    {session.user?.email || "N/A"}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 transition-colors hover:border-indigo-200 dark:hover:border-indigo-500/30">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Member Since
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 transition-colors hover:border-indigo-200 dark:hover:border-indigo-500/30">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Account Status
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Library className="w-5 h-5 text-purple-500" />
                Recent Activity
              </h2>

              {videos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {videos.map((video) => (
                    <Link
                      href={`/videos/${video._id}`}
                      key={video._id?.toString()}
                      className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900"
                    >
                      <IKVideo
                        src={video.videoUrl}
                        transformation={[{ height: "400", width: "400" }]}
                        controls={false}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm p-2 rounded-full">
                          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-400">
                    No recent activity to show.
                  </p>
                  <button
                    onClick={() => router.push('/upload')}
                    className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Upload your first video
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
