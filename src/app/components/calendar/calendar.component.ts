import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { AttendanceService } from '../../services/attendance.service';
import {
  subMonths,
  addMonths,
  addDays,
  addWeeks,
  subDays,
  subWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay
} from 'date-fns';
type CalendarPeriod = 'day' | 'week' | 'month';

function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: addDays,
    week: addWeeks,
    month: addMonths
  }[period](date, amount);
}
function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: subDays,
    week: subWeeks,
    month: subMonths
  }[period](date, amount);
}

function startOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: startOfDay,
    week: startOfWeek,
    month: startOfMonth
  }[period](date);
}

function endOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: endOfDay,
    week: endOfWeek,
    month: endOfMonth
  }[period](date);
}

export const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#388e3c',
    secondary: '#c8e6c9'
  }
};


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  title: string = "Calendar";
  view: CalendarPeriod = 'month';
  viewDate: Date = new Date();
  loaded: boolean = false;
  prevBtnDisabled: boolean = false;

  nextBtnDisabled: boolean = false;

  minDate: Date = new Date(new Date().getFullYear(), 1, 1);

  maxDate: Date = new Date();


  constructor(private attend: AttendanceService) {

  }

  events: Array<CalendarEvent<{ incrementsBadgeTotal: boolean }>>;

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      day.badgeTotal = day.events.filter(
        event => event.meta.incrementsBadgeTotal
      ).length;
      if (day.date.getDay() == 1) {
        day.cssClass = 'monday';
      }
    });
  }

  ngOnInit() {
    this.events = [];
    this.getEntries().then(() => {
      this.loaded = true;
    });
  }

  async getEntries() {
    await this.attend.getEntries().then(snapshots => {
      snapshots.forEach(data => {
        let entry = data.val();
        this.events.push({
          title: `${(entry.type == 'entry' ? 'Entered' : 'Exited')}  at ${new Date(entry.time).toLocaleTimeString()}`,
          start: new Date(entry.time),
          color: entry.type == 'entry' ? colors.green : colors.red,
          meta: {
            incrementsBadgeTotal: false
          }
        });
      });
    }, error => {
      console.log(error.message);
    });
  }



  changeDate(date: Date): void {
    this.viewDate = date;
    this.dateOrViewChanged();
  }

  dateOrViewChanged(): void {
    this.prevBtnDisabled = !this.dateIsValid(
      endOfPeriod(this.view, subPeriod(this.view, this.viewDate, 1))
    );
    this.nextBtnDisabled = !this.dateIsValid(
      startOfPeriod(this.view, addPeriod(this.view, this.viewDate, 1))
    );
    if (this.viewDate < this.minDate) {
      this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      this.changeDate(this.maxDate);
    }
  }

  increment(): void {
    this.changeDate(addPeriod(this.view, this.viewDate, 1));
  }

  decrement(): void {
    this.changeDate(subPeriod(this.view, this.viewDate, 1));
  }

  today(): void {
    this.changeDate(new Date());
  }

  dateIsValid(date: Date): boolean {
    return date >= this.minDate && date <= this.maxDate;
  }

}
