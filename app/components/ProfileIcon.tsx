"use client";

import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";

export default function ProfileIcon() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!session) {
    return (
      <a
        href="/login"
        className="text-sm font-medium hover:underline text-gray-700 dark:text-gray-200"
      >
        Login
      </a>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        aria-label="Profile"
      >
        <User className="w-5 h-5" />
      </button>
      {showDropdown && (
        <ProfileDropdown
          onClose={() => setShowDropdown(false)}
          onProfilePhotoClick={() => {
            setShowDropdown(false);
            router.push("/profile");
          }}
        />
      )}
    </div>
  );
}

