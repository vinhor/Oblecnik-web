import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  http = inject(HttpClient);
  private weatherCodes = {
    cloudy: [
      "partlycloudy_day",
      "partlycloudy_night",
      "partlycloudy_polartwilight",
      "cloudy",
    ],
    drizzle: [
      "lightsnowshowers_day",
      "lightsnowshowers_night",
      "lightsnowshowers_polartwilight",
      "lightrainshowers_day",
      "lightrainshowers_night",
      "lightrainshowers_polartwilight",
      "lightsleet",
      "lightsleetshowers_day",
      "lightsleetshowers_night",
      "lightsleetshowers_polartwilight",
      "lightrain",
      "fog",
      "lightrainshowersandthunder_day",
      "lightrainshowersandthunder_night",
      "lightrainshowersandthunder_polartwilight",
      "lightsnowandthunder",
      "lightssleetshowersandthunder_day",
      "lightssleetshowersandthunder_night",
      "lightssleetshowersandthunder_polartwilight",
      "lightsleetandthunder",
    ],
    rain: [
      "heavyrainandthunder",
      "heavysnowandthunder",
      "rainandthunder",
      "heavysleetshowersandthunder_day",
      "heavysleetshowersandthunder_night",
      "heavysleetshowersandthunder_polartwilight",
      "heavysnow",
      "heavyrainshowers_day",
      "heavyrainshowers_night",
      "heavyrainshowers_polartwilight",
      "heavyrain",
      "heavysleetshowers_day",
      "heavysleetshowers_night",
      "heavysleetshowers_polartwilight",
      "snow",
      "heavyrainshowersandthunder_day",
      "heavyrainshowersandthunder_night",
      "heavyrainshowersandthunder_polartwilight",
      "snowshowers_day",
      "snowshowers_night",
      "snowshowers_polartwilight",
      "snowshowersandthunder_day",
      "snowshowersandthunder_night",
      "snowshowersandthunder_polartwilight",
      "heavysleetandthunder",
      "rainshowersandthunder_day",
      "rainshowersandthunder_night",
      "rainshowersandthunder_polartwilight",
      "rain",
      "rainshowers_day",
      "rainshowers_night",
      "rainshowers_polartwilight",
      "sleetandthunder",
      "sleet",
      "sleetshowersandthunder_day",
      "sleetshowersandthunder_night",
      "sleetshowersandthunder_polartwilight",
      "rainshowersandthunder_day",
      "rainshowersandthunder_night",
      "rainshowersandthunder_polartwilight",
      "snowandthunder",
      "heavysnowshowersandthunder_day",
      "heavysnowshowersandthunder_night",
      "heavysnowshowersandthunder_polartwilight",
      "heavysnowshowers_day",
      "heavysnowshowers_night",
      "heavysnowshowers_polartwilight",
    ],
  };

  getClothing(): Observable<ClothingSummary> {
    return this.http
      .get<ForecastData>(`/metno?lat=${50}&lon=${14}`) // CF function, because User-Agent
      .pipe(map((value) => this.weatherToClothing(value)));
  }

  private weatherToClothing(forecast: ForecastData): ClothingSummary {
    forecast.properties.timeseries = forecast.properties.timeseries.filter(
      (value) => {
        let time = new Date(value.time);
        let now = new Date();
        let compareDate: string;
        if (now.getHours() > 7) {
          let nextDay = new Date();
          nextDay.setDate(now.getDate() + 1);
          compareDate = nextDay.toISOString().split("T")[0];
        } else {
          compareDate = now.toISOString().split("T")[0];
        }
        if (time.toISOString().split("T")[0] !== compareDate) {
          return false;
        }
        return (
          time.getHours() === 7 ||
          time.getHours() === 12 ||
          time.getHours() === 15
        );
      },
    );
    let weatherSummary: WeatherSummary = {
      temps: [
        forecast.properties.timeseries[0].data.instant.details.air_temperature,
        forecast.properties.timeseries[1].data.instant.details.air_temperature,
        forecast.properties.timeseries[2].data.instant.details.air_temperature,
      ],
      windIndex: Wind.No,
      windSpeed: 0,
      rainingIndex: Rain.Sunny,
    };

    if (
      this.weatherCodes.drizzle.includes(
        forecast.properties.timeseries[0].data.next_12_hours.summary
          .symbol_code,
      ) &&
      weatherSummary.rainingIndex !== Rain.HeavyRain
    ) {
      weatherSummary.rainingIndex = Rain.LightRain;
    } else if (
      this.weatherCodes.rain.includes(
        forecast.properties.timeseries[0].data.next_12_hours.summary
          .symbol_code,
      )
    ) {
      weatherSummary.rainingIndex = Rain.HeavyRain;
    } else if (
      this.weatherCodes.cloudy.includes(
        forecast.properties.timeseries[0].data.next_12_hours.summary
          .symbol_code,
      ) &&
      weatherSummary.rainingIndex === Rain.Sunny
    ) {
      weatherSummary.rainingIndex = Rain.Overcast;
    }

    for (const value of forecast.properties.timeseries) {
      if (
        value.data.instant.details.wind_speed <= 12 &&
        value.data.instant.details.wind_speed > 8 &&
        weatherSummary.windIndex === Wind.High
      ) {
        weatherSummary.windIndex = Wind.Low;
      } else if (value.data.instant.details.wind_speed > 12) {
        weatherSummary.windIndex = Wind.High;
      }

      if (value.data.instant.details.wind_speed > weatherSummary.windSpeed) {
        weatherSummary.windSpeed = value.data.instant.details.wind_speed;
      }
    }

    let clothingSummary: ClothingSummary = {
      hoodie: false,
      jacketIndex: Jacket.No,
      trousersIndex: Trousers.Warm,
      rainIndex: Rain.Sunny,
      windSpeed: 0,
    };
    let minTemp = Math.min(...weatherSummary.temps);
    let maxTemp = Math.max(...weatherSummary.temps);

    if (
      maxTemp < 21 ||
      (maxTemp < 26 && weatherSummary.rainingIndex >= Rain.LightRain)
    ) {
      clothingSummary.hoodie = true;
    }

    if (maxTemp < 10) {
      clothingSummary.jacketIndex = Jacket.Heavy;
    } else if (
      maxTemp < 15 ||
      (weatherSummary.rainingIndex === Rain.HeavyRain && minTemp >= 10)
    ) {
      clothingSummary.jacketIndex = Jacket.Light;
    }

    if (maxTemp > 25) {
      clothingSummary.trousersIndex = Trousers.Shorts;
    } else if (maxTemp > 5) {
      clothingSummary.trousersIndex = Trousers.Standard;
    }

    clothingSummary.rainIndex = weatherSummary.rainingIndex;
    clothingSummary.windSpeed = weatherSummary.windSpeed;

    return clothingSummary;
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

type WeatherSummary = {
  temps: number[]; // [0] = ráno, [1] = poledne, [2] = odpoledne
  windSpeed: number;
  windIndex: Wind;
  rainingIndex: Rain;
};

export type ClothingSummary = {
  hoodie: boolean;
  jacketIndex: Jacket;
  trousersIndex: Trousers;
  rainIndex: Rain;
  windSpeed: number;
};

enum Wind {
  No,
  Low,
  High, // 0 = < 8 m/s, 1 = 8-12 m/s, 2 = > 12 m/s
}

enum Rain {
  Sunny,
  Overcast,
  LightRain,
  HeavyRain,
}

export enum Jacket {
  No,
  Light,
  Heavy,
}

export enum Trousers {
  Shorts,
  Standard,
  Warm,
}
