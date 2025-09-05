import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, User, LogOut, Moon, Sun, Menu, X, Shield, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { searchAds, filters } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchAds(searchQuery);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="glass-navbar sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.svg" 
              alt="OLX Logo" 
              className="h-10 w-auto hover:scale-105 transition-transform duration-200" 
            />
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl mx-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-button border-0 bg-white/20 dark:bg-white/10"
              />
            </div>
            <Button type="submit" variant="default" className="ml-2">
              Search
            </Button>
            {/* Sell Button */}
            {isAuthenticated && (
              <Button asChild className="ml-2 bg-gradient-primary hover:bg-gradient-primary/90">
                <Link to="/upload-ad" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Sell
                </Link>
              </Button>
            )}
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="glass-button"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Favorites - Only when authenticated */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="glass-button hidden sm:flex"
              >
                <Link to="/wishlist">
                  <Heart className="h-4 w-4" />
                </Link>
              </Button>
            )}

            {/* User Menu or Login Button */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="glass-button flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium">{user?.name}</div>
                      {user?.role === 'admin' && (
                        <div className="text-xs text-blue-600 dark:text-blue-400">Admin</div>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-card">
                  <DropdownMenuItem asChild className="hover:bg-white/10 dark:hover:bg-white/5 focus:bg-white/10 dark:focus:bg-white/5">
                    <Link to="/profile" className="flex items-center hover:text-foreground">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-white/10 dark:hover:bg-white/5 focus:bg-white/10 dark:focus:bg-white/5">
                    <Link to="/wishlist" className="flex items-center hover:text-foreground">
                      <Heart className="mr-2 h-4 w-4" />
                      My Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-white/10 dark:hover:bg-white/5 focus:bg-white/10 dark:focus:bg-white/5">
                    <Link to="/my-ads" className="flex items-center hover:text-foreground">
                      <FileText className="mr-2 h-4 w-4" />
                      My Ads
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="hover:bg-white/10 dark:hover:bg-white/5 focus:bg-white/10 dark:focus:bg-white/5">
                        <Link to="/admin" className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive hover:bg-red-500/10 dark:hover:bg-red-500/10 focus:bg-red-500/10 dark:focus:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  asChild
                  className="glass-button hidden sm:flex"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden glass-button"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden py-3 border-t border-white/10">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-button border-0 bg-white/20 dark:bg-white/10"
              />
            </div>
            <Button type="submit" size="sm" className="ml-2">
              Search
            </Button>
          </form>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 glass-card">
            <div className="flex flex-col space-y-2">
              {!isAuthenticated ? (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                      <Heart className="mr-2 h-4 w-4" />
                      My Wishlist
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/my-ads" onClick={() => setMobileMenuOpen(false)}>
                      <FileText className="mr-2 h-4 w-4" />
                      My Ads
                    </Link>
                  </Button>
                  {user?.role === 'admin' && (
                    <Button variant="ghost" asChild className="justify-start">
                      <Link 
                        to="/admin" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 w-full"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="justify-start text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
