import React from 'react'; // or just import { useState } if needed

import { Button } from "@mui/material";

// In ProjectDetails component
export default function ProjectDetails({ onOpenFullScreen }) {
  return (
    <div>
      {/* Your existing content */}
      <Button variant="contained" onClick={onOpenFullScreen}>
        View Full Screen
      </Button>
    </div>
  );
}