import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
    userName: string | null = null;
    email: string | null = null;
    password: string | null = null;
    readonly errorMessage: string = "Bad Username/password combination;\nNo learning for you!";
    badCredentialsFlag = signal<boolean>(false);
    
    isUserNameValid(){
        return !!this.userName; // this will also catch empty strings
    }
    isEmailValid(){
        return (!!this.email) && this.email.includes("@");
    }
    isPasswordValid(){
        return !!this.password;
    }
    
    submitCredentials(){
        if (!(this.isUserNameValid() && this.isPasswordValid())){
            this.badCredentialsFlag.set(true);
        }else{
            this.badCredentialsFlag.set(false);
            // send to server, implement later
            
        }
    }
}
