import { createSlice } from "@reduxjs/toolkit";
import i18next from "i18next";

const langSlice = createSlice({
  name: "Lang/slice",
  initialState: {
    lang: localStorage.getItem("mNazLang")
      ? localStorage.getItem("mNazLang")
      : "en",
  },
  reducers: {
    changeLang: (state, action) => {
      state.lang = action.payload;
      i18next.changeLanguage(action.payload);
    },
  },
});

export const { changeLang } = langSlice.actions;
export default langSlice.reducer;
