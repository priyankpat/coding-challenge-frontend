import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, Subject, takeUntil } from 'rxjs';
import { EventService } from '../api/event.service';
import { Event } from '../types';

interface IData {
  eventId: string;
}

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event?: Event;
  loading: boolean = false;

  private _unsubscribeAll: Subject<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IData,
    private _eventService: EventService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    const { eventId } = this.data;

    if (eventId) {
      this.loading = true;

      this._eventService.getEvent(eventId)
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter((resp) => !!resp && !!resp.id),
      )
      .subscribe((response) => {
        this.event = response;
        this.loading = false;
      });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
