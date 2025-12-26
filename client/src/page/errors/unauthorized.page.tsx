import { Link } from "react-router-dom";
import { ShieldX, Home, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
              <ShieldX className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-destructive">403</h1>
          <h2 className="text-2xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page. Please log in with an authorized account or contact your administrator.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link to="/" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          </Button>
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Why am I seeing this?</p>
          <ul className="list-disc list-inside space-y-1 text-left">
            <li>Your session may have expired</li>
            <li>You may not have the required permissions</li>
            <li>The resource may be restricted</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
