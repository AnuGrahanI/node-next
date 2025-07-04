'use client';
import {
  Box,
  Grid,
  Avatar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CheckIcon from '@mui/icons-material/Check';
import MessageIcon from '@mui/icons-material/Message';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { fetchPeople } from '@/stores/people/people-thunk';
import { RootState } from '@/stores/store';
import { useRouter } from 'next/navigation';
import { RequestAction } from '@/stores/people/requests/requests.thunk';
import { cancelRequest, sendRequest } from '@/stores/people/peoples/peoples-thunk';
import debounce from 'lodash.debounce';
import { PersonCardSkeleton } from './skeleton';
import { patchPerson } from '@/stores/people/people-slice';

export default function PeoplePage() {
  const { rows, loading }= useAppSelector((state:RootState) => state.people)
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'friends' | 'sent' | 'received'>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch()
  const router = useRouter()
  const debouncedFetchPeople = useCallback(
  debounce((searchTerm: string, filter: typeof filterBy) => {
    dispatch(fetchPeople({ search: searchTerm, filter, page: 1, limit: 12 }));
  }, 400),
  [dispatch]
);
  useEffect(() => {
  debouncedFetchPeople(search, filterBy);
}, [search, filterBy, debouncedFetchPeople]);
useEffect(() => {
  return () => {
    debouncedFetchPeople.cancel();
  };
}, [debouncedFetchPeople]);
 
  useEffect(() => {
    dispatch(fetchPeople({
  search: search,
  filter: filterBy,
  page: 1,
  limit: 12
}));
  },[filterBy]);

const handleSendOrCancelRequest = async (recipientId: string) => {
  const target = rows.find(u => u.id === recipientId);
  if (!target) return;

  // ---- optimistic toggle ----
  dispatch(
    patchPerson({
      id: recipientId,
      patch: { isFollowing: !target.isFollowing },
    })
  );

  try {
    if (target.isFollowing) {
      await dispatch(cancelRequest({ recipientId })).unwrap();
    } else {
      await dispatch(sendRequest({ recipientId })).unwrap();
    }
    // success → nothing to do (UI already updated)
  } catch (err) {
    // error → roll back
    dispatch(
      patchPerson({
        id: recipientId,
        patch: { isFollowing: target.isFollowing },
      })
    );
    console.error(err);
  }
};

const handleAcceptRequest = async (requestorId: string) => {
  // optimistic accept
  dispatch(
    patchPerson({
      id: requestorId,
      patch: { isFriend: true, hasSentMeRequest: false },
    })
  );

  try {
    await dispatch(RequestAction({ requestorId, action: 'accept' })).unwrap();
  } catch (err) {
    // roll back
    dispatch(
      patchPerson({
        id: requestorId,
        patch: { isFriend: false, hasSentMeRequest: true },
      })
    );
    console.error(err);
  }
};
  const handleFilterSelect = (filter: typeof filterBy) => {
    setFilterBy(filter);
    setAnchorEl(null);
  };

  const filteredPeople = rows
    .filter(p => {
      const keyword = search.toLowerCase();
      return p.name.toLowerCase().includes(keyword) || p.username.toLowerCase().includes(keyword);
    })
    .filter(p => {
      if (filterBy === 'friends') return p.isFriend;
      if (filterBy === 'sent') return p.isFollowing && !p.isFriend;
      if (filterBy === 'received') return p.hasSentMeRequest;
      return true;
    });

  return (
    <Box p={{ xs: 1, md: 4 }} sx={{ mb: 4 }}>
      {/* Search & Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', }}>
        <TextField
          fullWidth
          placeholder="Search people..."
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400, }}
        />
        
        <IconButton size='small' onClick={e => setAnchorEl(e.currentTarget)}>
          <FilterListIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => handleFilterSelect('all')}>All</MenuItem>
          <MenuItem onClick={() => handleFilterSelect('friends')}>Friends</MenuItem>
          <MenuItem onClick={() => handleFilterSelect('sent')}>Requests Sent</MenuItem>
          <MenuItem onClick={() => handleFilterSelect('received')}>Requests Received</MenuItem>
        </Menu>
      </Box>

      {/* People list */}
      {loading ? (
  // Show 6 placeholders (adjust to your page size / columns)
  <>
    {Array.from({ length: 6 }).map((_, i) => (
      <PersonCardSkeleton key={i} />
    ))}
  </>
) :

      filteredPeople.length === 0 ? (
        <Typography sx={{ mx: 2 }}>No people found.</Typography>
      ) : (
        filteredPeople.map(user => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user.id} >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1.5,
                px: { xs: 1, sm: 2 },
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:hover': { bgcolor: 'action.hover' },
                '&:last-of-type': { borderBottom: 'none' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={user.image} alt={user.name} />
                <Box>
                  <Typography onClick={() => router.push(`/profile/${user.id}`)} fontWeight={500} sx={{ fontSize: { xs: '.8rem', sm: '.9rem' } }}>
                    {user.name}
                  </Typography>
                  <Typography
                    sx={{ color: 'text.secondary', fontSize: { xs: '.75rem', sm: '.8rem' } }}
                  >
                    {user.username}
                  </Typography>
                </Box>
              </Box>

              {user.isFriend ? (
                <Tooltip title="Message">
                  <IconButton onClick={() => router.push(`/chat/${user.id}`)} color="primary">
                    <MessageIcon />
                  </IconButton>
                </Tooltip>
              ) : user.hasSentMeRequest ? (
                <Tooltip title="Accept Request">
                  <IconButton color="success" onClick={() => handleAcceptRequest(user.id)}>
                    <DoneAllIcon />
                  </IconButton>
                </Tooltip>
              ) : user.isFollowing ? (
                <Tooltip title="Cancel Request">
                  <IconButton color="success" onClick={() => handleSendOrCancelRequest(user.id)}>
                    <CheckIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Send Follow Request">
                  <IconButton color="primary" onClick={() => handleSendOrCancelRequest(user.id)}>
                    <PersonAddAlt1Icon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Grid>
        ))
      )}
    </Box>
  );
}
