import type { ReactNode } from "react";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export default function CaseStudyLayout({ children }: { children: ReactNode }) {
  return children;
}
