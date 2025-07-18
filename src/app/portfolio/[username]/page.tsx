"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Timeline } from "@/components/ui/timeline";
import { AuroraText } from "@/components/magicui/aurora-text";

export default function PortfolioPage() {
  const { username } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post("/api/portfolio", { username });
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  const downloadPDF = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current);
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save(`${username}_portfolio.pdf`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return <p className="text-center text-red-400">Portfolio not found</p>;

  const { profile, skills, experience, education, projects, certificates } = data;

  return (
    <div
      ref={ref}
      className="bg-black text-white h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
    >
      <div className="min-h-screen text-center px-32 py-24 space-y-10 snap-start">
        <section>
          <p className="text-6xl font-bold my-10">{profile.fullName}</p>
          <p className="text-2xl text-gray-400 my-10">{profile.title}</p>
          <p className="text-xl my-10 mx-auto max-w-5xl">{profile.bio}</p>
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            {profile.github && (
              <Button variant="ghost" onClick={() => window.open(profile.github, "_blank")}>
                GitHub
              </Button>
            )}
            {profile.linkedin && (
              <Button variant="ghost" onClick={() => window.open(profile.linkedin, "_blank")}>
                LinkedIn
              </Button>
            )}
            {profile.website && (
              <Button variant="ghost" onClick={() => window.open(profile.website, "_blank")}>
                Website
              </Button>
            )}
          </div>
        </section>
      </div>

      <div className="min-h-screen px-32 py-24 text-center snap-start">
        <section>
          <AuroraText className="text-5xl font-bold mb-25">Skills</AuroraText>
          <div className="flex flex-wrap gap-4 justify-center">
            {skills.map((s: any) => (
              <Badge key={s._id} className="text-lg font-semibold px-4 py-2">
                {s.skill}
              </Badge>
            ))}
          </div>
        </section>
      </div>

      <div className="min-h-screen px-32 py-24 snap-start">
        <section className="text-center">
            <AuroraText className="text-5xl font-bold mb-25 text-center">
            Experience
            </AuroraText>
            <div className="text-left">
            <Timeline
                data={experience.map((e: any) => ({
                title: e.company,
                content: (
                    <div className="space-y-1">
                    <p className="text-xl font-semibold text-white">{e.position}</p>
                    <p className="text-sm text-gray-400">
                        {new Date(e.startDate).toLocaleDateString()} –{" "}
                        {e.endDate ? new Date(e.endDate).toLocaleDateString() : "Present"}
                    </p>
                    <p className="mt-2">{e.description}</p>
                    </div>
                ),
                }))}
            />
            </div>
        </section>
    </div>


      <div className="min-h-screen px-32 py-24 snap-start">
        <section className="text-center">
            <AuroraText className="text-5xl font-bold mb-25 text-center">
            Education
            </AuroraText>
            <div className="text-left">
            <Timeline
                data={education.map((ed: any) => ({
                title: ed.degree,
                content: (
                    <div className="space-y-1">
                    <p className="text-xl font-semibold text-white">{ed.fieldOfStudy}</p>
                    <p className="text-gray-400">{ed.institution}</p>
                    <p className="text-sm text-gray-400">
                        {new Date(ed.startDate).toLocaleDateString()} –{" "}
                        {ed.endDate ? new Date(ed.endDate).toLocaleDateString() : "Present"}
                    </p>
                    </div>
                ),
                }))}
            />
            </div>
        </section>
    </div>


      <div className="min-h-screen px-32 py-24 snap-start text-center">
        <section>
          <AuroraText className="text-5xl font-bold mb-25">Projects</AuroraText>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((p: any) => (
              <Card key={p._id} className="bg-[#111] border-gray-800 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{p.project}</CardTitle>
                </CardHeader>
                <CardContent className="text-lg">
                  <p>{p.description}</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {p.technologies.map((t: string, idx: number) => (
                      <Badge key={idx} className="text-base font-semibold px-3 py-1">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <div className="min-h-screen px-32 py-24 snap-start text-center">
        <section>
          <AuroraText className="text-5xl font-bold mb-25">Certificates</AuroraText>
          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((c: any) => (
              <Card key={c._id} className="bg-[#111] border-gray-800 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{c.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-lg">
                  <p>{c.issuer}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(c.issueDate).toLocaleDateString()}
                  </p>
                  {c.description && <p className="mt-4">{c.description}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}