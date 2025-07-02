// components/PostScopeDropdown.tsx
"use client";

import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { useState } from "react";

type Scope = "all" | "my" | "friends";

interface Props {
  scope: Scope;
  onChange: (s: Scope) => void;
}

const LABEL: Record<Scope, string> = {
  all: "All Posts",
  my: "My Posts",
  friends: "Friends",
};

export default function PostScopeDropdown({ scope, onChange }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = (value?: Scope) => {
    if (value && value !== scope) onChange(value);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="Filter posts"
        aria-controls={open ? "post-scope-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ mr: 1 }}
      >
        <SortIcon />
      </IconButton>

      {/* tiny label next to the icon */}
      <Typography variant="body2" sx={{ mr: "auto", fontWeight: 500 }}>
        {LABEL[scope]}
      </Typography>

      <Menu
        id="post-scope-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        MenuListProps={{ dense: true }}
      >
        <MenuItem onClick={() => handleClose("all")}>All Posts</MenuItem>
        <MenuItem onClick={() => handleClose("my")}>My Posts</MenuItem>
        <MenuItem onClick={() => handleClose("friends")}>Friends</MenuItem>
      </Menu>
    </>
  );
}
