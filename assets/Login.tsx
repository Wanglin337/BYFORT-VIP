import { useState } from "react";
import { signInWithRedirect, signInWithEmailAndPassword, createUserWithEmailAndPassword, getRedirectResult } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";
import { useEffect } from "react";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { firebaseUser } = useAuth();

  useEffect(() => {
    // Handle redirect result when user returns from Google auth
    getRedirectResult(auth).catch((error) => {
      console.error("Auth redirect error:", error);
    });
  }, []);

  if (firebaseUser) {
    return <Redirect to="/" />;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    signInWithRedirect(auth, googleProvider);
  };

  return (
    <div className="min-h-screen bg-dark-primary flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-8">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="text-6xl font-bold bg-gradient-to-r from-accent-pink to-accent-blue bg-clip-text text-transparent mb-4">
            BYFORT
          </div>
          <p className="text-gray-400 text-lg">Share your moments, discover the world</p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleEmailAuth} className="space-y-6">
          {isSignUp && (
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-dark-secondary border-gray-600 text-white placeholder-gray-400 focus:border-accent-pink"
              required
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-dark-secondary border-gray-600 text-white placeholder-gray-400 focus:border-accent-pink"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-dark-secondary border-gray-600 text-white placeholder-gray-400 focus:border-accent-pink"
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent-pink to-accent-blue hover:shadow-lg"
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}
          </Button>
        </form>

        {/* Social Login */}
        <div className="mt-8 space-y-4">
          <div className="text-center text-gray-400 text-sm">Or continue with</div>
          <Button
            onClick={handleGoogleAuth}
            variant="outline"
            className="w-full bg-dark-secondary border-gray-600 text-white hover:bg-gray-700"
          >
            🌐 Google
          </Button>
        </div>

        {/* Toggle Sign Up/Sign In */}
        <div className="mt-8 text-center">
          <span className="text-gray-400">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
          </span>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-accent-pink font-semibold"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
