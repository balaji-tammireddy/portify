"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ExperiencePage() {
  const [experienceList, setExperienceList] = useState([]);
  const [form, setForm] = useState({
    _id: "",
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/experience");
      setExperienceList(res.data.data || []);
    } catch (err: any) {
      toast.error("Error fetching experience");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim() || !form.startDate.trim()) {
      toast.error("Company, Position, and Start Date are required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/experience", form);
      toast.success(isEditing ? "Experience updated" : "Experience added");
      resetForm();
      fetchExperience();
    } catch (err: any) {
      toast.error("Failed to save experience");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (experienceId: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/experience?experienceId=${experienceId}`);
      toast.success("Experience deleted");
      setExperienceList((prev) => prev.filter((e: any) => e._id !== experienceId));
    } catch (err: any) {
      toast.error("Failed to delete experience");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp: any) => {
    setForm({
      _id: exp._id,
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate?.slice(0, 10),
      endDate: exp.endDate?.slice(0, 10),
      description: exp.description || "",
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({
      _id: "",
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setIsEditing(false);
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
          <CardTitle>{isEditing ? "Edit Experience" : "Add New Experience"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label className="mb-2">Company</Label>
              <Input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label className="mb-2">Position</Label>
              <Input
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="mb-2">Start Date</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex-1">
                <Label className="mb-2">End Date</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update Experience" : "Add Experience"}
              </Button>
              {isEditing && (
                <Button variant="ghost" type="button" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {experienceList.map((exp: any) => (
          <Card key={exp._id}>
            <CardHeader>
              <CardTitle>{exp.position} @ {exp.company}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                {new Date(exp.startDate).toLocaleDateString()} -{" "}
                {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
              </p>
              <p className="text-sm">{exp.description}</p>
              <div className="flex justify-between mt-2">
                <Button size="sm" onClick={() => handleEdit(exp)} disabled={loading}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(exp._id)}
                  disabled={loading}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
