"use client";

import { useState, useEffect } from "react";

export default function AllFamiliesPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // ফর্ম স্টেট
  const [familyName, setFamilyName] = useState("");
  const [headName, setHeadName] = useState("");
  const [totalMembers, setTotalMembers] = useState("");
  const [maleCount, setMaleCount] = useState("");
  const [femaleCount, setFemaleCount] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ডাটা ফেচ করা
  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/family");
      const data = await res.json();
      if (data.success) {
        setMembers(data.members);
      }
    } catch (error) {
      console.error("Error fetching family data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ডাটা সাবমিট করা
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyName,
          headName,
          totalMembers,
          maleCount,
          femaleCount,
          contact,
          address,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // ফর্ম রিসেট
        setFamilyName("");
        setHeadName("");
        setTotalMembers("");
        setMaleCount("");
        setFemaleCount("");
        setContact("");
        setAddress("");
        setIsOpen(false);
        fetchMembers();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // সামারি হিসাব করা
  const totalFamiliesCount = members.length;
  const grandTotalMembers = members.reduce((acc, curr) => acc + Number(curr.totalMembers || 0), 0);
  const grandTotalMale = members.reduce((acc, curr) => acc + Number(curr.maleCount || 0), 0);
  const grandTotalFemale = members.reduce((acc, curr) => acc + Number(curr.femaleCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* পেজ হেডার ও বাটন */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              🏡 সকল পরিবারের তালিকা ও হিসাব
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              এখানে আপনার ইভেন্ট বা এলাকার সকল নিবন্ধিত পরিবারের নিরাপদ ও সংরক্ষিত ডেটা দেখতে পাবেন।
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm"
          >
            + নতুন পরিবার যোগ করুন
          </button>
        </div>

        {/* সামারি কার্ডস */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">মোট পরিবার</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalFamiliesCount} টি</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">মোট সদস্য সংখ্যা</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">{grandTotalMembers} জন</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">মোট ছেলে (পুরুষ)</p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-1">{grandTotalMale} জন</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">মোট মেয়ে (নারী)</p>
            <h3 className="text-2xl font-bold text-pink-600 mt-1">{grandTotalFemale} জন</h3>
          </div>
        </div>

        {/* সকল পরিবারের তালিকা টেবিল */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">নিবন্ধিত পরিবারসমূহের বিবরণ</h2>

          {loading ? (
            <p className="text-gray-500 text-sm py-4">ডেটা লোড হচ্ছে...</p>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-base">এখনো কোনো পরিবারের তথ্য যোগ করা হয়নি।</p>
              <button
                onClick={() => setIsOpen(true)}
                className="mt-3 text-blue-600 font-semibold hover:underline text-sm"
              >
                প্রথম পরিবারটি এখনই যুক্ত করুন
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                    <th className="p-3.5">পরিবারের নাম / গোত্র</th>
                    <th className="p-3.5">প্রধান কর্তার নাম</th>
                    <th className="p-3.5 text-center">মোট সদস্য</th>
                    <th className="p-3.5 text-center">ছেলে</th>
                    <th className="p-3.5 text-center">মেয়ে</th>
                    <th className="p-3.5">যোগাযোগ</th>
                    <th className="p-3.5">ঠিকানা</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {members.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50/80 transition">
                      <td className="p-3.5 font-semibold text-blue-600">{item.familyName}</td>
                      <td className="p-3.5 font-medium text-gray-800">{item.headName}</td>
                      <td className="p-3.5 text-center font-bold text-gray-900">{item.totalMembers} জন</td>
                      <td className="p-3.5 text-center text-indigo-600 font-semibold">{item.maleCount || 0}</td>
                      <td className="p-3.5 text-center text-pink-600 font-semibold">{item.femaleCount || 0}</td>
                      <td className="p-3.5 text-gray-600">{item.contact || "নথিভুক্ত নয়"}</td>
                      <td className="p-3.5 text-gray-600">{item.address || "নথিভুক্ত নয়"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* নতুন পরিবার যোগ করার মডাল ফর্ম */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white max-w-lg w-full p-6 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">নতুন পরিবারের তথ্য যুক্ত করুন</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">পরিবারের নাম / ব্যাচ (যেমন: রহিম সাহেবের পরিবার)</label>
                  <input
                    type="text"
                    required
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="পরিবারের নাম লিখুন"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">পরিবার প্রধানের নাম</label>
                  <input
                    type="text"
                    required
                    value={headName}
                    onChange={(e) => setHeadName(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="প্রধানের নাম"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">মোট সদস্য</label>
                    <input
                      type="number"
                      required
                      value={totalMembers}
                      onChange={(e) => setTotalMembers(e.target.value)}
                      className="mt-1 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="সংখ্যা"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">ছেলে সংখ্যা</label>
                    <input
                      type="number"
                      value={maleCount}
                      onChange={(e) => setMaleCount(e.target.value)}
                      className="mt-1 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ছেলে"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">মেয়ে সংখ্যা</label>
                    <input
                      type="number"
                      value={femaleCount}
                      onChange={(e) => setFemaleCount(e.target.value)}
                      className="mt-1 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="মেয়ে"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">মোবাইল নম্বর / যোগাযোগ</label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="০১XXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">গ্রাম / ঠিকানা</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="গ্রাম বা এলাকার নাম"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                  >
                    {submitting ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
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