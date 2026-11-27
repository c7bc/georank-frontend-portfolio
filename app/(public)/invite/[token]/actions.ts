"use server";

import { cookies } from "next/headers";

export async function fetchInviteInfo(token: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return { error: "unauthorized" };
  }

  // Decode token if URL-encoded
  const decodedToken = decodeURIComponent(token);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  try {
    const res = await fetch(`${apiBase}/team/invite/${decodedToken}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      return { error: "expired" };
    }

    const json = await res.json();
    return { data: json?.data ?? json };
  } catch (err) {
    console.error("Invite fetch error:", err);
    return { error: "fetch_error" };
  }
}
