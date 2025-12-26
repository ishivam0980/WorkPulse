import { Link } from "react-router-dom";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <FileQuestion className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground pt-4">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
