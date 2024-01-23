import { Routes } from '@angular/router';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';

export const routes: Routes = [
  {
    path: '', redirectTo: 'users', pathMatch: 'full',
  },
  {
    path: 'users', component: UserListComponent
  },
  {
    path: 'users/:id', component: UserDetailsComponent
  },
];
