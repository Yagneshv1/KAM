import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressSpinnerService {

  private count = 0;
  private isLoading$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  getIsLoadingObserver(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  startLoading() {
    this.count += 1;
    this.isLoading$.next(true);
  }

  stopLoading() {
    if (this.count > 0) this.count -= 1;
    if (this.count <= 0) this.isLoading$.next(false);
  }

  reset() {
    this.count = 0;
    this.isLoading$.next(false);  
  }
}
