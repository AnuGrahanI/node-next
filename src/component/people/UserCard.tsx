"use client";

import {
  Card,
  CardHeader,
  CardActions,
  Avatar,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  actions: React.ReactNode;
  _id: string;
  image?: string;
}

interface UserCardProps {
  user: User;
  actions: React.ReactNode;
}

export default function UserCard({ user, actions }: UserCardProps) {
  const router = useRouter();
  return (
    <Card elevation={3} >
      <CardHeader
        onClick={() => {router.push("/profile/"+user._id)}} sx={{cursor:"pointer"}}
        avatar={<Avatar>{user.image}</Avatar>}
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
