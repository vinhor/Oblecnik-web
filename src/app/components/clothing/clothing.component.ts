import { Component, inject, signal, WritableSignal } from '@angular/core';
import { OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clothing',
  imports: [],
  templateUrl: './clothing.component.html',
  styleUrl: './clothing.component.css',
})
export class ClothingComponent implements OnDestroy, OnInit {
  http = inject(HttpClient);
  subscription!: Subscription;
  fetchingError: WritableSignal<any> = signal<any>('');

  processForecastData(forecast: ForecastData) {
    console.log(forecast);
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.http
      .get<ForecastData>(
        `https://oblecnik-web.pages.dev/metno?lat=${50}&lon=${14}`
      )
      .subscribe({
        next: (value) => {
          this.processForecastData(value);
        },
        error: (error) => {
          this.fetchingError.set(JSON.stringify(error));
        },
      });
  }
}

type WeatherData = {
  time: string;
  data: {
    instant: {
      details: {
        air_pressure_at_sea_level: number;
        air_temperature: number;
        cloud_area_fraction: number;
        relative_humidity: number;
        wind_from_direction: number;
        wind_speed: number;
      };
    };
    next_12_hours: {
      summary: {
        symbol_code: string;
      };
      details: {};
    };
    next_1_hours: {
      summary: {
        symbol_code: string;
      };
      details: {
        precipitation_amount: number;
      };
    };
    next_6_hours: {
      summary: {
        symbol_code: string;
      };
      details: {
        precipitation_amount: number;
      };
    };
  };
};

type ForecastData = {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    meta: {
      updated_at: string;
      units: {
        air_pressure_at_sea_level: string;
        air_temperature: string;
        cloud_area_fraction: string;
        precipitation_amount: string;
        relative_humidity: string;
        wind_from_direction: string;
        wind_speed: string;
      };
    };
    timeseries: WeatherData[];
  };
};
