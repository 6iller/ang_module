import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {TreeNode} from "primeng/api";
import {TOrder} from "../../shared/mock/orders";
import {OrdersService} from "../../services/orders/orders.service";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private _destroyer: Subscription;
  tableData$: Observable<TreeNode<TOrder[]>[]>;

  constructor(
    private orderService: OrdersService,
    private userService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.userService.user$.subscribe((data) => {
      console.log('user', data)
    })
    this.initOrders();

    this._destroyer = this.orderService.groupOrders$.subscribe((data) => {
      this.initOrders()
    })
  }

  ngOnDestroy() {
    this._destroyer.unsubscribe()
  }

  initOrders() {
    this.tableData$ = this.orderService.getOrders();
  }
}
