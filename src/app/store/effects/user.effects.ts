import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UserActions from '../actions/user.actions';
import { UserService } from '../../services/user.service'; 
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators'; 
import { of } from 'rxjs'; 

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {} 


  // Effect to load users
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers), // Listen for the `loadUsers` action
      mergeMap(({ page, perPage }) => // Extract page and perPage from the action payload
        this.userService.getUserCards(page, perPage).pipe( // Call the service to get user data
          map((response) => // On success, dispatch the `loadUsersSuccess` action
            UserActions.loadUsersSuccess({
              users: response.data, // Pass the users data
              total: response.total, // Pass the total number of users
              totalPages: response.total_pages, // Pass the total number of pages
            })
          ),
          catchError((error) => 
            of(UserActions.loadUsersFailure({ error })) // On error, dispatch `loadUsersFailure` with the error
          )
        )
      )
    )
  );
  // Summary: This effect listens for the `loadUsers` action, triggers an API call to fetch users, and dispatches either
  // `loadUsersSuccess` or `loadUsersFailure` depending on the outcome.

  // Effect to load details for a specific user
  loadUserDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserDetails), // Listen for the `loadUserDetails` action
      mergeMap(({ userId }) => // Extract userId from the action payload
        this.userService.getUserDetails(userId).pipe( // Call the service to get the user details
          map((response) => 
            UserActions.loadUserDetailsSuccess({ user: response.data }) // Dispatch `loadUserDetailsSuccess` with the user data
          ),
          catchError((error) => 
            of(UserActions.loadUserDetailsFailure({ error })) // Dispatch `loadUserDetailsFailure` on error
          )
        )
      )
    )
  );
  // Summary: This effect handles fetching a specific user's details based on the `userId`, dispatching success or failure actions.

  // Effect to initialize fetching all users for search functionality
  initializeAllUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.initializeAllUsers), // Listen for the `initializeAllUsers` action
      switchMap(() => 
        this.userService.initializeAllUsers().pipe( // Call the service to initialize all users (e.g., for search functionality)
          map((users) => 
            UserActions.initializeAllUsersSuccess({ users }) // Dispatch `initializeAllUsersSuccess` with the users array
          ),
          catchError((error) =>
            of(UserActions.initializeAllUsersFailure({ error })) // Dispatch `initializeAllUsersFailure` on error
          )
        )
      )
    )
  );
  // Summary: This effect is responsible for initializing all users, typically for a search feature, and dispatching success or failure.
}
