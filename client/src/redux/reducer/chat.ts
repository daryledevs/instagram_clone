import { createSlice, current } from "@reduxjs/toolkit";
import { getChatThunk } from "../action/chat";
import { IEChatState } from "../reduxIntface";

const initialState: Array<Array<IEChatState>> = [
  [
    {
      conversation_id: null as any,
      first_name: null as any,
      last_name: null as any,
      message_id: null as any,
      sender_id: null as any,
      text_message: null as any,
      time_sent: null as any,
      user_one: null as any,
      user_two: null as any,
      username: null as any,
    },
  ],
];

const chatSlice = createSlice({
  name: "name",
  initialState,
  reducers:{

    addMessage: (state, action) =>{
      let stateInstance = [...current(state)];

      let findState = stateInstance.find(function(state:any, index:any){
        if (state[0].conversation_id === action.payload.conversation_id) return state;
      });
      
      let index = stateInstance.findIndex(
        (state: any, index: any) =>
          state[0].conversation_id === findState?.[0].conversation_id
      );

      let stateContent = stateInstance[index];
      stateInstance[index] = [...stateContent, { ...action.payload }];

      return [...stateInstance];
    }
  },

  extraReducers(builder) {
    builder.addCase(getChatThunk.rejected, (state, action) => {
      console.log("CHAT REJECT: ", action?.payload?.message);
    });

    builder.addCase(getChatThunk.fulfilled, (state, action) => {
      return [...action.payload]
    });
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;