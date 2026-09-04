// FullscreenButton.jsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { styled } from "@mui/material/styles";

// Styled component for better performance and customization
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  width: "40px",
  height: "40px",
  padding: "8px",
  position: "relative",
  zIndex: 1,
  
  "&:hover": {
    backgroundColor: "#ffffff",
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
  },
  
  "&:active": {
    transform: "scale(0.95)",
  },
  
  "&:focus-visible": {
    outline: "2px solid #1976d2",
    outlineOffset: "2px",
  },
  
  "& .MuiSvgIcon-root": {
    fontSize: "24px",
    color: "#333",
    transition: "color 0.2s ease",
  },
  
  "&:hover .MuiSvgIcon-root": {
    color: "#1976d2",
  },
  
  // Reduced motion preference
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    "&:hover": {
      transform: "none",
    },
    "&:active": {
      transform: "none",
    },
  },
  
  // Mobile responsive
  "@media (max-width: 768px)": {
    width: "36px",
    height: "36px",
    padding: "6px",
    
    "& .MuiSvgIcon-root": {
      fontSize: "20px",
    },
  },
}));

// Fullscreen button component
const FullscreenButton = React.memo(() => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);

  // Check fullscreen API support
  useEffect(() => {
    const isFullscreenSupported = 
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled;
    
    setIsSupported(!!isFullscreenSupported);
  }, []);

  // Handle fullscreen change events
  useEffect(() => {
    if (!isSupported) return;

    const handleFullscreenChange = () => {
      const isFullscreenNow = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isFullscreenNow);
    };

    // Add event listeners for all browsers
    const events = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleFullscreenChange);
    });

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleFullscreenChange);
      });
    };
  }, [isSupported]);

  // Get container element
  const getContainer = useCallback(() => {
    // Try multiple selectors for flexibility
    const selectors = [
      ".mumbai-map-container",
      ".map-container",
      "[data-map-container]",
      ".gm-style",
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        // Find the actual map container parent
        const parent = element.closest(".mumbai-map-container") || 
                      element.closest(".map-container") ||
                      element.parentElement;
        return parent || element;
      }
    }

    // Fallback to body if no container found
    return document.body;
  }, []);

  // Handle fullscreen toggle
  const handleFullscreen = useCallback(async () => {
    if (!isSupported) {
      console.warn("Fullscreen API is not supported in this browser");
      return;
    }

    try {
      const container = getContainer();
      
      if (!container) {
        console.error("Could not find map container for fullscreen");
        return;
      }

      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      if (!isCurrentlyFullscreen) {
        // Request fullscreen with cross-browser support
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          await container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
          await container.msRequestFullscreen();
        } else {
          throw new Error("Fullscreen API not supported");
        }
      } else {
        // Exit fullscreen with cross-browser support
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        } else {
          throw new Error("Fullscreen API not supported");
        }
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
      // Fallback: try using the entire page
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (fallbackError) {
        console.error("Fallback fullscreen failed:", fallbackError);
      }
    }
  }, [isSupported, getContainer]);

  // Keyboard shortcut support (F key for fullscreen)
  useEffect(() => {
    if (!isSupported) return;

    const handleKeyDown = (event) => {
      // Check if F key pressed and not in input/textarea
      if (event.key === "f" || event.key === "F") {
        const target = event.target;
        if (target.tagName !== "INPUT" && 
            target.tagName !== "TEXTAREA" && 
            target.tagName !== "SELECT") {
          event.preventDefault();
          handleFullscreen();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleFullscreen, isSupported]);

  // Don't render if not supported
  if (!isSupported) {
    return null;
  }

  // Tooltip text based on state
  const tooltipTitle = isFullscreen 
    ? "Exit fullscreen (F)" 
    : "Fullscreen (F)";

  const ariaLabel = isFullscreen 
    ? "Exit fullscreen mode" 
    : "Enter fullscreen mode";

  return (
    <Tooltip 
      title={tooltipTitle} 
      placement="left"
      arrow
      enterDelay={500}
      leaveDelay={200}
    >
      <StyledIconButton
        ref={buttonRef}
        onClick={handleFullscreen}
        aria-label={ariaLabel}
        aria-expanded={isFullscreen}
        aria-controls="map-container"
        data-testid="fullscreen-button"
        className="custom-fullscreen-button"
      >
        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </StyledIconButton>
    </Tooltip>
  );
});

FullscreenButton.displayName = "FullscreenButton";

export default FullscreenButton;