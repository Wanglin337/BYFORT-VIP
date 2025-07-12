import { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["/api/users/uid", firebaseUser?.uid],
    enabled: !!firebaseUser?.uid,
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: { uid: string; email: string; displayName: string; username: string }) => {
      const response = await apiRequest("POST", "/api/users", userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/uid"] });
    },
  });

  useEffect(() => {
    let unsubscribe: () => void;
    
    // Check if Firebase Auth is available
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setFirebaseUser(firebaseUser);
        
        if (firebaseUser) {
          // Check if user exists in our database
          try {
            const response = await fetch(`/api/users/uid/${firebaseUser.uid}`);
            if (response.status === 404) {
              // Create user in our database
              const username = firebaseUser.email?.split('@')[0] || `user_${Date.now()}`;
              try {
                await apiRequest("POST", "/api/users", {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  displayName: firebaseUser.displayName || username,
                  username,
                });
                queryClient.invalidateQueries({ queryKey: ["/api/users/uid"] });
              } catch (createError) {
                console.error("Error creating user:", createError);
              }
            }
          } catch (error) {
            console.error("Error checking/creating user:", error);
          }
        }
        
        setLoading(false);
      });
    } else {
      console.warn("Firebase Auth not configured, using demo mode");
      // Demo mode - create a mock user
      const demoUser = {
        uid: "demo-user-1",
        email: "demo@byfort.app",
        displayName: "Demo User",
        emailVerified: true,
      } as FirebaseUser;
      
      setFirebaseUser(demoUser);
      setLoading(false);
      
      unsubscribe = () => {};
    }

    return unsubscribe;
  }, [queryClient]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    queryClient.clear();
  };

  const value = {
    firebaseUser,
    user: user || null,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
