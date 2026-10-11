"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const savedName = localStorage.getItem("user_name");
    const savedEmail = localStorage.getItem("user_email");

    if (savedName || savedEmail) {
      setUser({
        name: savedName || "ইউজার",
        email: savedEmail || "",
      });
    } else {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (adminEmail) {
        setUser({ name: "MD SAMIUL ISLAM", email: adminEmail });
      }
    }
  }, []);

  const handleLogout = async () => {
    localStorage.clear();
    setUser({ name: "", email: "" });
    router.push("/signup");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* লোগো */}
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl">💰</span>
              <span className="font-bold text-xl text-gray-800 tracking-tight">
                Event Cost Manager
              </span>
            </Link>
          </div>

          {/* মেনু লিংকস */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className={`font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              ড্যাশবোর্ড
            </Link>
            <Link
              href="/profile"
              className={`font-medium transition-colors ${
                pathname === "/profile"
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              সকল পরিবার
            </Link>
          </div>

          {/* ইউজার ও লগইন/লগআউট */}
          <div className="flex items-center space-x-4">
            {user && (user.name || user.email) ? (
              <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-800 leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md transition"
                >
                  লগআউট
                </button>
              </div>
            ) : (
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition"
              >
                লগইন করুন
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}