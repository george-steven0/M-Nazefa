import { store } from "../components/APIs/store";
import { API } from "../components/APIs/apiSlice";

/**
 * Clears all client-side auth state in one place:
 *  - wipes localStorage (token, roles, uid, etc.)
 *  - resets the RTK Query cache so the next user can never see the previous
 *    user's cached data (e.g. the GetUser result in the header).
 *
 * Navigation is intentionally left to the caller, since redirect mechanics
 * differ per call site (<Navigate /> vs navigate() vs window.location).
 *
 * Dispatches through the imported store rather than a hook so it can run
 * outside the React render lifecycle.
 */
export const logout = () => {
  localStorage.clear();
  store.dispatch(API.util.resetApiState());
};
