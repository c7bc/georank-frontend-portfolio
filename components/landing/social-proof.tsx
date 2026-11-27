"use client";

import { useTranslations } from "next-intl";

const aiModels = [
  {
    name: "ChatGPT",
    src: "https://freelogopng.com/images/all_img/1681038472chatgpt-logo.png",
  },
  {
    name: "Claude",
    src: "https://i.logos-download.com/114232/31116-05a1502c46130721c61b3a89eb569886.png/Claude_Logo_2023.png?dl",
  },
  {
    name: "Perplexity",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Perplexity_AI_logo.svg/1280px-Perplexity_AI_logo.svg.png",
  },
  {
    name: "Gemini",
    src: "https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-PNG-Photos.png",
  },
  {
    name: "Grok",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Grok-feb-2025-logo.svg/330px-Grok-feb-2025-logo.svg.png",
  },
  {
    name: "DeepSeek",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/DeepSeek_logo.svg/1280px-DeepSeek_logo.svg.png",
  },
];

export function SocialProof() {
  const t = useTranslations("socialProof");

  // Split logos into two rows
  const firstRow = aiModels.slice(0, 3);
  const secondRow = aiModels.slice(3, 6);

  return (
    <section
      id="metafi-logos"
      className="bg-background overflow-hidden px-6 lg:px-0"
    >
      <div className="container mx-auto px-0 py-4 text-center sm:py-6 md:px-6 md:py-8">
        <p className="text-muted-foreground text-sm sm:text-base">
          Monitor your visibility across leading AI platforms
        </p>

        <div className="mt-12 flex flex-col items-center gap-10 sm:gap-12 md:gap-20">
          {/* First row of logos */}
          <ul className="flex flex-nowrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
            {firstRow.map((model) => (
              <li key={model.name} className="flex-shrink-0">
                <div className="relative h-6 w-auto md:h-10">
                  <img
                    alt={model.name}
                    loading="lazy"
                    width={100}
                    height={40}
                    decoding="async"
                    data-nimg="1"
                    className="h-6 w-auto brightness-0 contrast-[90%] hue-rotate-[190deg] invert-[0.43] saturate-[180%] sepia-[0.06] md:h-10"
                    src={model.src}
                    style={{ color: "transparent", height: "100%", width: "auto" }}
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* Second row of logos */}
          <ul className="flex -translate-x-4 flex-nowrap items-center justify-center gap-8 sm:-translate-x-6 sm:gap-12 md:gap-16">
            {secondRow.map((model) => (
              <li key={model.name} className="flex-shrink-0">
                <div className="relative h-6 w-auto md:h-10">
                  <img
                    alt={model.name}
                    loading="lazy"
                    width={100}
                    height={40}
                    decoding="async"
                    data-nimg="1"
                    className="h-6 w-auto brightness-0 contrast-[90%] hue-rotate-[190deg] invert-[0.43] saturate-[180%] sepia-[0.06] md:h-10"
                    src={model.src}
                    style={{ color: "transparent", height: "100%", width: "auto" }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
