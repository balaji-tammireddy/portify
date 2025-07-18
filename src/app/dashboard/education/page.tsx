"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EducationPage() {
  const [educationList, setEducationList] = useState([]);
  const [form, setForm] = useState({
    _id: "",
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    grade: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/education");
      setEducationList(res.data.data || []);
    } catch (err: any) {
      toast.error("Failed to fetch education");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { institution, degree, fieldOfStudy, startDate, grade } = form;
    if (!institution || !degree || !fieldOfStudy || !startDate || !grade) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/education", form);
      toast.success(isEditing ? "Education updated" : "Education added");
      resetForm();
      fetchEducation();
    } catch (err: any) {
      toast.error("Failed to save education");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (edu: any) => {
    setForm({
      _id: edu._id,
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate?.slice(0, 10),
      endDate: edu.endDate?.slice(0, 10) || "",
      grade: edu.grade,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (educationId: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/education?educationId=${educationId}`);
      toast.success("Education deleted");
      setEducationList((prev) => prev.filter((e: any) => e._id !== educationId));
    } catch (err: any) {
      toast.error("Delete failed");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      _id: "",
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      grade: "",
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
          <CardTitle>{isEditing ? "Edit Education" : "Add Education"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label className="mb-2">Institution</Label>
              <Input
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div>
              <Label className="mb-2">Degree</Label>
              <Input
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div>
              <Label className="mb-2">Field of Study</Label>
              <Input
                value={form.fieldOfStudy}
                onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="mb-2">Start Date</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  disabled={loading}
                  required
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
              <Label className="mb-2">Grade</Label>
              <Input
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="flex gap-2 mt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update" : "Add"}
              </Button>
              {isEditing && (
                <Button type="button" variant="ghost" onClick={resetForm} disabled={loading}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {educationList.map((edu: any) => (
          <Card key={edu._id}>
            <CardHeader>
              <CardTitle>{edu.institution}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm text-gray-700">
              <div>
                <strong>Degree:</strong> {edu.degree}
              </div>
              <div>
                <strong>Field:</strong> {edu.fieldOfStudy}
              </div>
              <div>
                <strong>Duration:</strong>{" "}
                {edu.startDate?.slice(0, 10)} to {edu.endDate?.slice(0, 10) || "Present"}
              </div>
              <div>
                <strong>Grade:</strong> {edu.grade}
              </div>
              <div className="flex justify-between mt-2">
                              <Button size="sm" onClick={() => handleEdit(edu)} disabled={loading}>
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(edu._id)}
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
