import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { UserService } from '../user.service';
import { optionalLog } from '../config';
import * as Validation from '../utils/validation';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
    userEmail: string | null = null;
    password: string | null = null;
    readonly errorMessage: string = "Bad Usermail/password combination;\nNo learning for you!";
    badCredentialsFlag = signal<boolean>(false);
    
    private authService = inject(AuthenticationService);
    private userService = inject(UserService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    // this flag gets set if login component gets instantiated from a programmatic rerouting
    // with a certain query parameter "reason" = "jwtIssue". An interceptor is defined that
    // will redirect with this parameter whenever an HTTP response with status code "401" is
    // encountered, which is the standard HTTP return code for failed authentication.
    // In our implementation this can happen for example when the JWT that is stored inside
    // browser local storage is no longer valid / expired
    failedAuthFlag = signal<boolean>(false);
    
    private reRouteToHomepageForUser(): void{
        // From: /login
        // Result: /homepage
        this.router.navigate(['..', 'homepage'], {relativeTo: this.route});
    }

    ngOnInit(){
        if(this.userService.isLoggedIn()){
            this.reRouteToHomepageForUser();
        }
        this.route.queryParams.subscribe(params=> {
            params["reason"] === "jwtIssue"
            ? this.failedAuthFlag.set(true)
            : this.failedAuthFlag.set(false); // doesnt really matter what we do here
        });
    }

    submitCredentials(){
        if (!(Validation.isEmailValid(this.userEmail) && Validation.isPasswordValid(this.password))){
            this.badCredentialsFlag.set(true);
        }else{
            this.badCredentialsFlag.set(false);
            
            // send to server
            this.authService.sendLoginRequest(this.userEmail as string,this.password as string).subscribe({
            
                // successful 2xx responses are emitted as "next" data by Angular HTTP response wrappers
                next: (response) => {
                
                    optionalLog("Successful Login API call:",response.status,response.body);
                    let token: string = response.body;
                    this.userService.logIn(this.userEmail as string, token);
                    this.reRouteToHomepageForUser();
                    
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
