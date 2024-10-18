import { createReducer, on } from '@ngrx/store'; 
import { User } from '../models/user.model'; 
import * as UserActions from '../actions/user.actions'; 

// Interface to define the shape of the UserState in the store
export interface UserState {
  users: User[]; 
  totalUsers: number;
  totalPages: number; 
  loading: boolean;
  error: any;
  selectedUser: User | null; 
  allUsers: User[];
}

// The initial state of the UserState when the application starts
export const initialState: UserState = {
  users: [], 
  totalUsers: 0, 
  totalPages: 0, 
  loading: false, 
  error: null,
  selectedUser: null,
  allUsers: [],
};

// Reducer function to handle actions and update the state
export const userReducer = createReducer(
  initialState, // Initial state of the reducer

  // --- Load Users ---
  on(UserActions.loadUsers, (state) => ({
    ...state, // Spread operator to copy the current state
    loading: true, // Set loading to true when loading users
    error: null, // Clear any existing errors
  })),
  on(UserActions.loadUsersSuccess, (state, { users, total, totalPages }) => ({
    ...state, // Copy the current state
    users, // Update the `users` array with the loaded users
    totalUsers: total, // Set the total number of users
    totalPages, // Set the total number of pages
    loading: false, // Set loading to false because the operation is done
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state, // Copy the current state
    loading: false, // Stop loading
    error, // Set the error object with the received error
  })),

  // --- Load User Details ---
  on(UserActions.loadUserDetails, (state) => ({
    ...state, // Copy the current state
    loading: true, // Set loading to true when loading user details
    error: null, // Clear any existing errors
  })),
  on(UserActions.loadUserDetailsSuccess, (state, { user }) => ({
    ...state, // Copy the current state
    selectedUser: user, // Set the selectedUser to the loaded user details
    loading: false, // Stop loading
  })),
  on(UserActions.loadUserDetailsFailure, (state, { error }) => ({
    ...state, // Copy the current state
    loading: false, // Stop loading
    error, // Set the error object with the received error
  })),

  // --- Initialize All Users (for Search) ---
  on(UserActions.initializeAllUsers, (state) => ({
    ...state, // Copy the current state
    loading: true, // Set loading to true when initializing all users
    error: null, // Clear any existing errors
  })),
  on(UserActions.initializeAllUsersSuccess, (state, { users }) => ({
    ...state, // Copy the current state
    allUsers: users, // Set the `allUsers` array to the loaded users (used for search)
    loading: false, // Stop loading
  })),
  on(UserActions.initializeAllUsersFailure, (state, { error }) => ({
    ...state, // Copy the current state
    loading: false, // Stop loading
    error, // Set the error object with the received error
  }))
);
