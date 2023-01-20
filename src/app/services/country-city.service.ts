import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root',
})
export class CountryCityService {
  private baseURL = 'https://countriesnow.space/api/v0.1';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http
      .get<{ error: boolean; msg: string; data: Country[] }>(
        `${this.baseURL}/countries/info?returns=name`
      )
      .pipe(
        map(({ error, data }) => {
          if (error) {
            return [];
          } else {
            return data;
          }
        })
      );
  }

  getCities(country: string): Observable<string[]> {
    return this.http
      .post<{ error: boolean; msg: string; data: string[] }>(
        `${this.baseURL}/countries/cities`,
        {
          country,
        }
      )
      .pipe(
        map(({ error, data }) => {
          if (error) {
            return [];
          } else {
            return data;
          }
        })
      );
  }
}
