import {errorResponseCreator} from "./errorResponseCreator";
import {UsernamePasswordInput} from "./UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {

    if(!options.email.includes("@")) {
        return errorResponseCreator("email", "Incorrect email")
    }
    if(options.username.length <= 2) {
        return errorResponseCreator("username", "Username's length must be longer")
    }
    if(options.password.length <= 2) {
        return errorResponseCreator("password", "Password's length must be longer")
    }
    if(options.username.includes("@")) {
        return errorResponseCreator("username", "Username cann't include an '@'.")
    }

    return null
}