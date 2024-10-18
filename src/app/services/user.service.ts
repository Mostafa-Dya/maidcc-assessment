import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { User } from '../store/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  // Fetch user cards based on page number and items per page
  getUserCards(page: number, perPage: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    return this.http.get<any>(`${environment.api}/users`, { params });
  }

  // Fetch user details by user ID
  getUserDetails(userId: number): Observable<any> {
    return this.http.get<any>(`${environment.api}/users/${userId}`);
  }

  // Initialize and fetch all users (used in HeaderComponent for search)
  initializeAllUsers(): Observable<User[]> {
    const perPage = 12; // Max per_page value
    const params = new HttpParams()
      .set('page', '1')
      .set('per_page', perPage.toString());
    return this.http
      .get<any>(`${environment.api}/users`, { params })
      .pipe(map((res) => res.data));
  }
}
