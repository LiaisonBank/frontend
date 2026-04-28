"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import "swiper/css";
import { teamData } from "@/lib/data/teamData";


function TeamCard({ member }) {
  return (
    <div
      className="w-full max-w-sm mx-auto"
     
    >
      <div className="rounded-2xl text-center shadow-sm hover:shadow-md transition"  data-aos="fade-up"
      data-aos-duration="600"
      data-aos-delay="100">

        {/* Image Wrapper */}
        <div className="member-image relative w-full h-[320px] rounded-xl overflow-hidden bg-gray-200">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-[50%_10%]"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>

        {/* Content */}
        <div className="relative mt-4 pb-4">
          <h5 className="text-lg font-semibold text-gray-900">
            {member.name}
          </h5>
          <p className="text-sm text-center text-gray-500">
            {member.designation}
          </p>
        </div>

      </div>
    </div>
  );
}

export default function TeamSection() {
  return (
    <div className="w-full px-4 py-8">

      {/* Mobile Carousel */}
      <div className="md:hidden">
        <Swiper
          modules={[A11y]}
          spaceBetween={16}
          slidesPerView={1}
        >
          {teamData.map((member, index) => (
            <SwiperSlide key={index}>
              <TeamCard member={member} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop Grid */}
      <div className="team-card hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {teamData.map((member, index) => (
          <TeamCard key={index} member={member} />
        ))}
      </div>
    </div>
  );
}