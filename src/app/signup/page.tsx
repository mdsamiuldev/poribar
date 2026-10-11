"use client";

import { useState } from "react";
import { signUp, authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onSuccess: () => {
          setLoading(false);
          router.push("/profile");
        },
        onError: (ctx) => {
          setLoading(false);
          setError(ctx.error.message || "একাউন্ট তৈরি করতে সমস্যা হয়েছে!");
        },
      }
    );
  };

  // গুগল দিয়ে সাইন-ইন বা সাইন-আপ করার ফাংশন
  const handleSocialSignIn = async (provider: "google" | "facebook") => {
    await authClient.signIn.social({
      provider: provider,
      callbackURL: "/profile", // সফলভাবে লগইন হলে এই পেজে যাবে
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          নতুন একাউন্ট তৈরি করুন
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">নাম</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black outline-none"
              placeholder="আপনার নাম লিখুন"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ইমেইল</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black outline-none"
              placeholder="example@mail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-750 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "একাউন্ট তৈরি হচ্ছে..." : "সাইন আপ"}
          </button>
        </form>

        {/* সোশ্যাল লগইন সেপারেশন */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">অথবা</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* গুগল ও ফেসবুক বাটন */}
        <div className="space-y-3">
          <button
            onClick={() => handleSocialSignIn("google")}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition"
          >
            <span>🌐 গুগল (Google) দিয়ে চালিয়ে যান</span>
          </button>

          <button
            onClick={() => handleSocialSignIn("facebook")}
            className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 rounded-lg transition"
          >
            <span>📘 ফেসবুক (Facebook) দিয়ে চালিয়ে যান</span>
          </button>
        </div>
      </div>
    </div>
  );
}