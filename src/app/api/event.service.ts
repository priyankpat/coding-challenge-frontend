import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event, Events } from '../types';
import { BaseAPI } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseAPI {

  constructor(private _httpClient: HttpClient) { super(); }

  getAllEvents(page?: number, size?: number, from?: string, until?: string): Observable<Events> {
    let url = `${this.baseUrl}/api/events?page=${page}&size=${size}&from=${from ? from : ''}&until=${until ? until : ''}`;
    return this._httpClient.get<Events>(url);
  }

  getEvent(eventId: string): Observable<Event> {
    let url = `${this.baseUrl}/api/events/${eventId}`;
    return this._httpClient.get<Event>(url);
  }
}
