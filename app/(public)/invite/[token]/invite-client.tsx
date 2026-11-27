"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { fetchInviteInfo } from "./actions";

interface InviteInfo {
  workspace_name: string;
  inviter_name?: string;
  recipient_name?: string;
  email?: string;
  role: string;
  user_type: "recipient" | "inviter";
}

interface InviteClientProps {
  token: string;
}

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getInitialColor(name?: string): string {
  if (!name) return "bg-muted";
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-violet-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function InviteClient({ token }: InviteClientProps) {
  const t = useTranslations("team.invite");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const isRecipient = inviteInfo?.user_type === "recipient";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    async function loadInviteInfo() {
      try {
        const result = await fetchInviteInfo(token);
        if (result.error) {
          setError(t("expired"));
        } else if (result.data) {
          setInviteInfo(result.data);
        }
      } catch {
        setError(t("expired"));
      } finally {
        setLoading(false);
      }
    }
    loadInviteInfo();
  }, [token, t]);

  const handleAccept = async () => {
    setAccepting(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/team/invite/accept`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        setError(errorData?.message || t("acceptError"));
        setAccepting(false);
        return;
      }
      setAccepted(true);
      setTimeout(() => {
        window.location.href = process.env.NEXT_PUBLIC_DASHBOARD_URL || "/dashboard";
      }, 2000);
    } catch {
      setError(t("acceptError"));
      setAccepting(false);
    }
  };

  const handleDecline = async () => {
    setDeclining(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/team/invite/decline`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        setError(errorData?.message || t("declineError"));
        setDeclining(false);
        return;
      }
      setDeclined(true);
    } catch {
      setError(t("declineError"));
      setDeclining(false);
    }
  };

  return (
    <section id="georank-invite" className="w-full min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error && !inviteInfo ? (
          <div className="mx-auto space-y-8 rounded-xl border border-border px-6 pt-12 pb-10 shadow-lg">
            <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-2xl font-medium text-foreground">
                {t("expired")}
              </p>
              <p className="max-w-sm text-muted-foreground">
                {t("expiredMessage") || "This invitation has expired or is no longer valid."}
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
              >
                {t("backToHome") || "Back to Home"}
              </button>
            </div>
          </div>
        ) : declined ? (
          <div className="mx-auto space-y-8 rounded-xl border border-border px-6 pt-12 pb-10 shadow-lg">
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-2xl font-medium text-foreground">
                {t("declined")}
              </p>
              <p className="max-w-sm text-muted-foreground">
                {t("declinedMessage")}
              </p>
            </div>
            <div className="flex justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
              >
                {t("contactSupport")}
              </a>
            </div>
          </div>
        ) : inviteInfo ? (
          <div className="mx-auto space-y-12 rounded-xl border border-border px-6 pt-12 pb-10 shadow-lg">
            {/* Avatar and Message */}
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
              <div
                className={`flex size-32 items-center justify-center rounded-full ${getInitialColor(
                  isRecipient ? inviteInfo.inviter_name : inviteInfo.recipient_name
                )} text-6xl font-medium text-white`}
              >
                {getInitials(isRecipient ? inviteInfo.inviter_name : inviteInfo.recipient_name)}
              </div>
              <div>
                {isRecipient ? (
                  <p className="text-2xl">
                    <span className="font-medium text-foreground">
                      {inviteInfo.inviter_name || t("inviterPlaceholder")}
                    </span>
                    <span className="font-light text-foreground">
                      {" "}{t("inviteMessage")}
                    </span>
                  </p>
                ) : (
                  <p className="text-2xl">
                    <span className="font-light text-foreground">
                      {t("youInvitedPrefix")}{" "}
                    </span>
                    <span className="font-medium text-foreground">
                      {inviteInfo.recipient_name || inviteInfo.email}
                    </span>
                    <span className="font-light text-foreground">
                      {" "}{t("youInvitedSuffix")}
                    </span>
                  </p>
                )}
              </div>
              <p className="max-w-sm text-muted-foreground">
                {isRecipient ? (
                  <>
                    {t("joinPrefix")}{" "}
                    <span className="font-medium text-foreground">
                      {inviteInfo.workspace_name}
                    </span>{" "}
                    {t("collaborateMessage")}
                  </>
                ) : (
                  <>
                    <span className="font-medium text-foreground">
                      {inviteInfo.recipient_name || t("inviterNewMember")}
                    </span>{" "}
                    {t("inviterCollaborateMessage")}
                  </>
                )}
              </p>
            </div>

            {/* Error message if any */}
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Action buttons - Only for recipients */}
            {isRecipient ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={handleDecline}
                    disabled={declining}
                    className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    {declining ? t("declining") : t("decline")}
                  </button>
                  <button
                    onClick={handleAccept}
                    disabled={accepting}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    {accepting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("accepting")}
                      </>
                    ) : (
                      t("acceptInvite")
                    )}
                  </button>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  {t("expirationWarning")}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {t("inviterViewOnly") || "You sent this invitation. It's pending acceptance."}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
