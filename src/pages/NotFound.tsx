import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-surface p-4">
      <Card className="glass-card max-w-md w-full text-center">
        <CardContent className="p-8">
          <div className="text-6xl font-bold text-primary mb-4">404</div>
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link to="/">Return to Home</Link>
            </Button>
            <Button variant="outline" asChild className="w-full glass-button">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
