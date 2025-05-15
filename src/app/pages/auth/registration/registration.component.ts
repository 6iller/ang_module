import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {AuthService} from "../../../services/auth/auth.service";
import {IUser} from "../../../models/users";
import {ConfigService} from "../../../services/config/config.service";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup; // доб. для управления формой
  login: string;
  password: string; // внимание. на сервере psw, легче на сервере сделать password
  repeatPassword: string;
  cardNumber: string = '';
  email: string;
  isRemember: boolean;
  isShowCardNumber: boolean;
  id: string;

  constructor(
    private http: HttpClient, // доб.
    private authService: AuthService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    
    this.isShowCardNumber = ConfigService.config.useUserCard

    // доб. Инициализация формы
    this.registrationForm = new FormGroup({
      // login: new FormControl(''), // валидаторы по необходимости
      // email: new FormControl(''),
      // password: new FormControl(''),
      // cardNumber: new FormControl(''), // 
        login: new FormControl(''),
  email: new FormControl(''),
  password: new FormControl(''), // ИЗМЕНИЛ password на psw
  cardNumber: new FormControl(''),
      // id: new FormControl('') // ID обычно не устанавливается клиентом при регистрации
    });
  }
  
  registration(): void {
    if (this.registrationForm.invalid) {
      this.messageService.add({severity:'warn', summary:'Ошибка', detail:'Пожалуйста, заполните все обязательные поля.'});
      // Пометить все поля как touched для отображения ошибок
      Object.values(this.registrationForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    // const userObj: IUser = this.registrationForm.value;
    // Убедитесь, что userObj соответствует интерфейсу IUser.
    // Поле 'id' не должно отправляться или должно быть null/undefined при создании нового пользователя,
    // так как оно обычно генерируется сервером или базой данных.
    // Если ваше API ожидает id, то нужно его как-то формировать или оставить пустым.
    // В вашем IUser id есть, так что если бэкенд ожидает его пустым или не ожидает вовсе, надо скорректировать.
    // Для чистоты, при создании нового пользователя id лучше не отправлять или отправлять как null.
    // Но так как в вашем IUser оно есть и в DTO на сервере, я оставлю его в userObj.
    // const userToSend = { ...userObj, id: undefined }; // Как вариант, если id не нужен при создании
const userObj = {
    login: this.registrationForm.value.login,
    email: this.registrationForm.value.email,
    password: this.registrationForm.value.psw, // ИЗМЕНИЛ password на psw
    cardNumber: this.registrationForm.value.cardNumber,
    // id: undefined // id не отправляем при создании
};
    this.http.post<IUser>('http://localhost:3000/users/', userObj).subscribe(
      (data) => { // data здесь будет IUser, если сервер его вернет
        this.messageService.add({ severity: 'success', summary: 'Регистрация прошла успешно' });
        this.registrationForm.reset(); // Очистить форму после успешной регистрации
        // тут можно, например, перенаправить пользователя на страницу входа
      },
      (error) => {
        // error.error может содержать сообщение от сервера
        const detailMessage = error.error && error.error.message ? error.error.message : 'Пользователь уже зарегистрирован или произошла ошибка на сервере.';
        this.messageService.add({ severity: 'warn', summary: 'Ошибка регистрации', detail: detailMessage });
        console.error('Registration error:', error);
      }
    );
  }
  ngOnDestroy(): void {

  }

  onAuth(): void {
    if (this.password !== this.repeatPassword) {
      this.messageService.add({severity: 'error', summary: 'Passwords are not the same'});
      return
    }

    const user: IUser = {
      login: this.login,
      password: this.password,
      id: this.id,
      cardNumber: this.cardNumber,
      email: this.email,
    }
    const result = this.authService.addUser(user, this.isRemember);
    if (result !== true) {
      this.messageService.add({severity: 'error', summary: result});
      return;
    }
    this.messageService.add({severity: 'success', summary: 'You are registered and authorized!'});
  }

}
