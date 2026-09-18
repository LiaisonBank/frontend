"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper/modules";
import TeamMemberCard from "./TeamCard/TeamMemberCard";

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
        {Object.entries(groupedTeam).map(([groupKey, members]) => (
          <div key={groupKey} className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 py-2 flex items-center gap-3 section-title">
              {getGroupTitle(groupKey)}
            </h3>

            {/* Desktop / Tablet View - Grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 py-5 justify-items-center gap-6">
              {members.map((member, index) => (
                <TeamMemberCard
                  key={member?._id || member?.id || `${groupKey}-${index}`}
                  member={member}
                />
              ))}
            </div>

            {/* Mobile View - Department wise Slider (same card as desktop) */}
            <div className="block md:hidden">
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
                  pauseOnMouseEnter: true,
                }}
                className="team-swiper"
              >
                {members.map((member, index) => (
                  <SwiperSlide
                    key={member?._id || member?.id || `${groupKey}-${index}`}
                  >
                    <div className="flex justify-center">
                      <TeamMemberCard member={member} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}