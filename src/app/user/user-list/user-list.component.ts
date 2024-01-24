import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SharedServiceModule } from '../../shared-service/shared-service.module';
import { Subject, takeUntil } from 'rxjs';
import { fadeInOutAnimation } from '../../animation/fadeInOutAnimation';
import { ChangeDetectorRef } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SharedServiceModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  animations: [fadeInOutAnimation]
})
export class UserListComponent {
  users: any[] = [];
  currentPage = 1;
  totalPages!: number;
  itemsPerPage!: number;
  displayedUsers!: any[];
  loading: boolean = true;
  requestedPages: number[] = [];
  searchTerm: string = '';

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private userService: UserService,private _cdr: ChangeDetectorRef) {
    this.fetchUserCards();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Fetch user cards based on the current page, either from cache or API
  fetchUserCards() {
    this.loading = true;

    // Include the current page in the list of requested pages
    this.requestedPages.push(this.currentPage, this.itemsPerPage);

    // Check if data is in the cache
    const cacheKey = `userCards-${this.currentPage}`;
    const cachedData = this.userService.getCachedUserCards(cacheKey);

    if (cachedData && !this.userService.hasTotalPagesChanged(cachedData.total_pages)) {
      // Use cached data if total_pages hasn't changed
      this.displayedUsers = [...cachedData.data];
      this.totalPages = cachedData.total_pages;
      this.itemsPerPage = cachedData.per_page;
      this.userService.allUsers = this.displayedUsers;
      this.loading = false;
    } else {
      // If not in the cache or total_pages has changed, proceed with the HTTP request
      this.userService.getUserCards(this.currentPage).pipe(
        takeUntil(this.destroy$),
        debounceTime(800)
      ).subscribe(
        (response) => {
          this.handleUserCardsResponse(response, cacheKey);
          // Update the last known total pages
          this.userService.updateLastKnownTotalPages(response.total_pages);
        },
        (error) => {
          console.error('Error fetching user cards:', error);
          this.loading = false;
        }
      );
    }
  }

  // Handle the response when user cards are fetched (including pagination)

  private handleUserCardsResponse(response: any, cacheKey: string) {
    this.totalPages = response.total_pages;
    this.itemsPerPage = response.per_page;

    // Concatenate the new user data to displayedUsers
    this.displayedUsers = this.displayedUsers ? [...this.displayedUsers, ...response.data] : [...response.data];
  
    const pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  
    // Filter out the pages that have already been requested
    const newPages = pages.filter((page) => !this.requestedPages.includes(page));
  
    // Update requested pages with the new pages
    this.requestedPages = [...this.requestedPages, ...newPages];
  
    // Fetch all pages using forkJoin
    this.userService.getUserCards(newPages).subscribe(
      (responses) => {
        // Flatten the array of responses and concatenate the user arrays
        const users = responses.flatMap((response: any) => response.data);
        this.displayedUsers = [...this.displayedUsers, ...users];
        this.userService.allUsers = this.displayedUsers;
        this.loading = false;
  
        // Cache the result after fetching all pages
        this.userService.cacheUserCards(cacheKey, {
          data: this.displayedUsers,
          total_pages: this.totalPages,
          per_page: this.itemsPerPage
        });
  
        // Trigger change detection
        this._cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching user cards:', error);
        this.loading = false;
      }
    );
  }


  // Move to the previous page
  onPrevious() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Move to the next page
  onNext() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Handle page click
  onPageClick(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Generate an array of page numbers based on total users and items per page
  generatePageArray(): number[] {
    const totalUsers = this.displayedUsers ? this.displayedUsers.length : 0;
    const itemsPerPage = this.itemsPerPage || 1;
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Get the users to be displayed on the current page
  getDisplayedUsers(): any[] {
    if (this.displayedUsers) {

      return this.displayedUsers.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    } else {
      return [];
    }
  }
}
