// ScrollTopFab.tsx
"use client";

import { Box, Fab, Zoom, useScrollTrigger } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  onActivate: () => void;
}

export default function ScrollTopFab({ onActivate }: Props) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Zoom in={trigger}>
      <Box
        role="presentation"
        sx={{
          position: "fixed",
          bottom: { xs: 56, lg: 16},
          right: 16,
          zIndex: (theme) => theme.zIndex.speedDial, // above drawers
        }}
        onClick={onActivate}
      >
        <Fab color="primary" size="medium">
          <AddIcon />
        </Fab>
      </Box>
    </Zoom>
  );
}
