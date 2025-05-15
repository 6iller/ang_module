import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TicketsRoutingModule} from './tickets-routing.module';
import {TicketsComponent} from './tickets.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {TicketListComponent} from './ticket-list/ticket-list.component';
import {AsideComponent} from './aside/aside.component';
import {MenubarModule} from "primeng/menubar";
import {CardModule} from 'primeng/card';
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {BlockStyleDirective} from "../../directive/block-style.directive";
import {CalendarModule} from "primeng/calendar";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    TicketsComponent,
    HeaderComponent,
    FooterComponent,
    TicketListComponent,
    AsideComponent,
    BlockStyleDirective
  ],
  imports: [
    CommonModule,
    TicketsRoutingModule,
    MenubarModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    CalendarModule,
    ToastModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    MessageService
  ]
})
export class TicketsModule {
}
