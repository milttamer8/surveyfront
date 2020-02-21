import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class ActivateGuard implements CanActivate {
  constructor(private router:Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // throw new Error("Method not implemented.");
    if ((localStorage.getItem("user_id") === undefined) ||  (localStorage.getItem("user_id") === '')){
      this.router.navigate(['/', 'login']);
    } else {
      return true;
    }
  }  
}
