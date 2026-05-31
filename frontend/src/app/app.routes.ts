import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Homepage } from './homepage/homepage';

const TITLE_PREFIX: string = "LMS-";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
    },
    {
        path: "login",
        component: Login,
        title: TITLE_PREFIX+"Login"
    },
    {
        path: "register",
        component: Register,
        title: TITLE_PREFIX+"Register"
    },
    {
        path: "homepage",
        component: Homepage,
        title: TITLE_PREFIX+"Homepage"
    }

];
