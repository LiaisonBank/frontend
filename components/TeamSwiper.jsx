"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
// import { TeamMemberCard } from "./components/TeamCard/TeamMemberCard";
import TeamMemberCard from "./TeamCard/TeamMemberCard"; // ✅ Correct import


import "swiper/css";
import "swiper/css/pagination";

// import { teamData } from "@/lib/data/teamData";
function TeamCard({ member }) {
  // Build image URL with fallback
  return (
    <div className="w-full max-w-sm mx-auto group">
      <div className="relative w-full h-[400px] [perspective:1200px]">
        <div
          className="
            relative
            w-full
            h-full
            transition-transform
            duration-700
            ease-[cubic-bezier(.4,.1,.2,1)]
            [transform-style:preserve-3d]
            group-hover:[transform:rotateY(180deg)]
          "
        >
          {/* ==================== FRONT ==================== */}
          <div
            className="
              absolute
              inset-0
              w-full
              h-full
              rounded-2xl
              overflow-hidden
              cursor-pointer
              [backface-visibility:hidden]
              [-webkit-backface-visibility:hidden]
              shadow-sm
              bg-white
            "
          >
            {/* Image Container */}
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

            {/* Overlay with Name & Designation */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-6 py-5">
              <h4 className="text-xl font-semibold text-white member-name">
                {member.name}
              </h4>
              {member.designation && (
                <p className="text-sm text-white/80 member-designation">
                  {member.designation}
                </p>
              )}
            </div>
          </div>

          {/* ==================== BACK ==================== */}
          <div
            className="
              absolute
              inset-0
              w-full
              h-full
              rounded-2xl
              bg-white
              border
              border-gray-100
              shadow-xl
              p-6
              [backface-visibility:hidden]
              [-webkit-backface-visibility:hidden]
              [transform:rotateY(180deg)]
              flex
              flex-col
            "
          >
            {/* Inner Container with Flex Row Layout */}
            <div className="flex flex-col h-full items-center justify-center gap-4">
              {/* Left: Small Image */}
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

              {/* Right: Contact Details */}
              <div className="flex-1 min-w-0 space-y-3 text-center">
                {/* Name */}
                <h4 className="text-xl font-semibold text-gray-900 leading-tight">
                  {member.name}
                </h4>

                {/* Designation */}
                {member.designation && (
                  <p className="text-sm text-gray-500 leading-tight">
                    {member.designation}
                  </p>
                )}

                {/* Divider */}
                <div className="w-12 h-px bg-orange-400 mx-auto my-2" />

                {/* Email */}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2.5
                      w-full
                      rounded-lg
                      bg-gray-50
                      px-3
                      py-2
                      transition-all
                      duration-300
                      hover:bg-orange-50
                      hover:translate-x-1
                      group/link
                    "
                    aria-label={`Email ${member.name}`}
                  >
                    <span className="text-orange-500 shrink-0">
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
                    <span className="text-sm font-medium text-gray-700 truncate group-hover/link:text-orange-600 transition-colors">
                      {member.email}
                    </span>
                  </a>
                )}

                {/* Phone */}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2.5
                      w-full
                      rounded-lg
                      bg-gray-50
                      px-3
                      py-2
                      transition-all
                      duration-300
                      hover:bg-orange-50
                      hover:translate-x-1
                      group/link
                    "
                    aria-label={`Call ${member.name}`}
                  >
                    <span className="text-orange-500 shrink-0">
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
                    <span className="text-sm font-medium text-gray-700 group-hover/link:text-orange-600 transition-colors">
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

export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/employee`
        );

        const data = await res.json();

        if (data.success) {
          setTeamData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch team:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <section className="w-full py-8">
      {/* Mobile */}
      <div className="block md:hidden mobile-view">
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
          {teamData.length > 0 && (
              <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {teamData.map((member, index) => (
                    <TeamCard
                      key={index}
                      member={member}
                      // onClick={() => setSelectedMember(member)}
                    />
                  ))}
                </div>
              </div>
            )}
        </Swiper>
      </div>

      {/* Desktop */}
      <div className="team-card hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {teamData.map((member, index) => (
          <TeamMemberCard
            key={index}
            member={member}
          // onClick={() => setSelectedMember(member)}
          />
        ))}
      </div>
    </section>
  );
}
