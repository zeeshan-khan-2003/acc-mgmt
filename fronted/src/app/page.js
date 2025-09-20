"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    loginId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // errors for each field
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (res.ok) {
          router.push("/admin");
        } else {
          localStorage.removeItem("jwtToken");
        }
      });
    }
  }, [router]);

  function handleChange(e) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" })); // clear error on input change
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { username, loginId, email, password, confirmPassword } = formData;

    const newErrors = {};

    if (!username) newErrors.username = "Username is required";
    if (!loginId) newErrors.loginId = "Login ID is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          loginId,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors({ general: data.msg || "Registration failed" });
        return;
      }

      alert("User created successfully!");
      router.push("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({ general: "Something went wrong. Please try again." });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Create User</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <Label htmlFor="username" className="mb-2">
                Username
              </Label>
              <Input
                id="username"
                placeholder="johndoe123"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="loginId" className="mb-2">
                Login ID
              </Label>
              <Input
                id="loginId"
                placeholder="johndoe"
                value={formData.loginId}
                onChange={handleChange}
              />
              {errors.loginId && (
                <p className="mt-1 text-sm text-red-600">{errors.loginId}</p>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col">
              <Label htmlFor="password" className="mb-2">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col">
              <Label htmlFor="confirmPassword" className="mb-2">
                Re-enter Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            {errors.general && (
              <p className="mt-1 text-sm text-red-600">{errors.general}</p>
            )}

            <Button type="submit">Create</Button>
          </form>
        </CardContent>
        <CardFooter>
          <p>
            Already have an account
            <Link href="/login" scroll={false}>
              {" "}
              login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
