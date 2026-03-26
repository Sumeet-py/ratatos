import { pusherServer } from "@/lib/pusher";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. Save to Supabase Table
    const { data, error } = await supabase
      .from('messages')
      .insert([{ text: message }])
      .select();

    if (error) throw error;

    // 2. Broadcast to UI via Pusher
    await pusherServer.trigger("world-tree", "new-pulse", {
      message: message,
      timestamp: new Date(data[0].created_at).toLocaleTimeString(),
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Failed to process pulse" }, { status: 500 });
  }
}