import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  http = inject(HttpClient);
  private weatherCodes: object = {
    cloudy: [
      'partlycloudy_day',
      'partlycloudy_night',
      'partlycloudy_polartwilight',
      'cloudy',
    ],
    drizzle: [
      'lightsnowshowers_day',
      'lightsnowshowers_night',
      'lightsnowshowers_polartwilight',
      'lightrainshowers_day',
      'lightrainshowers_night',
      'lightrainshowers_polartwilight',
      'lightsleet',
      'lightsleetshowers_day',
      'lightsleetshowers_night',
      'lightsleetshowers_polartwilight',
      'lightrain',
      'fog',
      'lightrainshowersandthunder_day',
      'lightrainshowersandthunder_night',
      'lightrainshowersandthunder_polartwilight',
      'lightsnowandthunder',
      'lightssleetshowersandthunder_day',
      'lightssleetshowersandthunder_night',
      'lightssleetshowersandthunder_polartwilight',
      'lightsleetandthunder',
    ],
    rain: [
      'heavyrainandthunder',
      'heavysnowandthunder',
      'rainandthunder',
      'heavysleetshowersandthunder_day',
      'heavysleetshowersandthunder_night',
      'heavysleetshowersandthunder_polartwilight',
      'heavysnow',
      'heavyrainshowers_day',
      'heavyrainshowers_night',
      'heavyrainshowers_polartwilight',
      'heavyrain',
      'heavysleetshowers_day',
      'heavysleetshowers_night',
      'heavysleetshowers_polartwilight',
      'snow',
      'heavyrainshowersandthunder_day',
      'heavyrainshowersandthunder_night',
      'heavyrainshowersandthunder_polartwilight',
      'snowshowers_day',
      'snowshowers_night',
      'snowshowers_polartwilight',
      'snowshowersandthunder_day',
      'snowshowersandthunder_night',
      'snowshowersandthunder_polartwilight',
      'heavysleetandthunder',
      'rainshowersandthunder_day',
      'rainshowersandthunder_night',
      'rainshowersandthunder_polartwilight',
      'rain',
      'rainshowers_day',
      'rainshowers_night',
      'rainshowers_polartwilight',
      'sleetandthunder',
      'sleet',
      'sleetshowersandthunder_day',
      'sleetshowersandthunder_night',
      'sleetshowersandthunder_polartwilight',
      'rainshowersandthunder_day',
      'rainshowersandthunder_night',
      'rainshowersandthunder_polartwilight',
      'snowandthunder',
      'heavysnowshowersandthunder_day',
      'heavysnowshowersandthunder_night',
      'heavysnowshowersandthunder_polartwilight',
      'heavysnowshowers_day',
      'heavysnowshowers_night',
      'heavysnowshowers_polartwilight',
    ],
  };

  getClothing(): Observable<string> {
    return this.http
      .get<ForecastData>(`/metno?lat=${50}&lon=${14}`)
      .pipe(map((value) => this.weatherToClothing(value)));
  }

  private weatherToClothing(forecast: ForecastData): string {
    return forecast.properties.timeseries[0].data.next_12_hours.summary
      .symbol_code;
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
