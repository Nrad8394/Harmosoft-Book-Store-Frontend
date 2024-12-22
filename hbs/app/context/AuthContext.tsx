"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { signUpUser, loginUser, logoutUser, getUserDetails } from '@/handler/Api';

interface User {
  id: string;
  username: string;
  email: string;
  user_type: string;
  [key: string]: any; // Additional user fields
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (email: string, username: string, password1: string, password2: string, user_type: string) => Promise<void>;
  getUserDetails: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter(); // Initialize useRouter hook
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(async () => {
    try {
      await logoutUser(); // Call API to handle logout on the server
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push('/books'); // Redirect to home page after logout
    }
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      const { access, refresh, user: loggedInUser } = await loginUser(email, password);
  
      // Store tokens in local storage
      await localStorage.setItem('accessToken', access);
      await localStorage.setItem('refreshToken', refresh);
  
      // Fetch and set user details
      await fetchUserDetails();

      setIsAuthenticated(true);
    } catch (error: any) {
      handleAuthError(error, "Login failed");
    }
  };

  const signUp = async (email: string, username: string, password1: string, password2: string, user_type: string) => {
    try {
      const { access, refresh, user: signedUpUser } = await signUpUser(email, username, password1, password2, user_type);
  
      // Store tokens in local storage
      await localStorage.setItem('accessToken', access);
      await localStorage.setItem('refreshToken', refresh);
  
      // Fetch and set user details
      await fetchUserDetails();

      setIsAuthenticated(true);
    } catch (error: any) {
      handleAuthError(error, "Signup failed");
    }
  };

  const fetchUserDetails = async () => {
    try {
      const userDetails = await getUserDetails();
      setUser(userDetails);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      logout(); // If fetching user details fails, force a logout
    }
  };

  const getUserDetailsOnInit = useCallback(async () => {
    const accessToken = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    if (accessToken && username) {
      try {
        const userDetails = await getUserDetails();
        setUser(userDetails);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching user details on init:', error);
        logout(); // Force a logout if fetching user details fails
      }
    }
  }, [logout]); // Add 'logout' to the dependency array

  const handleAuthError = (error: any, message: string) => {
    if (error && typeof error === 'object') {
      for (const key in error) {
        if (error.hasOwnProperty(key)) {
          console.log(`${message}: ${error[key]}`);
        }
        throw new Error(error[key]);
      }
    } else {
      console.error(`${message}. Error:`, error);
      throw new Error(`${message}. Please try again.`);
    }
  };

  useEffect(() => {
    getUserDetailsOnInit(); // Fetch user details on app init if tokens exist
  }, [getUserDetailsOnInit]); // Include getUserDetailsOnInit in the dependency array

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, signUp, getUserDetails: fetchUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
