"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug, projects } from "@/data/projects";

export default function CaseStudyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4"
        style={{ background: "var(--color-bg)" }}>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-secondary)" }}
        >
          Project not found
        </h1>
        <Link
          href="/"
          className="text-sm font-light transition-colors duration-300"
          style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  const currentIndex = projects.findIndex((p) => p.id === slug);
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;

  return (
    <main className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden" style={{ background: "var(--color-bg)" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom right, var(--color-bg-alt), var(--color-surface))" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

        {/* Project info overlay */}
        <div className="absolute bottom-12 left-4 md:bottom-16 md:left-16 z-20 max-w-2xl">
          <h1
            className="text-2xl md:text-5xl lg:text-6xl font-semibold mb-2 tracking-tight"
            style={{ fontFamily: "var(--font-inter)", color: "var(--color-text)" }}
          >
            {project.brand}
          </h1>
          {project.brandCn && (
            <p
              className="text-sm md:text-lg font-light mb-1"
              style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-secondary)" }}
            >
              {project.brandCn}
            </p>
          )}
          <p
            className="text-sm md:text-xl font-light mb-4"
            style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-secondary)" }}
          >
            {project.title}
          </p>
          <p
            className="text-xs md:text-sm font-light"
            style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
          >
            Role: {project.role}
          </p>
        </div>

        {/* Back button */}
        <Link
          href="/"
          className="absolute top-6 left-4 md:top-8 md:left-8 z-30 text-xs md:text-sm font-light transition-colors duration-300"
          style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
        >
          ← Back
        </Link>
      </section>

      {/* Description Section */}
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-4xl mx-auto">
        <div className="mb-12">
          <h2
            className="text-xs tracking-[0.08em] mb-4 font-light"
            style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
          >
            ABOUT THIS PROJECT
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed font-light"
            style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-secondary)" }}
          >
            {project.description}
          </p>
        </div>

        {/* Role */}
        <div className="mb-16">
          <h2
            className="text-xs tracking-[0.08em] mb-3 font-light"
            style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
          >
            ROLE
          </h2>
          <p
            className="text-lg md:text-xl font-light"
            style={{ fontFamily: "var(--font-inter)", color: "var(--color-text)" }}
          >
            {project.role}
          </p>
        </div>

        {/* Gallery */}
        {project.images.gallery.length > 0 && (
          <div className="mb-16">
            <h2
              className="text-xs tracking-[0.08em] mb-6 font-light"
              style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
            >
              GALLERY
            </h2>
            <div className={`grid gap-6 ${
              project.id === "girl-egg-rocket"
                ? "grid-cols-1 max-w-4xl mx-auto"
                : "grid-cols-1 md:grid-cols-2 gap-4"
            }`}>
              {project.images.gallery.map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden ${
                    project.id === "girl-egg-rocket"
                      ? "aspect-[4/3]"
                      : "aspect-[16/9]"
                  }`}
                  style={{ background: "var(--color-surface)" }}
                >
                  <Image
                    src={img}
                    alt={`${project.title} detail ${i + 1}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes={project.id === "girl-egg-rocket" ? "(max-width: 896px) 100vw, 896px" : "(max-width: 768px) 100vw, 50vw"}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Watch Film Button */}
        {project.filmUrl && (
          <div className="text-center mb-16">
            <a
              href={project.filmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg transition-all duration-300 group font-light"
              style={{ fontFamily: "var(--font-inter)", color: "var(--color-text)" }}
            >
              <span
                className="pb-0.5 transition-all duration-300 group-hover:translate-x-1 inline-block"
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                {project.buttonLabel}
              </span>
            </a>
          </div>
        )}

        {/* Stills section */}
        {project.images.stills.length > 0 && (
          <div className="mb-16">
            <h2
              className="text-xs tracking-[0.08em] mb-6 font-light"
              style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
            >
              STILLS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.images.stills.map((still, i) => (
                <div
                  key={i}
                  className="relative aspect-[16/9] overflow-hidden"
                  style={{ background: "var(--color-surface)" }}
                >
                  <Image
                    src={still}
                    alt={`${project.title} still ${i + 1}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BTS section */}
        {project.images.bts.length > 0 && (
          <div className="mb-16">
            <h2
              className="text-xs tracking-[0.08em] mb-6 font-light"
              style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
            >
              BEHIND THE SCENES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.images.bts.map((bts, i) => (
                <div
                  key={i}
                  className="relative aspect-[16/9] overflow-hidden"
                  style={{ background: "var(--color-surface)" }}
                >
                  <Image
                    src={bts}
                    alt={`${project.title} BTS ${i + 1}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-16" style={{ borderTop: "1px solid var(--color-border)" }}>
          <div>
            {prevProject ? (
              <Link
                href={`/case-study/${prevProject.id}`}
                className="text-sm font-light transition-colors duration-300"
                style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
              >
                ← {prevProject.brand}
              </Link>
            ) : (
              <Link
                href="/"
                className="text-sm font-light transition-colors duration-300"
                style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
              >
                ← Back to Home
              </Link>
            )}
          </div>
          <div>
            {nextProject ? (
              <Link
                href={`/case-study/${nextProject.id}`}
                className="text-sm font-light transition-colors duration-300"
                style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
              >
                {nextProject.brand} →
              </Link>
            ) : (
              <Link
                href="/"
                className="text-sm font-light transition-colors duration-300"
                style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
              >
                Back to Home →
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
