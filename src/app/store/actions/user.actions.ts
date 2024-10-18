import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';

// ----------------- Load Users Actions -----------------

// Action to load a list of users, which includes pagination info (page number and number of users per page)
export const loadUsers = createAction(
  '[User List] Load Users', // Action type (identifier) for the action
  props<{ page: number; perPage: number }>() // Action payload containing the page number and number of users per page
);

// Action dispatched when users are successfully loaded, passing the user list and metadata (total users, total pages)
export const loadUsersSuccess = createAction(
  '[User API] Load Users Success', // Action type for successful user load from API
  props<{ users: User[]; total: number; totalPages: number }>() // Payload with the user data, total number of users, and total pages
);

// Action dispatched when loading users fails, passing an error object
export const loadUsersFailure = createAction(
  '[User API] Load Users Failure', // Action type for user load failure
  props<{ error: any }>() // Payload containing the error information
);

// ----------------- Load User Details Actions -----------------

// Action to load details of a single user by user ID
export const loadUserDetails = createAction(
  '[User Details] Load User Details', // Action type for loading a single user's details
  props<{ userId: number }>() // Payload containing the user ID to load details for
);

// Action dispatched when the user details are successfully loaded, passing the user object
export const loadUserDetailsSuccess = createAction(
  '[User API] Load User Details Success', // Action type for successful user details load from API
  props<{ user: User }>() // Payload containing the user details object
);

// Action dispatched when loading user details fails, passing an error object
export const loadUserDetailsFailure = createAction(
  '[User API] Load User Details Failure', // Action type for user details load failure
  props<{ error: any }>() // Payload containing the error information
);

// ----------------- Initialize All Users Actions (for Search) -----------------

// Action to initialize fetching all users, typically for search functionality
export const initializeAllUsers = createAction('[Header] Initialize All Users');
// No payload here because this is just a trigger action to start the process

// Action dispatched when all users are successfully initialized (for search), passing the complete user list
export const initializeAllUsersSuccess = createAction(
  '[User API] Initialize All Users Success', // Action type for successful fetch of all users for search
  props<{ users: User[] }>() // Payload containing the entire list of users
);

// Action dispatched when initializing all users fails, passing an error object
export const initializeAllUsersFailure = createAction(
  '[User API] Initialize All Users Failure', // Action type for failure during fetch of all users
  props<{ error: any }>() // Payload containing the error information
);
