"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Login gagal: " + result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-transparant border border-gray-300 shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Login Akun
        </h2>

        <form onSubmit={handleLogin} className="space-y-5 mb-5">
          {error && (
            <p className="text-red-600 bg-red-50 border border-red-200 rounded-md p-2 text-sm">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-white"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@email.com"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-white"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
            />
          </div>

          <Button
            type="submit"
            variant="secondary"
            disabled={isLoading}
            className="w-full text-white py-2 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Please wait..." : "Login"}
          </Button>
        </form>
        <hr />
        <Link href="/">
          <Button
            variant="default"
            className="w-full mt-5 py-2 rounded-lg transition disabled:opacity-50"
          >Kembali

          </Button>
        </Link>
      </div>
    </div>
  );
}
