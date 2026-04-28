"use client";

import { useEffect } from "react";

const useBodyClass = (className) => {
  useEffect(() => {
    if (!className) return;

    document.body.classList.add(className);

    return () => {
      document.body.classList.remove(className);
    };
  }, [className]);
};

export default useBodyClass;
