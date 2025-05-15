import { Component, OnInit } from '@angular/core'
import {AuthService} from "../../../services/auth/auth.service";
import {IUser} from "../../../models/users";
import {MessageService} from "primeng/api";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  // onAuth(): void {
  //   const user: IUser = {
  //     login: this.login,
  //     password: this.password,
  //   }
  //   const result = this.authService.authUser(this.login, this.password, this.isRememberMe);
  //   if (result !== true) {
  //     this.messageService.add({severity:'error', summary: result});
  //     return;
  //   }
  //   this.messageService.add({severity:'success', summary: 'You are authorized!'});
  // }
    onAuth(): void {
    if (!this.login || !this.password) {
      this.messageService.add({severity:'warn', summary:'Ошибка', detail:'Введите логин и пароль'});
      return;
    }

    const authUser = { login: this.login, password: this.password }; // id не нужен для запроса авторизации

    // URL из вашего задания: 'http://localhost:3000/users/' + authUser.login
    // Это соответствует POST /users/:login на сервере.
    // В тело запроса отправляем authUser (логин и пароль).
    this.http.post<IUser>(`http://localhost:3000/users/${authUser.login}`, authUser).subscribe(
      (data: IUser) => { // data должна быть IUser, если авторизация успешна и сервер возвращает пользователя
        this.messageService.add({severity:'success', summary:'Успех', detail:'Авторизация прошла успешно'});
        // Здесь вы можете сохранить данные пользователя, например, в localStorage или в сервисе состояния
        // localStorage.setItem('currentUser', JSON.stringify(data));
        // this.userService.setCurrentUser(data);
        this.router.navigate(['tickets/tickets-list']); // или ваш целевой маршрут
      },
      (error) => {
        const detailMessage = error.error && error.error.message ? error.error.message : 'Ошибка авторизации. Неверный логин или пароль.';
        this.messageService.add({ severity: 'warn', summary: 'Ошибка авторизации', detail: detailMessage });
        console.error('Authorization error:', error);
      }
    );
  }
}