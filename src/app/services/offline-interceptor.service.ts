import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OfflineInterceptorService implements HttpInterceptor {

  get isOnline() {
    return navigator.onLine;
  }

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(      
      catchError((error: HttpErrorResponse) => { 
        if (!this.isOnline) {          
          return throwError('OFFLINE');
        } 
        if(error.status == 404 || error.statusText == 'Unknown Error') {
          return throwError('ERROR_NETWORK');
        }
        return throwError(error.error);
      })
    );
  }
}
