import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiRoutes from '../helpres/ApiRoutes';

export const fetchGroups = createAsyncThunk('groups/fetchGroups', async () => {
    const response = await fetch(apiRoutes.getGroups);
    if (!response.ok) {
        throw new Error('Failed to fetch groups');
    }
    const data = await response.json();
    return data.map(group => ({ value: group._id, label: group.name }));
});

const groupsSlice = createSlice({
    name: 'groups',
    initialState: {
        groups: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroups.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.groups = action.payload;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const selectAllGroups = (state) => state.groups.groups;

export default groupsSlice.reducer;
