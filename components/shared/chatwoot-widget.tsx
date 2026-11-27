"use client";

import Script from "next/script";

declare global {
  interface Window {
    chatwootSettings?: {
      position: "right";
      type: "standard";
      launcherTitle: string;
      darkMode: "auto";
    };
    $chatwoot?: { toggle(): void };
    chatwootSDK?: {
      run(options: { websiteToken: string; baseUrl: string }): void;
    };
  }
}

const baseUrl = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL?.replace(/\/$/, "");
const websiteToken = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;

export function ChatwootWidget() {
  if (!baseUrl || !websiteToken) return null;

  return (
    <Script
      id="chatwoot"
      src={`${baseUrl}/packs/js/sdk.js`}
      strategy="lazyOnload"
      onReady={() => {
        window.chatwootSettings = {
          position: "right",
          type: "standard",
          launcherTitle: "Chat with us",
          darkMode: "auto",
        };
        window.chatwootSDK?.run({ websiteToken, baseUrl });
      }}
    />
  );
}
