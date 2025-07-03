'use client';

import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/stores/hooks';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { id } = useAppSelector((state) => state.user.data);

  const [value, setValue] = useState(pathname);

  useEffect(() => {
    setValue(pathname);
  }, [pathname]);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event: React.SyntheticEvent, newValue: string) => {
          setValue(newValue);
          router.push(newValue);
        }}
      >
        <BottomNavigationAction  value="/home" icon={<HomeFilledIcon />} />
        <BottomNavigationAction  value="/peoples" icon={<SearchIcon />} />
        <BottomNavigationAction  value="/chat" icon={<ChatBubbleOutlineIcon />} />
        <BottomNavigationAction  value={`/profile/${id}`} icon={<PersonOutlineRoundedIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
