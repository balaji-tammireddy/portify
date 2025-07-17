"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [profile, setProfile] = useState({
    fullName: "",
    title: "",
    location: "",
    bio: "",
    phone: "",
    email: "",
    github: "",
    linkedin: "",
    website: "",
  });

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        //console.log("Fetching profile...");
        const response = await axios.get("/api/profile");
        const data = response.data.data;
        //console.log("Profile fetched:", data);

        if (data) {
          setProfile({
            fullName: data.fullName || "",
            title: data.title || "",
            location: data.location || "",
            bio: data.bio || "",
            phone: data.phone || "",
            email: data.email || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
            website: data.website || "",
          });
        }
      } catch (error: any) {
        // console.error("Error fetching profile:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (profile.fullName.trim() === "") {
      toast.error("Full name is required");
    //   console.warn("Full name is empty");
      return;
    }

    try {
      setLoading(true);
    //   console.log("Sending profile to backend:", profile);
      const response = await axios.post("/api/profile", profile);
    //   console.log("Backend response:", response.data);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error("Error updating profile");
    //   console.error("Error updating profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-3xl shadow-xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullname" className="mb-2 block">Full Name<span className="text-red-500">*</span></Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="John Doe"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title" className="mb-2 block">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Software Engineer"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="mb-2 block">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="City, Country"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="mb-2 block">Phone</Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="+91-9876543210"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-2 block">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin" className="mb-2 block">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    type="text"
                    placeholder="https://linkedin.com/in/..."
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="github" className="mb-2 block">GitHub</Label>
                  <Input
                    id="github"
                    type="text"
                    placeholder="https://github.com/..."
                    value={profile.github}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="website" className="mb-2 block">Personal Website</Label>
                  <Input
                    id="website"
                    type="text"
                    placeholder="https://yourportfolio.com"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Bio</h3>
              <Label htmlFor="bio" className="mb-2 block">Short Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}