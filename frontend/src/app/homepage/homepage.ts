import { Component, signal, inject, computed } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {

  private router = inject(Router);
  USER_PROFILE_UNDEFINED_FLAG;
  readonly USER_PROFILE_UNATTAINABLE_MESSAGE = (
    "Cant get User Profile for this User. Possibly this User\n"+
    "no longer exists within backend's database"
  )
  constructor(readonly userService: UserService){
    this.USER_PROFILE_UNDEFINED_FLAG = computed( () => {
      return this.userService.getUserProfile()() === undefined;
    });
  }

  logOut(): void {
    this.userService.logOut();
    this.router.navigate(["/login"]);
  }

}
