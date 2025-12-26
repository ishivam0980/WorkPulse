import { useParams } from "react-router-dom";
import { Copy, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetWorkspaceMembersQuery, useGetWorkspaceQuery, useChangeWorkspaceMemberRoleMutation } from "@/hooks/api/use-workspace";
import { PageLoader } from "@/components/skeleton-loaders/page-loader";
import { getAvatarColor, getAvatarFallbackText, Permissions } from "@/constant";
import { usePermissions } from "@/hooks/use-permissions";

const MembersPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { hasPermission } = usePermissions(workspaceId!);

  const { data: workspaceData } = useGetWorkspaceQuery(workspaceId!);
  const { data: membersData, isLoading } = useGetWorkspaceMembersQuery(workspaceId!);
  const { mutate: changeRole } = useChangeWorkspaceMemberRoleMutation(workspaceId!);

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/invite/workspace/${workspaceData?.workspace.inviteCode}/join`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard!");
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

  if (isLoading) {
    return <PageLoader />;
  }

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

      {hasPermission(Permissions.ADD_MEMBER) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invite Link</CardTitle>
            <CardDescription>
              Share this link to invite new members to your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-muted rounded-lg text-sm overflow-hidden text-ellipsis">
                {`${window.location.origin}/invite/workspace/${workspaceData?.workspace.inviteCode}/join`}
              </code>
              <Button variant="outline" size="icon" onClick={handleCopyInviteLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Members ({membersData?.members?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {membersData?.members?.map((member) => {
              const initials = getAvatarFallbackText(member.userId.name);
              const avatarColor = getAvatarColor(initials);

              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.userId.profilePicture || undefined} />
                      <AvatarFallback style={{ backgroundColor: avatarColor }}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.userId.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.userId.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasPermission(Permissions.CHANGE_MEMBER_ROLE) &&
                    member.role.name !== "OWNER" ? (
                      <Select
                        value={member.role._id}
                        onValueChange={(value) => handleRoleChange(member._id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {membersData?.roles?.map((role) => (
                            <SelectItem key={role._id} value={role._id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="secondary">{member.role.name}</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembersPage;
