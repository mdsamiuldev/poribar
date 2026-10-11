"use client";

import { useState, useEffect } from "react";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  paidBy: string;
  date: string;
}

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  // ইউজারের অ্যাডমিন স্ট্যাটাস (টেস্ট করার জন্য আপনার জিমেইল এখানে দিন বা .env থেকে নিন)
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "samiul@gmail.com";
  const [userEmail, setUserEmail] = useState("");

  // মোডাল স্টেট
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  // ফর্ম ফিল্ড
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("খাবার");
  const [paidBy, setPaidBy] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ডাটা ফেচ করা
  const fetchData = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      if (data.success) {
        setExpenses(data.expenses);
        setTotalExpense(data.totalExpense);
        setTotalBudget(data.totalBudget);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // ব্রাউজারে লগইন করা ইউজারের ইমেইল সিমুলেট করা (অথবা Better Auth সেশন থেকে নেওয়া)
    // নিরাপত্তার জন্য আপনি এখানে আপনার অ্যাডমিন জিমেইল বসিয়ে টেস্ট করতে পারেন
    setUserEmail(localStorage.getItem("user_email") || adminEmail);
  }, []);

  const isAdmin = userEmail === adminEmail;

  // নতুন খরচ যোগ করা
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, amount, category, paidBy }),
      });
      const data = await res.json();
      if (data.success) {
        setTitle("");
        setAmount("");
        setPaidBy("");
        setIsExpenseOpen(false);
        fetchData();
      } else {
        alert(data.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // বাজেট সেট করা (শুধু অ্যাডমিন পারবে)
  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("দুঃখিত! শুধুমাত্র অ্যাডমিন বাজেট পরিবর্তন করতে পারবেন।");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "budget", amount: newBudget }),
      });
      const data = await res.json();
      if (data.success) {
        setNewBudget("");
        setIsBudgetOpen(false);
        fetchData();
      }
    } finally {
      setSubmitting(false);
    }
  };

  // খরচ ডিলিট করা (শুধু অ্যাডমিন পারবে)
  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      alert("⚠️ সতর্কতা: শুধুমাত্র অ্যাডমিন এই ডাটা রিমুভ বা ডিলিট করতে পারবেন!");
      return;
    }

    if (!confirm("আপনি কি নিশ্চিত এই খরচটি ডিলিট করতে চান?")) return;

    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const remainingBalance = totalBudget - totalExpense;

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            📊 ইভেন্ট খরচ ও পরিবার ড্যাশবোর্ড
          </h1>
          <div className="space-x-2">
            {isAdmin && (
              <button
                onClick={() => setIsBudgetOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                ⚙️ বাজেট সেট করুন
              </button>
            )}
            <button
              onClick={() => setIsExpenseOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              + নতুন খরচ যোগ করুন
            </button>
          </div>
        </div>

        {/* অ্যাডমিন স্ট্যাটাস নোটিশ */}
        <div className={`mb-6 p-3 rounded-lg text-sm font-medium ${isAdmin ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {isAdmin ? "👑 আপনি অ্যাডমিন মোডে আছেন (তথ্য পরিবর্তন ও ডিলিট করার অনুমতি আছে)।" : "👁️ আপনি সাধারণ ভিউয়ার মোডে আছেন (খরচ বা ডাটা ডিলিট করার অধিকার কেবল অ্যাডমিনের রয়েছে)।"}
        </div>

        {/* সামারি কার্ডস */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
            <h3 className="text-gray-500 font-medium">মোট বাজেট</h3>
            <p className="text-2xl font-bold text-purple-600">৳ {totalBudget}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
            <h3 className="text-gray-500 font-medium">মোট খরচ</h3>
            <p className="text-2xl font-bold text-red-600">৳ {totalExpense}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <h3 className="text-gray-500 font-medium">অবশিষ্ট ব্যালেন্স</h3>
            <p className={`text-2xl font-bold ${remainingBalance < 0 ? "text-red-600" : "text-green-600"}`}>
              ৳ {remainingBalance}
            </p>
          </div>
        </div>

        {/* সাম্প্রতিক খরচসমূহের তালিকা */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">খরচের তালিকা</h2>

          {loading ? (
            <p className="text-gray-500 text-sm">লোড হচ্ছে...</p>
          ) : expenses.length === 0 ? (
            <p className="text-gray-500 text-sm">এখনো কোনো খরচ যুক্ত করা হয়নি।</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-100 text-gray-700">
                    <th className="p-3">বিবরণ</th>
                    <th className="p-3">ক্যাটাগরি</th>
                    <th className="p-3">প্রদানকারী</th>
                    <th className="p-3">পরিমাণ</th>
                    <th className="p-3 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{item.title}</td>
                      <td className="p-3">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{item.paidBy}</td>
                      <td className="p-3 font-bold text-red-600">৳ {item.amount}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className={`text-sm font-semibold ${isAdmin ? "text-red-500 hover:text-red-700 cursor-pointer" : "text-gray-400 cursor-not-allowed"}`}
                          title={isAdmin ? "ডিলিট করুন" : "শুধুমাত্র অ্যাডমিন ডিলিট করতে পারবেন"}
                        >
                          {isAdmin ? "ডিলিট" : "লকড (অ্যাডমিন প্রয়োজন)"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* খরচ যোগ করার মডাল */}
        {isExpenseOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white max-w-md w-full p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800">নতুন খরচ যোগ করুন</h2>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">খরচের বিবরণ</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="যেমন: প্যান্ডেল ভাড়া"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">টাকার পরিমাণ (৳)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="যেমন: ৫০০০"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="খাবার">খাবার</option>
                    <option value="সাজসজ্জা">সাজসজ্জা</option>
                    <option value="যাতায়াত">যাতায়াত</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">কে পরিশোধ করেছেন?</label>
                  <input
                    type="text"
                    required
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="যেমন: আব্বা"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsExpenseOpen(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-700 font-medium"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* বাজেট সেট করার মডাল */}
        {isBudgetOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white max-w-md w-full p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800">ইভেন্ট বাজেট সেট করুন</h2>
              <form onSubmit={handleSetBudget} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">মোট বাজেটের পরিমাণ (৳)</label>
                  <input
                    type="number"
                    required
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="যেমন: ১০০০০০"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBudgetOpen(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-700 font-medium"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                  >
                    বাজেট আপডেট করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}