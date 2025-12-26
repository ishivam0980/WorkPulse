import { useParams } from "react-router-dom";
import { Check, Copy, MoreHorizontal, Shield, ShieldCheck, Trash2, UserMinus, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetWorkspaceMembersQuery, useGetWorkspaceQuery, useChangeWorkspaceMemberRoleMutation } from "@/hooks/api/use-workspace";
import { useRemoveWorkspaceMember } from "@/hooks/api/use-member";
import { PageLoader } from "@/components/skeleton-loaders/page-loader";
import { getAvatarColor, getAvatarFallbackText, Permissions } from "@/constant";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuthContext } from "@/context/auth-provider";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const MembersPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { user } = useAuthContext();
  const { hasPermission } = usePermissions(workspaceId!);
  const confirmDialog = useConfirmDialog();
  const [copied, setCopied] = useState(false);

  const { data: workspaceData } = useGetWorkspaceQuery(workspaceId!);
  const { data: membersData, isLoading } = useGetWorkspaceMembersQuery(workspaceId!);
  const { mutate: changeRole } = useChangeWorkspaceMemberRoleMutation(workspaceId!);
  const { mutate: removeMember, isPending: isRemoving } = useRemoveWorkspaceMember();

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/invite/workspace/${workspaceData?.workspace.inviteCode}/join`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRoleChange = (memberId: string, roleId: string) => {
    changeRole(
      { workspaceId: workspaceId!, data: { memberId, roleId } },
      {
        onSuccess: () => toast.success("Role updated successfully"),
        onError: (error: any) => toast.error(error?.message || "Failed to update role"),
      }
    );
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    const confirmed = await confirmDialog.confirm();
    if (confirmed) {
      removeMember(
        { workspaceId: workspaceId!, memberId },
        {
          onSuccess: () => toast.success(`${memberName} has been removed from the workspace`),
          onError: (error: any) => toast.error(error?.message || "Failed to remove member"),
        }
      );
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "OWNER":
        return <ShieldCheck className="h-3 w-3" />;
      case "ADMIN":
        return <Shield className="h-3 w-3" />;
      default:
        return <Users className="h-3 w-3" />;
    }
  };

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName) {
      case "OWNER":
        return "default" as const;
      case "ADMIN":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  const ownerCount = membersData?.members?.filter((m) => m.role.name === "OWNER").length || 0;
  const adminCount = membersData?.members?.filter((m) => m.role.name === "ADMIN").length || 0;
  const memberCount = membersData?.members?.filter((m) => m.role.name === "MEMBER").length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">
            Manage your workspace members and their roles
          </p>
        </div>
        {hasPermission(Permissions.ADD_MEMBER) && (
          <Button onClick={handleCopyInviteLink}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membersData?.members?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownerCount + adminCount}</div>
            <p className="text-xs text-muted-foreground">
              {ownerCount} owner, {adminCount} admin
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberCount}</div>
            <p className="text-xs text-muted-foreground">Regular members</p>
          </CardContent>
        </Card>
      </div>

      {hasPermission(Permissions.ADD_MEMBER) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite Link
            </CardTitle>
            <CardDescription>
              Share this link to invite new members to your workspace. Anyone with this link can join.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-muted rounded-lg text-sm overflow-hidden text-ellipsis font-mono">
                {`${window.location.origin}/invite/workspace/${workspaceData?.workspace.inviteCode}/join`}
              </code>
              <Button variant="outline" size="icon" onClick={handleCopyInviteLink}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Members
          </CardTitle>
          <CardDescription>
            View and manage all workspace members and their access levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {membersData?.members?.map((member) => {
              const initials = getAvatarFallbackText(member.userId.name);
              const avatarColor = getAvatarColor(initials);
              const isCurrentUser = member.userId._id === user?._id;
              const isOwner = member.role.name === "OWNER";
              const canModify = hasPermission(Permissions.CHANGE_MEMBER_ROLE) && !isOwner && !isCurrentUser;

              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                      <AvatarImage src={member.userId.profilePicture || undefined} />
                      <AvatarFallback style={{ backgroundColor: avatarColor }} className="font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.userId.name}</p>
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {member.userId.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {canModify ? (
                      <Select
                        value={member.role._id}
                        onValueChange={(value) => handleRoleChange(member._id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {membersData?.roles
                            ?.filter((role) => role.name !== "OWNER")
                            .map((role) => (
                              <SelectItem key={role._id} value={role._id}>
                                <span className="flex items-center gap-2">
                                  {getRoleIcon(role.name)}
                                  {role.name}
                                </span>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={getRoleBadgeVariant(member.role.name)} className="gap-1">
                        {getRoleIcon(member.role.name)}
                        {member.role.name}
                      </Badge>
                    )}

                    {canModify && hasPermission(Permissions.REMOVE_MEMBER) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleRemoveMember(member._id, member.userId.name)}
                            disabled={isRemoving}
                          >
                            <UserMinus className="mr-2 h-4 w-4" />
                            Remove from workspace
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={() => confirmDialog.handleCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Remove Member
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this member from the workspace? 
              They will lose access to all projects and tasks.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={confirmDialog.handleCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDialog.handleConfirm}>
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembersPage;
