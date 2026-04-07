
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Health {

  constructor(private http: HttpClient) {}

  getHealth() {
    return this.http.get('http://localhost:8000/');
  }
}

// Here we use Angular HttpClient to call the backend.