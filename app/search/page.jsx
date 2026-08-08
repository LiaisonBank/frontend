"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import useBodyClass from "@/components/useBodyClass";

function SearchContent() {
  useBodyClass("search");

  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <>
      <div className="page-header">
        <div className="inner-header">
          <div className="page-title">
            <div className="container">
              <div className="row justify-content-center text-center">
                <div className="col-lg-10">
                  <div className="theme-breadcrumb-box">
                    <h1>Search</h1>

                    <nav aria-label="breadcrumb" className="page-breadcrumb">
                      <ol className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item">
                          <Link href="/">
                            <i className="bi bi-house-door me-1"></i>
                            Home
                          </Link>
                        </li>

                        <li className="breadcrumb-item active">
                          Search Result of {query || "All"}
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

      <section className="container py-5">
        <div className="row justify-content-center text-center">
          <div>
            Search result for: <strong>{query || "All"}</strong>
          </div>
        </div> 
      </section>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container py-5 text-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}