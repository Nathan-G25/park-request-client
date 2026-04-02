import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Mail, ArrowLeft, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";



const requestResetEmail = async (email: string) => {
  const response = await fetch("http://localhost:3000/parking-avenue-owner/forgot-password", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send reset email");
  }
  return response.text();
};

const submitNewPassword = async (payload: { email: string; token: string; newPassword: string }) => {
  const response = await fetch("http://localhost:3000/parking-avenue-owner/reset-password", { // Update with your full backend URL if needed
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to reset password");
  }

  return response.json();
};

const ResetPassword = () => {
  const [step, setStep] = useState<"request" | "sent" | "reset">("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const requestMutation = useMutation({
    mutationFn: (email: string) => requestResetEmail(email),
    onSuccess: () => setStep("sent"),
  });

  const resetMutation = useMutation({
    mutationFn: submitNewPassword,
    onSuccess: (data) => {
      toast(data.message); 
      navigate('/login');
    },
  });

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    requestMutation.mutate(email);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast("Passwords do not match");

    resetMutation.mutate({
      email,
      token,
      newPassword: password,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-md space-y-6">
        {/* Step: Request Reset */}
        {step === "request" && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={requestMutation.isPending}
                  />
                </div>

                {requestMutation.isError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    {requestMutation.error.message}
                  </div>
                )}

                <Button type="submit" className="w-full bg-linear-to-b from-[#8958F2] to-[#1326F5]" disabled={requestMutation.isPending}>
                  {requestMutation.isPending ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step: Email Sent */}
        {step === "sent" && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle className="text-xl">Check your email</CardTitle>
              <CardDescription>We sent a link to <span className="font-medium">{email}</span></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <Button variant="outline" className="w-full" onClick={() => setStep("reset")}>
                I have a reset code
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step: New Password */}
        {step === "reset" && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Set new password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Token</Label>
                  <Input 
                    id="token" 
                    value={token} 
                    onChange={(e) => setToken(e.target.value)} 
                    placeholder="Enter code from email" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">New password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    minLength={8} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                  />
                </div>

                {resetMutation.isError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    {resetMutation.error.message}
                  </div>
                )}

                <Button type="submit" className="w-full bg-linear-to-b from-[#8958F2] to-[#1326F5]" disabled={resetMutation.isPending}>
                  {resetMutation.isPending ? <Loader2 className="animate-spin" /> : "Reset Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;