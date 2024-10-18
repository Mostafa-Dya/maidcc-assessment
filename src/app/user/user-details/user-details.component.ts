import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeInOutAnimation } from '../../animation/fadeInOutAnimation';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import * as UserActions from '../../store/actions/user.actions';
import * as UserSelectors from '../../store/selectors/user.selectors';
import { Observable, Subject } from 'rxjs';
import { User } from '../../store/models/user.model';
import { takeUntil } from 'rxjs/operators';
import { SharedServiceModule } from '../../shared-service/shared-service.module';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [SharedServiceModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  animations: [fadeInOutAnimation],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  userId!: number;
  userDetails$: Observable<User | null>;
  loading$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {
    // Select the user details and loading state from the store
    this.userDetails$ = this.store.pipe(select(UserSelectors.selectSelectedUser));
    this.loading$ = this.store.pipe(select(UserSelectors.selectLoading));
  }

  ngOnInit() {
    // Get the user ID from the route parameters
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.userId = +params['id'];
      // Dispatch the action to load user details
      this.store.dispatch(UserActions.loadUserDetails({ userId: this.userId }));
    });
  }

  ngOnDestroy() {
    // Clean up subscriptions to avoid memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
