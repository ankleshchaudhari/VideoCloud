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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Profile Header - GitHub style */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
            <div className="px-6 pb-6 -mt-16">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
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
                          className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                        />
                        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity border-4 border-white dark:border-gray-800">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-indigo-500 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg relative group">
                        <UserIcon className="w-16 h-16 text-white" />
                        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity border-4 border-white dark:border-gray-800">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                    {uploadingPhoto && (
                      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center border-4 border-white dark:border-gray-800">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex-1 pt-4 sm:pt-0">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {profile?.name || session.user?.email?.split("@")[0] || "User"}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    {session.user?.email || "N/A"}
                  </p>
                  <button
                    onClick={handleMyLibrary}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <Library className="w-5 h-5" />
                    My Library
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Name</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {profile?.name || session.user?.email?.split("@")[0] || "User"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {session.user?.email || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

