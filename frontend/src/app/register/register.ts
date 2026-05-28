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

    /**
     * The idea here is to create a unique 64-bit int value (that starts with 0 since
     * backend expects int64 type and we dont want headache of incorrect casting/
     * negative IDs) as a hash value /fingerprint of the string that is the combination
     * of username, matrikelNumber and email. Extremely unlikely that two students
     * with different credentials will get the same ID
     */
    private async createUserId(
            userName: string,
            email: string,
            matrikelNumber: number
        ): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(
            `${userName}:${email}:${matrikelNumber}`
        );
        let hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', data);
        
        // important: ID ultimately gets safed as an int64 and we dont want negative
        // ints, so set MSB to zero
        let viewedAsByteArray = new Uint8Array(hashBuffer);
        viewedAsByteArray[0] &= 0x7F;

        const view = new DataView(hashBuffer);
        return view.getBigUint64(0, false).toString();
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
            NOTE: The backend currently needs values like ID, role, and MatriculationNumber.
            THese concepts are not yet fully clear. How should frontend generate ID or
            Matriculation-Number for a new User? and what exactly are the roles?
            Will they be validated?

            So given this uncertainty frontend currently does the following:
            -It sends each new user with role "user" and hopes it is okay
            -It generates a random matriculation number from a range that corresponds to
             a uint16-type
            -Since UserIds should be unique, it hashes the combination "username+email+matriculation-
             Number" into a 64-bit integer with a leading zero
        */

        // we need the following data:
        // {id, username, email, matrikelNumber,role,password};

        // random matrikelNumber must be generated before the ID
        let matrikelNumber: number = this.generateMatrikelNumber();

        // now we can generate an ID
        let id: string = await this.createUserId(
            this.userName as string,
            this.email as string,
            matrikelNumber
        );

        // send to server
        this.authService.sendRegisterRequest(
            id,
            this.userName as string,
            this.email as string,
            matrikelNumber,
            "user",
            this.password as string,
        ).subscribe({
        
            // successful 2xx responses are emitted as "next" data by Angular HTTP response wrappers
            next: (response) => {
            
                optionalLog("Successful Register API call:",response.status,response.body);
                this.registerSuccessFlag.set(true);
                
                
            }, error: (err) => {
                
                // error messages are stored in .error property of Angular HTTP Response wrapper
                optionalLog("Unsuccessful Register API call:",err.status,err.error);
                this.registerSuccessFlag.set(false);
            }
        });
        this.isLoadingFlag.set(false);
    }
    
    
}
