"use client";

import { Grid, Button } from "@mui/material";
import UserCard from "../UserCard";
import { User } from "../UserCard";
import {  useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { FetchPeoples, sendRequest } from "@/stores/people/peoples/peoples-thunk";




// export default function PeopleList({ users }: { users: User[] }) {
export default function PeopleList() {
    const peoples = useAppSelector((state: any) => state.peoples.peoples);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(FetchPeoples());
    }, []);
    const handleSendRequest = useCallback(async (recipientId: string) => {
        try{
        await dispatch(sendRequest({recipientId})).unwrap();
         await dispatch(FetchPeoples());
        }
        catch (error) {
            console.error('Action failed:', error);
        }
    }, []);

  return (
    <Grid container spacing={3}>
      {peoples?.map((user:User) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}  key={user.id}>
          <UserCard
            user={user}
            actions={
              <Button size="small" variant="contained" color="primary"
               onClick={() => handleSendRequest(user._id)
                
               }
>
                Add Friend
              </Button>
            }
          />
        </Grid>
      ))}
    </Grid>
  );
}
