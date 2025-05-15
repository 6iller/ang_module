import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ITour, ITourTypeSelect} from "../../../models/tours";
import {TicketStorageService} from "../../../services/ticket-storage/ticket-storage.service";
import {Router} from "@angular/router";
import {TicketService} from "../../../services/ticket/ticket.service";
import {
  buffer, catchError, combineLatest, combineLatestAll, concat, concatAll,
  concatMap,
  debounceTime,
  delay, every, exhaust, exhaustMap,
  filter, first, forkJoin, from,
  fromEvent, isEmpty, last,
  map,
  mergeMap, Observable,
  of, range, reduce, skip, startWith,
  Subscription,
  switchMap, take,
  tap, timeout, toArray,merge
} from "rxjs";
import {logMessages} from "@angular-devkit/build-angular/src/builders/browser-esbuild/esbuild";
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../../services/auth/auth.service";


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TicketListComponent implements OnInit {
  private tourUnsubscriber: Subscription;
  search: string = '';
  private ticketFilterType: ITourTypeSelect = {label: 'Все', value: 'all'};
  inputForm = new FormGroup({
    inputControl: new FormControl('')
  })

  @ViewChild('tourWrap') tourWrap: ElementRef;
  @ViewChild('ticketSearch') ticketSearch: ElementRef;

  searchTicketSub: Subscription;

  constructor(
    private router: Router,
    private ticketStorage: TicketStorageService,
    private ticketService: TicketService,
    private userService: AuthService
  ) {
  }

  get tickets() {
    return this.ticketStorage.tickets;
  }

  get filteredTickets() {
    const search = this.search.toLowerCase()
    const filterDate = this.ticketFilterType.date ? new Date(this.ticketFilterType.date).toISOString().split('T')[0] : null;
    return this.ticketStorage.tickets
      .filter(({name, type, date}) =>
        (this.ticketFilterType.value === 'all' || type === this.ticketFilterType.value)
        && (!filterDate || filterDate === date)
        && (!this.search || name.toLowerCase().includes(search)));
  }

  ngOnInit(): void {
    this.ticketStorage.fetchTickets();
    this.tourUnsubscriber = this.ticketService.getTicketTypeObservable().subscribe((data: ITourTypeSelect) => {
      if (data) {
        this.ticketFilterType = {...this.ticketFilterType, ...data};
      }
    });
  }

  ngOnDestroy() {
    this.tourUnsubscriber.unsubscribe();
    this.searchTicketSub.unsubscribe();
  }

  ngAfterViewInit() {
    let min = 1000;
    let max = 5000 ;

    const fromEventObserver = fromEvent<KeyboardEvent>(this.ticketSearch.nativeElement, 'keyup', {passive: false});
    this.searchTicketSub = fromEventObserver.pipe(
      map((ev) => +ev.key),
      // filter((key: string) => key === '5')
     mergeMap((val) => of(val).pipe(delay((Math.floor(Math.random() * (max - min + 1)) + min)))),
     // startWith('hi'),
      tap((val) => {
        console.log('pipe value tap')
      }),
      skip(0),
     //  timeout(5000),
     //  take(2),
     // every((val) => {
     //   return val == 3;
     // }),
      // reduce((acc, val) => acc + val, 0)

    ).subscribe((ev) => {
      console.log('search val', ev)
    }, (err) => {
      console.log('err', err)
    })

    // other observer
    const observer2 = from([1,2,3,4]);
    const observer3 = from(['a','b','c','d']);

    // combineLatest([this.userService.basket$, observer3]).subscribe((data: any) => {
    //   console.log('combineLatest data', data)
    // })


    // combineLatest(observer2, fromEventObserver, observer3).subscribe((data) => {
    //   console.log('combineLatest data', data)
    // })
    //
    // concat(observer2, fromEventObserver.pipe(take(5)), observer3).subscribe((data) => {
    //   console.log('concat data', data)
    // })
    //
    // forkJoin([observer2, fromEventObserver.pipe(take(1)), observer3]).subscribe((data) => {
    //   console.log('forkJoin data', data)
    // });
    concat(this.userService.basket$, fromEventObserver, observer3).subscribe((data: any) => {
      console.log('merge data', data)
    })



    this.userService.basket$.pipe(buffer(this.inputForm.valueChanges)).subscribe((data) => {
      console.log('buffer', data);
    })



  }

  goToTicket(item: ITour) {
    this.router.navigate([`/tickets/ticket/${item.id}`]);
  }
}
