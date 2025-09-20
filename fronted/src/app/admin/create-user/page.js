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

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    loginId: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  function clearForm() {
    setFormData({
      name: "",
      role: "",
      loginId: "",
      password: "",
      confirmPassword: "",
      email: "",
    });
  }

  function handleChange(e) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const { name, role, loginId, password, confirmPassword, email } = formData;

    if (!name || !role || !loginId || !password || !email) {
      alert("Please fill all the fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Submit logic here (e.g. call API)
    alert("User created successfully!");

    clearForm();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Create User</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  placeholder="Admin"
                  required
                  value={formData.role}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loginId">Login ID</Label>
                <Input
                  id="loginId"
                  placeholder="johndoe123"
                  required
                  value={formData.loginId}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Re-enter Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button type="submit">Create</Button>
              <Button type="button" onClick={clearForm}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
        {/* <CardFooter>
          <p>
            Already have an account
            <Link href="/login" scroll={false}>
              {" "}
               login
            </Link>
          </p>
        </CardFooter> */}
      </Card>
    </div>
  );
}
