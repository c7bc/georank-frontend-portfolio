"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Loader2, UserMinus, Shield, Users, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { inviteTeamMember, updateMemberRole, removeTeamMember } from "@/app/actions/team";
import { usePermissions } from "@/hooks/use-permissions";
import type { TeamMemberResponse, TeamRole } from "@/types";

interface TeamClientProps {
  members: TeamMemberResponse[];
}

const roleBadgeColors: Record<TeamRole, string> = {
  owner: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  admin: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  editor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  member: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  viewer: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

export function TeamClient({ members }: TeamClientProps) {
  const t = useTranslations("sidebar");
  const tTeam = useTranslations("team");
  const tEmpty = useTranslations("emptyStates");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { can } = usePermissions();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [removeId, setRemoveId] = useState<number | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<TeamRole>("member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManageTeam = can("manage_team");

  const statusColors: Record<string, string> = {
    active: "badge-success",
    pending: "badge-warning",
    inactive: "badge-error",
  };

  const handleInvite = async () => {
    if (!newEmail.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const result = await inviteTeamMember({ email: newEmail, role: newRole });

    setIsSubmitting(false);

    if (result.success) {
      setIsInviteOpen(false);
      setNewEmail("");
      setNewRole("member");
      startTransition(() => {
        router.refresh();
      });
    } else {
      setError(result.error || "Failed to invite member");
    }
  };

  const handleRoleChange = async (memberId: number, role: TeamRole) => {
    setIsSubmitting(true);

    const result = await updateMemberRole(memberId, role);

    setIsSubmitting(false);

    if (result.success) {
      startTransition(() => {
        router.refresh();
      });
    }
  };

  const handleRemove = async () => {
    if (!removeId) return;

    setIsSubmitting(true);

    const result = await removeTeamMember(removeId);

    setIsSubmitting(false);

    if (result.success) {
      setRemoveId(null);
      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <div data-testid="team-members">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("team")}</h2>
          <p className="text-muted-foreground">
            {tTeam("subtitle")}
          </p>
        </div>
        {canManageTeam && (
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {tTeam("inviteMember")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{tTeam("inviteTitle")}</DialogTitle>
                <DialogDescription>
                  {tTeam("inviteDesc")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">{tTeam("emailLabel")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{tTeam("roleLabel")}</Label>
                  <Select value={newRole} onValueChange={(v) => setNewRole(v as TeamRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder={tTeam("selectRole")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex flex-col">
                          <span>{tTeam("roles.admin")}</span>
                          <span className="text-xs text-muted-foreground">{tTeam("roles.adminDesc")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="editor">
                        <div className="flex flex-col">
                          <span>{tTeam("roles.editor")}</span>
                          <span className="text-xs text-muted-foreground">{tTeam("roles.editorDesc")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="member">
                        <div className="flex flex-col">
                          <span>{tTeam("roles.member")}</span>
                          <span className="text-xs text-muted-foreground">{tTeam("roles.memberDesc")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="viewer">
                        <div className="flex flex-col">
                          <span>{tTeam("roles.viewer")}</span>
                          <span className="text-xs text-muted-foreground">{tTeam("roles.viewerDesc")}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                  {tTeam("cancel")}
                </Button>
                <Button onClick={handleInvite} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {tTeam("sending")}
                    </>
                  ) : (
                    tTeam("sendInvite")
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="@container/card from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
        <CardHeader>
          <CardTitle>{tTeam("membersTitle", { count: members.length })}</CardTitle>
          <CardDescription>Manage roles and access for your team</CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-4 font-medium text-muted-foreground">{tEmpty("teamMembers")}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {tEmpty("teamMembersDesc")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border border-border/50 p-4 bg-muted/20",
                    isPending && "opacity-50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {member.name?.[0] || member.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name || member.email.split("@")[0]}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {member.status !== "active" && (
                      <Badge variant="secondary" className={statusColors[member.status]}>
                        {member.status}
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className={roleBadgeColors[member.role] || roleBadgeColors.member}
                    >
                      {tTeam(`roles.${member.role}`)}
                    </Badge>
                    {member.role !== "owner" && canManageTeam && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {member.role !== "admin" && (
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(member.id, "admin")}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              {tTeam("promoteAdmin")}
                            </DropdownMenuItem>
                          )}
                          {member.role !== "editor" && (
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(member.id, "editor")}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              {tTeam("setEditor")}
                            </DropdownMenuItem>
                          )}
                          {member.role !== "member" && (
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(member.id, "member")}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              {tTeam("setMember")}
                            </DropdownMenuItem>
                          )}
                          {member.role !== "viewer" && (
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(member.id, "viewer")}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              {tTeam("setViewer")}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setRemoveId(member.id)}
                          >
                            <UserMinus className="mr-2 h-4 w-4" />
                            {tTeam("removeFromTeam")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remove Confirmation */}
      <AlertDialog open={!!removeId} onOpenChange={() => setRemoveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tTeam("removeTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tTeam("removeDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tTeam("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tTeam("removing")}
                </>
              ) : (
                tTeam("remove")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
