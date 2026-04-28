'use client';

export default function HeroWave({ className = '' }) {
  return (
    <svg
      viewBox="0 0 800 550"
      preserveAspectRatio="none" // IMPORTANT
      className={`w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="flowGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#262626" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      <g>
        {/* MAIN SHAPE */}
        <path fill="url(#flowGradient)">
          <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values={`
              M50 250C50 80 150 20 300 20H600C700 20 750 80 750 140C750 200 700 240 650 240H500C450 240 430 280 460 310C500 350 600 330 700 330C750 330 780 370 780 420C780 470 730 500 600 500H300C150 500 50 420 50 250Z;
              M60 260C60 100 170 40 320 30H620C710 30 760 90 760 150C760 210 710 250 660 250H510C460 250 440 290 470 320C510 360 610 340 710 340C760 340 790 380 790 430C790 480 740 510 610 510H320C170 510 60 420 60 260Z;
              M50 250C50 80 150 20 300 20H600C700 20 750 80 750 140C750 200 700 240 650 240H500C450 240 430 280 460 310C500 350 600 330 700 330C750 330 780 370 780 420C780 470 730 500 600 500H300C150 500 50 420 50 250Z
            `}
          />
        </path>

        {/* FLOW LINES */}
        <rect x="500" y="340" width="200" height="30" rx="15" fill="url(#flowGradient)">
          <animate attributeName="x" values="500;520;500" dur="4s" repeatCount="indefinite" />
        </rect>

        <rect x="480" y="400" width="260" height="30" rx="15" fill="url(#flowGradient)" opacity="0.7">
          <animate attributeName="x" values="480;510;480" dur="5s" repeatCount="indefinite" />
        </rect>

        <rect x="460" y="460" width="300" height="30" rx="15" fill="url(#flowGradient)" opacity="0.5">
          <animate attributeName="x" values="460;490;460" dur="6s" repeatCount="indefinite" />
        </rect>

        {/* DOTS */}
        <circle cx="620" cy="120" r="12" fill="url(#flowGradient)">
          <animate attributeName="cy" values="120;100;120" dur="3s" repeatCount="indefinite" />
        </circle>

        <circle cx="760" cy="260" r="8" fill="url(#flowGradient)" opacity="0.6">
          <animate attributeName="cy" values="260;280;260" dur="4s" repeatCount="indefinite" />
        </circle>

        <circle cx="650" cy="400" r="14" fill="url(#flowGradient)" opacity="0.4">
          <animate attributeName="cy" values="400;380;400" dur="5s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}