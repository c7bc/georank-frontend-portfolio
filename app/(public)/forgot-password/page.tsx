"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { GeoRankIcon } from "@/components/shared/georank-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}

function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section id="georank-forgot-password" className="bg-background px-6 lg:px-0 w-full min-h-screen flex items-center">
      <div className="container mx-auto px-0 py-16 md:px-6">
        <div className="bg-muted/30 rounded-[16px] px-6 py-12 text-center sm:px-8 sm:py-16 md:py-20 border border-border/50">
          <div className="mb-4 flex w-full items-center justify-center sm:mb-5">
            <div className="flex size-12 items-center justify-center rounded-full bg-background shadow-sm border border-border">
              <GeoRankIcon className="text-foreground" size={28} />
            </div>
          </div>
          
          <h1 className="text-foreground text-2xl font-medium tracking-tight sm:text-3xl">{t("title")}</h1>
          <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">{t("subtitle")}</p>

          <div className="text-card-foreground shadow-sm bg-card mx-auto mt-6 w-full max-w-md rounded-[12px] border border-border text-left sm:mt-8">
            <div className="p-6 pt-8">
              {isSubmitted ? (
                <div className="space-y-6 py-4 text-center">
                  <div className="flex justify-center">
                    <CheckCircle2 className="h-12 w-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Check your email</h3>
                    <p className="text-sm text-muted-foreground px-4">
                      We&apos;ve sent a password reset link to your email address.
                    </p>
                  </div>
                  <Button asChild className="w-full h-11 rounded-[8px] font-semibold">
                    <Link href="/login">{t("backToLogin")}</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-muted-foreground mb-2 block text-sm font-normal">{t("email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      required
                      className="h-11 rounded-[8px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-[8px] font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("button")}...
                      </>
                    ) : (
                      t("button")
                    )}
                  </Button>
                  
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("backToLogin")}
                  </Link>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
