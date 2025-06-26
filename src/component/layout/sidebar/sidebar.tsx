'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Box, List, ListItemButton, ListItemText, Toolbar } from '@mui/material';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', href: '/dashboard' },
  { text: 'CRUD', href: '/crud' },
];

export default function Sidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <Box sx={{ width: drawerWidth }} onClick={onItemClick}>
      <Toolbar />
      <List>
        {navItems.map(({ text, href }) => {
          const isActive = pathname.startsWith(href);

          return (
            <Link key={href} href={href} passHref legacyBehavior>
              <ListItemButton
                component="a"
                // selected={isActive}
                sx={{
                  bgcolor: isActive ? 'primary.dark' : undefined,
                  color: isActive ? 'primary.contrastText' : 'text.primary',
                  borderRadius: 1,
                  mx: 1,
                  mb: 1,
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'white',
                  },
                }}
              >
                <ListItemText primary={text} />
              </ListItemButton>
            </Link>
          );
        })}
      </List>
    </Box>
  );
}
