'use client';

import React, { forwardRef, memo, useId } from 'react';

const ProjectMarker = memo(
  forwardRef(
    (
      {
        width = 48,
        height = 72,
        className = '',
        topColor = '#ff6a00',
        bottomColor = '#ff9d2f',
        ...props
      },
      ref
    ) => {
      const gradientId = useId();

      return (
        <svg
          ref={ref}
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 384"
          width={width}
          height={height}
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
          {...props}
        >
          <defs>
            <linearGradient
              id={gradientId}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={topColor} />
              <stop offset="100%" stopColor={bottomColor} />
            </linearGradient>
          </defs>

          <path
            d="M128 0
               C57 0 0 57 0 128
               C0 219 128 384 128 384
               C128 384 256 219 256 128
               C256 57 199 0 128 0Z"
            fill={`url(#${gradientId})`}
          />

          <circle
            cx="128"
            cy="128"
            r="42"
            fill="#fff"
          />
        </svg>
      );
    }
  )
);

ProjectMarker.displayName = 'ProjectMarker';

export default ProjectMarker;