"use client";

import { useEffect, useRef } from "react";

const Cursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e) => {
      cursor.style.top = `${e.pageY - 10}px`;
      cursor.style.left = `${e.pageX - 10}px`;
    };

    const clickCursor = () => {
      cursor.classList.add("expand");
      setTimeout(() => {
        cursor.classList.remove("expand");
      }, 500);
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("click", clickCursor);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("click", clickCursor);
    };
  }, []);

  return <div className="cursor" ref={cursorRef}></div>;
};

export default Cursor;