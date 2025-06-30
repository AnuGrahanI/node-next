"use client";

import { Grid, Button } from "@mui/material";
import UserCard from "../UserCard";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { useCallback, useEffect } from "react";
import { FetchRequests, RequestAction } from "@/stores/people/requests/requests.thunk";
import { RootState } from "@/stores/store";


export default function RequestsList() {
    const dispatch = useAppDispatch();
    const peoples = useAppSelector((state: RootState) => state.requests.peoples);
    
        useEffect(() => {
            dispatch(FetchRequests());
        }, []);
          const handleRequestAction = useCallback(async (requestorId: string, action: 'accept' | 'reject') => {
             try {
                    await dispatch(RequestAction({ requestorId, action })).unwrap(); // wait for success
                    await dispatch(FetchRequests());
                } catch (error) {
                    console.error('Action failed:', error);
                    // optional: show a snackbar or toast error here
                }
            }, []);

  return (
    <Grid container spacing={3}>
      {peoples.map((user) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user.id}>
          <UserCard
            user={user}
            actions={
              <>
                <Button size="small" variant="contained" color="success" onClick={() => handleRequestAction(user._id, 'accept')}>
                  Accept
                </Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleRequestAction(user._id, 'reject')}>
                  Reject
                </Button>
              </>
            }
          />
        </Grid>
      ))}
    </Grid>
  );
}
