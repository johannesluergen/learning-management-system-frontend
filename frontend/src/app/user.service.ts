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
  private username: string | null;

    constructor() {
      this.jwtToken = localStorage.getItem('jwt');
      this.username = localStorage.getItem('username');
    }

    getToken(): string | null {
      return this.jwtToken;
    }

    setToken(token: string): void {
      this.jwtToken = token;
      localStorage.setItem('jwt', token);
    }

    getUsername(): string | null {
      return this.username;
    }

    setUsername(username: string): void {
      this.username = username;
      localStorage.setItem('username', username);
    }

    isLoggedIn(): boolean{
      return this.jwtToken !== null;
    }

    logOut(): void {
      // wipes out user information (currently username and JWT token)
      localStorage.removeItem('jwt');
      this.jwtToken = null;
      localStorage.removeItem('username');
      this.username = null;
    }
}

