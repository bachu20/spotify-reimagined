import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getURL } from "@/libs/helpers";

export async function POST() {
  try {
    return NextResponse.json({ session_url: null });
  } catch (err: any) {
    console.log(err);
    new NextResponse("Internal Error", { status: 500 });
  }
}
