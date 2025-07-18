"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Certificate {
  _id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  description?: string;
  certificateLink?: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [form, setForm] = useState<Certificate>({
    title: "",
    issuer: "",
    issueDate: "",
    description: "",
    certificateLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get("/api/certificate");
      setCertificates(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch certificates");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.issuer || !form.issueDate) {
      toast.error("Title, Issuer, and Issue Date are required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/certificate", form);
      toast.success(isEditing ? "Certificate updated" : "Certificate added");
      setForm({
        title: "",
        issuer: "",
        issueDate: "",
        description: "",
        certificateLink: "",
      });
      setIsEditing(false);
      fetchCertificates();
    } catch (err) {
      toast.error("Error saving certificate");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setForm({
      _id: certificate._id,
      title: certificate.title,
      issuer: certificate.issuer,
      issueDate: certificate.issueDate.slice(0, 10),
      description: certificate.description || "",
      certificateLink: certificate.certificateLink || "",
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/certificate?certificateId=${id}`);
      toast.success("Certificate deleted");
      setCertificates(certificates.filter((c) => c._id !== id));
    } catch (err) {
      toast.error("Failed to delete certificate");
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setForm({
      title: "",
      issuer: "",
      issueDate: "",
      description: "",
      certificateLink: "",
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
          <CardTitle>{isEditing ? "Edit Certificate" : "Add Certificate"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label className="mb-2">Title</Label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <Label className="mb-2">Issuer</Label>
              <Input
                name="issuer"
                value={form.issuer}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <Label className="mb-2">Issue Date</Label>
              <Input
                name="issueDate"
                type="date"
                value={form.issueDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <Label className="mb-2">Description</Label>
              <Input
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <Label className="mb-2">Certificate Link</Label>
              <Input
                name="certificateLink"
                value={form.certificateLink}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {isEditing ? "Update" : "Add"}
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <Card key={cert._id}>
            <CardHeader>
              <CardTitle>{cert.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 flex flex-col gap-1">
              <div>
                <strong>Issuer:</strong> {cert.issuer}
              </div>
              <div>
                <strong>Issue Date:</strong>{" "}
                {cert.issueDate ? cert.issueDate.slice(0, 10) : "N/A"}
              </div>
              {cert.description && (
                <div>
                  <strong>Description:</strong> {cert.description}
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => handleEdit(cert)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(cert._id!)}
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