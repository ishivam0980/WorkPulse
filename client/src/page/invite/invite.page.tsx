import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/logo";
import API from "@/lib/axios-client";
import useAuth from "@/hooks/api/use-auth";

const InviteUserPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const { data: authData, isLoading: isAuthLoading } = useAuth();

  const { mutate: joinWorkspace, isPending: isJoining } = useMutation({
    mutationFn: async () => {
      const response = await API.post(`/member/workspace/${inviteCode}/join`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Successfully joined the workspace!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      navigate(`/workspace/${data.workspaceId}`);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to join workspace");
    },
  });

  useEffect(() => {
    if (!isAuthLoading && !authData?.user) {
      const returnUrl = encodeURIComponent(`/invite/workspace/${inviteCode}/join`);
      navigate(`/?returnUrl=${returnUrl}`);
    }
  }, [authData, isAuthLoading, inviteCode, navigate]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo />
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>You're Invited!</CardTitle>
            <CardDescription>
              You've been invited to join a workspace on WorkPulse
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Click below to accept the invitation and join the team.</p>
            </div>
            <Button
              onClick={() => joinWorkspace()}
              className="w-full"
              disabled={isJoining}
            >
              {isJoining && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Accept & Join Workspace
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Decline
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InviteUserPage;
