"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper/modules";
import TeamMemberCard from "./TeamCard/TeamMemberCard";
import { getImageUrl } from "../lib/utils/getImagehelper";

import "swiper/css";
import "swiper/css/pagination";
import "./TeamCard/TeamMemberCard.scss";

/* -------------------------------------------------------------------------- */
/*                              Configuration                                 */
/* -------------------------------------------------------------------------- */

// Team grouping configuration
const TEAM_GROUPS = {
  ceoDirector: {
    title: "CEO & Director",
    designations: [
      "CEO",
      "Director",
      "Managing Director",
      "Founder",
      "Chief Executive Officer",
      "Executive Director",
    ],
  },
  headOperationGeneralManager: {
    title: "Head of Operation & General Manager",
    designations: [
      "Head of Operation",
      "Operations Head",
      "General Manager",
      "GM",
      "Operations Manager",
    ],
  },
  chiefOfficers: {
    title: "Chief Officers",
    designations: [
      "Chief Officer",
      "Deputy Chief",
      "Chief Vigilance",
      "Chief Vigilance Officer",
    ],
  },
  adminArchitecture: {
    title: "Admin & Architect",
    designations: [
      "Admin",
      "Architecture",
      "Architect",
      "Administrative",
      "Administration",
      "Facilities",
      "Senior Architect",
      "Architectural Designer",
    ],
  },
  informationTechnologySales: {
    title: "Information Technology & Sales",
    designations: [
      "Software Engineer",
      "Information Technology",
      "Sales",
      "IT Head",
      "IT",
      "Sales Head",
      "IT Manager",
      "Sales Manager",
      "Business Development",
    ],
  },
  projectCoordinator: {
    title: "Project Coordinator",
    designations: [
      "Project Co-Ordinator",
      "Project Manager",
      "MGL Liaison Co-ordinator",
      "Project Lead",
      "Program Manager",
      "Coordinator",
    ],
  },
  liaisoningLicensing: {
    title: "Liaisoning and Licensing",
    designations: [
      "Liaison",
      "Licensing",
      "Compliance",
      "Regulatory",
      "Liaison Officer",
      "Licensing Manager",
    ],
  },
};

/**
 * Priority ordering for specific groups.
 * Members whose names match these entries (case-insensitive, partial match)
 * will be placed at the top of their group, in the order listed here.
 * All other members retain their original relative order.
 */
const GROUP_PRIORITY_NAMES = {
  adminArchitecture: ["arjun", "akshay"],
};

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

/**
 * Normalizes a string for case-insensitive comparison.
 */
const normalize = (value) => (value || "").toString().trim().toLowerCase();

/**
 * Checks whether a member's designation matches any of the given designations.
 */
const matchesDesignation = (memberDesignation, designations) => {
  const normalized = normalize(memberDesignation);
  if (!normalized) return false;
  return designations.some((d) => normalized.includes(normalize(d)));
};

/**
 * Sorts a group's members so that priority names appear first, in the
 * exact order specified. Non-priority members keep their original order.
 */
const applyPriorityOrdering = (members, priorityNames) => {
  if (!Array.isArray(members) || members.length === 0) return members;
  if (!Array.isArray(priorityNames) || priorityNames.length === 0) return members;

  return [...members].sort((a, b) => {
    const aName = normalize(a?.name);
    const bName = normalize(b?.name);

    const aIndex = priorityNames.findIndex((n) => aName.includes(normalize(n)));
    const bIndex = priorityNames.findIndex((n) => bName.includes(normalize(n)));

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });
};

/* -------------------------------------------------------------------------- */
/*                              Team Card (Mobile)                            */
/* -------------------------------------------------------------------------- */

function TeamCard({ member }) {
  const imageSrc = getImageUrl(member?.image);
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="w-full max-w-sm mx-auto group">
      <div className="relative w-full h-[400px] [perspective:1200px]">
        <div className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(.4,.1,.2,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          {/* Front */}
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden cursor-pointer [backface-visibility:hidden] shadow-sm bg-white">
            <div className="relative w-full h-[320px] bg-gray-200">
              <Image
                src={imageSrc}
                alt={member?.name || "Team member"}
                fill
                className="object-cover object-[50%_10%]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
                unoptimized={isDev}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-6 py-5">
              <h4 className="text-xl font-semibold text-white">
                {member?.name}
              </h4>
              {member?.designation && (
                <p className="text-sm text-white/80">{member.designation}</p>
              )}
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-white border border-gray-100 shadow-xl p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col">
            <div className="flex flex-col h-full items-center justify-center gap-4">
              <div className="relative w-32 h-32 shrink-0 rounded-full overflow-hidden bg-gray-200 border-4 border-orange-100">
                <Image
                  src={imageSrc}
                  alt={member?.name || "Team member"}
                  fill
                  className="object-cover object-[50%_10%]"
                  sizes="128px"
                  unoptimized={isDev}
                />
              </div>
              <div className="flex-1 min-w-0 space-y-3 text-center">
                <h4 className="text-xl font-semibold text-gray-900">
                  {member?.name}
                </h4>
                {member?.designation && (
                  <p className="text-sm text-gray-500">{member.designation}</p>
                )}
                <div className="w-12 h-px bg-orange-400 mx-auto my-2" />
                {member?.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center justify-center gap-2.5 w-full rounded-lg bg-gray-50 px-3 py-2 hover:bg-orange-50 transition"
                  >
                    <span className="text-orange-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-4 h-4"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {member.email}
                    </span>
                  </a>
                )}
                {member?.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center justify-center gap-2.5 w-full rounded-lg bg-gray-50 px-3 py-2 hover:bg-orange-50 transition"
                  >
                    <span className="text-orange-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 4h3l2 5-2.5 1.5a12 12 0 005 5L14 13l5 2v3a2 2 0 01-2 2C10.373 20 4 13.627 4 6a2 2 0 012-2z"
                        />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {member.phone}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Team Section                                  */
/* -------------------------------------------------------------------------- */

export default function TeamSection() {
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* --------------------------- Fetch Team Data ---------------------------- */
  useEffect(() => {
    const controller = new AbortController();

    const fetchTeam = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/employee`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch team: ${res.status}`);
        }

        const data = await res.json();

        if (data?.success && Array.isArray(data.data)) {
          setTeamData(data.data);
        } else {
          setTeamData([]);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch team:", err);
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();

    return () => controller.abort();
  }, []);

  /* --------------------------- Group Team Data ---------------------------- */
  const groupedTeam = useMemo(() => {
    if (!Array.isArray(teamData) || teamData.length === 0) return {};

    const grouped = {};

    // Initialize groups
    Object.keys(TEAM_GROUPS).forEach((key) => {
      grouped[key] = [];
    });

    // Assign members to groups
    teamData.forEach((member) => {
      const designation = member?.designation || "";
      let assigned = false;

      for (const [key, group] of Object.entries(TEAM_GROUPS)) {
        if (matchesDesignation(designation, group.designations)) {
          grouped[key].push(member);
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        if (!grouped.other) grouped.other = [];
        grouped.other.push(member);
      }
    });

    // Apply priority ordering per group
    Object.entries(GROUP_PRIORITY_NAMES).forEach(([groupKey, names]) => {
      if (grouped[groupKey]?.length) {
        grouped[groupKey] = applyPriorityOrdering(grouped[groupKey], names);
      }
    });

    // Remove empty groups
    Object.keys(grouped).forEach((key) => {
      if (!grouped[key] || grouped[key].length === 0) {
        delete grouped[key];
      }
    });

    return grouped;
  }, [teamData]);

  /* ---------------------------- Group Title ------------------------------- */
  const getGroupTitle = useCallback((groupKey) => {
    return TEAM_GROUPS[groupKey]?.title || groupKey;
  }, []);

  /* ------------------------------- Render --------------------------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-red-500 text-sm">Failed to load team members.</p>
      </div>
    );
  }

  if (Object.keys(groupedTeam).length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500 text-sm">No team members available.</p>
      </div>
    );
  }

  return (
    <section className="w-full px-4">
      <div className="container-fluid mx-auto">
        {/* Desktop / Tablet View */}
        <div className="hidden md:block">
          {Object.entries(groupedTeam).map(([groupKey, members]) => (
            <div key={groupKey} className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 py-2 flex items-center gap-3 section-title">
                {getGroupTitle(groupKey)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 py-5 justify-items-center gap-6">
                {members.map((member, index) => (
                  <TeamMemberCard
                    key={member?._id || member?.id || `${groupKey}-${index}`}
                    member={member}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="block md:hidden">
          {Object.entries(groupedTeam).map(([groupKey, members]) => (
            <div key={groupKey} className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">
                  {TEAM_GROUPS[groupKey]?.icon || "👥"}
                </span>
                {getGroupTitle(groupKey)}
              </h2>
              <Swiper
                modules={[Autoplay, A11y]}
                slidesPerView={1}
                spaceBetween={16}
                grabCursor
                touchRatio={1}
                touchAngle={45}
                resistance
                resistanceRatio={0.85}
                speed={500}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false,
                }}
                className="team-swiper"
              >
                {members.map((member, index) => (
                  <SwiperSlide
                    key={member?._id || member?.id || `${groupKey}-${index}`}
                  >
                    <div className="flex justify-center">
                      <TeamCard member={member} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}