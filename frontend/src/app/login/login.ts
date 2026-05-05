import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { optionalLog } from '../config';

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
    
    private authService = inject(AuthenticationService);
    
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
            
            // send to server
            let loginResponse: number;
            this.authService.sendLoginRequest(this.userName as string,this.password as string).subscribe({
            
                // successful 2xx responses are emitted as "next" data by Angular HTTP response wrappers
                next: (response) => {
                
                    optionalLog("Successful Login API call:",response.status,response.body);
                    
                    loginResponse = response.status;
                    if (loginResponse !== 200){
                        // something unexpected happened: loginResponse is a successfull http return code,
                        // but not the plain 200 we expected
                        
                        this.badCredentialsFlag.set(true); // this is not ideal though since semantically
                        // these may not be bad credentials. I maybe should implement a general error component
                        // which gets displayed when something unexpected happens outside component-specific cases
                        // (like bad credentials here)
                    }
                    // IMPLEMENT: DEAL WITH SUCCESSFUL login
                    // Possibly create a User object and instantiate a HOMEPAGE component/route with it
                }, error: (err) => {
                    
                    // error messages are stored in .error property of Angular HTTP Response wrapper
                    optionalLog("Unsuccessful Login API call:",err.status,err.error);
                    
                    // unsuccessful HTTP response status codes like 4xx, 500 will only get caught here
                    this.badCredentialsFlag.set(true);
                }
            });
        }
    }
}
