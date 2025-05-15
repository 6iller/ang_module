import {Injectable} from '@angular/core';
import {BehaviorSubject, map, of, switchAll, switchMap, withLatestFrom} from "rxjs";
import {ORDERMOCK, TOrder, TOrderProps} from "../../shared/mock/orders";
import {TreeNode} from "primeng/api";
import {TicketRestService} from "../ticket-rest/ticket-rest.service";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private groupOrders = new BehaviorSubject(false);
  readonly groupOrders$ = this.groupOrders.asObservable();

  constructor(
    private ticketServiceRest: TicketRestService
  ) {
  }

  getOrders() {
    return of(ORDERMOCK).pipe(
      withLatestFrom(this.groupOrders$),
      switchMap(([orders, group]) => {
        return of(orders).pipe(
          map((data) => ([this.transformOrderData(data, group)]))
        )
      })
    )
  }

  initGroupOrder(val: boolean) {
    this.groupOrders.next(val);
  }

  transformOrderData(data: TOrder[], group: boolean, groupBy: TOrderProps = 'name' as TOrderProps) {
    const treeNodeObj: TreeNode = {
      children: [],
      data: {
        name: 'Orders',
      },
      expanded: true,
    }
    if (!data?.length) {
      return <TreeNode<TOrder[]>>[]
    }
    if (group) {
      return data.reduce((acc, cur) => {
        const target = acc.children.find(e => e.data[groupBy] === cur[groupBy])

        if (target) {
          target.children.push({data: cur})
        } else {
          acc.children.push({data: {name: cur.name}, children: [{data: cur}]})
        }
        return acc;
      }, treeNodeObj)
    }
    treeNodeObj.children = data.map(e => ({data: e}))
    return treeNodeObj;
  }

  getRandomNearestEvent(type: number) {
    return this.ticketServiceRest.getRandomNearestEvent(type)
  }

}
