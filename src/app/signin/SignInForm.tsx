"use client";

import { useActionState, useState } from "react";
import { LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { signInAction, googleSignInAction, type SignInState } from "./actions";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const initial: SignInState = {};

export function SignInForm() {
  const [state, formAction, pending] = useActionState(signInAction, initial);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const user = result.user;
      
      if (user.email) {
        // Generate a base slug
        const baseSlug = user.displayName?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "user";
        
        // Check Firestore
        const userRef = doc(db, "users", user.email);
        const userSnap = await getDoc(userRef);
        
        let finalSlug = baseSlug;
        if (!userSnap.exists()) {
          finalSlug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
          // Store new user in Firestore
          await setDoc(userRef, {
            email: user.email,
            name: user.displayName || "User",
            cardSlug: finalSlug,
            createdAt: new Date().toISOString()
          });
        } else {
          finalSlug = userSnap.data().cardSlug;
        }

        const resultAction = await googleSignInAction(user.email, user.displayName || "User", finalSlug);
        if (!resultAction?.error) {
          window.location.href = "/dashboard";
        } else {
          console.error(resultAction.error);
        }
      }
    } catch (error) {
      console.error("Google Sign-in Error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="example@email.com"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-ring"
        />
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={pending || googleLoading}>
        <LogIn className="h-4 w-4" />
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button 
        type="button" 
        variant="outline" 
        className="w-full bg-white text-black hover:bg-gray-50 hover:text-black border-gray-300 cursor-pointer" 
        onClick={handleGoogleSignIn}
        disabled={googleLoading || pending}
      >
        <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        {googleLoading ? "Signing in…" : "Sign in with Google"}
      </Button>
    </div>
  );
}
