import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable, forkJoin, tap } from 'rxjs';
import { CachingService } from './caching.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // BehaviorSubject for handling search term changes
  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();
  
  // Injecting HttpClient and CachingService
  http = inject(HttpClient)
  constructor(private cachingService: CachingService) { }

  // Array to store all users
  public allUsers: any[] = []; 

  // Set the search term and notify subscribers
  setSearchTerm(term: string) {
    this.searchSubject.next(term);
  }
  
  // Fetch user cards based on page(s)
  getUserCards(pages: number[] | number): Observable<any> {
    if (Array.isArray(pages)) {
      // If 'pages' is an array, make multiple requests using forkJoin
      const requests = pages.map(page => {
        const params = new HttpParams().set('page', page.toString());
        return this.http.get<any>(`${environment.api}/users`, { params });
      });
      console.log(this.allUsers)
      return forkJoin(requests);
    } else {
      // If 'pages' is a single number, make a single request
      const params = new HttpParams().set('page', pages.toString());
      return this.http.get<any>(`${environment.api}/users`, { params });
    }
  }

  // Fetch user details by user ID
  getUserDetails(userId: number): Observable<any> {
    const cacheKey = `userDetails-${userId}`; // Set a unique key for this cache entry

    // Check if data is in the cache
    const cachedData = this.cachingService.get(cacheKey);
    if (cachedData) {
      // Return cached data as an observable
      return new Observable((observer) => {
        observer.next(cachedData);
        observer.complete();
      });
    }

    // If not in the cache, proceed with the HTTP request
    const params = new HttpParams().set('id', userId.toString());
    return this.http.get<any>(`${environment.api}/users/${userId}`, { params }).pipe(
      // Cache the result
      tap(data => this.cachingService.set(cacheKey, data))
    );
  }

  // Cache user cards for a specific cache key
  cacheUserCards(cacheKey: string, value: any): void {
    this.cachingService.set(cacheKey, value);
  }

  // Get cached user cards for a specific cache key
  getCachedUserCards(cacheKey: string): any {
    return this.cachingService.get(cacheKey);
  }
}
