"use client";

import {
  Card,
  CardHeader,
  CardActions,
  Avatar,
  Stack,
} from "@mui/material";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  actions: React.ReactNode;
  _id: string;
}

interface UserCardProps {
  user: User;
  actions: React.ReactNode;
}

export default function UserCard({ user, actions }: UserCardProps) {
  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<Avatar>{user.avatar}</Avatar>}
        title={user.name}
        subheader={user.email}
      />
      <CardActions>
        <Stack direction="row" spacing={1}>
          {actions}
        </Stack>
      </CardActions>
    </Card>
  );
}
