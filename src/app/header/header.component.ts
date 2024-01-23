import { Component } from '@angular/core';
import { SharedServiceModule } from '../shared-service/shared-service.module';
import { UserService } from '../services/user.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedServiceModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchTerm: string = '';  // New property for the search term
  dropdownUsers: any[] = [];
  isDropdownVisible: boolean = false;
  isLoading: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    // Subscribe to the search term changes and update dropdownUsers accordingly
    this.userSearch();
  }

  userSearch() {
    this.isLoading = true; // Set loading state
    this.userService.search$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.trim() === '') {
          this.dropdownUsers = this.userService.allUsers;
          this.isLoading = false; // Set loading state to false when data is loaded
        } else {
          this.dropdownUsers = this.userService.allUsers.filter(user => user.id.toString() === term.trim());
          this.isLoading = false; // Set loading state to false when data is loaded

        }
        return [];
      })
    ).subscribe(
      () => {
      },
      (error) => {
        console.error('Error fetching user data:', error);
        this.isLoading = false; // Set loading state to false in case of an error
      }
    );
  }

  // Handle focus event on the input, showing the dropdown and subscribing to search
  onInputFocus() {
    this.isDropdownVisible = true;
    this.userSearch();
  }

  // Handle blur event on the input, hiding the dropdown with a slight delay
  onInputBlur() {
    setTimeout(() => {
      this.isDropdownVisible = false;
    }, 200);
  }

  // Handle input change event, updating the search term in the user service
  onInputChange(value: string) {
    this.userService.setSearchTerm(value.trim());
  }
}
