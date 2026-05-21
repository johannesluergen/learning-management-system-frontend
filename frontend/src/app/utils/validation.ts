
export function isUserNameValid(userName?: string | null){
    return !!userName; // this will also catch empty strings
}
export const badUserNameDescription = "Username may not be empty";

export function isEmailValid(email?: string | null){
    return (!!email) && email.includes("@");
}
export const badEmailDescription = "Email may not be empty and must contain @";

export function isPasswordValid(password?: string | null){
    return (!!password) && (password.length > 3);
}
export const badPasswordDescription = "Password may not be empty and be at least 4 characters";