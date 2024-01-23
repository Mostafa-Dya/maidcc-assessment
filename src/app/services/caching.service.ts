import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CachingService {
  // Private cache object to store key-value pairs
  private cache: { [key: string]: any } = {};

  // Set a value in the cache for a given key
  set(key: string, value: any): void {
    this.cache[key] = value;
  }

  // Get a value from the cache for a given key
  get(key: string): any {
    return this.cache[key];
  }

  // Clear the entire cache
  clear(): void {
    this.cache = {};
  }
}
