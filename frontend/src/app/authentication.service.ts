import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
    constructor(private http: HttpClient){} //gets HttpClient Injectable
    
    sendLoginRequest(username: string, password: string): Observable<any>{
    
        const body = {username, password};
        
        return this.http.post(API_BASE_URL+"/auth/login", body, {observe: "response"} );
    }

    sendRegisterRequest(
        id: string, // sending big numbers as string like "6736352" is safer
        username: string,
        email: string,
        matrikelNumber: number,
        role: string,
        password: string,
    ){
        const body = {id, username, email, matrikelNumber,role,password};

        return this.http.post(API_BASE_URL+"/auth/addNewUser", body, {observe: "response" });
        
    }
}
