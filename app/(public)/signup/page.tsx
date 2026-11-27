"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GeoRankIcon } from "@/components/shared/georank-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup, signupVerify } from "@/app/actions/auth";
import { Loader2, Eye, EyeOff, Mail } from "lucide-react";
import { mapAuthError } from "@/lib/utils/errors";

const createSignupSchema = (t: ReturnType<typeof useTranslations>, skipRepeatPassword: boolean) => {
  const baseSchema = z.object({
    email: z.string().email(t("errors.validation.emailInvalid")),
    password: z.string().min(8, t("errors.validation.passwordMinLength")),
    repeatPassword: skipRepeatPassword ? z.string().optional() : z.string().min(1, t("errors.validation.passwordRequired")),
  });

  if (skipRepeatPassword) {
    return baseSchema;
  }

  return baseSchema.refine((data) => data.password === data.repeatPassword, {
    message: t("errors.validation.passwordsDontMatch"),
    path: ["repeatPassword"],
  });
};

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const t = useTranslations("auth.signup");
  const tCommon = useTranslations();
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain") || "";
  const skipVerify = searchParams.get("sv") === "1";
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [step, setStep] = useState<1 | 2>(1);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingLocale, setPendingLocale] = useState("");
  const [savedFormData, setSavedFormData] = useState<{ name: string; email: string; password: string; language: string; skip_verify?: boolean; domain?: string } | null>(null);
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || "/dashboard";
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const signupSchema = createSignupSchema(tCommon, skipVerify);
  type SignupFormData = z.infer<typeof signupSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);

    const formPayload = {
      name: data.email.split("@")[0],
      email: data.email,
      password: data.password,
      language: locale,
      skip_verify: skipVerify,
      domain: domain,
    };
    const result = await signup(formPayload);

    if (result.success) {
      if (result.requiresVerification) {
        setPendingEmail(result.email!);
        setPendingLocale(locale);
        setSavedFormData(formPayload);
        setStep(2);
        return;
      }
      // Direct redirect for skip_verify flow or legacy token flow
      window.location.assign(`${dashboardUrl.replace(/\/$/, "")}/onboarding`);
    } else {
      const errorKey = mapAuthError(result.error);
      setError(tCommon(`errors.auth.${errorKey}`));
    }
  };

  const handleVerify = async () => {
    if (verifyCode.length !== 6) return;
    setVerifyLoading(true);
    setVerifyError(null);
    const result = await signupVerify(pendingEmail, verifyCode, pendingLocale, domain);
    if (result.success) {
      window.location.assign(`${dashboardUrl.replace(/\/$/, "")}/onboarding`);
    } else {
      setVerifyError(result.error || "Verification failed");
      setVerifyLoading(false);
    }
  };

  const handleResend = async () => {
    if (!savedFormData) return;
    setVerifyCode("");
    setVerifyError(null);
    await signup(savedFormData);
  };

  return (
    <section id="georank-signup" className="bg-background px-6 lg:px-0 w-full min-h-screen flex items-center">
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
              {step === 1 ? (
                <>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                      <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-muted-foreground mb-2 block text-sm font-normal">{t("email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        {...register("email")}
                        className="h-11 rounded-[8px]"
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-muted-foreground mb-2 block text-sm font-normal">{t("password")}</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t("passwordPlaceholder")}
                          {...register("password")}
                          className="h-11 rounded-[8px] pr-10"
                          aria-invalid={!!errors.password}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-muted-foreground/80 hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded p-1"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                      )}
                    </div>

                    {!skipVerify && (
                      <div className="space-y-2">
                        <Label htmlFor="repeat-password" className="text-muted-foreground mb-2 block text-sm font-normal">{t("repeatPassword")}</Label>
                        <div className="relative">
                          <Input
                            id="repeat-password"
                            type={showRepeatPassword ? "text" : "password"}
                            placeholder={t("repeatPasswordPlaceholder")}
                            {...register("repeatPassword")}
                            className="h-11 rounded-[8px] pr-10"
                            aria-invalid={!!errors.repeatPassword}
                          />
                          <button
                            type="button"
                            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                            className="text-muted-foreground/80 hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded p-1"
                          >
                            {showRepeatPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {errors.repeatPassword && (
                          <p className="text-xs text-destructive mt-1">{errors.repeatPassword.message}</p>
                        )}
                      </div>
                    )}

                    <div className="-mt-1">
                      <Link href="/forgot-password" className="text-primary text-sm hover:underline">
                        {tCommon("auth.login.forgotPassword")}
                      </Link>
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
                  </form>
                  <p className="text-muted-foreground mt-6 text-center text-sm">
                    {t("hasAccount")}{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                      {t("logIn")}
                    </Link>
                  </p>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">{t("verifyTitle")}</h2>
                    <p className="text-sm text-muted-foreground">
                      {t("verifySubtitle", { email: pendingEmail })}
                    </p>
                  </div>

                  {verifyError && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {verifyError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="verify-code" className="text-muted-foreground mb-2 block text-sm font-normal">
                      {t("codeLabel")}
                    </Label>
                    <Input
                      id="verify-code"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder={t("codePlaceholder")}
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                      className="h-11 rounded-[8px] text-center text-2xl tracking-[0.5em] font-mono"
                      autoComplete="one-time-code"
                    />
                  </div>

                  <Button
                    className="w-full h-11 rounded-[8px] font-semibold"
                    onClick={handleVerify}
                    disabled={verifyLoading || verifyCode.length !== 6}
                  >
                    {verifyLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("verifyButton")}...
                      </>
                    ) : (
                      t("verifyButton")
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    {t("resendPrompt")}{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-primary hover:underline font-medium"
                    >
                      {t("resend")}
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
