import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/reducers';
import * as UserActions from '../store/actions/user.actions';
import * as UserSelectors from '../store/selectors/user.selectors';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { User } from '../store/models/user.model';
import { takeUntil } from 'rxjs/operators';
import { SharedServiceModule } from '../shared-service/shared-service.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone:true,
  imports:[SharedServiceModule],
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchTerm = '';
  dropdownUsers: User[] = [];
  isDropdownVisible = false;
  isLoading = false;

  private searchTermSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(UserActions.initializeAllUsers());

    this.setupSearchSubscription();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupSearchSubscription() {
    this.searchTermSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.isLoading = true;
        this.store
          .pipe(select(UserSelectors.selectAllUsers), takeUntil(this.destroy$))
          .subscribe((users) => {
            this.dropdownUsers = users.filter((user) => {
              const searchLower = term.toLowerCase();
              return (
                user.id.toString() === searchLower ||
                user.first_name.toLowerCase().includes(searchLower) ||
                user.last_name.toLowerCase().includes(searchLower) ||
                `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchLower)
              );
            });
            this.isLoading = false;
          });
      });
  }

  onInputFocus() {
    this.isDropdownVisible = true;
  }

  onInputBlur() {
    setTimeout(() => {
      this.isDropdownVisible = false;
    }, 200);
  }

  onInputChange(value: string) {
    this.isLoading = true;
    this.searchTermSubject.next(value.trim());
  }
}
