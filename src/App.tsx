import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppProvider } from "@/contexts/AppContext";
import { Navbar } from "@/components/Navbar";
import AuthRoute from "@/components/AuthRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { AdDetail } from "./pages/AdDetail";
import { Profile } from "./pages/Profile";
import { AdminPanel } from "./pages/AdminPanel";
import { UploadAd } from "./pages/UploadAd";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppProvider>
              <div className="min-h-screen bg-background">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={
                    <AuthRoute>
                      <Login />
                    </AuthRoute>
                  } />
                  <Route path="/signup" element={
                    <AuthRoute>
                      <Signup />
                    </AuthRoute>
                  } />
                  <Route path="/ad/:slug" element={<AdDetail />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-ads" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin>
                      <AdminPanel />
                    </ProtectedRoute>
                  } />
                  <Route path="/upload-ad" element={
                    <ProtectedRoute>
                      <UploadAd />
                    </ProtectedRoute>
                  } />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </AppProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
