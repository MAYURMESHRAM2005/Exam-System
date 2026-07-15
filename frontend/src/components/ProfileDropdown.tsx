import { useState, useRef, useEffect } from "react";
import { LogOut, LogOutIcon, User } from "lucide-react";
import { logoutAllDevices } from "../api/auth";

interface ProfileDropdownProps {
  userName: string | null;
  avatarUrl?: string | null;
  onLogout: () => void;
  onProfile: () => void;
}

export function ProfileDropdown({ userName, avatarUrl, onLogout, onProfile }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loggingOutAll, setLoggingOutAll] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const firstLetter = userName ? userName.charAt(0).toUpperCase() : "U";

  const Avatar = ({ className }: { className: string }) =>
    avatarUrl ? (
      <img src={avatarUrl} alt={userName || "Profile"} className={`${className} object-cover`} />
    ) : (
      <div className={`${className} bg-indigo-600 flex items-center justify-center text-white font-semibold`}>
        {firstLetter}
      </div>
    );

  const handleLogoutAll = async () => {
    setLoggingOutAll(true);
    try {
      await logoutAllDevices();
    } catch {
      // Even if the request fails, still log the current device out locally.
    } finally {
      setLoggingOutAll(false);
      onLogout();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 focus:outline-none"
      >
        <Avatar className="w-10 h-10 rounded-full" />
        <span className="hidden md:block text-sm font-medium text-slate-800">
          {userName || "User"}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-fadeIn">

          <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-3">
            <Avatar className="w-9 h-9 rounded-full flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {userName || "User"}
              </p>
              <p className="text-xs text-slate-500">
                Account Settings
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setOpen(false);
              onProfile();
            }}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <User size={16} />
            Profile
          </button>

          <button
            onClick={handleLogoutAll}
            disabled={loggingOutAll}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            <LogOutIcon size={16} />
            {loggingOutAll ? 'Logging out everywhere...' : 'Logout all devices'}
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} />
            Logout
           </button>
        </div>
      )}
    </div>
  );
}