import Project from "@/components/projects/Project";
import GridShape from "../../../components/common/GridShape";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";

export const metadata: Metadata = {
  title: "Project | Speck",
  description:
    "This is Project page for Testify",
};

export default function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  return (
    <Project projectId={projectId} />
  );
}
