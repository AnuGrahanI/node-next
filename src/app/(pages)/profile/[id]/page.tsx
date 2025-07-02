
"use client";
import React, { useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Paper } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { RootState } from "@/stores/store";
import { fetchUserProfile } from "@/stores/user/profiles/profiles-thunk";
import { cancelRequest, sendRequest } from "@/stores/people/peoples/peoples-thunk";
import { UnfriendAction } from "@/stores/people/friends/friends-thunk";
import { RequestAction } from "@/stores/people/requests/requests.thunk";

// Mock data for demo
const userProfile = {
  bio: "Co-founder at Startup Inc.",
  location: "San Francisco",
  cover: "https://picsum.photos/200/150",
};




export default function Page() {
 const dispatch = useAppDispatch();
 const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: user } = useAppSelector(
    (state: RootState) => state.users
  );

  const isMyProfile = user?.isMe;
const handleFollow =async (recipientId: string) => {
     await dispatch(sendRequest({recipientId})).unwrap();
     await dispatch(fetchUserProfile(id)).unwrap();

}
 const handleCancelRequest      = async (recipientId: string) => {
    await dispatch(cancelRequest({recipientId})).unwrap();
     await dispatch(fetchUserProfile(id)).unwrap();
  };

  const handleAccept  = async (requestorId: string) => {
        await dispatch(RequestAction({ requestorId, "action": "accept" })).unwrap(); // wait for success
        await dispatch(fetchUserProfile(id)).unwrap();
  };

  const handleDecline = async (requestorId: string) => {
        await dispatch(RequestAction({ requestorId, "action": "reject" })).unwrap(); // wait for success
         await dispatch(fetchUserProfile(id)).unwrap();
  };

  const handleUnfollow    = async (friendId: string) =>{
        await dispatch(UnfriendAction({friendId})).unwrap();
        await dispatch(fetchUserProfile(id)).unwrap();
  };
  const goToEditProfile   = () => router.push("/profile/update");

    const actionButtons = useMemo(() => {
    if (user?.isMe) {
      return (
        <Button variant="contained" size="small" onClick={goToEditProfile}>
          Edit Profile
        </Button>
      );
    }switch (user?.relationshipStatus) {
      case "following":
        return (
            <>
          <Button variant="outlined" size="small" onClick={() => handleUnfollow(id)}>
            Unfollow
          </Button>
          <Button variant="contained" size="small" onClick={() => router.push("/chat/"+id)}>
            Message
          </Button>
          </>
        );

      case "sentRequest":
        return (
        
          <Button variant="contained" size="small" onClick={() => handleCancelRequest(id)}>
            Cancel Request
          </Button>
        
        );

      case "acceptRequest":
        return (
          <Stack direction="row" spacing={1}>
            <Button variant="contained" size="small" onClick={() => handleAccept(id)}>
              Accept
            </Button>
            <Button variant="outlined"  size="small" onClick={() => handleDecline(id)}>
              Decline
            </Button>
          </Stack>
        );

      /** "follow" (default) */
      default:
        return (
          <Button variant="contained" size="small" onClick={() => handleFollow(id)} >
            Follow
          </Button>
        );
    }
  }, [user]);


  useEffect(() => {
    if (id) dispatch(fetchUserProfile(id));
  }, [id]);



  return (
    <>
      <Paper elevation={1} sx={{ p: 1, borderRadius: 3 }}>
      {/* Cover Image */}
      <Box
        sx={{
          position: "relative",
          height: 100,
          backgroundImage: `url(${userProfile.cover})`,
          backgroundSize: "cover",
          borderRadius: 2,
          mb: 3,
        }}
      >
        {/* Profile Avatar */}
        <Avatar
          src={user?.image}
          alt={user?.name}
          sx={{
            width: 120,
            height: 120,
            border: "4px solid white",
            position: "absolute",
            bottom: -60,
            left: { xs: "50%", sm: 4 },
            transform: { xs: "translateX(-50%)", sm: "none" },
          }}
        />
      </Box>

      {/* User Info */}
      <Box
        sx={{
          mt: 8,
          ml: { sm: 16 },
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          {user?.name}
        </Typography>
        <Typography color="text.secondary">{userProfile?.bio}</Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          {isMyProfile ? (
            <Button variant="contained" size="small" onClick={() => {router.push("/profile/update")}}>
              Edit Profile
            </Button>
          ) : (
            actionButtons
          )}
        </Stack>

        <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>{user?.posts?.length}</strong> Posts
          </Typography>
          <Typography variant="body2">
            <strong>{user?.friends?.length}</strong> friends
          </Typography>
        </Stack>
      </Box>
      </Paper>

</>  );
}

