import { Person } from "./people.type";

export interface Event {
  id: string;
  name: string;
  isOutside: boolean;
  city?: string;
  country?: string;
  remote: boolean;
  organizers: Person[];
  date: string;
  weather?: Weather;
}

export interface Events {
  totalItems: number;
  events: Event[];
  totalPages: number;
  currentPage: number;
}

export interface Weather {
  temperatureInDegreesCelsius: number;
	chanceOfRain: number;
}
