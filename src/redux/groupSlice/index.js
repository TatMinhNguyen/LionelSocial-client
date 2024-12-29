import { createSlice } from '@reduxjs/toolkit'

const INIT = {
    groups:[],
    group: {},
    members:[],
    posts:[],
}

const group = createSlice({
    name: 'group',
    initialState: INIT,
    reducers: {
      setGroups: (state, action) => {
        state.groups = action.payload;
        return state;
      },
      setGroup: (state, action) => {
        state.group = action.payload;
        return state
      },
      clearGroup: (state) => {
        state.group = {}
      },
      setMembers: (state, action) => {
        state.members = action.payload;
        return state;
      },
      setPosts:(state, action) => {
        state.posts = action.payload;
        return state;
      },
      setClearGroup:(state) => {
        state.groups = []
        state.group = {}
        state.members = []
        state.posts = []
      }
    },
})

export const { 
    setGroups,
    setGroup,
    setMembers,
    setPosts,
    clearGroup,
    setClearGroup
  } = group.actions

export default group.reducer