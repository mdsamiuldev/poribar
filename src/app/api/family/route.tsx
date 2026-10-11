import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

// ১. সব পরিবারের সদস্য ও ইউজারদের তালিকা আনার এপিআই (GET)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("event_cost_manager");
    
    const members = await db
      .collection("family_members")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      members,
    });
  } catch (error) {
    console.error("GET Family Error:", error);
    return NextResponse.json({ success: false, message: "তথ্য আনতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}

// ২. নতুন পরিবারের সদস্য বা অ্যাকাউন্ট তথ্য যোগ করার এপিআই (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { familyName, headName, totalMembers, maleCount, femaleCount, contact, address } = body;

    if (!familyName || !headName || !totalMembers) {
      return NextResponse.json({ success: false, message: "প্রয়োজনীয় ফিল্ডগুলো পূরণ করুন।" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("event_cost_manager");

    const newFamily = {
      familyName,
      headName,
      totalMembers: Number(totalMembers),
      maleCount: Number(maleCount || 0),
      femaleCount: Number(femaleCount || 0),
      contact: contact || "",
      address: address || "",
      createdAt: new Date(),
    };

    const result = await db.collection("family_members").insertOne(newFamily);

    return NextResponse.json({
      success: true,
      message: "পরিবারের তথ্য সফলভাবে সংরক্ষিত হয়েছে!",
      member: { ...newFamily, _id: result.insertedId },
    });
  } catch (error) {
    console.error("POST Family Error:", error);
    return NextResponse.json({ success: false, message: "সেভ করতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}