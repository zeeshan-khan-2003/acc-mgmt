"use client";

import { useState } from "react";
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

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    loginId: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  // errors for each field
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" })); // clear error on input change
  }

  function handleSubmit(e) {
    e.preventDefault();

    const { name, loginId, password, confirmPassword, email } = formData;

    const newErrors = {};

    if (!name) newErrors.name = "Name is required";
    if (!loginId) newErrors.loginId = "Login ID is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If no errors:
    alert("User created successfully!");

    setFormData({
      name: "",
      loginId: "",
      password: "",
      confirmPassword: "",
      email: "",
    });
    
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
              <Label htmlFor="name" className="mb-2">
                Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="flex flex-col">
              <Label htmlFor="loginId" className="mb-2">
                Login ID
              </Label>
              <Input
                id="loginId"
                placeholder="johndoe123"
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
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

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
