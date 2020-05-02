import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  isDataSaved: () => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<CanComponentDeactivate> {

  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean {
    console.log(nextState.url)
    //if (nextState.url === '/dashboard/design-template' || nextState.url == '/dashboard/resume-operations') return true;

    return component.isDataSaved();
  }

}


// canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {
//   if(nextState.url === '/dashboard/design-template' || nextState.url == '/dashboard/resume-operations') return true;

//   return component.isDataSaved();
// }