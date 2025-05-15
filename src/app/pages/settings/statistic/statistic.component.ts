import {Component, OnInit} from '@angular/core';
import {StatisticService} from "../../../services/statistic/statistic.service";
import {ICustomStatisticUser} from "../../../models/users";

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
  columns = [
    {field: 'name', header: 'Name'},
    {field: 'company', header: 'Company'},
    {field: 'phone', header: 'Phone'},
    {field: 'city', header: 'City'},
    {field: 'street', header: 'Street'},
  ];
  users: ICustomStatisticUser[];

  constructor(
    private statisticService: StatisticService
  ) {
  }

  ngOnInit(): void {
    this.statisticService.getUserStatistic().subscribe((data) => {
      this.users = data
    })
  }

}
