import { Injectable } from '@angular/core';

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

    constructor() {
      this.jwtToken = localStorage.getItem('jwt');
      this.userEmail = localStorage.getItem('userEmail');
    }

    getToken(): string | null {
      return this.jwtToken;
    }

    setToken(token: string): void {
      this.jwtToken = token;
      localStorage.setItem('jwt', token);
    }

    getUserEmail(): string | null {
      return this.userEmail;
    }

    setUserEmail(userEmail: string): void {
      this.userEmail = userEmail;
      localStorage.setItem('userEmail', userEmail);
    }

    isLoggedIn(): boolean{
      return this.jwtToken !== null;
    }

    logOut(): void {
      // wipes out user information (currently userEmail and JWT token)
      localStorage.removeItem('jwt');
      this.jwtToken = null;
      localStorage.removeItem('userEmail');
      this.userEmail = null;
    }
}

