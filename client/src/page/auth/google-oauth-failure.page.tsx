import { useSearchParams, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Logo from "@/components/logo";

const GoogleOAuthFailure = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message") || "Authentication failed";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Failed</CardTitle>
            <CardDescription>
              There was a problem signing in with Google
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>

            <Button asChild className="w-full">
              <Link to="/">Try Again</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleOAuthFailure;
