import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, BusinessProfile } from '../types';
import { db, DEFAULT_USER, DEFAULT_BUSINESS_PROFILE } from '../services/db';

interface AuthContextType {
  user: User | null;
  business: BusinessProfile;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, businessName: string, password?: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateBusiness: (updates: Partial<BusinessProfile>) => void;
  refreshState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => db.getUser());
  const [business, setBusiness] = useState<BusinessProfile>(() => db.getBusinessProfile());

  const refreshState = () => {
    setUser(db.getUser());
    setBusiness(db.getBusinessProfile());
  };

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      refreshState();
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    // Multi-tenant check or demo login
    const existing = db.getUser();
    if (existing && existing.email.toLowerCase() === email.toLowerCase()) {
      setUser(existing);
      return true;
    }

    // Login with new or specified email
    const loggedUser: User = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Studio Owner',
      role: 'owner',
      businessId: business.id,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };
    db.setUser(loggedUser);
    setUser(loggedUser);
    return true;
  };

  const signup = async (
    name: string,
    email: string,
    businessName: string,
    _password?: string
  ): Promise<boolean> => {
    const newUserId = `user_${Date.now()}`;
    const newBizId = `biz_${Date.now()}`;

    const newUser: User = {
      id: newUserId,
      email,
      name,
      role: 'owner',
      businessId: newBizId,
      createdAt: new Date().toISOString(),
    };

    const newBusiness: BusinessProfile = {
      ...DEFAULT_BUSINESS_PROFILE,
      id: newBizId,
      userId: newUserId,
      name: businessName || `${name}'s Creative Hub`,
      email,
    };

    db.setUser(newUser);
    db.setBusinessProfile(newBusiness);
    setUser(newUser);
    setBusiness(newBusiness);
    return true;
  };

  const resetPassword = async (_email: string): Promise<boolean> => {
    // Simulated instant reset link
    return new Promise((resolve) => setTimeout(() => resolve(true), 600));
  };

  const logout = () => {
    setUser(null);
  };

  const updateBusiness = (updates: Partial<BusinessProfile>) => {
    const updated = db.updateBusinessProfile(updates);
    setBusiness(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        resetPassword,
        updateBusiness,
        refreshState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
