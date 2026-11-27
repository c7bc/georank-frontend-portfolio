"use server";

import { z } from "zod";
import { headers } from "next/headers";

const contactSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  country: z.string().min(1),
  companySize: z.string().optional(),
  referral: z.string().optional(),
  message: z.string().min(10),
});

// Rate limiting: max 3 submissions per IP per 15 minutes
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 min
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// Cleanup stale entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.firstRequest > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(key);
    }
  }
}, 30 * 60 * 1000);

export async function sendContactForm(values: z.infer<typeof contactSchema>) {
  const BASE_URL = process.env.CHATWOOT_BASE_URL!;
  const INBOX_IDENTIFIER = process.env.CHATWOOT_INBOX_IDENTIFIER!;

  // Rate limit check
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!checkRateLimit(ip)) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  try {
    // 1. Create Contact
    const contactRes = await fetch(`${BASE_URL}/public/api/v1/inboxes/${INBOX_IDENTIFIER}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.fullName,
        email: values.email,
        identifier: values.email,
        custom_attributes: {
          company: values.company || "N/A",
          country: values.country,
          company_size: values.companySize || "N/A",
          referral: values.referral || "N/A",
        },
      }),
    });
    const contactData = await contactRes.json();
    const sourceId = contactData.source_id;

    if (!sourceId) throw new Error("Contact creation failed");

    // 2. Create Conversation
    const convRes = await fetch(`${BASE_URL}/public/api/v1/inboxes/${INBOX_IDENTIFIER}/contacts/${sourceId}/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const convData = await convRes.json();
    const conversationId = convData.id;

    if (!conversationId) throw new Error("Conversation creation failed");

    // 3. Send Message
    const msgContent =
      `📬 New Contact Form\n\n` +
      `Name: ${values.fullName}\n` +
      `Email: ${values.email}\n` +
      `Company: ${values.company || "N/A"}\n` +
      `Size: ${values.companySize || "N/A"}\n` +
      `Country: ${values.country}\n` +
      `Referral: ${values.referral || "N/A"}\n\n` +
      `Message:\n${values.message}`;

    const msgRes = await fetch(`${BASE_URL}/public/api/v1/inboxes/${INBOX_IDENTIFIER}/contacts/${sourceId}/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: msgContent }),
    });
    const msgData = await msgRes.json();

    if (msgData.error) throw new Error("Message delivery failed");

    return { success: true };
  } catch {
    return { success: false, error: "Failed to send message. Please try again." };
  }
}
