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

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Subscribe to the search term changes and update dropdownUsers accordingly
    this.userService.search$.pipe(
      debounceTime(300), // Wait for a 300ms pause in events
      distinctUntilChanged(), // Ignore if the next search term is the same as the previous one
      switchMap(term => {
        if (term.trim() === '') {
          // If the search term is empty, show all users
          this.dropdownUsers = this.userService.allUsers;
        } else {
          // If there is a search term, filter the users based on the ID
          this.dropdownUsers = this.userService.allUsers.filter(user => user.id.toString() === term.trim());
        }
        return [];
      })
    ).subscribe();
  }

  // Handle focus event on the input, showing the dropdown
  onInputFocus() {
    this.isDropdownVisible = true;
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
