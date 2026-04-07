import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Health } from './health';
import { JsonPipe } from "@angular/common";
import { NgIf } from '@angular/common';
/*
to fix this, import the "JsonPipe" class from "@angular/common" 
and add it to the "imports" array of the component.*/

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-first-angular-app');
  
  health = signal<any>(null);
  
  constructor(private healthService: Health){}
  
  ngOnInit() {
    this.healthService.getHealth()
      .subscribe(data => {
        this.health.set(data);
      },
      error => {
        console.error('API call failed', error);
    });
  }
}
