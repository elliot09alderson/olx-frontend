import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../utils/authService.js";

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (abc: User) => any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const result = await authService.checkAuth();
        if (result.isAuthenticated) {
          setUser(result.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await authService.login({ email, password });
      if (result.success) {
        setUser(result.user);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await authService.register({ 
        email, 
        password, 
        fullname: name,
        confirmpassword: password 
      });
      if (result.success) {
        setUser(result.user);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    setUser,
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
