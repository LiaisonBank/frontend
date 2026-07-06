"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import { AnimatePresence, motion } from "framer-motion";

import "swiper/css";

import { teamData } from "@/lib/data/teamData";

function TeamCard({ member, onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-full max-w-sm mx-auto cursor-pointer"
    >
      <div className="rounded-2xl text-center shadow-sm hover:shadow-xl transition-all duration-300">

        <div className="relative w-full h-[320px] rounded-xl overflow-hidden bg-gray-200">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-[50%_10%]"
            sizes="(max-width:300px)100vw,300px"
          />
        </div>

        <div className="mt-4 pb-4">
          <h5 className="text-lg font-semibold text-gray-900 member-name">
            {member.name}
          </h5>

          <p className="text-sm text-center text-gray-500 member-designation">
            {member.designation}
          </p>
        </div>

      </div>
    </div>
  );
}

function TeamMemberModal({ member, isOpen, onClose }) {
  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-[99998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-6"
             onClick={onClose} // Click anywhere outside closes
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl employee-info"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full emp-img">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="image"
                />
              </div>

              <div className="p-6"> 
                <div className="name-designation">
                  <h3 className="text-lg font-semibold text-gray-900 member-name">{member.name}</h3>
                  <p className="text-sm text-center text-gray-500 member-designation">{member.designation}</p>
                </div>
                <hr className="my-4"></hr>
                <div className="mt-4">
                  <h4 className="text-md font-semibold text-gray-900">Education</h4>
                  <p className="text-sm text-gray-500">{member.education}</p>
                </div>

                <div className="mt-4">
                  <h4 className="text-md font-semibold text-gray-900">Experience</h4>
                  <p className="text-sm text-gray-500">{member.experience}</p>
                </div>

              </div>

              <button
                onClick={onClose}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white shadow-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}


export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="w-full px-4 py-8">

      {/* Mobile */}
      <div className="md:hidden">
        <Swiper
          modules={[A11y]}
          spaceBetween={16}
          slidesPerView={1}
        >
          {teamData.map((member, index) => (
            <SwiperSlide key={index}>
              <TeamCard
                member={member}
                onClick={() => setSelectedMember(member)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop */}
      <div className="team-card  hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {teamData.map((member, index) => (
          <TeamCard
            key={index}
            member={member}
            onClick={() => setSelectedMember(member)}
          />
        ))}
      </div>

      <TeamMemberModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}