import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SKIP_AUTH_WRAPPING } from './http-context';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  /*
  if this http context token is set, dont do anything
  */
  const context: boolean = req.context.get(SKIP_AUTH_WRAPPING);
  if(context){
    return next(req);
  }

  const userService = inject(UserService);
  const router = inject(Router);

  const token = userService.getToken();


  // if we have a non-null token, attach it to any outgoing http-request
  const authReq = ( token )
  ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) { // unauthorized request to a protected API
        userService.logOut();
        router.navigate(['/login'], {
          queryParams: {reason: "jwtIssue"},
        });
      }

      return throwError(() => err);
    })
  );
};
