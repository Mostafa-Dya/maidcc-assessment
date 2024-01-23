import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { SharedServiceModule } from '../../shared-service/shared-service.module';
import { fadeInOutAnimation } from '../../animation/fadeInOutAnimation';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [SharedServiceModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  animations: [fadeInOutAnimation]
})
export class UserDetailsComponent implements OnInit {
  userId!: number;
  userDetails: any;
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    // Subscribe to route parameters to get the user ID from the URL
    this.route.params.subscribe(params => {
      this.userId = +params['id']; // Extract user ID from parameters and convert to number
      this.loading = true;

      // Fetch user details based on the user ID
      this.userService.getUserDetails(this.userId).subscribe(
        (response) => {
          // Assign fetched user details to the component property
          this.userDetails = response.data;
          this.loading = false; // Update loading status after successful fetch
        },
        (error) => {
          console.error('Error fetching user details:', error);
          this.loading = false; // Update loading status after encountering an error
        }
      );
    });
  }
}
