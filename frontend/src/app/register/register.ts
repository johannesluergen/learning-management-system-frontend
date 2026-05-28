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
    
    // userName: string | null = null;  -> Less idiomatic and must always be explicitly initialized
    // with null
    userName?: string;  //-> More idiomatic, same as userName: string | undefined, and undefined
                        //   can be checked like Null. Implicitly initialized to undefined
    email?: string;
    password?: string;
    confirmPassword?: string;
    
    errorMessage = signal<string>("Error");
    badInputFlag = signal<boolean>(false);
    doPasswordsMatch = signal<boolean>(false);
    showConfirmPassword = signal<boolean>(false);
    passwordCheckRequested = signal<boolean>(false);
    registerRequestedFlag = signal<boolean>(false);
    registerSuccessFlag = signal<boolean>(false); // this only gets set on successful register
    isLoadingFlag = signal<boolean>(false);

    
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
        this.passwordCheckRequested.set(true);
    }

    /**
     * generates a random matrikelNumber from 0 to 65535
     */
    private generateMatrikelNumber(): number{
        let bytes = new Uint16Array(1);
        crypto.getRandomValues(bytes);
        return Number(bytes[0]);
    }

    // this is a so-called JSDoc comment
    /**
     * note that this function is only called by HTML template if all credentials
     * have been validated; so this function manages WITHOUT repeated validation
     */
    async submitRegisterCredentials(){
        this.isLoadingFlag.set(true);
        this.registerRequestedFlag.set(true);
        /*
            NOTE: Backend currently does not have the clearest API documentation of
            what it wants from frontend. For example, should frontend generate
            Matriculation-Number for a new User? and what exactly are the roles?
            Will they be validated?

            So given this uncertainty frontend currently does the following:
            -It sends each new user with role "ROLE_USER" and hopes it is okay
            -It generates a random matriculation number from a range that corresponds to
             a uint16-type
        */

        // we need the following data:
        // {username, email, matrikelNumber,role,password};

        // random matrikelNumber must be generated before the ID
        let matrikelNumber: number = this.generateMatrikelNumber();

        // send to server
        this.authService.sendRegisterRequest(
            this.userName as string,
            this.email as string,
            matrikelNumber,
            "ROLE_USER",
            this.password as string,
        ).subscribe({
        
            // successful 2xx responses are emitted as "next" data by Angular HTTP response wrappers
            next: (response) => {
            
                optionalLog("Successful Register API call:",response.status,response.body);
                this.registerSuccessFlag.set(true);
                this.isLoadingFlag.set(false);
                
            }, error: (err) => {
                
                // error messages are stored in .error property of Angular HTTP Response wrapper
                optionalLog("Unsuccessful Register API call:",err.status,err.error);
                this.registerSuccessFlag.set(false);
                this.isLoadingFlag.set(false);
            }
        });
    }
    
    
}
