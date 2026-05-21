import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { optionalLog } from '../config';
import * as Validation from '../utils/validation';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
    
    // userName: string | null = null;  -> Less idiomatic and must always be explicitly initialized with null
    userName?: string;  //-> More idiomatic, same as userName: string | undefined, and undefined
                        //   can be checked like Null. Implicitly initialized to undefined
    email?: string;
    password?: string;
    confirmPassword?: string;
    
    errorMessage = signal<string>("Error");
    badInputFlag = signal<boolean>(false);
    doPasswordsMatch = signal<boolean>(false);
    showConfirmPassword = signal<boolean>(false);
    
    private authService = inject(AuthenticationService);
    
    checkInput(){
        if (!(Validation.isUserNameValid(this.userName))){
            this.errorMessage.set(Validation.badUserNameDescription);
            this.badInputFlag.set(true);
        }else if (!(Validation.isEmailValid(this.email))){
            this.errorMessage.set(Validation.badEmailDescription);
            this.badInputFlag.set(true);
        } else if (!(Validation.isPasswordValid(this.password))){
            this.errorMessage.set(Validation.badPasswordDescription);
            this.badInputFlag.set(true);
        } else {
            // if we are here we shouldnt forget to reset the badInputFlag
            this.badInputFlag.set(false);
            this.showConfirmPassword.set(true);
        }
    }
    
    checkPasswords(){
        if(this.password && this.confirmPassword){
            if(this.password == this.confirmPassword){
                this.doPasswordsMatch.set(true);
            }
        }else{
            this.doPasswordsMatch.set(false);
        }
    }
    
    
}
