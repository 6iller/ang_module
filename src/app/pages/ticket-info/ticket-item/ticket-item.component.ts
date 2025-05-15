import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TicketStorageService} from "../../../services/ticket-storage/ticket-storage.service";
import {INearestTour, ITour, ITourLocation} from "../../../models/tours";
import {IUser} from "../../../models/users";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth/auth.service";
import {forkJoin, fromEvent, Subscription} from "rxjs";
import {TicketService} from "../../../services/ticket/ticket.service";

@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent implements OnInit {
  ticket: ITour;
  isNotFound: boolean = false;

  user: IUser;
  userForm: FormGroup;

  nearestTours: INearestTour[] = [];
  tourLocations: ITourLocation[] = []
  ticketSearchValue: string = '';
  @ViewChild('ticketSearch') ticketSearch: ElementRef;
  private ticketSearchSubsc: Subscription;
  private ticketRestSub: Subscription;
  searchTypes = [1, 2, 3];

  constructor(
    private route: ActivatedRoute,
    private ticketStorage: TicketStorageService,
    private authService: AuthService,
    private ticketService: TicketService
  ) {
  }

  ngOnInit(): void {
    this.ticketStorage.fetchTickets().subscribe(this.setCurrentTicket.bind(this));
    this.setCurrentTicket();

    this.user = this.authService.user!;

    this.userForm = new FormGroup({
      firstName: new FormControl('', {validators: Validators.required}),
      lastName: new FormControl('', [Validators.required, Validators.minLength(5)]),
      cardNumber: new FormControl(''),
      birthday: new FormControl(''),
      age: new FormControl(22),
      citizenship: new FormControl(''),
    })

    forkJoin([this.ticketService.getNearestTours(), this.ticketService.getTourLocations()]).subscribe(([tours, locations]) => {
      this.tourLocations = locations;
      this.nearestTours = this.ticketService.transformData(tours, locations);
    })
  }

  ngAfterViewInit() {
    console.log(this.ticketSearch)
    if (!this.ticketSearch) {
      return;
    }
    const fromEventObserver = fromEvent(this.ticketSearch.nativeElement, 'keyup');
    this.ticketSearchSubsc = fromEventObserver.subscribe((e) => this.initSearchTour())
  }

  ngOnDestroy() {
    this.ticketSearchSubsc?.unsubscribe()
  }

  getTourCountry(tour: INearestTour) {
    return this.tourLocations.find(({id}) => tour.locationId === id)?.name || '-';
  }

  ngOnChange() {
    this.setCurrentTicket();
  }

  setCurrentTicket() {

    const routerId = this.route.snapshot.paramMap.get('id');

    if (routerId) {
      const ticket = this.ticketStorage.getTicket(routerId);
      if (!ticket) {
        this.isNotFound = true;
        return;
      }
      this.isNotFound = false;
      this.ticket = ticket;
    }


  }

  selectDate(ev: Date | PointerEvent) {
    const selected = ev instanceof PointerEvent ? undefined : ev
    this.userForm.patchValue({
      'birthday': selected
    })
  }

  onSubmit() {
    console.log(this.userForm.value)
    this.ticketService.sendTourData(this.userForm.value).subscribe(console.log)
  }

  initSearchTour() {
    console.log('initSearchTour')
    const type = Math.floor(Math.random() * this.searchTypes.length)
    if (this.ticketRestSub && !this.ticketRestSub.closed) {
      this.ticketRestSub.unsubscribe();
    }

    this.ticketRestSub = this.ticketService.getRandomNearestEvent(type).subscribe((data: any) => {
      this.nearestTours = this.ticketService.transformData([data], this.tourLocations)
    })
  }
}
