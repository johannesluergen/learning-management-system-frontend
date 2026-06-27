import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { API_BASE_URL } from './config';
import { Observable } from 'rxjs';
import { optionalLog } from './config';
import { SKIP_AUTH_WRAPPING } from './http-context';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
    constructor(private http: HttpClient){} //gets HttpClient Injectable
    
    sendLoginRequest(username: string, password: string): Observable<any>{
    
        const body = {username, password};
        
        return this.http.post(API_BASE_URL+"/auth/login", body, {
            responseType: "text",
            observe: "response",
            context: new HttpContext().set(SKIP_AUTH_WRAPPING, true)
        });
    }


    // REFACTOR on final backend API!
    sendRegisterRequest(
        username: string,
        email: string,
        matrikelNumber: number,
        role: string,
        password: string,
    ){
        const body = {username, email, matrikelNumber,role,password};
        optionalLog("Register request sent:",JSON.stringify(body));
        return this.http.post(API_BASE_URL+"/auth/addNewUser", body, {
            responseType: "text",
            observe: "response",
            context: new HttpContext().set(SKIP_AUTH_WRAPPING, true)
        });
        
    }
}
