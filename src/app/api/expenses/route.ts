import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

// ১. খরচ এবং বাজেট নিয়ে আসার এপিআই (GET)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("event_cost_manager");
    
    // খরচগুলো আনা
    const expenses = await db
      .collection("expenses")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // মোট খরচ হিসাব
    const totalExpense = expenses.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );

    // বাজেট ডাটা আনা
    const budgetDoc = await db.collection("settings").findOne({ type: "budget" });
    const totalBudget = budgetDoc ? budgetDoc.amount : 0;

    return NextResponse.json({
      success: true,
      expenses,
      totalExpense,
      totalBudget,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, message: "ডাটা আনতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}

// ২. নতুন খরচ বা বাজেট সেভ করার এপিআই (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // যদি বাজেট সেট করার রিকোয়েস্ট হয়
    if (body.type === "budget") {
      const client = await clientPromise;
      const db = client.db("event_cost_manager");
      
      await db.collection("settings").updateOne(
        { type: "budget" },
        { $set: { amount: Number(body.amount) } },
        { upsert: true }
      );

      return NextResponse.json({ success: true, message: "বাজেট সফলভাবে আপডেট হয়েছে!" });
    }

    // নতুন খরচ যোগ করার রিকোয়েস্ট
    const { title, amount, category, paidBy } = body;
    if (!title || !amount || !category || !paidBy) {
      return NextResponse.json({ success: false, message: "সবগুলো ফিল্ড পূরণ করুন।" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("event_cost_manager");

    const newExpense = {
      title,
      amount: Number(amount),
      category,
      paidBy,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date(),
    };

    const result = await db.collection("expenses").insertOne(newExpense);

    return NextResponse.json({
      success: true,
      message: "খরচ সফলভাবে যুক্ত হয়েছে!",
      expense: { ...newExpense, _id: result.insertedId },
    });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, message: "সেভ করতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}

// ৩. খরচ ডিলিট করার এপিআই (DELETE - শুধুমাত্র অ্যাডমিন পারমিশন চেক করা নিরাপদ করতে পারেন)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "আইডি পাওয়া যায়নি।" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("event_cost_manager");

    await db.collection("expenses").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: "খরচ সফলভাবে ডিলিট করা হয়েছে।" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ success: false, message: "ডিলিট করতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}