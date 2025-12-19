"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { apiClient, UserProfile } from "@/lib/api-client";
import { useNotification } from "./Notification";
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileDropdownProps {
  onClose: () => void;
  onProfilePhotoClick: () => void;
}

export default function ProfileDropdown({
  onClose,
  onProfilePhotoClick,
}: ProfileDropdownProps) {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await apiClient.getUserProfile();
        setProfile(userProfile);
      } catch (error) {
        showNotification("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProfile();
    }
  }, [session, showNotification]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
      onClose();
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
    >
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <>
            <div
              onClick={onProfilePhotoClick}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2 transition-colors group"
            >
              {profile?.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 group-hover:border-indigo-600 transition-colors"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-indigo-500 group-hover:border-indigo-600 transition-colors">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {profile?.name || session.user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {session.user?.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-4">
              <div className="px-2 py-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profile?.name || session.user?.email?.split("@")[0] || "User"}
                </p>
              </div>
              <div className="px-2 py-1 mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {session.user?.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <button
                onClick={handleSignOut}
                className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

