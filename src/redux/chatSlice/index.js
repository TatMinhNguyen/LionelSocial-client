import { createSlice } from '@reduxjs/toolkit'

const INIT = {
    chats:[],
    messages:[],
    chat: {}
}

const chat = createSlice({
    name: 'chat',
    initialState: INIT,
    reducers: {
      setChats: (state, action) => {
        state.chats = action.payload;
        return state;
      },
      setMessages: (state, action) => {
        state.messages = action.payload;
        return state;
      },
      setChat: (state, action) => {
        state.chat = action.payload;
        return state
      },
      setClearChat: (state) => {
        state.chats = []
        state.messages = []
        state.chat = {}
      }
    },
})

export const { 
    setChats,
    setMessages,
    setChat,
    setClearChat
  } = chat.actions

export default chat.reducer