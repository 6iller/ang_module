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
  password: string;
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
        login: new FormControl(''),
  email: new FormControl(''),
  password: new FormControl(''), 
  cardNumber: new FormControl(''),

    // с валидаторами
// login: new FormControl('',[Validators.required, Validators.minLength(3)]),
//   email: new FormControl('', [Validators.required, Validators.email]),
//   password: new FormControl(''[Validators.required, Validators.minLength(6)]), 
//   cardNumber: new FormControl('',[Validators.required, Validators.minLength(4)]),

    });
  }
  
  registration(): void {
    if (this.registrationForm.invalid) {
      this.messageService.add({severity:'warn', summary:'Ошибка', detail:'заполните все обязательные поля.'});
      // помечаем поля как touched для отображения ошибок
      Object.values(this.registrationForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
const Test =this.registrationForm.getRawValue()
const userObj = {
    login: this.registrationForm.value.login,
    email: this.registrationForm.value.email,
    password: this.registrationForm.value.password, 
    cardNumber: this.registrationForm.value.cardNumber,
};
    this.http.post<IUser>('http://localhost:3000/users/', userObj).subscribe(
      (data) => { // data здесь будет IUser, если сервер его вернет
        this.messageService.add({ severity: 'success', summary: 'Регистрация прошла успешно' });
        this.registrationForm.reset();
      },
      (error) => {
        // error- для сообщения от сервера
        const detailMessage = error.error && error.error.message ? error.error.message : 'Пользователь уже зарегистрирован или произошла ошибка на сервере.';
        this.messageService.add({ severity: 'warn', summary: 'Ошибка регистрации', detail: detailMessage });
        console.error('ошибка регистрации:', error);
      }
    );
  }
  ngOnDestroy(): void {

  }

  onAuth(): void {
    if (this.password !== this.repeatPassword) {
      this.messageService.add({severity: 'error', summary: 'пароли не совпадают'});
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
    this.messageService.add({severity: 'успешно', summary: 'вы зарегистрированы'});
  }

}
