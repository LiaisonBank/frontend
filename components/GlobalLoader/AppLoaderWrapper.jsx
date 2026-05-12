"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/GlobalLoader/index";

export default function AppLoaderWrapper({ children }) {
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // minimum 1 sec

    return () => clearTimeout(timer);
  }, [pathname]);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
}