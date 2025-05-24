import { Component, OnInit } from '@angular/core'
import {AuthService} from "../../../services/auth/auth.service";
import {IUser} from "../../../models/users";
import {MessageService} from "primeng/api";
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerError } from 'src/app/models/server';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
})

export class AuthorizationComponent implements OnInit {
  login: string;
  password: string;
  cardNumber: string = '';
  isRememberMe: boolean;
  isHaveCard: boolean;
  constructor(private authService: AuthService, private messageService: MessageService, private http: HttpClient,
    private router: Router,) { }

    ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  //   onAuth(): void {
  //   if (!this.login || !this.password) {
  //     this.messageService.add({severity:'warn', summary:'Ошибка', detail:'Введите логин и пароль'});
  //     return;
  //   }

  //   const authUser = { login: this.login, password: this.password };
   

  //   this.http.post<IUser>(`http://localhost:3000/users/${authUser.login}`, authUser).
  //   subscribe((data: IUser)     => { // если авторизация успешна и сервер возвращает пользователя, то:
  //       this.messageService.add({severity:'success', summary:'Успех', detail:'Авторизация прошла успешно'});
  //        this.authService.auth(data)
  //       // редирект 
  //       this.router.navigate(['/tickets']); 
  //     },
  //     (error) => {
  //       const detailMessage = error.error && error.error.message ? error.error.message : 'Ошибка авторизации. Неверный логин или пароль.';
  //       this.messageService.add({ severity: 'warn', summary: 'Ошибка авторизации', detail: detailMessage });
  //       console.error('Authorization error:', error);
  //     }
  //   );
  // }

  onAuth(ev: Event): void {
    const authUser: IUser = {
      password: this.password,
      login: this.login,
      cardNumber: this.cardNumber
    }
    this.http.post<{access_token:string, id: string}>
  ('http://localhost:3000/users/'+authUser.login, authUser).subscribe((data)=> {
    authUser.id=data.id;
    // this.authService.setUser(authUser);
    const token: string = data.access_token;
    this.authService.setToken(token);
    this.router.navigate(['/tickets']);
        }, 
        (err: HttpErrorResponse)=> {
          const serverError= <ServerError>err.error;
          this.messageService.add({severity:'warn', summary:serverError.errorText});
        })
}

}