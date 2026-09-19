"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const FloatingChatbot = dynamic(
  () => import("./FloatingChatbot"),
  { ssr: false, loading: () => null }
);

export default function ClientChatbotWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Server renders null → next/dynamic is never invoked → no bailout
  if (!mounted) return null;

  return <FloatingChatbot />;
}