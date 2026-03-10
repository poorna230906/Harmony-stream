import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const userService = inject(UserService);

  // Add auth headers to all API requests
  const authReq = req.clone({
    setHeaders: {
      'Authorization': `Bearer mock-token`,
      'Content-Type': 'application/json'
    }
  });

  console.log(`[HTTP Interceptor] ${req.method} ${req.url}`);

  return next(authReq).pipe(
    tap(() => console.log(`[HTTP Interceptor] Request successful: ${req.url}`)),
    catchError((error: HttpErrorResponse) => {
      let msg = 'An error occurred';
      if (error.status === 401) msg = 'Unauthorized. Please log in.';
      else if (error.status === 404) msg = 'Resource not found.';
      else if (error.status === 500) msg = 'Server error. Please try again.';
      userService.notify(msg);
      return throwError(() => error);
    })
  );
};
