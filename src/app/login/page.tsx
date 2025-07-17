"use client"
import React from "react";
import { useRouter } from "next/navigation";
import toast, { Toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [user, setUser] = React.useState({
        email: "",
        password: ""
    });

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);

            toast.success("User logged in successfully");
            console.log("Login success", response.data);
            router.push("/dashboard");
        } catch (error: any) {
            toast.error("Failed to login User");
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black z-50">
                <div
                className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"
                role="status"
                aria-label="Loading"
                ></div>
            </div>
        );
    }
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
              <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Login To Your Account</CardTitle>
                  <CardDescription>
                    Enter your details below to login
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onLogin} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email" className="mb-2">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          disabled={loading}
                          value={user.email}
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password" className="mb-2">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          disabled={loading}
                          value={user.password}
                          onChange={(e) =>
                            setUser({ ...user, password: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
        
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </Button>
        
                    <p className="text-center text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <span
                        onClick={() => router.push("/signup")}
                        className="cursor-pointer text-blue-600 hover:underline"
                      >
                        Sign Up
                      </span>
                    </p>
                  </form>
                </CardContent>
            </Card>
        </div>
    );
}