import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { API_BASE_URL } from './config';
import { Observable } from 'rxjs';
import { optionalLog } from './config';
import { SKIP_AUTH_WRAPPING } from './http-context';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  // the jwtToken for authorization that gets returned by the backend
  // to enable the logged-in status on the client side to be "persistent" in
  // the browser (meaning like in most modern applications we want being logged in
  // to survive page reload, for example), we save to "localStorage" which is
  // provided by browser API as a quick key-value type lookup for strings.
  // It would get reset/cleared when user clears his browser
  // cache/cookies/site data
  private jwtToken: string | null;
  private userEmail: string | null;
  private http: HttpClient;
  // The actual writable signal:
  private _userProfile = signal<any | undefined>(undefined);
  // A readonly view of the same signal for other components to read
  private readonly userProfile = this._userProfile.asReadonly();
  // a helper that shows when an http request to update user Profile is already on the way
  private loadingUserProfile = false;

    constructor() {
      this.jwtToken = localStorage.getItem('jwt');
      this.userEmail = localStorage.getItem('userEmail');
      this.http = inject(HttpClient);
    }

    getToken(): string | null {
      return this.jwtToken;
    }

    private setToken(token: string): void {
      this.jwtToken = token;
      localStorage.setItem('jwt', token);
    }

    getUserEmail(): string | null {
      return this.userEmail;
    }

    private setUserEmail(userEmail: string): void {
      this.userEmail = userEmail;
      localStorage.setItem('userEmail', userEmail);
    }

    isLoggedIn(): boolean{
      return this.jwtToken !== null;
    }

    // helper function. NEEDS TO BE REFACTORED WHEN BACKEND CHANGES
    // IMPLEMENTATION TO PROPERLY RETURN JSON WITH FULL INFORMATION (USERNAME)
    // INSTEAD OF THIS TEXT RESPONSE
    private getUserProfileFromServer(){
      return this.http.get(API_BASE_URL+"/auth/user/profile",{
        responseType: "text",
        observe: "response",
      });
    }

    // helper function
    private updateUserProfile(){
        this.getUserProfileFromServer().subscribe({
        next: (response) => {
          optionalLog("User Profile received from Server:",response.body);
          this._userProfile.set(response.body);
          this.loadingUserProfile = false;
        },
        error: (err) => {
          optionalLog("Some trouble with requesting User Profile from Server:",
            err.status,
            err.error
          );
          this.loadingUserProfile = false;
        }
      });
    }

    /**
     * This function can be used to log a user in, aka provide a token and
     * a userEmail
     */
    logIn(userEmail: string, jwtToken: string){
      this.setUserEmail(userEmail);
      this.setToken(jwtToken);
      this.updateUserProfile();
    }

    logOut(): void {
      // wipes out user information (currently userEmail and JWT token)
      localStorage.removeItem('jwt');
      this.jwtToken = null;
      localStorage.removeItem('userEmail');
      this.userEmail = null;
      // userProfile is not stored in localStorage, but should be cleared as well
      this._userProfile.set(undefined);
    }

    /**
     * returns User Profile for the currently logged in user, which is a signal.
     * It may be a signal of undefined initially but if a user is logged in it should
     * eventually update to the real UserProfile
     */
    getUserProfile(){
      if( !this.userProfile() && this.isLoggedIn() && !this.loadingUserProfile ){
        this.loadingUserProfile = true;
        this.updateUserProfile();
      }
      return this.userProfile;
    }
}

