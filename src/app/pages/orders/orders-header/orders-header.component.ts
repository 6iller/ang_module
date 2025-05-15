import {Component, OnInit} from '@angular/core';
import {OrdersService} from "../../../services/orders/orders.service";

@Component({
  selector: 'app-orders-header',
  templateUrl: './orders-header.component.html',
  styleUrls: ['./orders-header.component.scss']
})
export class OrdersHeaderComponent implements OnInit {

  constructor(
    private orderService: OrdersService,
  ) {
  }

  ngOnInit(): void {
  }

  groupOrders(event: any) {
    this.orderService.initGroupOrder(event.checked)
  }
}
