"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiClient, UserProfile } from "@/lib/api-client";
import { useNotification } from "@/app/components/Notification";
import { User as UserIcon, Library, Upload, Loader2, ArrowLeft } from "lucide-react";
import { upload } from "@imagekit/next";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">
                <div className="h-32 relative">
                  <div className="absolute inset-0"></div>
                </div>

                <div className="px-6 pb-8">
                  <div className="relative -mt-16 mb-6 flex justify-center">
                    <div className="relative">
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
                        className="cursor-pointer relative group block"
                      >
                        {profile?.profilePhoto ? (
                          <div className="relative">
                            <img
                              src={profile.profilePhoto}
                              alt="Profile"
                              className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-2xl"
                            />
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm border-4 border-white dark:border-gray-800">
                              <Upload className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-2xl relative group">
                            <span className="text-4xl font-bold text-white">
                              {(profile?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase()}
                            </span>
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm border-4 border-white dark:border-gray-800">
                              <Upload className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        )}
                        {uploadingPhoto && (
                          <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center border-4 border-white dark:border-gray-800 z-10">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profile?.name || session.user?.email?.split("@")[0] || "User"}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {session.user?.email || "N/A"}
                    </p>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={handleMyLibrary}
                      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <Library className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      My Library
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details & Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-indigo-500" />
                  Account Overview
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 transition-colors hover:border-indigo-200 dark:hover:border-indigo-500/30">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Display Name
                    </p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {profile?.name || session.user?.email?.split("@")[0] || "User"}
                    </p>
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

