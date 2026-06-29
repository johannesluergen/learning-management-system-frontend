import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './config';
import { HttpContext } from '@angular/common/http';
import { SKIP_AUTH_WRAPPING } from './http-context';


@Injectable({
  providedIn: 'root'
})
export class Health {

  constructor(private http: HttpClient) {}

  getHealth() {
    // Here we use Angular HttpClient to call the backend.
    return this.http.get(API_BASE_URL+'/api/health',
      {context: new HttpContext().set(SKIP_AUTH_WRAPPING, true)}
    );
  }
}
