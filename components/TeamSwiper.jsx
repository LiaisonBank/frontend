"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper/modules";
import TeamMemberCard from "./TeamCard/TeamMemberCard";

import "swiper/css";
import "swiper/css/pagination";
import "./TeamCard/TeamMemberCard.scss";


// Team grouping configuration - EXACTLY as specified
const TEAM_GROUPS = {
  ceoDirector: {
    title: "CEO & Director",
    designations: ["CEO", "Director", "Managing Director", "Founder", "Chief Executive Officer", "Executive Director"]
  },
  headOperationGeneralManager: {
    title: "Head of Operation & General Manager",
    designations: ["Head of Operation", "Operations Head", "General Manager", "GM", "Operations Manager"]
  },
  chiefOfficers: {
    title: "Chief Officers",
    designations: ["Chief Officer", "Deputy Chief", "Chief Vigilance", "Chief Vigilance Officer", ]
  },
   adminArchitecture: {
    title: "Admin & Architecture",
    designations: ["Admin", "Architecture", "Architect", "Administrative", "Administration", "Facilities", "Senior Architect", "Architectural Designer"]
  },
  informationTechnologySales: {
    title: "Information Technology & Sales",
    designations: ["IT", "Information Technology", "Sales", "IT Head", "Sales Head", "IT Manager", "Sales Manager", "Business Development"]
  },
    projectCoordinator: {
    title: "Project Coordinator",
    designations: ["Project Coordinator", "Project Manager", "MGL Liaison Coordinator", "Project Lead", "Program Manager", "Coordinator"]
  },
  liaisoningLicensing: {
    title: "Liaisoning and Licensing",
    designations: ["Liaison", "Licensing", "Compliance", "Regulatory", "Liaison Officer", "Licensing Manager"]
  },
 

};

function TeamCard({ member }) {
  return (
    <div className="w-full max-w-sm mx-auto group">
      <div className="relative w-full h-[400px] [perspective:1200px]">
        <div className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(.4,.1,.2,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          {/* Front */}
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden cursor-pointer [backface-visibility:hidden] shadow-sm bg-white">
            <div className="relative w-full h-[320px] bg-gray-200">
              <Image
                src={`${process.env.NEXT_PUBLIC_LOCAL_API_URL}${member.image}`}
                alt={member.name}
                fill
                className="object-cover object-[50%_10%]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
                unoptimized={process.env.NODE_ENV === 'development'}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-6 py-5">
              <h4 className="text-xl font-semibold text-white">{member.name}</h4>
              {member.designation && (
                <p className="text-sm text-white/80">{member.designation}</p>
              )}
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-white border border-gray-100 shadow-xl p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col">
            <div className="flex flex-col h-full items-center justify-center gap-4">
              <div className="relative w-32 h-32 shrink-0 rounded-full overflow-hidden bg-gray-200 border-4 border-orange-100">
                <Image
                  src={`${process.env.NEXT_PUBLIC_LOCAL_API_URL}${member.image}`}
                  alt={member.name}
                  fill
                  className="object-cover object-[50%_10%]"
                  sizes="128px"
                  unoptimized={process.env.NODE_ENV === 'development'}
                />
              </div>
              <div className="flex-1 min-w-0 space-y-3 text-center">
                <h4 className="text-xl font-semibold text-gray-900">{member.name}</h4>
                {member.designation && (
                  <p className="text-sm text-gray-500">{member.designation}</p>
                )}
                <div className="w-12 h-px bg-orange-400 mx-auto my-2" />
                {member.email && (
                  <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-2.5 w-full rounded-lg bg-gray-50 px-3 py-2 hover:bg-orange-50 transition">
                    <span className="text-orange-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-700">{member.email}</span>
                  </a>
                )}
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="flex items-center justify-center gap-2.5 w-full rounded-lg bg-gray-50 px-3 py-2 hover:bg-orange-50 transition">
                    <span className="text-orange-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h3l2 5-2.5 1.5a12 12 0 005 5L14 13l5 2v3a2 2 0 01-2 2C10.373 20 4 13.627 4 6a2 2 0 012-2z" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-700">{member.phone}</span>
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

export default function TeamSection() {
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedTeam, setGroupedTeam] = useState({});

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/employee`);
        const data = await res.json();
        if (data.success) {
          setTeamData(data.data);
          groupTeamMembers(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch team:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const groupTeamMembers = (members) => {
    const grouped = {};
    
    // Initialize groups
    Object.keys(TEAM_GROUPS).forEach(key => {
      grouped[key] = [];
    });

    members.forEach(member => {
      const designation = member.designation?.toLowerCase() || "";
      let assigned = false;

      // Check each group
      for (const [key, group] of Object.entries(TEAM_GROUPS)) {
        if (group.designations.some(d => designation.includes(d.toLowerCase()))) {
          grouped[key].push(member);
          assigned = true;
          break;
        }
      }

      // If not assigned to any group, add to "Other" category
      if (!assigned) {
        if (!grouped.other) grouped.other = [];
        grouped.other.push(member);
      }
    });

    // Remove empty groups
    Object.keys(grouped).forEach(key => {
      if (grouped[key].length === 0) {
        delete grouped[key];
      }
    });

    setGroupedTeam(grouped);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <section className="w-full px-4">
      <div className="container-fluid mx-auto">
        {/* Desktop/Tablet View */}
        <div className="hidden md:block">
          {Object.entries(groupedTeam).map(([groupKey, members]) => (
            <div key={groupKey} className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 py-2 flex items-center gap-3 section-title">
                {TEAM_GROUPS[groupKey]?.title || groupKey}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 py-5  justify-items-center gap-6">
                {members.map((member, index) => (
                  <TeamMemberCard key={index} member={member} />
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
                <span className="text-2xl">{TEAM_GROUPS[groupKey]?.icon || "👥"}</span>
                {TEAM_GROUPS[groupKey]?.title || groupKey}
              </h2>
              <Swiper
                modules={[Autoplay, A11y]}
                slidesPerView={1}
                spaceBetween={16}
                grabCursor={true}
                touchRatio={1}
                touchAngle={45}
                resistance={true}
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
                  <SwiperSlide key={index}>
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