import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");
  if (!topic) {
    return NextResponse.json({ summary: "No topic provided." }, { status: 400 });
  }
  try {
    // Wikipedia summary API
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
    if (!res.ok) throw new Error("No summary found");
    const data = await res.json();
    const summary = data.extract || `Here's a quick fact about this topic: ${topic}`;
    return NextResponse.json({ summary });
  } catch (e) {
    return NextResponse.json({ summary: `Here's a quick fact about this topic: ${topic}` }, { status: 200 });
  }
} 