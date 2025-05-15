import {Component, Input, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthService} from "../../../services/auth/auth.service";
import {IMenuType} from "../../../models/menu";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() set menuType (type: IMenuType) {
    console.log('new type', type)
    this.settingsActive = this.menuType?.type === "extended";
    this.items = this.initMenuItems();
  };

  items: MenuItem[];
  time: Date;
  private timer: number;
  private settingsActive: boolean = false;

  constructor(private authService: AuthService) {
  }

  get userName(): string {
    return this.authService.user?.login || '';
  }

  ngOnInit(): void {
    this.items = this.initMenuItems();
    this.timer = window.setInterval(() => {
      this.time = new Date();
    }, 1000)
  }

  ngOnChanges(ev: SimpleChanges): void {
    // this.settingsActive = this.menuType?.type === "extended";
    // this.items = this.initMenuItems();
  }

  ngOnDestroy() {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
  }

  initMenuItems(): MenuItem[] {
    return [
      {
        label: 'Билеты',
        routerLink: ['ticket-list']
      },
      {
        label: 'Настройки',
        routerLink: ['/tickets/settings'],
      },
      {
        label: 'Заказы',
        routerLink: ['/tickets/orders'],
      },

      {
        label: 'Выйти',
        routerLink: ['/auth']
      },
    ];
  }


  onLogout() {
    this.authService.logout()
  }
}
