"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChatwootWidget } from "@/components/shared/chatwoot-widget";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sendContactForm } from "@/app/actions/contact";
import { toast } from "sonner";

const contactSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
  companySize: z.string().optional(),
  referral: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const t = useTranslations("contactPage");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      country: "",
      companySize: "",
      referral: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    try {
      const result = await sendContactForm(data);
      if (result.success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        form.reset();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send message. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      {/* Background Decor removed */}

      {/* Hero Section */}
      <section id="contact-hero" className="px-6 lg:px-0 py-12 relative z-10">
        <div className="container max-w-[1200px] mx-auto px-0 md:px-6 text-center">
          <div className="pt-20 sm:pt-24 md:pt-28">
            <h1 className="text-foreground text-4xl leading-tight font-medium tracking-tight sm:text-5xl md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base sm:text-lg">
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="relative z-10 mt-10 sm:mt-12 md:mt-16">
            <div className="relative overflow-hidden mx-auto max-w-3xl">
              <div className="absolute inset-0 rounded-[24px] border border-border/40 pointer-events-none [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.1),black_30%)] z-0" />
              <div className="relative p-6 sm:p-8 md:p-10 text-start z-20">
                <h2 className="text-foreground mb-6 text-center text-2xl font-medium">
                  {t("speakToUs.title")}
                </h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-muted-foreground text-sm font-normal">
                        {t("speakToUs.form.fullName")}
                      </Label>
                      <Input
                        id="fullName"
                        {...form.register("fullName")}
                        placeholder={t("speakToUs.form.fullNamePlaceholder")}
                        className={cn(
                          "h-11 rounded-lg border-border bg-background focus-visible:ring-primary shadow-xs",
                          form.formState.errors.fullName && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {form.formState.errors.fullName && (
                        <p className="text-[11px] text-destructive">{form.formState.errors.fullName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-muted-foreground text-sm font-normal flex items-center gap-1.5">
                        {t("speakToUs.form.email")}
                        <span className="text-[11px] opacity-70">
                          {t("speakToUs.form.emailHint")}
                        </span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        placeholder={t("speakToUs.form.emailPlaceholder")}
                        className={cn(
                          "h-11 rounded-lg border-border bg-background focus-visible:ring-primary shadow-xs",
                          form.formState.errors.email && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {form.formState.errors.email && (
                        <p className="text-[11px] text-destructive">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-muted-foreground text-sm font-normal">
                      {t("speakToUs.form.company")}
                    </Label>
                    <Input
                      id="company"
                      {...form.register("company")}
                      placeholder={t("speakToUs.form.companyPlaceholder")}
                      className="h-11 rounded-lg border-border bg-background focus-visible:ring-primary shadow-xs"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-muted-foreground text-sm font-normal">
                        {t("speakToUs.form.country")}
                      </Label>
                      <Select 
                        onValueChange={(value) => form.setValue("country", value)}
                        value={form.watch("country")}
                      >
                        <SelectTrigger className={cn(
                          "h-11 rounded-lg border-border bg-background focus:ring-primary shadow-xs text-muted-foreground",
                          form.formState.errors.country && "border-destructive focus:ring-destructive"
                        )}>
                          <SelectValue placeholder={t("speakToUs.form.countryPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="br">Brazil</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.country && (
                        <p className="text-[11px] text-destructive">{form.formState.errors.country.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companySize" className="text-muted-foreground text-sm font-normal">
                        {t("speakToUs.form.companySize")}
                      </Label>
                      <Select 
                        onValueChange={(value) => form.setValue("companySize", value)}
                        value={form.watch("companySize")}
                      >
                        <SelectTrigger className="h-11 rounded-lg border-border bg-background focus:ring-primary shadow-xs text-muted-foreground">
                          <SelectValue placeholder={t("speakToUs.form.companySizePlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="500+">500+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referral" className="text-muted-foreground text-sm font-normal">
                      {t("speakToUs.form.referral")}
                    </Label>
                    <Select 
                        onValueChange={(value) => form.setValue("referral", value)}
                        value={form.watch("referral")}
                    >
                      <SelectTrigger className="h-11 rounded-lg border-border bg-background focus:ring-primary shadow-xs text-muted-foreground">
                        <SelectValue placeholder={t("speakToUs.form.referralPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google Search</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="referral">Friend or Colleague</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-muted-foreground text-sm font-normal">
                      {t("speakToUs.form.message")}
                    </Label>
                    <Textarea
                      id="message"
                      {...form.register("message")}
                      placeholder={t("speakToUs.form.messagePlaceholder")}
                      className={cn(
                        "min-h-[150px] rounded-lg border-border bg-background focus-visible:ring-primary shadow-xs transition-all",
                        form.formState.errors.message && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {form.formState.errors.message && (
                      <p className="text-[11px] text-destructive">{form.formState.errors.message.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : t("speakToUs.form.submit")}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section id="contact-info" className="px-6 lg:px-0 py-16 sm:py-20 md:py-24">
        <div className="container max-w-[1200px] mx-auto px-0 md:px-6">
          <div className="mb-14">
            <h2 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl text-balance">
              {t("info.title")}
            </h2>
            <p className="max-w-xl text-lg text-muted-foreground mt-2">
              {t("info.subtitle")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Email Card */}
            <div className="rounded-2xl border border-border/50 p-8 hover:border-primary/30 transition-all hover:-translate-y-1">
              <span className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Mail className="size-7" />
              </span>
              <h3 className="text-foreground mb-3 text-xl font-bold">
                {t("info.email.title")}
              </h3>
              <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                {t("info.email.description")}
              </p>
              <a
                href={`mailto:${t("info.email.value")}`}
                className="text-primary text-lg font-bold hover:underline transition-all inline-flex items-center gap-2 group"
              >
                {t("info.email.value")}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Live Chat Card */}
            <div className="rounded-2xl border border-border/50 p-8 hover:border-primary/30 transition-all hover:-translate-y-1">
              <span className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <MessageCircle className="size-7" />
              </span>
              <h3 className="text-foreground mb-3 text-xl font-bold">
                {t("info.chat.title")}
              </h3>
              <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                {t("info.chat.description")}
              </p>
              <Button
                variant="default"
                size="lg"
                className="w-full rounded-xl h-12 font-bold cursor-pointer text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                onClick={() => {
                  // Trigger Chatwoot if script is loaded
                  if (window.$chatwoot) {
                    window.$chatwoot.toggle();
                  } else {
                    alert("Support chat is warming up! Please try again in a moment.");
                  }
                }}
              >
                {t("info.chat.value")}
              </Button>
            </div>
          </div>
        </div>
      </section>
      <div className="h-10 sm:h-12 md:h-14"></div>
      <ChatwootWidget />
    </div>
  );
}
