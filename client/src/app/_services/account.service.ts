import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators'
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
baseURL = 'https://localhost:5001/api/';
private currentUserSource=new ReplaySubject<User>(1);// 1= size of the buffer
currentUser$ =this.currentUserSource.asObservable();  //$ bc is an observable

  constructor(private http: HttpClient) { }

  login(model : any){
   
    return this.http.post(this.baseURL + 'account/login', model).pipe(
      map((response : User ) => {
        const user=response;
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })

    );
  }


  register(model: any){
    return this.http.post(this.baseURL+ 'account/register', model).pipe(
      map((user : User) => {
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }
  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
