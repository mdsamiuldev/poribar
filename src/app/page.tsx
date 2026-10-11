import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        অনুষ্ঠান খরচ ও পরিবার ড্যাশবোর্ড
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        পারিবারিক অনুষ্ঠানে অংশগ্রহণকারী সকল সদস্যের তথ্য এবং খরচের হিসাব সহজেই ম্যানেজ করুন।
      </p>

      <div className="flex gap-4">
        <Link
          href="/signup"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          নতুন একাউন্ট খুলুন
        </Link>
        <Link
          href="/login"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          লগইন করুন
        </Link>
      </div>
    </div>
  );
}