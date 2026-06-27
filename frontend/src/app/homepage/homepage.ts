import { Component, signal, inject } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
  userEmail: string | null;
  private router = inject(Router);

  constructor(private userService: UserService){
    this.userEmail = this.userService.getUserEmail();
  }

  logOut(): void {
    this.userService.logOut();
    this.router.navigate(["/login"]);
  }

}
