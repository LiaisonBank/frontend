"use client";

import { useLayoutEffect } from "react";

const useBodyClass = (className) => {
  useLayoutEffect(() => {
    if (!className) return;

    document.body.classList.add(className);

    return () => {
      document.body.classList.remove(className);
    };
  }, [className]);
};

export default useBodyClass;