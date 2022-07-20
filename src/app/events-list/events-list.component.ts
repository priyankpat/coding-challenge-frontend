import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EventService } from '../api/event.service';
import { EventDetailComponent } from '../event-detail';
import { Event, Events } from '../types';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'outside',
    'city',
    'country',
    'remote',
    'organizer',
    'date',
    'details'
  ];
  dataSource = new MatTableDataSource<Event>();
  length: number = 0;
  pageIndex: number = 0;
  pageSize: number = 0;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  private _unsubscribeAll: Subject<any>;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private _eventService: EventService, private _dialog: MatDialog) {
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit(): void {
    this.range.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter((dates) => !!dates.start && !!dates.end)
      )
      .subscribe((dates) => {
        this.fetchEvents(
          this.paginator?.pageIndex,
          this.paginator?.pageSize,
          dates.start?.toISOString(),
          dates.end?.toISOString()
        ).subscribe();
      });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator!;
      this.paginator.page.subscribe((page) => {
        this.fetchEvents(page.pageIndex, page.pageSize).subscribe();
      });

      console.log(this.paginator);

      this.fetchEvents(
        this.paginator?.pageIndex,
        this.paginator?.pageSize
      ).subscribe();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  formatDate(date: string): string {
    return moment(date).format('YYYY-MM-DD');
  }

  showEventDetail(eventId: string): void {
    if (!!eventId) {
      const dialog = this._dialog.open(EventDetailComponent, {
        data: {
          eventId
        }
      });
    }
  }

  private fetchEvents(page?: number, size?: number, from?: string, until?: string): Observable<Events> {
    return this._eventService.getAllEvents(page, size, from, until).pipe(
      takeUntil(this._unsubscribeAll),
      filter((resp) => resp && resp.events.length > 0),
      tap((response) => {
        const { events, totalItems, totalPages, currentPage } = response;
        this.length = totalItems;
        this.pageIndex = currentPage;
        // this.pageSize = totalPages;
        this.dataSource.data = events;
      })
    );
  }
}
