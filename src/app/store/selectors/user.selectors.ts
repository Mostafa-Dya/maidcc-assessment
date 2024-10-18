import { createFeatureSelector, createSelector } from '@ngrx/store'; 

import { UserState } from '../reducers/user.reducer'; 


// ----------- Selectors for User Feature State -----------

// `createFeatureSelector` is used to select a specific feature slice of the state.
export const selectUserState = createFeatureSelector<UserState>('user');


// ----------- Selectors for Specific Properties of the User State -----------

// Selects the `users` array from the user state
export const selectUsers = createSelector(
  selectUserState, // Uses the user feature state selected by `selectUserState`
  (state) => state.users // Accesses the `users` property from the user state
);

// Selects the total number of users (for pagination)
export const selectTotalUsers = createSelector(
  selectUserState, // Uses the user feature state selected by `selectUserState`
  (state) => state.totalUsers // Accesses the `totalUsers` property from the user state
);

// Selects the total number of pages (for pagination)
export const selectTotalPages = createSelector(
  selectUserState, // Uses the user feature state selected by `selectUserState`
  (state) => state.totalPages // Accesses the `totalPages` property from the user state
);

// Selects the loading flag to determine if data is currently being fetched
export const selectLoading = createSelector(
  selectUserState, // Uses the user feature state selected by `selectUserState`
  (state) => state.loading // Accesses the `loading` property from the user state
);

// Selects the error object to check if any errors occurred during data fetching
export const selectError = createSelector(
  selectUserState, // Uses the user feature state selected by `selectUserState`
  (state) => state.error // Accesses the `error` property from the user state
);

// Selects the currently selected user (for viewing details)
export const selectSelectedUser = createSelector(
  selectUserState, // Uses the user feature state selected by `selectUserState`
  (state) => state.selectedUser // Accesses the `selectedUser` property from the user state
);

// Selects all users (used for search functionality)
export const selectAllUsers = createSelector(
  selectUserState, // Uses the user feature state selected by `selectUserState`
  (state) => state.allUsers // Accesses the `allUsers` property from the user state (this is typically for search)
);
