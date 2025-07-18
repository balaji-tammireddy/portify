"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    _id: "",
    project: "",
    description: "",
    technologies: [] as string[],
    githubLink: "",
    liveDemo: "",
  });
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/projects");
      setProjects(res.data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch projects:", err.message);
      toast.error("Error loading projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.project.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/projects", form);
      toast.success(isEditing ? "Project updated" : "Project added");
      resetForm();
      fetchProjects();
    } catch (err: any) {
      console.error("Project error:", err.message);
      toast.error("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/projects?projectId=${projectId}`);
      toast.success("Project deleted");
      setProjects((prev) => prev.filter((p: any) => p._id !== projectId));
    } catch (err: any) {
      console.error("Delete error:", err.message);
      toast.error("Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: any) => {
    setForm({
      _id: project._id,
      project: project.project,
      description: project.description,
      technologies: project.technologies || [],
      githubLink: project.githubLink || "",
      liveDemo: project.liveDemo || "",
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({
      _id: "",
      project: "",
      description: "",
      technologies: [],
      githubLink: "",
      liveDemo: "",
    });
    setIsEditing(false);
    setTechInput("");
  };

  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !form.technologies.includes(trimmed)) {
      setForm({ ...form, technologies: [...form.technologies, trimmed] });
      setTechInput("");
    }
  };

  const handleRemoveTech = (index: number) => {
    const newTechs = [...form.technologies];
    newTechs.splice(index, 1);
    setForm({ ...form, technologies: newTechs });
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
          <CardTitle>{isEditing ? "Edit Project" : "Add New Project"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label className="mb-2">Project Name</Label>
              <Input
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div>
              <Label className="mb-2">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={loading}
              />
            </div>

            <div>
              <Label className="mb-2">Technologies</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  disabled={loading}
                />
                <Button
                  type="button"
                  onClick={handleAddTech}
                  disabled={loading || !techInput.trim()}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tech}
                    <button
                      type="button"
                      className="ml-2 text-red-500"
                      onClick={() => handleRemoveTech(idx)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2">GitHub Link</Label>
              <Input
                value={form.githubLink}
                onChange={(e) => setForm({ ...form, githubLink: e.target.value })}
                disabled={loading}
              />
            </div>

            <div>
              <Label className="mb-2">Live Demo</Label>
              <Input
                value={form.liveDemo}
                onChange={(e) => setForm({ ...form, liveDemo: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update Project" : "Add Project"}
              </Button>
              {isEditing && (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: any) => (
          <Card key={project._id} className="relative">
            <CardHeader>
              <CardTitle>{project.project}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-sm text-gray-600">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string, idx: number) => (
                  <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between mt-3">
                <Button size="sm" onClick={() => handleEdit(project)} disabled={loading}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(project._id)}
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
