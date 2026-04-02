import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router";

// --- Mock API Functions (Replace these with your actual API calls) ---
const requestResetEmail = async (email: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { success: true };
};

const submitNewPassword = async (data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { success: true };
};

const ResetPassword = () => {
  const [step, setStep] = useState<"request" | "sent" | "reset">("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(""); // Added missing state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- Mutations ---

  // 1. Request Reset Mutation
  const requestMutation = useMutation({
    mutationFn: (email: string) => requestResetEmail(email),
    onSuccess: () => {
      setStep("sent");
    },
    onError: (error) => {
      console.error("Failed to send reset link:", error);
      // Handle error (e.g., show a toast)
    },
  });

  // 2. Submit Reset Mutation
  const resetMutation = useMutation({
    mutationFn: (data: any) => submitNewPassword(data),
    onSuccess: () => {
      // Redirect to login or show success toast
      alert("Password reset successfully!");
    },
    onError: (error) => {
      console.error("Failed to reset password:", error);
    },
  });

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    requestMutation.mutate(email);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    resetMutation.mutate({ email, token, password });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-linear-to-b from-[#8958F2] to-[#1326F5] flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Park-Request</span>
          </div>
        </div>

        {step === "request" && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center space-y-1">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Forgot your password?</CardTitle>
              <CardDescription>Enter your email and we'll send you a reset link.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={requestMutation.isPending}
                    required
                  />
                </div>
                <Button 
                    type="submit" 
                    className="w-full bg-linear-to-b from-[#8958F2] to-[#1326F5]"
                    disabled={requestMutation.isPending}
                >
                  {requestMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                </Button>
                <div className="text-center">
                  <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "sent" && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center space-y-1">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle className="text-xl">Check your email</CardTitle>
              <CardDescription>
                We sent a password reset link to <span className="font-medium text-foreground">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Didn't receive the email? Check your spam folder or{" "}
                <button onClick={() => setStep("request")} className="text-primary hover:underline font-medium">
                  try again
                </button>.
              </p>
              <Button variant="outline" className="w-full bg-linear-to-b from-[#8958F2] to-[#1326F5] text-white" onClick={() => setStep("reset")}>
                I have a reset code
              </Button>
              <div className="text-center">
                <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "reset" && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center space-y-1">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Set new password</CardTitle>
              <CardDescription>Your new password must be at least 8 characters.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Reset Token</Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="Enter the code from your email"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    disabled={resetMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={resetMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={resetMutation.isPending}
                  />
                </div>
                <Button 
                    type="submit" 
                    className="w-full bg-linear-to-b from-[#8958F2] to-[#1326F5]"
                    disabled={resetMutation.isPending}
                >
                  {resetMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
                </Button>
                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => setStep("sent")} 
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;