/* This file is for certain global variables like our backend's current base URL so
   we avoid hardcoding them into every single API service 
*/

export const API_BASE_URL = "http://localhost:8080";

export const DEBUG_MODE = true;

// if DEBUG_MODE is set this optionalLog can take a number of args and prints it to console
// [the BROWSER console since Angular runs in the browser, so click "inspect" in your web page
// to see it]
export const optionalLog = (...args: unknown[]) => {
    if (DEBUG_MODE){
        console.log(args.join(" "));
    }
};