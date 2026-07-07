"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import { AnimatePresence, motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";

import { teamData } from "@/lib/data/teamData";

function TeamCard({ member, onClick }) {
  return (
    <div onClick={onClick} className="w-full max-w-sm mx-auto cursor-pointer">
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
            className="fixed inset-0 z-[99999] flex items-center justify-center p-0 md:p-6"
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="employee-wrapper">
              <div
                className="employee-info relative mx-auto bg-white rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="employee-wrapper">
                  <div className="emp-img">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="emp-detail">
                    <div className="name-designation">
                      <h2>{member.name}</h2>
                      <p>{member.designation}</p>
                    </div>

                    <hr />

                    <div>
                      <h4>Jobe Profile</h4>
                      <p>{member.jobprofile}</p>
                    </div>

                    <div>
                      <h4>Education</h4>
                      <p>{member.education}</p>
                    </div>

                    <div>
                      <h4>Key Achievements</h4>
                        {member.keyachievments && (
                          <ul className="achievement-list"
                            dangerouslySetInnerHTML={{ __html: member.keyachievments }}
                          />
                        )}
                    </div>

                  </div>
                </div>

                <button className="close-btn" onClick={onClose}>
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <section className="w-full py-8">
      {/* Mobile */}
      <div className="block md:hidden">
        <Swiper
          modules={[Autoplay, Pagination, A11y]}
          slidesPerView={1}
          spaceBetween={16}
          pagination={{
            clickable: true,
          }}
          grabCursor={true}
          touchRatio={1}
          touchAngle={45}
          resistance={true}
          resistanceRatio={0.85}
          speed={500}
           breakpoints={{
            0: {
              autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              },
            },
            1024: {
              autoplay: false,
            },
          }}
          className="pb-10 team-swiper"
        >
          {teamData.map((member, index) => (
            <SwiperSlide key={index}>
              <TeamCard
                member={member}
                // onClick={() => setSelectedMember(member)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop */}
      <div className="team-card hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {teamData.map((member, index) => (
          <TeamCard
            key={index}
            member={member}
            // onClick={() => setSelectedMember(member)}
          />
        ))}
      </div>

      <TeamMemberModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
}
