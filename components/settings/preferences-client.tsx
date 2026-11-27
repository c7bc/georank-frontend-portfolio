"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { updateLanguage } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", label: "English", description: "United States", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "es", label: "Espa\u00F1ol", description: "Espa\u00F1a", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "pt-br", label: "Portugu\u00EAs (Brasil)", description: "Brasil", flag: "\u{1F1E7}\u{1F1F7}" },
];

interface PreferencesClientProps {
  currentLanguage: string;
}

export function PreferencesClient({ currentLanguage }: PreferencesClientProps) {
  const t = useTranslations("preferences");
  const router = useRouter();
  const [selected, setSelected] = useState(currentLanguage);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanged = selected !== currentLanguage;

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const result = await updateLanguage(selected);

    if (result.success) {
      setSaved(true);
      // Also set client-side cookie for immediate routing
      document.cookie = `NEXT_LOCALE=${selected};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
      // Refresh to pick up the new locale from cookie
      setTimeout(() => {
        router.refresh();
      }, 500);
    }

    setSaving(false);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Card className="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
        <CardHeader>
          <CardTitle>{t("languageTitle")}</CardTitle>
          <CardDescription>{t("languageDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={selected} onValueChange={setSelected}>
            {languages.map((lang, index) => (
              <div key={lang.code}>
                {index > 0 && <Separator />}
                <Label
                  htmlFor={`lang-${lang.code}`}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg p-3 -mx-3 transition-colors hover:bg-muted/50",
                    selected === lang.code && "bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <p className="font-medium">{lang.label}</p>
                      <p className="text-sm text-muted-foreground">{lang.description}</p>
                    </div>
                  </div>
                  <RadioGroupItem value={lang.code} id={`lang-${lang.code}`} />
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Button
            onClick={handleSave}
            disabled={!hasChanged || saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("save")}...
              </>
            ) : saved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t("saved")}
              </>
            ) : (
              t("save")
            )}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
