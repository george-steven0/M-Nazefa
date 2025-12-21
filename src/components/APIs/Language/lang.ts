import { createSlice } from "@reduxjs/toolkit";
import i18next from "i18next";

const langSlice = createSlice({
  name: "Lang/slice",
  initialState: {
    lang: localStorage.getItem("mNazLng")
      ? localStorage.getItem("mNazLng")
      : "en",
  },
  reducers: {
    changeLang: (state, action) => {
      state.lang = action.payload || i18next.language;
    },
  },
});

export const { changeLang } = langSlice.actions;
export default langSlice.reducer;
