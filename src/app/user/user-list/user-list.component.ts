import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeInOutAnimation } from '../../animation/fadeInOutAnimation';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import * as UserActions from '../../store/actions/user.actions';
import * as UserSelectors from '../../store/selectors/user.selectors';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';
import { User } from '../../store/models/user.model';
import { takeUntil } from 'rxjs/operators';
import { SharedServiceModule } from '../../shared-service/shared-service.module';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SharedServiceModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  animations: [fadeInOutAnimation],
})
export class UserListComponent implements OnInit, OnDestroy {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  totalUsers$: Observable<number>;

  currentPage = 1;
  itemsPerPage = 6;

  private destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>) {
    this.users$ = this.store.pipe(select(UserSelectors.selectUsers));
    this.loading$ = this.store.pipe(select(UserSelectors.selectLoading));
    this.totalUsers$ = this.store.pipe(select(UserSelectors.selectTotalUsers));
  }

  ngOnInit() {
    this.fetchUserCards();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchUserCards() {
    this.store.dispatch(
      UserActions.loadUsers({
        page: this.currentPage,
        perPage: this.itemsPerPage,
      })
    );
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.fetchUserCards();
  }
}
