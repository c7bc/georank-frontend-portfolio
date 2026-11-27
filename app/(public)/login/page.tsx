"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GeoRankIcon } from "@/components/shared/georank-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/app/actions/auth";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { mapAuthError } from "@/lib/utils/errors";
import { resolveLoginDestination } from "@/lib/utils/login-destination";

const createLoginSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    email: z.string().email(t("errors.validation.emailInvalid")),
    password: z.string().min(1, t("errors.validation.passwordRequired")),
  });

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const t = useTranslations("auth.login");
  const tCommon = useTranslations();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = createLoginSchema(tCommon);
  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || "/dashboard";

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    const result = await login({
      email: data.email,
      password: data.password,
    });

    if (result.success) {
      window.location.assign(resolveLoginDestination(callbackUrl, dashboardUrl));
    } else {
      const errorKey = mapAuthError(result.error);
      setError(tCommon(`errors.auth.${errorKey}`));
    }
  };

  return (
    <section id="georank-login" className="bg-background px-6 lg:px-0 w-full min-h-screen flex items-center">
      <div className="container mx-auto px-0 py-16 md:px-6">
        <div className="bg-muted/30 rounded-[16px] px-6 py-12 text-center sm:px-8 sm:py-16 md:py-20 border border-border/50">
          <div className="mb-4 flex w-full items-center justify-center sm:mb-5">
            <div className="flex size-12 items-center justify-center rounded-full bg-background shadow-sm border border-border">
              <GeoRankIcon className="text-foreground" size={28} />
            </div>
          </div>
          <h1 className="text-foreground text-2xl font-medium tracking-tight sm:text-3xl">{t("welcomeBack")}</h1>
          <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">{t("subtitle")}</p>

          <div className="text-card-foreground shadow-sm bg-card mx-auto mt-6 w-full max-w-md rounded-[12px] border border-border text-left sm:mt-8">
            <div className="p-6 pt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
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
                    autoComplete="username"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "login-email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="login-email-error" className="text-xs text-destructive mt-1">{errors.email.message}</p>
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
                      autoComplete="current-password"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "login-password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="text-muted-foreground/80 hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="login-password-error" className="text-xs text-destructive mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="-mt-1">
                  <Link href="/forgot-password" className="text-primary text-sm hover:underline">
                    {t("forgotPassword")}
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

{/* 
                <div className="my-2 flex items-center">
                  <span className="bg-border/70 h-px flex-1"></span>
                  <span className="text-muted-foreground mx-3 text-xs whitespace-nowrap">{t("orContinue")}</span>
                  <span className="bg-border/70 h-px flex-1"></span>
                </div>

                <div className="mt-4 space-y-3">
                  <Button variant="outline" type="button" className="w-full h-11 rounded-[8px] font-medium transition-colors" disabled>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" x="0px" y="0px" viewBox="0 0 48 48" enableBackground="new 0 0 48 48" className="mr-2 size-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    {t("google")}
                  </Button>
                  <Button variant="outline" type="button" className="w-full h-11 rounded-[8px] font-medium transition-colors" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook mr-2 size-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    {t("facebook")}
                  </Button>
                </div>
                */}
              </form>
              <p className="text-muted-foreground mt-6 text-center text-sm">
                {t("noAccount")}{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  {t("signUp")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
