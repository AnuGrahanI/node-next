// components/PostSkeleton.tsx
"use client";

import { Box, Card, Skeleton, Stack } from "@mui/material";

export default function PostSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} sx={{ mb: 2, borderRadius: 3, p: 2 }}>
          {/* Header: Avatar and username */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="30%" height={18} />
              <Skeleton width="20%" height={14} />
            </Box>
          </Stack>

          {/* Text content */}
          <Skeleton sx={{ mt: 2 }} height={20} width="100%" />

          {/* Image block */}
          <Skeleton height={200} variant="rectangular" sx={{ borderRadius: 2, mt: 2 }} />

          {/* Action icons */}
          <Stack direction="row" spacing={2} mt={2}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </Stack>
        </Card>
      ))}
    </>
  );
}
