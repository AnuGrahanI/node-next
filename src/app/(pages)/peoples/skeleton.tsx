import { Avatar, Box, Grid, Skeleton } from "@mui/material";

export const PersonCardSkeleton = () => (
  <Grid size ={{ xs: 12, sm: 6, md: 4}} >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 1.5,
        px: { xs: 1, sm: 2 },
      }}
    >
      <Skeleton variant="circular">
        <Avatar />
      </Skeleton>

      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="40%" height={16} />
      </Box>

      <Skeleton variant="circular" width={32} height={32} />
    </Box>
  </Grid>
);
