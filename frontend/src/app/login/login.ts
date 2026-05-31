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
    userName: string | null = null;
    email: string | null = null;
    password: string | null = null;
    readonly errorMessage: string = "Bad Username/password combination;\nNo learning for you!";
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
        if (!(Validation.isUserNameValid(this.userName) && Validation.isPasswordValid(this.password))){
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
                    // this will need to be refactored later when backend combines login + generate token
                    this.userService.setUsername(this.userName as string);
                    // this is obviously not a real jwt token, but for now we need non-empty string to proceed
                    this.userService.setToken("EXAMPLE_TOKEN_REFACTOR_LATER");
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
