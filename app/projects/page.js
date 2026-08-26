"use client";

import Link from "next/link";

import useBodyClass from "@/components/useBodyClass";
import MumbaiMap from "@/components/MumbaiMap/MumbaiMap";
import ProjectDetails from "@/components/ProjectDetail/ProjectDetails";

export default function ProjectsPage() {
  useBodyClass("completed");
  return (
    <>
      <div className="page-header">
        <div className="inner-header">
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1>Projects</h1>
                    <nav aria-label="breadcrumb" className="page-breadcrumb">
                      <ol className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item">
                          <Link href="/">
                            <i className="bi bi-house-door me-1" />
                            Home
                          </Link>
                        </li>

                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Projects
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="container py-4" aria-label="Projects section">
        <div className="auto-grid">
          <ProjectDetails />
          <MumbaiMap />

        </div>
      </section>
    </>
  );
}
