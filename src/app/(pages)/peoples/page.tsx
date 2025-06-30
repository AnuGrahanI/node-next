"use client";

import { useState } from "react";
import { Container, Tabs, Tab, Box } from "@mui/material";

import TabPanel from "@/component/people/TabPanel";
import PeopleList from "@/component/people/peoples/PeopleList";
import RequestsList from "@/component/people/requests/RequestsList";
import FriendsList from "@/component/people/friends/friendsList";


export default function PeopleTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={value} onChange={handleChange} variant="fullWidth">
          <Tab label="People" />
          <Tab label="Requests" />
          <Tab label="Friends" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <PeopleList />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RequestsList />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <FriendsList />
      </TabPanel>
    </Container>
  );
}
