
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Health {

  constructor(private http: HttpClient) {}

  getHealth() {
    // this was for dummy FastAPI backend
    // return this.http.get('http://localhost:8000/');
    
    // call real Spring backend
    return this.http.get('http://localhost:8080/api/health');
  }
}

// Here we use Angular HttpClient to call the backend.