"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function AuthForm({ onAuth }: { onAuth: () => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuth();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      onAuth();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto mt-16 md:mt-24 p-4 md:p-8 border bg-white rounded shadow-lg"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
        {isRegister ? "Register" : "Login"}
      </h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="input input-bordered w-full text-base md:text-lg py-2"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="input input-bordered w-full text-base md:text-lg py-2"
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button disabled={loading} type="submit" className="w-full text-base md:text-lg">
        {isRegister ? "Register" : "Login"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full text-base md:text-lg"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        Continue with Google
      </Button>
      <div className="text-center pt-2">
        <span>{isRegister ? "Already have an account?" : "Don't have an account?"}</span>
        <button
          className="underline ml-2"
          type="button"
          onClick={() => setIsRegister((r) => !r)}
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </div>
    </form>
  );
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) router.replace("/dashboard");
    });
  }, [router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">Loading...</div>
    );

  return <AuthForm onAuth={() => router.replace("/dashboard")} />;
}
