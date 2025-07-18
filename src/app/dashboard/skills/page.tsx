"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState({ skill: "", level: "Beginner" });
  const [loading, setLoading] = useState(false);

  // Fetch all skills
  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/skills");
      setSkills(res.data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch skills:", err.message);
      toast.error("Error loading skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Add skill
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.skill.trim()) {
      toast.error("Skill name is required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/skills", skillInput);
      toast.success("Skill added");
      setSkillInput({ skill: "", level: "Beginner" });
      fetchSkills();
    } catch (err: any) {
      console.error("Add skill error:", err.message);
      toast.error("Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  // Delete skill
  const handleDeleteSkill = async (skillId: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/skills?skillId=${skillId}`);
      toast.success("Skill deleted");
      setSkills((prev) => prev.filter((skill: any) => skill._id !== skillId));
    } catch (err: any) {
      console.error("Delete error:", err.message);
      toast.error("Failed to delete skill");
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
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSkill} className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <Label htmlFor="skill" className="mb-2">Skill</Label>
              <Input
                id="skill"
                type="text"
                value={skillInput.skill}
                onChange={(e) => setSkillInput({ ...skillInput, skill: e.target.value })}
                disabled={loading}
                required
              />
            </div>
            <div className="w-48">
              <Label htmlFor="level" className="mb-2">Level</Label>
              <Select
                value={skillInput.level}
                onValueChange={(value) => setSkillInput({ ...skillInput, level: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? "Saving..." : "Add Skill"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill: any) => (
          <Card key={skill._id} className="relative">
            <CardHeader>
              <CardTitle>{skill.skill}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{skill.level}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteSkill(skill._id)}
                disabled={loading}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
