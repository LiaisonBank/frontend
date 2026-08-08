"use client";

import dynamic from "next/dynamic";

const MumbaiMapClient = dynamic(
  () => import("./MumbaiMapClient"),
  {
    ssr: false,

    loading: () => (
      <div
        style={{
          width: "100%",
          aspectRatio: "531 / 801",
          minHeight: 520,
          background: "#d7e9ed",
        }}
        aria-label="Loading Mumbai map"
      />
    ),
  }
);

export default function MumbaiMap() {
  return <MumbaiMapClient />;
}