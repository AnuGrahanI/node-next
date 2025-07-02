"use client";

import { Grid, Button } from "@mui/material";
import UserCard from "../UserCard";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { RootState } from "@/stores/store";
import { useCallback, useEffect } from "react";
import { FetchFriends, UnfriendAction } from "@/stores/people/friends/friends-thunk";
import { useRouter } from "next/navigation";


export default function FriendsList() {
    const router = useRouter();
    const peoples = useAppSelector((state: RootState) => state.friends.peoples);
    const dispatch = useAppDispatch();
        
            useEffect(() => {
                dispatch(FetchFriends());
            }, []);

              const handleUnfriend = useCallback(async (friendId: string) => {
    try {
      await dispatch(UnfriendAction({friendId})).unwrap();
      await dispatch(FetchFriends());
      
      // Optional: Show success notification
    } catch (err) {
      console.error('Failed to unfriend:', err);
      // Optional: Show error notification
    }
  }, []);
  return (
    <Grid container spacing={3}>
      {peoples.map((user) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}  key={user.id}>
          <UserCard
            user={user}
            actions={
              <>
                <Button size="small" variant="contained" color="secondary" onClick={() => router.push("/chat/"+user._id)}>
                  Message
                </Button>
                <Button size="small" variant="outlined" color="warning" onClick={() => handleUnfriend(user._id)}>
                  Unfriend
                </Button>
              </>
            }
          />
        </Grid>
      ))}
    </Grid>
  );
}
