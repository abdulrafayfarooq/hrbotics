
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

interface User {
  email: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('virtualhr_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('virtualhr_user');
      }
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      // Check if user exists in localStorage
      const storedUsers = localStorage.getItem('virtualhr_users');
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const existingUser = users.find((u: any) => u.email === email);
      
      if (existingUser) {
        // Simple password check - in a real app this would be handled securely
        if (existingUser.password === password) {
          const userData = { email: existingUser.email, name: existingUser.name };
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('virtualhr_user', JSON.stringify(userData));
          toast({
            title: "Welcome back!",
            description: `Nice to see you again, ${existingUser.name}!`,
          });
          return true;
        } else {
          toast({
            title: "Login failed",
            description: "Incorrect password. Please try again.",
            variant: "destructive",
          });
          return false;
        }
      } else {
        // Auto-register if user doesn't exist
        const newUser = {
          email,
          password,
          name: email.split('@')[0], // Generate a basic name from email
        };
        
        users.push(newUser);
        localStorage.setItem('virtualhr_users', JSON.stringify(users));
        
        const userData = { email: newUser.email, name: newUser.name };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('virtualhr_user', JSON.stringify(userData));
        
        toast({
          title: "Account created",
          description: "Welcome to VirtualHR! Your account has been created.",
        });
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const register = async (email: string, password: string, name: string) => {
    try {
      const storedUsers = localStorage.getItem('virtualhr_users');
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        toast({
          title: "Registration failed",
          description: "Email already exists. Try logging in instead.",
          variant: "destructive",
        });
        return false;
      }
      
      const newUser = { email, password, name };
      users.push(newUser);
      localStorage.setItem('virtualhr_users', JSON.stringify(users));
      
      const userData = { email, name };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('virtualhr_user', JSON.stringify(userData));
      
      toast({
        title: "Registration successful",
        description: "Welcome to VirtualHR!",
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('virtualhr_user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
